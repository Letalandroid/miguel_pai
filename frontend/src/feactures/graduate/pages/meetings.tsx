import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Chip, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";

// Meeting type definition
interface Meeting {
  id: string;
  date: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled";
  observations?: string;
  canCancel: boolean;
}

// Mock data
const meetingsMock: Meeting[] = [
  {
    id: "1",
    date: "2023-06-15T10:00:00",
    type: "Orientación Profesional",
    status: "scheduled",
    observations: "Preparar preguntas sobre desarrollo profesional y oportunidades en el sector tecnológico.",
    canCancel: true
  },
  {
    id: "2",
    date: "2023-06-18T15:30:00",
    type: "Revisión de CV",
    status: "scheduled",
    observations: "Traer CV actualizado y ejemplos de trabajos anteriores.",
    canCancel: true
  },
  {
    id: "3",
    date: "2023-05-20T11:00:00",
    type: "Asesoría Laboral",
    status: "completed",
    observations: "Se discutieron estrategias para mejorar la presencia en LinkedIn y optimizar el CV.",
    canCancel: false
  },
  {
    id: "4",
    date: "2023-05-10T09:30:00",
    type: "Entrevista Simulada",
    status: "cancelled",
    observations: "Cancelada por el egresado.",
    canCancel: false
  }
];

