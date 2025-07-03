import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";
import { supabase } from "../../../supabase/client";

// Job type definition
interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  createdAt: string;
  closingDate: string;
  status: "active" | "closed" | "draft";
  applicants: number;
}

// Applicant type definition
interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  applicationDate: string;
  status: "pending" | "reviewed" | "interviewed" | "selected" | "rejected";
  cv: string;
}

// Mock data
const jobsMock: Job[] = [
  {
    id: "1",
    title: "Desarrollador Frontend",
    company: "Tech Solutions",
    description:
      "Buscamos un desarrollador frontend con experiencia en React, TypeScript y diseño responsive para unirse a nuestro equipo de desarrollo.",
    requirements: [
      "Experiencia mínima de 2 años en desarrollo frontend",
      "Conocimientos sólidos de React, TypeScript y HTML/CSS",
      "Experiencia con herramientas de control de versiones (Git)",
      "Capacidad para trabajar en equipo y comunicarse efectivamente",
    ],
    createdAt: "2023-06-01T10:00:00",
    closingDate: "2023-06-30T23:59:59",
    status: "active",
    applicants: 12,
  },
  {
    id: "2",
    title: "Analista de Marketing Digital",
    company: "Marketing Pro",
    description:
      "Estamos en búsqueda de un Analista de Marketing Digital para gestionar campañas publicitarias y analizar métricas de rendimiento.",
    requirements: [
      "Experiencia mínima de 1 año en marketing digital",
      "Conocimientos de Google Analytics y herramientas de publicidad digital",
      "Capacidad analítica y orientación a resultados",
      "Habilidades de comunicación y trabajo en equipo",
    ],
    createdAt: "2023-06-05T14:30:00",
    closingDate: "2023-07-05T23:59:59",
    status: "active",
    applicants: 8,
  },
  {
    id: "3",
    title: "Ingeniero de Datos",
    company: "Data Insights",
    description:
      "Buscamos un Ingeniero de Datos para diseñar e implementar soluciones de procesamiento y análisis de datos a gran escala.",
    requirements: [
      "Experiencia en diseño y desarrollo de pipelines de datos",
      "Conocimientos de SQL, Python y herramientas de Big Data",
      "Experiencia con bases de datos relacionales y NoSQL",
      "Capacidad para resolver problemas complejos",
    ],
    createdAt: "2023-05-20T09:15:00",
    closingDate: "2023-06-10T23:59:59",
    status: "closed",
    applicants: 15,
  },
  {
    id: "4",
    title: "Diseñador UX/UI",
    company: "Creative Design",
    description:
      "Estamos buscando un Diseñador UX/UI para crear experiencias de usuario intuitivas y atractivas para nuestros productos digitales.",
    requirements: [
      "Experiencia en diseño de interfaces de usuario y experiencia de usuario",
      "Dominio de herramientas como Figma, Adobe XD o Sketch",
      "Portfolio que demuestre habilidades de diseño",
      "Conocimientos de principios de usabilidad y accesibilidad",
    ],
    createdAt: "2023-06-08T11:45:00",
    closingDate: "2023-07-08T23:59:59",
    status: "active",
    applicants: 6,
  },
  {
    id: "5",
    title: "Especialista en Recursos Humanos",
    company: "HR Solutions",
    description:
      "Buscamos un Especialista en Recursos Humanos para gestionar procesos de reclutamiento, selección y desarrollo de personal.",
    requirements: [
      "Experiencia en procesos de reclutamiento y selección",
      "Conocimientos de legislación laboral",
      "Habilidades de comunicación y empatía",
      "Capacidad para trabajar en equipo",
    ],
    createdAt: "2023-06-03T08:30:00",
    closingDate: "2023-06-25T23:59:59",
    status: "draft",
    applicants: 0,
  },
];

