import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Input,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Image,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";
import { supabase } from "../../../supabase/client";
import { uploadFileFromBrowser } from "../../../utils/uploadFiles";

// Workshop type definition
interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "upcoming" | "active" | "completed";
  image: string;
  link?: string;
  participants: number;
  maxParticipants: number;
}

// Participant type definition
interface Participant {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: "confirmed" | "pending" | "cancelled";
}

// Mock data
const workshopsMock: Workshop[] = [
  {
    id: "1",
    title: "Habilidades Blandas para el Éxito Profesional",
    description:
      "Aprende a desarrollar habilidades de comunicación, trabajo en equipo y liderazgo que son fundamentales en el entorno laboral actual.",
    date: "2023-06-20T14:00:00",
    status: "upcoming",
    image: "https://img.heroui.chat/image/ai?w=600&h=400&u=workshop1",
    link: "https://meet.google.com/abc-defg-hij",
    participants: 18,
    maxParticipants: 30,
  },
  {
    id: "2",
    title: "Innovación y Emprendimiento",
    description:
      "Descubre las claves para desarrollar proyectos innovadores y emprender con éxito en el mercado actual.",
    date: "2023-06-25T09:00:00",
    status: "upcoming",
    image: "https://img.heroui.chat/image/ai?w=600&h=400&u=workshop2",
    link: "https://meet.google.com/klm-nopq-rst",
    participants: 12,
    maxParticipants: 25,
  },
  {
    id: "3",
    title: "LinkedIn: Optimiza tu Perfil Profesional",
    description:
      "Aprende a crear un perfil de LinkedIn atractivo y efectivo para destacar en el mercado laboral.",
    date: "2023-06-10T10:00:00",
    status: "completed",
    image: "https://img.heroui.chat/image/ai?w=600&h=400&u=workshop4",
    link: "https://meet.google.com/456-789-012",
    participants: 25,
    maxParticipants: 25,
  },
  {
    id: "4",
    title: "Herramientas Digitales para Profesionales",
    description:
      "Conoce y aprende a utilizar las principales herramientas digitales que potenciarán tu perfil profesional.",
    date: "2023-07-05T16:30:00",
    status: "upcoming",
    image: "https://img.heroui.chat/image/ai?w=600&h=400&u=workshop3",
    link: "https://meet.google.com/uvw-xyz-123",
    participants: 8,
    maxParticipants: 20,
  },
  {
    id: "5",
    title: "Gestión del Tiempo y Productividad",
    description:
      "Estrategias y técnicas para optimizar tu tiempo y aumentar tu productividad en el entorno laboral.",
    date: "2023-06-15T11:00:00",
    status: "active",
    image: "https://img.heroui.chat/image/ai?w=600&h=400&u=workshop5",
    link: "https://meet.google.com/def-456-abc",
    participants: 15,
    maxParticipants: 20,
  },
];

// Mock participants data
const participantsMock: Participant[] = [
  {
    id: "1",
    name: "Ana Rodríguez",
    email: "ana.rodriguez@example.com",
    registrationDate: "2023-06-01T10:30:00",
    status: "confirmed",
  },
  {
    id: "2",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@example.com",
    registrationDate: "2023-06-02T14:15:00",
    status: "confirmed",
  },
  {
    id: "3",
    name: "María López",
    email: "maria.lopez@example.com",
    registrationDate: "2023-06-03T09:45:00",
    status: "pending",
  },
  {
    id: "4",
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    registrationDate: "2023-06-01T16:20:00",
    status: "confirmed",
  },
  {
    id: "5",
    name: "Laura Torres",
    email: "laura.torres@example.com",
    registrationDate: "2023-06-04T11:10:00",
    status: "cancelled",
  },
];

