import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Input, Textarea, Chip, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";

// Meeting type definition
interface Meeting {
  id: string;
  graduateName: string;
  graduateId: string;
  date: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled";
  observations?: string;
}

// Graduate type definition
interface Graduate {
  id: string;
  name: string;
  career: string;
}

// Meeting type options
const meetingTypes = [
  { value: "interview", label: "Entrevista Inicial" },
  { value: "technical", label: "Evaluación Técnica" },
  { value: "final", label: "Entrevista Final" },
  { value: "feedback", label: "Sesión de Feedback" }
];

// Mock data
const meetingsMock: Meeting[] = [
  { 
    id: "1", 
    graduateName: "Ana Rodríguez", 
    graduateId: "1",
    date: "2023-06-15T10:00:00", 
    type: "Entrevista Inicial",
    status: "scheduled",
    observations: "Revisar CV y portafolio antes de la reunión."
  },
  { 
    id: "2", 
    graduateName: "Carlos Mendoza", 
    graduateId: "2",
    date: "2023-06-18T15:30:00", 
    type: "Evaluación Técnica",
    status: "scheduled",
    observations: "Preparar ejercicios prácticos de programación."
  },
  { 
    id: "3", 
    graduateName: "María López", 
    graduateId: "3",
    date: "2023-05-20T11:00:00", 
    type: "Entrevista Final",
    status: "completed",
    observations: "Candidata con buen perfil técnico y habilidades de comunicación."
  },
  { 
    id: "4", 
    graduateName: "Pedro Gómez", 
    graduateId: "4",
    date: "2023-05-10T09:30:00", 
    type: "Entrevista Inicial",
    status: "cancelled",
    observations: "Cancelada por el candidato."
  }
];

// Mock graduates
const graduatesMock: Graduate[] = [
  { id: "1", name: "Ana Rodríguez", career: "Ingeniería de Sistemas" },
  { id: "2", name: "Carlos Mendoza", career: "Ingeniería de Software" },
  { id: "3", name: "María López", career: "Diseño Gráfico" },
  { id: "4", name: "Pedro Gómez", career: "Marketing Digital" },
  { id: "5", name: "Laura Torres", career: "Administración de Empresas" },
  { id: "6", name: "Juan Pérez", career: "Ingeniería Industrial" }
];