// Mock applicants data
const applicantsMock: Applicant[] = [
  {
    id: "1",
    name: "Ana Rodríguez",
    email: "ana.rodriguez@example.com",
    phone: "987654321",
    applicationDate: "2023-06-05T14:30:00",
    status: "interviewed",
    cv: "https://example.com/cv/ana_rodriguez.pdf",
  },
  {
    id: "2",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@example.com",
    phone: "987654322",
    applicationDate: "2023-06-06T10:15:00",
    status: "reviewed",
    cv: "https://example.com/cv/carlos_mendoza.pdf",
  },
  {
    id: "3",
    name: "María López",
    email: "maria.lopez@example.com",
    phone: "987654323",
    applicationDate: "2023-06-07T09:45:00",
    status: "pending",
    cv: "https://example.com/cv/maria_lopez.pdf",
  },
  {
    id: "4",
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    phone: "987654324",
    applicationDate: "2023-06-08T16:20:00",
    status: "selected",
    cv: "https://example.com/cv/juan_perez.pdf",
  },
  {
    id: "5",
    name: "Laura Torres",
    email: "laura.torres@example.com",
    phone: "987654325",
    applicationDate: "2023-06-09T11:10:00",
    status: "rejected",
    cv: "https://example.com/cv/laura_torres.pdf",
  },
];

