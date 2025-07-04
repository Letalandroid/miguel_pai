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
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";
import { supabase } from "../../../supabase/client";

// Job type definition
interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  createdAt: string;
  closingDate: string;
  status: "active" | "closed";
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

export const CompanyJobs: React.FC = () => {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [postulantes, setPostulantes] = React.useState([]);
  const [egresados, setEgresados] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "active" | "closed"
  >("all");
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [convocatoriasRes, postulantesRes] = await Promise.all([
        supabase
          .from("convocatorias")
          .select("*")
          .order("id", { ascending: false }),
        supabase
          .from("postulaciones")
          .select("*")
          .order("id", { ascending: false }),
      ]);

      if (convocatoriasRes.error) throw convocatoriasRes.error;
      if (postulantesRes.error) throw postulantesRes.error;

      const postulantes = postulantesRes.data;
      setPostulantes(postulantes);

      const updatedJobs = convocatoriasRes.data.map((job: any) => {
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

    fetchData();
  }, []);

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
          applicationDate: p.fecha_postulacion ?? new Date(),
          status: p.estado || "pending",
          cv: p.cvUrl,
        };
      });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && job.status === statusFilter;
  });

  // Form state
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    requirements: "",
    closingDate: "",
  });

  // Form errors
  const [errors, setErrors] = React.useState({
    title: "",
    description: "",
    requirements: "",
    closingDate: "",
  });

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
      description: "",
      requirements: "",
      closingDate: "",
    };

    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "El título es obligatorio";
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

    if (!formData.closingDate.trim()) {
      newErrors.closingDate = "La fecha de cierre es obligatoria";
      isValid = false;
    } else {
      const closingDate = new Date(formData.closingDate);
      const today = new Date();

      if (closingDate <= today) {
        newErrors.closingDate = "La fecha de cierre debe ser posterior a hoy";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      // Create new job
      const addJob: Job = {
        id: (jobs.length + 1).toString(),
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements
          .split("\n")
          .filter((req) => req.trim() !== ""),
        createdAt: new Date().toISOString().split("T")[0],
        closingDate: formData.closingDate,
        status: "active",
        applicants: 0,
      };

      const { id, ...newJob } = addJob;

      const { error } = await supabase.from("convocatorias").insert(newJob);

      if (error) {
        console.error(error);
      }

      setJobs([addJob, ...jobs]);
      setIsCreateModalOpen(false);

      // Reset form
      setFormData({
        title: "",
        description: "",
        requirements: "",
        closingDate: "",
      });

      // Show success message
      addToast({
        title: "Convocatoria creada",
        description: "La convocatoria ha sido publicada correctamente",
        color: "success",
      });
    }
  };

  // View job details
  const viewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  // Close job
  const closeJob = async (job: Job) => {
    // 1. Actualizar en Supabase
    const { error } = await supabase
      .from("convocatorias") // o "empleos", si ese es el nombre real de tu tabla
      .update({ status: "closed" })
      .eq("id", job.id);

    if (error) {
      console.error("Error al cerrar la convocatoria:", error.message);
      addToast({
        title: "Error al cerrar",
        description: "No se pudo cerrar la convocatoria",
        color: "danger",
      });
      return;
    }

    // 2. Actualizar estado local
    const updatedJobs = jobs.map((j) =>
      j.id === job.id ? { ...j, status: "closed" as const } : j
    );

    setJobs(updatedJobs);
    setIsDetailsModalOpen(false);

    // 3. Notificación de éxito
    addToast({
      title: "Convocatoria cerrada",
      description: "La convocatoria ha sido cerrada correctamente",
      color: "success",
    });
  };

  // Delete job
  const deleteJob = async () => {
    if (!selectedJob) return;

    // 1. Eliminar de Supabase
    const { error } = await supabase
      .from("convocatorias") // cambia esto si tu tabla se llama diferente
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
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
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
              Publica y gestiona tus ofertas laborales
            </p>
          </div>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:plus" width={18} height={18} />}
            onPress={() => setIsCreateModalOpen(true)}
          >
            Nueva Convocatoria
          </Button>
        </div>
      </motion.div>
      {/* Filters */}
      <motion.div
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 },
        }}
        className="mb-6"
      >
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
            <div className="flex gap-2">
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
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
        >
          <Card shadow="sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Convocatorias</h2>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              {filteredJobs.map((job, index) => (
                <div
                  key={job.id}
                  className={`p-4 ${
                    index !== filteredJobs.length - 1
                      ? "border-b border-default-100"
                      : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{job.title}</h3>
                        <Chip
                          color={
                            job.status === "active" ? "success" : "default"
                          }
                          variant="flat"
                          size="sm"
                        >
                          {job.status === "active" ? "Activa" : "Cerrada"}
                        </Chip>
                      </div>
                      <p className="text-small text-default-500">
                        Creada: {new Date(job.createdAt).toLocaleDateString()} |
                        Cierra: {new Date(job.closingDate).toLocaleDateString()}{" "}
                        | Postulantes: {job.applicants}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={() => viewDetails(job)}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          className="text-center py-12"
        >
          <Icon
            icon="lucide:briefcase-x"
            className="mx-auto mb-4 text-default-400"
            width={48}
            height={48}
          />
          <h3 className="text-xl font-medium text-foreground-800">
            No se encontraron convocatorias
          </h3>
          <p className="text-default-500 mt-2">
            {searchTerm
              ? "No hay resultados para tu búsqueda."
              : statusFilter !== "all"
              ? `No tienes convocatorias ${
                  statusFilter === "active" ? "activas" : "cerradas"
                }.`
              : "No has publicado ninguna convocatoria aún."}
          </p>
        </motion.div>
      )}

      {/* Job details modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        size="2xl"
      >
        <ModalContent>
          {(onClose) =>
            selectedJob && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedJob.title}
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Chip
                        color={
                          selectedJob.status === "active"
                            ? "success"
                            : "default"
                        }
                        variant="flat"
                      >
                        {selectedJob.status === "active" ? "Activa" : "Cerrada"}
                      </Chip>
                      <p className="text-small text-default-500">
                        Postulantes: {selectedJob.applicants}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-default-600 font-medium">
                          Fecha de creación:
                        </p>
                        <p>
                          {new Date(selectedJob.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-default-600 font-medium">
                          Fecha de cierre:
                        </p>
                        <p>
                          {new Date(
                            selectedJob.closingDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-default-600 font-medium">
                        Descripción:
                      </p>
                      <p className="text-default-700">
                        {selectedJob.description}
                      </p>
                    </div>

                    <div>
                      <p className="text-default-600 font-medium">
                        Requisitos:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        {selectedJob.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>
      {/* Create job modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        size="2xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Publicar Nueva Convocatoria
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Título"
                    placeholder="Ej: Desarrollador Frontend"
                    value={formData.title}
                    onValueChange={(value) => handleChange("title", value)}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    isRequired
                  />

                  <Textarea
                    label="Descripción"
                    placeholder="Describe la posición, responsabilidades, etc."
                    value={formData.description}
                    onValueChange={(value) =>
                      handleChange("description", value)
                    }
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    isRequired
                    minRows={3}
                  />

                  <Textarea
                    label="Requisitos"
                    placeholder="Ingresa los requisitos (uno por línea)"
                    value={formData.requirements}
                    onValueChange={(value) =>
                      handleChange("requirements", value)
                    }
                    isInvalid={!!errors.requirements}
                    errorMessage={errors.requirements}
                    isRequired
                    minRows={3}
                    description="Ingresa cada requisito en una línea separada"
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
                <Button color="primary" onPress={handleSubmit}>
                  Publicar Convocatoria
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
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmar Eliminación
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro que deseas eliminar la convocatoria{" "}
                  <strong>{selectedJob?.title}</strong>?
                </p>
                <p className="text-small text-danger mt-2">
                  Esta acción no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="danger" onPress={deleteJob}>
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  );
};
