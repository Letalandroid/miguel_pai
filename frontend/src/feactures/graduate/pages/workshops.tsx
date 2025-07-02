import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Input,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Image,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";
import { supabase } from "../../../supabase/client";

// Workshop type definition
interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "open" | "closed";
  image: string;
  link?: string;
  enrolled: boolean;
}

// Mock data
const workshopsMock: Workshop[] = [
  {
    id: "1",
    title: "Habilidades Blandas para el Éxito Profesional",
    description:
      "Aprende a desarrollar habilidades de comunicación, trabajo en equipo y liderazgo que son fundamentales en el entorno laboral actual.",
    date: "2023-06-20T14:00:00",
    status: "open",
    image: "https://img.heroui.chat/image/ai?w=600&h=400&u=workshop1",
    link: "https://meet.google.com/abc-defg-hij",
    enrolled: true,
  },
  {
    id: "2",
    title: "Innovación y Emprendimiento",
    description:
      "Descubre las claves para desarrollar proyectos innovadores y emprender con éxito en el mercado actual.",
    date: "2023-06-25T09:00:00",
    status: "open",
    image: "https://img.heroui.chat/image/ai?w=600&h=400&u=workshop2",
    link: "https://meet.google.com/klm-nopq-rst",
    enrolled: true,
  },
  {
    id: "3",
    title: "Herramientas Digitales para Profesionales",
    description:
      "Conoce y aprende a utilizar las principales herramientas digitales que potenciarán tu perfil profesional.",
    date: "2023-07-05T16:30:00",
    status: "open",
    image: "https://img.heroui.chat/image/ai?w=600&h=400&u=workshop3",
    link: "https://meet.google.com/uvw-xyz-123",
    enrolled: false,
  },
  {
    id: "4",
    title: "LinkedIn: Optimiza tu Perfil Profesional",
    description:
      "Aprende a crear un perfil de LinkedIn atractivo y efectivo para destacar en el mercado laboral.",
    date: "2023-07-10T10:00:00",
    status: "open",
    image: "https://img.heroui.chat/image/ai?w=600&h=400&u=workshop4",
    link: "https://meet.google.com/456-789-012",
    enrolled: false,
  },
  {
    id: "5",
    title: "Gestión del Tiempo y Productividad",
    description:
      "Estrategias y técnicas para optimizar tu tiempo y aumentar tu productividad en el entorno laboral.",
    date: "2023-06-15T11:00:00",
    status: "closed",
    image: "https://img.heroui.chat/image/ai?w=600&h=400&u=workshop5",
    enrolled: false,
  },
];