export const AdminJobs: React.FC = () => {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [postulantes, setPostulantes] = React.useState([]);
  const [egresados, setEgresados] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "active" | "closed" | "draft"
  >("all");
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] =
    React.useState(false);
  const [applicants, setApplicants] =
    React.useState<Applicant[]>(applicantsMock);

  useEffect(() => {
    const getPostulantes = async () => {
      const { data, error } = await supabase
        .from("postulaciones")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;

      setPostulantes(data);
    };

    getPostulantes();
  }, []);

  // 💡 Este useEffect depende de "postulantes"
  useEffect(() => {
    if (!postulantes || postulantes.length === 0) return;

    const getConvocatorias = async () => {
      const { error, data } = await supabase
        .from("convocatorias")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;

      const updatedJobs = data.map((job: any) => {
        const applicantsCount = postulantes.filter(
          (p: any) => p.convocatoriaId === job.id
        ).length;

        return {
          ...job,
          applicants: applicantsCount,
        };
      });

      setJobs(updatedJobs);
    };

    getConvocatorias();
  }, [postulantes]); // ⬅️ escucha cuando postulantes cambie

  useEffect(() => {
    const getEgresados = async () => {
      const { error, data } = await supabase
        .from("egresados")
        .select("*")
        .order("id", { ascending: false });

      setEgresados(data);

      if (error) {
        throw error;
      }
    };

    getEgresados();
  }, []);

  // 🔄 Úsalo dentro del componente AdminJobs

  const getApplicantsByConvocatoria = (convocatoriaId: number) => {
    return postulantes
      .filter((p) => p.convocatoriaId === convocatoriaId)
      .map((p) => {
        const egresado = egresados.find((e) => e.id === p.egresadoId);
        return {
          id: egresado?.id,
          name: egresado?.name,
          email: egresado?.email,
          phone: egresado?.celular,
          applicationDate: p.fechaPostulacion ?? new Date(),
          status: p.estado || "pending",
          cv: p.cvUrl || "#", // asegúrate de que así se llama en tu tabla
        };
      });
  };

  const postulantesDeEstaConvocatoria = postulantes.filter(
    (p: any) => p.convocatoriaId === selectedJob?.id
  );

  useEffect(() => {
    const hoy = new Date().toISOString();

    const actualizarEstados = async () => {
      const expiradas = jobs.filter(
        (job) => job.closingDate < hoy && job.status === "active"
      );
      for (const job of expiradas) {
        await supabase
          .from("convocatorias")
          .update({ status: "closed" })
          .eq("id", job.id);
      }
    };

    actualizarEstados();
  }, [jobs]);

  // Form state
  const [formData, setFormData] = React.useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    closingDate: "",
  });

  // Form errors
  const [errors, setErrors] = React.useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    closingDate: "",
  });

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && job.status === statusFilter;
  });

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "closed":
        return "default";
      case "draft":
        return "warning";
      case "pending":
        return "warning";
      case "reviewed":
        return "primary";
      case "interviewed":
        return "secondary";
      case "selected":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "default";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activa";
      case "closed":
        return "Cerrada";
      case "draft":
        return "Borrador";
      case "pending":
        return "Pendiente";
      case "reviewed":
        return "Revisado";
      case "interviewed":
        return "Entrevistado";
      case "selected":
        return "Seleccionado";
      case "rejected":
        return "Rechazado";
      default:
        return "Desconocido";
    }
  };

  // Handle input change
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear error when user types
    if (errors[field as keyof typeof errors]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      title: "",
      company: "",
      description: "",
      requirements: "",
      closingDate: "",
    };

    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "El título es obligatorio";
      isValid = false;
    }

    if (!formData.company.trim()) {
      newErrors.company = "La empresa es obligatoria";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es obligatoria";
      isValid = false;
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = "Los requisitos son obligatorios";
      isValid = false;
    }

    if (!formData.closingDate) {
      newErrors.closingDate = "La fecha de cierre es obligatoria";
      isValid = false;
    } else {
      const selectedDate = new Date(formData.closingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.closingDate =
          "La fecha de cierre debe ser igual o posterior a hoy";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission for adding a new job
  const handleAddJob = () => {
    if (validateForm()) {
      // Parse requirements
      const requirementsList = formData.requirements
        .split("\n")
        .filter((req) => req.trim() !== "")
        .map((req) => req.trim());

      // Create new job
      const newJob: Job = {
        id: (jobs.length + 1).toString(),
        title: formData.title,
        company: formData.company,
        description: formData.description,
        requirements: requirementsList,
        createdAt: new Date().toISOString(),
        closingDate: new Date(formData.closingDate).toISOString(),
        status: "draft",
        applicants: 0,
      };

      setJobs([...jobs, newJob]);
      setIsAddModalOpen(false);

      // Reset form
      setFormData({
        title: "",
        company: "",
        description: "",
        requirements: "",
        closingDate: "",
      });

      // Show success message
      addToast({
        title: "Convocatoria creada",
        description: "La convocatoria ha sido creada como borrador",
        color: "success",
      });
    }
  };

  // Handle form submission for editing a job
  const handleEditJob = () => {
    if (validateForm() && selectedJob) {
      // Parse requirements
      const requirementsList = formData.requirements
        .split("\n")
        .filter((req) => req.trim() !== "")
        .map((req) => req.trim());

      // Update job
      const updatedJobs = jobs.map((job) =>
        job.id === selectedJob.id
          ? {
              ...job,
              title: formData.title,
              company: formData.company,
              description: formData.description,
              requirements: requirementsList,
              closingDate: new Date(formData.closingDate).toISOString(),
            }
          : job
      );

      setJobs(updatedJobs);
      setIsEditModalOpen(false);

      // Show success message
      addToast({
        title: "Convocatoria actualizada",
        description: "La convocatoria ha sido actualizada correctamente",
        color: "success",
      });
    }
  };

  // Delete job
  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    // 1. Eliminar en Supabase
    const { error } = await supabase
      .from("convocatorias") // o "empleos", si ese es tu nombre real
      .delete()
      .eq("id", selectedJob.id);

    if (error) {
      console.error("Error al eliminar la convocatoria:", error.message);
      addToast({
        title: "Error",
        description: "No se pudo eliminar la convocatoria",
        color: "danger",
      });
      return;
    }

    // 2. Eliminar del estado local
    const updatedJobs = jobs.filter((job) => job.id !== selectedJob.id);
    setJobs(updatedJobs);

    // 3. Cerrar modales
    setIsDeleteModalOpen(false);
    setIsDetailsModalOpen(false);

    // 4. Mostrar mensaje de éxito
    addToast({
      title: "Convocatoria eliminada",
      description: "La convocatoria ha sido eliminada correctamente",
      color: "success",
    });
  };

  // Change job status
  const handleChangeStatus = async (
    jobId: string,
    newStatus: "active" | "closed" | "draft"
  ) => {
    // 1. Actualizar en Supabase
    const { error } = await supabase
      .from("convocatorias")
      .update({ status: newStatus })
      .eq("id", jobId);

    if (error) {
      console.error("Error al cambiar el estado:", error.message);
      addToast({
        title: "Error",
        description: "No se pudo actualizar el estado de la convocatoria",
        color: "danger",
      });
      return;
    }

    // 2. Actualizar el estado local
    const updatedJobs = jobs.map((job) =>
      job.id === jobId ? { ...job, status: newStatus } : job
    );
    setJobs(updatedJobs);

    // 3. Actualizar el job seleccionado (si aplica)
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, status: newStatus });
    }

    // 4. Mostrar mensaje de éxito
    addToast({
      title: "Estado actualizado",
      description: `La convocatoria ahora está ${
        newStatus === "active"
          ? "activa"
          : newStatus === "closed"
          ? "cerrada"
          : "en borrador"
      }`,
      color: "success",
    });
  };

  // View job details
  const viewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  // Edit job
  const editJob = (job: Job) => {
    setSelectedJob(job);

    setFormData({
      title: job.title,
      company: job.company,
      description: job.description,
      requirements: job.requirements.join("\n"),
      closingDate: new Date(job.closingDate).toISOString().split("T")[0],
    });

    setIsEditModalOpen(true);
  };

  // View applicants
  const viewApplicants = (job: Job) => {
    setSelectedJob(job);
    setIsApplicantsModalOpen(true);

    const postulantesDeLaConvocatoria = getApplicantsByConvocatoria(
      parseInt(job.id)
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground-900">
              Gestión de Convocatorias
            </h1>
            <p className="text-foreground-600">
              Administra las convocatorias laborales para egresados
            </p>
          </div>
          {/*<Button
            color="primary"
            startContent={<Icon icon="lucide:plus" width={18} height={18} />}
            onPress={() => setIsAddModalOpen(true)}
          >
            Crear Convocatoria
          </Button>*/}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card shadow="sm">
          <CardBody className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Buscar convocatorias..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              startContent={
                <Icon
                  icon="lucide:search"
                  className="text-default-400"
                  width={20}
                />
              }
              className="flex-grow"
            />

            <div className="flex gap-2 flex-wrap">
              <Button
                color={statusFilter === "all" ? "primary" : "default"}
                variant={statusFilter === "all" ? "flat" : "light"}
                size="sm"
                onPress={() => setStatusFilter("all")}
              >
                Todas
              </Button>
              <Button
                color={statusFilter === "active" ? "success" : "default"}
                variant={statusFilter === "active" ? "flat" : "light"}
                size="sm"
                onPress={() => setStatusFilter("active")}
              >
                Activas
              </Button>
              <Button
                color={statusFilter === "draft" ? "warning" : "default"}
                variant={statusFilter === "draft" ? "flat" : "light"}
                size="sm"
                onPress={() => setStatusFilter("draft")}
              >
                Borradores
              </Button>
              <Button
                color={statusFilter === "closed" ? "default" : "default"}
                variant={statusFilter === "closed" ? "flat" : "light"}
                size="sm"
                onPress={() => setStatusFilter("closed")}
              >
                Cerradas
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Jobs list */}
      {filteredJobs.length > 0 ? (
        <motion.div variants={itemVariants}>
          <Card shadow="sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Convocatorias Laborales</h2>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 bg-content2 rounded-lg flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium">{job.title}</h3>
                      <Chip
                        color={getStatusColor(job.status)}
                        variant="flat"
                        size="sm"
                      >
                        {getStatusText(job.status)}
                      </Chip>
                    </div>
                    <p className="text-default-600 mb-1">{job.company}</p>
                    <p className="text-small text-default-500">
                      Creada: {formatDate(job.createdAt)} | Cierra:{" "}
                      {formatDate(job.closingDate)} | Postulantes:{" "}
                      {job.applicants}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 self-end md:self-center">
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={() => viewDetails(job)}
                    >
                      Ver Detalles
                    </Button>
                    {job.applicants > 0 && (
                      <Button
                        size="sm"
                        color="secondary"
                        variant="flat"
                        onPress={() => viewApplicants(job)}
                      >
                        Ver Postulantes
                      </Button>
                    )}
                    {job.status === "draft" && (
                      <Button
                        size="sm"
                        color="success"
                        variant="flat"
                        onPress={() => handleChangeStatus(job.id, "active")}
                      >
                        Publicar
                      </Button>
                    )}
                    {job.status === "active" && (
                      <Button
                        size="sm"
                        color="default"
                        variant="flat"
                        onPress={() => handleChangeStatus(job.id, "closed")}
                      >
                        Cerrar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="text-center py-12">
          <Icon
            icon="lucide:search-x"
            className="mx-auto mb-4 text-default-400"
            width={48}
            height={48}
          />
          <h3 className="text-xl font-medium text-foreground-800">
            No se encontraron convocatorias
          </h3>
          <p className="text-default-500 mt-2">
            Intenta con otros términos de búsqueda o filtros
          </p>
        </motion.div>
      )}

      {/* Job details modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        size="3xl"
      >
        <ModalContent>
          {(onClose) =>
            selectedJob && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedJob.title}
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Chip
                      color={getStatusColor(selectedJob.status)}
                      variant="flat"
                    >
                      {getStatusText(selectedJob.status)}
                    </Chip>

                    <Chip variant="flat" color="default">
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:building" width={14} height={14} />
                        {selectedJob.company}
                      </div>
                    </Chip>

                    <Chip variant="flat" color="default">
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:calendar" width={14} height={14} />
                        Cierra: {formatDate(selectedJob.closingDate)}
                      </div>
                    </Chip>

                    <Chip variant="flat" color="default">
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:users" width={14} height={14} />
                        {selectedJob.applicants} postulantes
                      </div>
                    </Chip>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-2">Descripción</h4>
                    <p className="text-default-700">
                      {selectedJob.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">Requisitos</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="text-default-700">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Eliminar
                  </Button>
                  <Button color="default" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      onClose();
                      editJob(selectedJob);
                    }}
                  >
                    Editar
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>

      {/* Add job modal */}
      <Modal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crear Nueva Convocatoria
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Título"
                    placeholder="Ingrese el título de la convocatoria"
                    value={formData.title}
                    onValueChange={(value) => handleChange("title", value)}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    isRequired
                  />

                  <Input
                    label="Empresa"
                    placeholder="Ingrese el nombre de la empresa"
                    value={formData.company}
                    onValueChange={(value) => handleChange("company", value)}
                    isInvalid={!!errors.company}
                    errorMessage={errors.company}
                    isRequired
                  />

                  <Textarea
                    label="Descripción"
                    placeholder="Ingrese la descripción de la convocatoria"
                    value={formData.description}
                    onValueChange={(value) =>
                      handleChange("description", value)
                    }
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    minRows={3}
                    isRequired
                  />

                  <Textarea
                    label="Requisitos"
                    placeholder="Ingrese los requisitos (uno por línea)"
                    value={formData.requirements}
                    onValueChange={(value) =>
                      handleChange("requirements", value)
                    }
                    isInvalid={!!errors.requirements}
                    errorMessage={errors.requirements}
                    minRows={3}
                    isRequired
                  />

                  <Input
                    type="date"
                    label="Fecha de cierre"
                    value={formData.closingDate}
                    onValueChange={(value) =>
                      handleChange("closingDate", value)
                    }
                    isInvalid={!!errors.closingDate}
                    errorMessage={errors.closingDate}
                    isRequired
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleAddJob}>
                  Crear Convocatoria
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit job modal */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar Convocatoria
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Título"
                    placeholder="Ingrese el título de la convocatoria"
                    value={formData.title}
                    onValueChange={(value) => handleChange("title", value)}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    isRequired
                  />

                  <Input
                    label="Empresa"
                    placeholder="Ingrese el nombre de la empresa"
                    value={formData.company}
                    onValueChange={(value) => handleChange("company", value)}
                    isInvalid={!!errors.company}
                    errorMessage={errors.company}
                    isRequired
                  />

                  <Textarea
                    label="Descripción"
                    placeholder="Ingrese la descripción de la convocatoria"
                    value={formData.description}
                    onValueChange={(value) =>
                      handleChange("description", value)
                    }
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    minRows={3}
                    isRequired
                  />

                  <Textarea
                    label="Requisitos"
                    placeholder="Ingrese los requisitos (uno por línea)"
                    value={formData.requirements}
                    onValueChange={(value) =>
                      handleChange("requirements", value)
                    }
                    isInvalid={!!errors.requirements}
                    errorMessage={errors.requirements}
                    minRows={3}
                    isRequired
                  />

                  <Input
                    type="date"
                    label="Fecha de cierre"
                    value={formData.closingDate}
                    onValueChange={(value) =>
                      handleChange("closingDate", value)
                    }
                    isInvalid={!!errors.closingDate}
                    errorMessage={errors.closingDate}
                    isRequired
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleEditJob}>
                  Guardar Cambios
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        size="sm"
      >
        <ModalContent>
          {(onClose) =>
            selectedJob && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Confirmar Eliminación
                </ModalHeader>
                <ModalBody>
                  <p>
                    ¿Estás seguro que deseas eliminar la convocatoria{" "}
                    <strong>{selectedJob.title}</strong>?
                  </p>
                  <p className="text-small text-danger mt-4">
                    <Icon
                      icon="lucide:alert-triangle"
                      className="inline mr-1"
                      width={16}
                      height={16}
                    />
                    Esta acción no se puede deshacer.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button color="danger" onPress={handleDeleteJob}>
                    Eliminar
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>

      {/* Applicants modal */}
      <Modal
        isOpen={isApplicantsModalOpen}
        onOpenChange={setIsApplicantsModalOpen}
        size="3xl"
      >
        <ModalContent>
          {(onClose) =>
            selectedJob && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Postulantes - {selectedJob.title}
                </ModalHeader>
                <ModalBody>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-default-700">
                      <span className="font-medium">
                        {selectedJob.applicants}
                      </span>{" "}
                      postulantes
                    </p>
                  </div>

                  {getApplicantsByConvocatoria(parseInt(selectedJob.id))
                    .length > 0 ? (
                    <div className="space-y-4">
                      {getApplicantsByConvocatoria(
                        parseInt(selectedJob.id)
                      ).map((applicant) => (
                        <div
                          key={applicant.id}
                          className="p-4 bg-content2 rounded-lg flex flex-col sm:flex-row justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{applicant.name}</p>
                              <Chip
                                color={getStatusColor(applicant.status)}
                                variant="flat"
                                size="sm"
                              >
                                {getStatusText(applicant.status)}
                              </Chip>
                            </div>
                            <p className="text-small text-default-500">
                              {applicant.email} | {applicant.phone}
                            </p>
                            <p className="text-tiny text-default-400">
                              Postulación:{" "}
                              {new Date(
                                applicant.applicationDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-end sm:self-center">
                            <Select
                              size="sm"
                              className="w-32"
                              selectedKeys={[applicant.status]}
                              aria-label="Cambiar estado"
                            >
                              <SelectItem key="pending">Pendiente</SelectItem>
                              <SelectItem key="reviewed">Revisado</SelectItem>
                              <SelectItem key="interviewed">
                                Entrevistado
                              </SelectItem>
                              <SelectItem key="selected">
                                Seleccionado
                              </SelectItem>
                              <SelectItem key="rejected">Rechazado</SelectItem>
                            </Select>
                            <Button
                              onClick={() =>
                                window.open(applicant.cv, "_blank")
                              }
                              size="sm"
                              color="primary"
                              variant="flat"
                              startContent={
                                <Icon
                                  icon="lucide:file-text"
                                  width={16}
                                  height={16}
                                />
                              }
                            >
                              Ver CV
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Icon
                        icon="lucide:users-x"
                        className="mx-auto mb-4 text-default-400"
                        width={48}
                        height={48}
                      />
                      <h3 className="text-lg font-medium text-foreground-800">
                        No hay postulantes
                      </h3>
                      <p className="text-default-500 mt-2">
                        Esta convocatoria aún no tiene postulantes.
                      </p>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Guardar Cambios
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>
    </motion.div>
  );
};