export const AdminWorkshops: React.FC = () => {
  const [workshops, setWorkshops] = React.useState<Workshop[]>([]);
  const [egresados, setEgresados] = React.useState([]);
  const [taller_egresado, setTalleresEgresedaso] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "upcoming" | "active" | "completed"
  >("all");
  const [selectedWorkshop, setSelectedWorkshop] =
    React.useState<Workshop | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] =
    React.useState(false);
  const [participants, setParticipants] =
    React.useState<Participant[]>([]);

  useEffect(() => {
    const getTalleres = async () => {
      const { error, data } = await supabase
        .from("talleres")
        .select("*")
        .order("id", { ascending: false });

      setWorkshops(data);
      console.log(data);

      console.log();
      if (error) {
        throw error;
      }
    };

    getTalleres();
  }, []);

  useEffect(() => {
    const getEgresados = async () => {
      const { error, data } = await supabase
        .from("egresados")
        .select("*")
        .order("id", { ascending: false });

      setEgresados(data);
      console.log(data);

      console.log();
      if (error) {
        throw error;
      }
    };

    getEgresados();
  }, []);

  useEffect(() => {
    const getTalleresEgresados = async () => {
      const { error, data } = await supabase
        .from("taller_egresado")
        .select("*")
        .order("id", { ascending: false });

      setTalleresEgresedaso(data);
      console.log(data);

      if (error) {
        throw error;
      }
    };

    getTalleresEgresados();
  }, []);

  // Form state
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    date: "",
    time: "",
    link: "",
    status: "",
    maxParticipants: "",
    image: null as File | null,
  });

  // Form errors
  const [errors, setErrors] = React.useState({
    title: "",
    description: "",
    date: "",
    time: "",
    link: "",
    status: "",
    maxParticipants: "",
    image: "",
  });

  // Filter workshops based on search term and status
  const filteredWorkshops = workshops.filter((workshop) => {
    // Contar participantes reales basándose en taller_egresado
    const participantCount = taller_egresado.filter(
      (egresado) => egresado.tallerId === workshop.id
    ).length;

    // Agregar la propiedad participants al workshop
    workshop.participants = participantCount;

    const matchesSearch =
      workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && workshop.status === statusFilter;
  });

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "primary";
      case "active":
        return "success";
      case "completed":
        return "default";
      default:
        return "default";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Próximo";
      case "active":
        return "Activo";
      case "completed":
        return "Completado";
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

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          image: "El archivo debe ser una imagen (JPEG, PNG, GIF)",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          image: "La imagen no debe superar los 5MB",
        });
        return;
      }

      setFormData({
        ...formData,
        image: file,
      });

      setErrors({
        ...errors,
        image: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      date: "",
      time: "",
      link: "",
      status: "",
      maxParticipants: "",
      image: "",
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

    if (!formData.date) {
      newErrors.date = "La fecha es obligatoria";
      isValid = false;
    }

    if (!formData.time) {
      newErrors.time = "La hora es obligatoria";
      isValid = false;
    }

    if (!formData.link.trim()) {
      newErrors.link = "El enlace es obligatorio";
      isValid = false;
    } else if (!formData.link.startsWith("http")) {
      newErrors.link =
        "Ingrese un enlace válido (debe comenzar con http:// o https://)";
      isValid = false;
    }

    if (!formData.maxParticipants) {
      newErrors.maxParticipants =
        "El número máximo de participantes es obligatorio";
      isValid = false;
    } else if (parseInt(formData.maxParticipants) <= 0) {
      newErrors.maxParticipants = "El número debe ser mayor a 0";
      isValid = false;
    }

    if (!formData.image && !isEditModalOpen) {
      newErrors.image = "La imagen es obligatoria";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission for adding a new workshop
  const handleAddWorkshop = async () => {
    if (validateForm()) {
      // Create new workshop
      let imageUrl =
        "https://img.heroui.chat/image/ai?w=600&h=400&u=workshop" +
        (workshops.length + 1);

      if (formData.image) {
        const file = formData.image; // Asegúrate de que es del tipo File
        const filename = `workshop_${Date.now()}_${file.name}`;
        const bucket = "talleres"; // o el nombre de tu bucket en Supabase

        try {
          const uploadResult = await uploadFileFromBrowser(
            file,
            filename,
            bucket
          );
          imageUrl = uploadResult.publicUrl;
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }

      const newWorkshop: Workshop = {
        id: (workshops.length + 1).toString(),
        title: formData.title,
        description: formData.description,
        date: `${formData.date}T${formData.time}`,
        status: "active",
        image: imageUrl,
        link: formData.link,
        participants: 0,
        maxParticipants: parseInt(formData.maxParticipants),
      };

      const { id, ...workshopWithoutId } = newWorkshop;

      await supabase.from("talleres").insert(workshopWithoutId);

      setWorkshops([...workshops, newWorkshop]);
      setIsAddModalOpen(false);

      // Reset form
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        link: "",
        status: "",
        maxParticipants: "",
        image: null,
      });

      // Show success message
      addToast({
        title: "Taller creado",
        description: "El taller ha sido creado correctamente",
        color: "success",
      });
    }
  };

  // Handle form submission for editing a workshop
  const handleEditWorkshop = async () => {
    if (validateForm() && selectedWorkshop) {
      // Update workshop
      const updatedFields = {
        title: formData.title,
        description: formData.description,
        date: `${formData.date}T${formData.time}`,
        link: formData.link,
        status: formData.status as Workshop["status"],
        maxParticipants: parseInt(formData.maxParticipants),
        image: formData.image
          ? URL.createObjectURL(formData.image) // ⚠ solo para vista previa
          : selectedWorkshop.image,
      };

      // Actualiza en Supabase
      const { error } = await supabase
        .from("talleres")
        .update(updatedFields)
        .eq("id", selectedWorkshop.id);

      if (error) {
        console.error("Error al actualizar taller:", error);
      } else {
        // Actualiza el estado local
        const updatedWorkshops = workshops.map((workshop) =>
          workshop.id === selectedWorkshop.id
            ? { ...workshop, ...updatedFields }
            : workshop
        );

        setWorkshops(updatedWorkshops);
      }

      setIsEditModalOpen(false);

      // Show success message
      addToast({
        title: "Taller actualizado",
        description: "El taller ha sido actualizado correctamente",
        color: "success",
      });
    }
  };

  // Delete workshop
  const handleDeleteWorkshop = async () => {
    if (!selectedWorkshop) return;

    // 1. Eliminar de Supabase
    const { error } = await supabase
      .from("talleres")
      .delete()
      .eq("id", selectedWorkshop.id);

    if (error) {
      console.error("Error al eliminar el taller:", error);
      addToast({
        title: "Error",
        description: "No se pudo eliminar el taller",
        color: "danger",
      });
      return;
    }

    // 2. Eliminar del estado local
    const updatedWorkshops = workshops.filter(
      (workshop) => workshop.id !== selectedWorkshop.id
    );
    setWorkshops(updatedWorkshops);

    // 3. Cerrar modales
    setIsDeleteModalOpen(false);
    setIsDetailsModalOpen(false);

    // 4. Mostrar notificación
    addToast({
      title: "Taller eliminado",
      description: "El taller ha sido eliminado correctamente",
      color: "success",
    });
  };

  // View workshop details
  const viewDetails = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsDetailsModalOpen(true);
  };

  // Edit workshop
  const editWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);

    // Parse date and time
    const workshopDate = new Date(workshop.date);
    const date = workshopDate.toISOString().split("T")[0];
    const time = workshopDate.toTimeString().slice(0, 5);

    setFormData({
      title: workshop.title,
      description: workshop.description,
      date: date,
      time: time,
      status,
      link: workshop.link || "",
      maxParticipants: workshop.maxParticipants.toString(),
      image: null,
    });

    setIsEditModalOpen(true);
  };

  // View participants
  const viewParticipants = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsParticipantsModalOpen(true);
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
              Gestión de Talleres
            </h1>
            <p className="text-foreground-600">
              Administra los talleres para egresados
            </p>
          </div>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:plus" width={18} height={18} />}
            onPress={() => setIsAddModalOpen(true)}
          >
            Crear Taller
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card shadow="sm">
          <CardBody className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Buscar talleres..."
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
                Todos
              </Button>
              <Button
                color={statusFilter === "upcoming" ? "primary" : "default"}
                variant={statusFilter === "upcoming" ? "flat" : "light"}
                size="sm"
                onPress={() => setStatusFilter("upcoming")}
              >
                Próximos
              </Button>
              <Button
                color={statusFilter === "active" ? "success" : "default"}
                variant={statusFilter === "active" ? "flat" : "light"}
                size="sm"
                onPress={() => setStatusFilter("active")}
              >
                Activos
              </Button>
              <Button
                color={statusFilter === "completed" ? "default" : "default"}
                variant={statusFilter === "completed" ? "flat" : "light"}
                size="sm"
                onPress={() => setStatusFilter("completed")}
              >
                Completados
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Workshops list */}
      {filteredWorkshops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.map((workshop, index) => (
            <motion.div
              key={`${workshop.id}#${workshop.title}`}
              variants={itemVariants}
              custom={index}
              className="h-full"
            >
              <Card shadow="sm" className="h-full">
                <CardHeader className="p-0">
                  <Image
                    removeWrapper
                    alt={workshop.title}
                    className="object-cover w-full h-48"
                    src={workshop.image}
                  />
                </CardHeader>
                <CardBody className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{workshop.title}</h3>
                    <Chip
                      color={getStatusColor(workshop.status)}
                      variant="flat"
                      size="sm"
                    >
                      {getStatusText(workshop.status)}
                    </Chip>
                  </div>

                  <p className="text-small text-default-500 flex items-center gap-1">
                    <Icon icon="lucide:calendar" width={14} height={14} />
                    {formatDate(workshop.date)}
                  </p>

                  <p className="text-default-700 line-clamp-2">
                    {workshop.description}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <Icon
                      icon="lucide:users"
                      width={14}
                      height={14}
                      className="text-default-500"
                    />
                    <p className="text-small text-default-500">
                      {workshop.participants}/{workshop.maxParticipants}{" "}
                      participantes
                    </p>
                  </div>
                </CardBody>
                <CardFooter className="flex gap-2">
                  <Button
                    color="primary"
                    variant="flat"
                    fullWidth
                    onPress={() => viewDetails(workshop)}
                  >
                    Ver Detalles
                  </Button>
                  <Button
                    color="secondary"
                    variant="light"
                    fullWidth
                    onPress={() => viewParticipants(workshop)}
                  >
                    Participantes
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div variants={itemVariants} className="text-center py-12">
          <Icon
            icon="lucide:search-x"
            className="mx-auto mb-4 text-default-400"
            width={48}
            height={48}
          />
          <h3 className="text-xl font-medium text-foreground-800">
            No se encontraron talleres
          </h3>
          <p className="text-default-500 mt-2">
            Intenta con otros términos de búsqueda o filtros
          </p>
        </motion.div>
      )}

      {/* Workshop details modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        size="3xl"
      >
        <ModalContent>
          {(onClose) =>
            selectedWorkshop && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedWorkshop.title}
                </ModalHeader>
                <ModalBody>
                  <Image
                    removeWrapper
                    alt={selectedWorkshop.title}
                    className="object-cover w-full h-64 rounded-lg"
                    src={selectedWorkshop.image}
                  />

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Chip
                      color={getStatusColor(selectedWorkshop.status)}
                      variant="flat"
                    >
                      {getStatusText(selectedWorkshop.status)}
                    </Chip>

                    <Chip variant="flat" color="default">
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:calendar" width={14} height={14} />
                        {formatDate(selectedWorkshop.date)}
                      </div>
                    </Chip>

                    <Chip variant="flat" color="default">
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:users" width={14} height={14} />
                        {selectedWorkshop.participants}/
                        {selectedWorkshop.maxParticipants} participantes
                      </div>
                    </Chip>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Descripción</h4>
                    <p className="text-default-700">
                      {selectedWorkshop.description}
                    </p>
                  </div>

                  {selectedWorkshop.link && (
                    <div className="mt-4 p-4 bg-content2 rounded-lg">
                      <h4 className="text-lg font-semibold mb-2">
                        Enlace de acceso
                      </h4>
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="lucide:link"
                          width={18}
                          height={18}
                          className="text-primary"
                        />
                        <a
                          href={selectedWorkshop.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedWorkshop.link}
                        </a>
                      </div>
                    </div>
                  )}
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
                      editWorkshop(selectedWorkshop);
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

      {/* Add workshop modal */}
      <Modal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crear Nuevo Taller
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Título"
                    placeholder="Ingrese el título del taller"
                    value={formData.title}
                    onValueChange={(value) => handleChange("title", value)}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    isRequired
                  />

                  <Textarea
                    label="Descripción"
                    placeholder="Ingrese la descripción del taller"
                    value={formData.description}
                    onValueChange={(value) =>
                      handleChange("description", value)
                    }
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    minRows={3}
                    isRequired
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      type="date"
                      label="Fecha"
                      value={formData.date}
                      onValueChange={(value) => handleChange("date", value)}
                      isInvalid={!!errors.date}
                      errorMessage={errors.date}
                      isRequired
                    />

                    <Input
                      type="time"
                      label="Hora"
                      value={formData.time}
                      onValueChange={(value) => handleChange("time", value)}
                      isInvalid={!!errors.time}
                      errorMessage={errors.time}
                      isRequired
                    />
                  </div>

                  <Input
                    label="Enlace de acceso"
                    placeholder="https://meet.google.com/..."
                    value={formData.link}
                    onValueChange={(value) => handleChange("link", value)}
                    isInvalid={!!errors.link}
                    errorMessage={errors.link}
                    isRequired
                  />

                  <Input
                    type="number"
                    label="Máximo de participantes"
                    placeholder="Ingrese el número máximo de participantes"
                    value={formData.maxParticipants}
                    onValueChange={(value) =>
                      handleChange("maxParticipants", value)
                    }
                    isInvalid={!!errors.maxParticipants}
                    errorMessage={errors.maxParticipants}
                    isRequired
                  />

                  <div>
                    <p className="text-small font-medium mb-2">
                      Imagen del taller *
                    </p>
                    <div className="border-2 border-dashed border-default-200 rounded-lg p-4 text-center">
                      <Icon
                        icon="lucide:upload-cloud"
                        width={40}
                        height={40}
                        className="mx-auto mb-2 text-default-400"
                      />
                      <p className="text-default-600 mb-2">
                        Arrastra y suelta una imagen aquí o
                      </p>
                      <label className="cursor-pointer">
                        <span className="text-primary">
                          Selecciona un archivo
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="text-small text-default-500 mt-2">
                        PNG, JPG, GIF (máx. 5MB)
                      </p>
                    </div>

                    {formData.image && (
                      <div className="flex items-center justify-between p-2 bg-content2 rounded-lg mt-2">
                        <div className="flex items-center gap-2">
                          <Icon
                            icon="lucide:image"
                            width={20}
                            height={20}
                            className="text-primary"
                          />
                          <span className="text-small truncate max-w-[150px]">
                            {formData.image.name}
                          </span>
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() =>
                            setFormData({ ...formData, image: null })
                          }
                        >
                          <Icon icon="lucide:x" width={16} height={16} />
                        </Button>
                      </div>
                    )}

                    {errors.image && (
                      <p className="text-small text-danger mt-1">
                        {errors.image}
                      </p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleAddWorkshop}>
                  Crear Taller
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit workshop modal */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar Taller
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Título"
                    placeholder="Ingrese el título del taller"
                    value={formData.title}
                    onValueChange={(value) => handleChange("title", value)}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    isRequired
                  />

                  <Textarea
                    label="Descripción"
                    placeholder="Ingrese la descripción del taller"
                    value={formData.description}
                    onValueChange={(value) =>
                      handleChange("description", value)
                    }
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    minRows={3}
                    isRequired
                  />

                  <Select
                    label="Estado"
                    placeholder="Seleccione el estado"
                    selectedKeys={formData.status ? [formData.status] : []}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0];
                      handleChange("status", `${value}`);
                    }}
                    isInvalid={!!errors.status}
                    errorMessage={errors.status}
                    isRequired
                  >
                    <SelectItem key="upcoming">Próximo</SelectItem>
                    <SelectItem key="active">Activo</SelectItem>
                    <SelectItem key="completed">Completado</SelectItem>
                  </Select>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      type="date"
                      label="Fecha"
                      value={formData.date}
                      onValueChange={(value) => handleChange("date", value)}
                      isInvalid={!!errors.date}
                      errorMessage={errors.date}
                      isRequired
                    />

                    <Input
                      type="time"
                      label="Hora"
                      value={formData.time}
                      onValueChange={(value) => handleChange("time", value)}
                      isInvalid={!!errors.time}
                      errorMessage={errors.time}
                      isRequired
                    />
                  </div>

                  <Input
                    label="Enlace de acceso"
                    placeholder="https://meet.google.com/..."
                    value={formData.link}
                    onValueChange={(value) => handleChange("link", value)}
                    isInvalid={!!errors.link}
                    errorMessage={errors.link}
                    isRequired
                  />

                  <Input
                    type="number"
                    label="Máximo de participantes"
                    placeholder="Ingrese el número máximo de participantes"
                    value={formData.maxParticipants}
                    onValueChange={(value) =>
                      handleChange("maxParticipants", value)
                    }
                    isInvalid={!!errors.maxParticipants}
                    errorMessage={errors.maxParticipants}
                    isRequired
                  />

                  <div>
                    <p className="text-small font-medium mb-2">
                      Imagen del taller (opcional)
                    </p>
                    <div className="border-2 border-dashed border-default-200 rounded-lg p-4 text-center">
                      <Icon
                        icon="lucide:upload-cloud"
                        width={40}
                        height={40}
                        className="mx-auto mb-2 text-default-400"
                      />
                      <p className="text-default-600 mb-2">
                        Arrastra y suelta una imagen aquí o
                      </p>
                      <label className="cursor-pointer">
                        <span className="text-primary">
                          Selecciona un archivo
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="text-small text-default-500 mt-2">
                        PNG, JPG, GIF (máx. 5MB)
                      </p>
                    </div>

                    {formData.image && (
                      <div className="flex items-center justify-between p-2 bg-content2 rounded-lg mt-2">
                        <div className="flex items-center gap-2">
                          <Icon
                            icon="lucide:image"
                            width={20}
                            height={20}
                            className="text-primary"
                          />
                          <span className="text-small truncate max-w-[150px]">
                            {formData.image.name}
                          </span>
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() =>
                            setFormData({ ...formData, image: null })
                          }
                        >
                          <Icon icon="lucide:x" width={16} height={16} />
                        </Button>
                      </div>
                    )}

                    {errors.image && (
                      <p className="text-small text-danger mt-1">
                        {errors.image}
                      </p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleEditWorkshop}>
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
            selectedWorkshop && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Confirmar Eliminación
                </ModalHeader>
                <ModalBody>
                  <p>
                    ¿Estás seguro que deseas eliminar el taller{" "}
                    <strong>{selectedWorkshop.title}</strong>?
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
                  <Button color="danger" onPress={handleDeleteWorkshop}>
                    Eliminar
                  </Button>
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>

      {/* Participants modal */}
      <Modal
        isOpen={isParticipantsModalOpen}
        onOpenChange={setIsParticipantsModalOpen}
        size="2xl"
      >
        <ModalContent>
          {(onClose) =>
            selectedWorkshop && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Participantes - {selectedWorkshop.title}
                </ModalHeader>
                <ModalBody>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-default-700">
                      <span className="font-medium">
                        {selectedWorkshop.participants}
                      </span>{" "}
                      de{" "}
                      <span className="font-medium">
                        {selectedWorkshop.maxParticipants}
                      </span>{" "}
                      participantes
                    </p>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      startContent={
                        <Icon icon="lucide:plus" width={16} height={16} />
                      }
                    >
                      Agregar Participante
                    </Button>
                  </div>

                  {participants.length > 0 ? (
                    <div className="space-y-3">
                      {participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="p-3 bg-content2 rounded-lg flex flex-col sm:flex-row justify-between gap-2"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{participant.name}</p>
                              <Chip
                                color={
                                  participant.status === "confirmed"
                                    ? "success"
                                    : participant.status === "pending"
                                    ? "warning"
                                    : "default"
                                }
                                variant="flat"
                                size="sm"
                              >
                                {participant.status === "confirmed"
                                  ? "Confirmado"
                                  : participant.status === "pending"
                                  ? "Pendiente"
                                  : "Cancelado"}
                              </Chip>
                            </div>
                            <p className="text-small text-default-500">
                              {participant.email}
                            </p>
                            <p className="text-tiny text-default-400">
                              Registrado:{" "}
                              {new Date(
                                participant.registrationDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <Select
                              size="sm"
                              className="w-32"
                              selectedKeys={[participant.status]}
                              aria-label="Cambiar estado"
                            >
                              <SelectItem key="confirmed">
                                Confirmado
                              </SelectItem>
                              <SelectItem key="pending">Pendiente</SelectItem>
                              <SelectItem key="cancelled">Cancelado</SelectItem>
                            </Select>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="danger"
                            >
                              <Icon
                                icon="lucide:trash-2"
                                width={16}
                                height={16}
                              />
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
                        No hay participantes
                      </h3>
                      <p className="text-default-500 mt-2">
                        Este taller aún no tiene participantes registrados.
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