export const CompanyMeetings: React.FC = () => {
  const [meetings, setMeetings] = React.useState<Meeting[]>(meetingsMock);
  const [graduates] = React.useState<Graduate[]>(graduatesMock);
  const [selectedMeeting, setSelectedMeeting] = React.useState<Meeting | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<"all" | "scheduled" | "completed" | "cancelled">("all");
  
  // Form state
  const [formData, setFormData] = React.useState({
    graduateId: "",
    date: "",
    time: "",
    type: "",
    observations: ""
  });
  
  // Form errors
  const [errors, setErrors] = React.useState({
    graduateId: "",
    date: "",
    time: "",
    type: "",
    observations: ""
  });

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

  // Handle input change
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error when user types
    if (errors[field as keyof typeof errors]) {
      setErrors({
        ...errors,
        [field]: ""
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      graduateId: "",
      date: "",
      time: "",
      type: "",
      observations: ""
    };
    
    let isValid = true;
    
    if (!formData.graduateId) {
      newErrors.graduateId = "Selecciona un egresado";
      isValid = false;
    }
    
    if (!formData.date) {
      newErrors.date = "La fecha es obligatoria";
      isValid = false;
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = "La fecha debe ser igual o posterior a hoy";
        isValid = false;
      }
    }
    
    if (!formData.time) {
      newErrors.time = "La hora es obligatoria";
      isValid = false;
    }
    
    if (!formData.type) {
      newErrors.type = "El tipo de reunión es obligatorio";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Get graduate name
      const graduate = graduates.find(g => g.id === formData.graduateId);
      
      if (!graduate) {
        setErrors({
          ...errors,
          graduateId: "Egresado no encontrado"
        });
        return;
      }
      
      // Create new meeting
      const newMeeting: Meeting = {
        id: (meetings.length + 1).toString(),
        graduateName: graduate.name,
        graduateId: formData.graduateId,
        date: `${formData.date}T${formData.time}:00`,
        type: meetingTypes.find(t => t.value === formData.type)?.label || formData.type,
        status: "scheduled",
        observations: formData.observations
      };
      
      setMeetings([newMeeting, ...meetings]);
      setIsScheduleModalOpen(false);
      
      // Reset form
      setFormData({
        graduateId: "",
        date: "",
        time: "",
        type: "",
        observations: ""
      });
      
      // Show success message
      addToast({
        title: "Reunión programada",
        description: `Reunión con ${graduate.name} programada correctamente`,
        color: "success"
      });
    }
  };

  // View meeting details
  const viewDetails = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDetailsModalOpen(true);
  };

  // Cancel meeting
  const cancelMeeting = () => {
    if (selectedMeeting) {
      const updatedMeetings = meetings.map(m => 
        m.id === selectedMeeting.id ? { ...m, status: "cancelled" as const } : m
      );
      
      setMeetings(updatedMeetings);
      setIsCancelModalOpen(false);
      setIsDetailsModalOpen(false);
      
      // Show success message
      addToast({
        title: "Reunión cancelada",
        description: `La reunión con ${selectedMeeting.graduateName} ha sido cancelada`,
        color: "success"
      });
    }
  };

  // Mark meeting as completed
  const completeMeeting = (meeting: Meeting) => {
    const updatedMeetings = meetings.map(m => 
      m.id === meeting.id ? { ...m, status: "completed" as const } : m
    );
    
    setMeetings(updatedMeetings);
    setIsDetailsModalOpen(false);
    
    // Show success message
    addToast({
      title: "Reunión completada",
      description: `La reunión con ${meeting.graduateName} ha sido marcada como completada`,
      color: "success"
    });
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground-900">Gestión de Reuniones</h1>
            <p className="text-foreground-600">
              Programa y gestiona reuniones con egresados
            </p>
          </div>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:calendar-plus" width={18} height={18} />}
            onPress={() => setIsScheduleModalOpen(true)}
          >
            Programar Reunión
          </Button>
        </div>
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
                      <h3 className="text-lg font-medium">{meeting.type} con {meeting.graduateName}</h3>
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
                    {meeting.status === "scheduled" && (
                      <>
                        <Button
                          size="sm"
                          color="success"
                          variant="flat"
                          onPress={() => completeMeeting(meeting)}
                        >
                          Completar
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="light"
                          onPress={() => {
                            setSelectedMeeting(meeting);
                            setIsCancelModalOpen(true);
                          }}
                        >
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="text-center py-12">
          <Icon icon="lucide:calendar-x" className="mx-auto mb-4 text-default-400" width={48} height={48} />
          <h3 className="text-xl font-medium text-foreground-800">No se encontraron reuniones</h3>
          <p className="text-default-500 mt-2">
            {statusFilter === "all" 
              ? "No tienes reuniones programadas." 
              : `No tienes reuniones con estado "${getStatusText(statusFilter)}".`}
          </p>
          <Button
            color="primary"
            className="mt-6"
            startContent={<Icon icon="lucide:calendar-plus" width={18} height={18} />}
            onPress={() => setIsScheduleModalOpen(true)}
          >
            Programar Nueva Reunión
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
                    <h3 className="text-lg font-semibold">{selectedMeeting.type} con {selectedMeeting.graduateName}</h3>
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
                {selectedMeeting.status === "scheduled" && (
                  <>
                    <Button
                      color="success"
                      onPress={() => {
                        onClose();
                        completeMeeting(selectedMeeting);
                      }}
                    >
                      Marcar como Completada
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={() => {
                        setIsCancelModalOpen(true);
                      }}
                    >
                      Cancelar Reunión
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Schedule meeting modal */}
      <Modal isOpen={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Programar Nueva Reunión
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Select
                    label="Egresado"
                    placeholder="Selecciona un egresado"
                    selectedKeys={formData.graduateId ? [formData.graduateId] : []}
                    onChange={(e) => handleChange("graduateId", e.target.value)}
                    isInvalid={!!errors.graduateId}
                    errorMessage={errors.graduateId}
                    isRequired
                  >
                    {graduates.map((graduate) => (
                      <SelectItem key={graduate.id}>
                        {graduate.name} - {graduate.career}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="date"
                      label="Fecha"
                      value={formData.date}
                      onValueChange={(value) => handleChange("date", value)}
                      isInvalid={!!errors.date}
                      errorMessage={errors.date}
                      isRequired
                      min={new Date().toISOString().split('T')[0]}
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
                  
                  <Select
                    label="Tipo de reunión"
                    placeholder="Selecciona el tipo de reunión"
                    selectedKeys={formData.type ? [formData.type] : []}
                    onChange={(e) => handleChange("type", e.target.value)}
                    isInvalid={!!errors.type}
                    errorMessage={errors.type}
                    isRequired
                  >
                    {meetingTypes.map((type) => (
                      <SelectItem key={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Textarea
                    label="Observaciones"
                    placeholder="Agrega notas o detalles sobre la reunión"
                    value={formData.observations}
                    onValueChange={(value) => handleChange("observations", value)}
                    minRows={3}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                >
                  Programar Reunión
                </Button>
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
                  ¿Estás seguro que deseas cancelar la reunión con <strong>{selectedMeeting.graduateName}</strong>?
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
                  onPress={cancelMeeting}
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