export const GraduateWorkshops: React.FC = () => {
  const [workshops, setWorkshops] = React.useState<Workshop[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "open" | "closed" | "enrolled"
  >("all");
  const [selectedWorkshop, setSelectedWorkshop] =
    React.useState<Workshop | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);

  useEffect(() => {
    const getTalleres = async () => {
      const { error, data } = await supabase
        .from("talleres")
        .select("*")
        .order("id", { ascending: false });

      setWorkshops(data);

      if (error) {
        throw error;
      }
    };

    getTalleres();
  }, []);

  // Filter workshops based on search term and status
  const filteredWorkshops = workshops.filter((workshop) => {
    const matchesSearch =
      workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "open")
      return matchesSearch && workshop.status === "open";
    if (statusFilter === "closed")
      return matchesSearch && workshop.status === "closed";
    if (statusFilter === "enrolled") return matchesSearch && workshop.enrolled;

    return matchesSearch;
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

  // Handle workshop enrollment
  const handleEnroll = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsConfirmModalOpen(true);
  };

  // Confirm enrollment
  const confirmEnrollment = () => {
    if (selectedWorkshop) {
      // Update workshop status
      const updatedWorkshops = workshops.map((w) =>
        w.id === selectedWorkshop.id ? { ...w, enrolled: true } : w
      );

      setWorkshops(updatedWorkshops);
      setIsConfirmModalOpen(false);

      // Show success message
      addToast({
        title: "Inscripción exitosa",
        description: `Te has inscrito en el taller: ${selectedWorkshop.title}`,
        color: "success",
      });
    }
  };

  // View workshop details
  const viewDetails = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsModalOpen(true);
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
        <h1 className="text-2xl font-bold text-foreground-900">
          Talleres Disponibles
        </h1>
        <p className="text-foreground-600">
          Explora y participa en talleres diseñados para potenciar tu desarrollo
          profesional
        </p>
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
                color={statusFilter === "open" ? "success" : "default"}
                variant={statusFilter === "open" ? "flat" : "light"}
                size="sm"
                onPress={() => setStatusFilter("open")}
              >
                Abiertos
              </Button>
              <Button
                color={statusFilter === "enrolled" ? "secondary" : "default"}
                variant={statusFilter === "enrolled" ? "flat" : "light"}
                size="sm"
                onPress={() => setStatusFilter("enrolled")}
              >
                Inscritos
              </Button>
              <Button
                color={statusFilter === "closed" ? "danger" : "default"}
                variant={statusFilter === "closed" ? "flat" : "light"}
                size="sm"
                onPress={() => setStatusFilter("closed")}
              >
                Cerrados
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
              key={workshop.id}
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
                      color={workshop.status === "open" ? "success" : "danger"}
                      variant="flat"
                      size="sm"
                    >
                      {workshop.status === "open" ? "Abierto" : "Cerrado"}
                    </Chip>
                  </div>

                  <p className="text-small text-default-500 flex items-center gap-1">
                    <Icon icon="lucide:calendar" width={14} height={14} />
                    {formatDate(workshop.date)}
                  </p>

                  <p className="text-default-700 line-clamp-3">
                    {workshop.description}
                  </p>

                  {workshop.enrolled && (
                    <Chip
                      color="secondary"
                      variant="dot"
                      size="sm"
                      className="self-start"
                    >
                      Inscrito
                    </Chip>
                  )}
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
                  {workshop.status === "open" && !workshop.enrolled && (
                    <Button
                      color="success"
                      fullWidth
                      onPress={() => handleEnroll(workshop)}
                    >
                      Inscribirse
                    </Button>
                  )}
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
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} size="3xl">
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
                      color={
                        selectedWorkshop.status === "open"
                          ? "success"
                          : "danger"
                      }
                      variant="flat"
                    >
                      {selectedWorkshop.status === "open"
                        ? "Abierto"
                        : "Cerrado"}
                    </Chip>

                    {selectedWorkshop.enrolled && (
                      <Chip color="secondary" variant="dot">
                        Inscrito
                      </Chip>
                    )}

                    <Chip variant="flat" color="default">
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:calendar" width={14} height={14} />
                        {formatDate(selectedWorkshop.date)}
                      </div>
                    </Chip>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Descripción</h4>
                    <p className="text-default-700">
                      {selectedWorkshop.description}
                    </p>
                  </div>

                  {selectedWorkshop.enrolled && selectedWorkshop.link && (
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
                  <Button color="default" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                  {selectedWorkshop.status === "open" &&
                    !selectedWorkshop.enrolled && (
                      <Button
                        color="success"
                        onPress={() => {
                          onClose();
                          handleEnroll(selectedWorkshop);
                        }}
                      >
                        Inscribirse
                      </Button>
                    )}
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>

      {/* Confirmation modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        size="sm"
      >
        <ModalContent>
          {(onClose) =>
            selectedWorkshop && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Confirmar inscripción
                </ModalHeader>
                <ModalBody>
                  <p>
                    ¿Estás seguro que deseas inscribirte en el taller{" "}
                    <strong>{selectedWorkshop.title}</strong>?
                  </p>
                  <p className="text-small text-default-500 mt-2">
                    Fecha: {formatDate(selectedWorkshop.date)}
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button color="success" onPress={confirmEnrollment}>
                    Confirmar
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