export const GraduateMeetings: React.FC = () => {
  const [meetings, setMeetings] = React.useState<Meeting[]>(meetingsMock);
  const [selectedMeeting, setSelectedMeeting] = React.useState<Meeting | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<"all" | "scheduled" | "completed" | "cancelled">("all");

  // Filter meetings based on status
  const filteredMeetings = meetings.filter(meeting => {
    if (statusFilter === "all") return true;
    return meeting.status === statusFilter;
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
      case "scheduled":
        return "success";
      case "completed":
        return "primary";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Programada";
      case "completed":
        return "Completada";
      case "cancelled":
        return "Cancelada";
      default:
        return "Desconocido";
    }
  };

  // Handle meeting cancellation
  const handleCancelMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsCancelModalOpen(true);
  };

  // Confirm cancellation
  const confirmCancellation = () => {
    if (selectedMeeting) {
      // Update meeting status
      const updatedMeetings = meetings.map(m => 
        m.id === selectedMeeting.id ? { ...m, status: "cancelled" as const, canCancel: false } : m
      );
      
      setMeetings(updatedMeetings);
      setIsCancelModalOpen(false);
      
      // Show success message
      addToast({
        title: "Reunión cancelada",
        description: `La reunión de ${selectedMeeting.type} ha sido cancelada.`,
        color: "success"
      });
    }
  };

  // View meeting details
  const viewDetails = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDetailsModalOpen(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl font-bold text-foreground-900">Mis Reuniones</h1>
        <p className="text-foreground-600">
          Gestiona tus reuniones programadas con asesores y empresas
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card shadow="sm">
          <CardBody className="flex flex-wrap gap-4">
            <Button
              color={statusFilter === "all" ? "primary" : "default"}
              variant={statusFilter === "all" ? "flat" : "light"}
              size="sm"
              onPress={() => setStatusFilter("all")}
            >
              Todas
            </Button>
            <Button
              color={statusFilter === "scheduled" ? "success" : "default"}
              variant={statusFilter === "scheduled" ? "flat" : "light"}
              size="sm"
              onPress={() => setStatusFilter("scheduled")}
            >
              Programadas
            </Button>
            <Button
              color={statusFilter === "completed" ? "primary" : "default"}
              variant={statusFilter === "completed" ? "flat" : "light"}
              size="sm"
              onPress={() => setStatusFilter("completed")}
            >
              Completadas
            </Button>
            <Button
              color={statusFilter === "cancelled" ? "danger" : "default"}
              variant={statusFilter === "cancelled" ? "flat" : "light"}
              size="sm"
              onPress={() => setStatusFilter("cancelled")}
            >
              Canceladas
            </Button>
          </CardBody>
        </Card>
      </motion.div>

      {/* Meetings list */}
      {filteredMeetings.length > 0 ? (
        <motion.div variants={itemVariants}>
          <Card shadow="sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Reuniones</h2>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              {filteredMeetings.map((meeting) => (
                <div 
                  key={meeting.id} 
                  className="p-4 bg-content2 rounded-lg flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium">{meeting.type}</h3>
                      <Chip
                        color={getStatusColor(meeting.status)}
                        variant="flat"
                        size="sm"
                      >
                        {getStatusText(meeting.status)}
                      </Chip>
                    </div>
                    <p className="text-default-600 flex items-center gap-1 mb-1">
                      <Icon icon="lucide:calendar" width={16} height={16} />
                      {formatDate(meeting.date)}
                    </p>
                    {meeting.observations && (
                      <p className="text-small text-default-500 line-clamp-1">
                        <span className="font-medium">Observaciones:</span> {meeting.observations}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 self-end md:self-center">
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={() => viewDetails(meeting)}
                    >
                      Ver Detalles
                    </Button>
                    {meeting.status === "scheduled" && meeting.canCancel && (
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() => handleCancelMeeting(meeting)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                color="primary"
                variant="flat"
                startContent={<Icon icon="lucide:calendar-plus" width={18} height={18} />}
                className="ml-auto"
              >
                Solicitar Nueva Reunión
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="text-center py-12">
          <Icon icon="lucide:calendar-x" className="mx-auto mb-4 text-default-400" width={48} height={48} />
          <h3 className="text-xl font-medium text-foreground-800">No se encontraron reuniones</h3>
          <p className="text-default-500 mt-2">
            {statusFilter === "all" 
              ? "No tienes reuniones programadas. Solicita una nueva reunión." 
              : `No tienes reuniones con estado "${getStatusText(statusFilter)}".`}
          </p>
          <Button
            color="primary"
            className="mt-6"
            startContent={<Icon icon="lucide:calendar-plus" width={18} height={18} />}
          >
            Solicitar Nueva Reunión
          </Button>
        </motion.div>
      )}

      {/* Meeting details modal */}
      <Modal isOpen={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen} size="lg">
        <ModalContent>
          {(onClose) => selectedMeeting && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detalles de la Reunión
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedMeeting.type}</h3>
                    <Chip
                      color={getStatusColor(selectedMeeting.status)}
                      variant="flat"
                      className="mt-1"
                    >
                      {getStatusText(selectedMeeting.status)}
                    </Chip>
                  </div>
                  
                  <div className="bg-content2 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-small text-default-500">Fecha y hora:</p>
                      <p className="font-medium flex items-center gap-2">
                        <Icon icon="lucide:calendar" width={16} height={16} />
                        {formatDate(selectedMeeting.date)}
                      </p>
                    </div>
                    
                    {selectedMeeting.observations && (
                      <div>
                        <p className="text-small text-default-500">Observaciones:</p>
                        <p className="font-medium">{selectedMeeting.observations}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedMeeting.status === "scheduled" && (
                    <div className="bg-content3 p-4 rounded-lg">
                      <p className="text-small">
                        <Icon icon="lucide:info" className="inline mr-1" width={16} height={16} />
                        Recuerda estar disponible 5 minutos antes de la hora programada.
                      </p>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                {selectedMeeting.status === "scheduled" && selectedMeeting.canCancel && (
                  <Button
                    color="danger"
                    onPress={() => {
                      onClose();
                      handleCancelMeeting(selectedMeeting);
                    }}
                  >
                    Cancelar Reunión
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Cancellation confirmation modal */}
      <Modal isOpen={isCancelModalOpen} onOpenChange={setIsCancelModalOpen} size="sm">
        <ModalContent>
          {(onClose) => selectedMeeting && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmar Cancelación
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro que deseas cancelar la reunión de <strong>{selectedMeeting.type}</strong>?
                </p>
                <p className="text-small text-default-500 mt-2">
                  Fecha: {formatDate(selectedMeeting.date)}
                </p>
                <p className="text-small text-danger mt-4">
                  <Icon icon="lucide:alert-triangle" className="inline mr-1" width={16} height={16} />
                  Esta acción no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Volver
                </Button>
                <Button
                  color="danger"
                  onPress={confirmCancellation}
                >
                  Confirmar Cancelación
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  );
};