import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Chip, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";

// Availability slot type definition
interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "available" | "booked" | "past";
  notes?: string;
}

// Mock data
const availabilitySlotsMock: AvailabilitySlot[] = [
  {
    id: "1",
    date: "2023-06-20",
    startTime: "09:00",
    endTime: "12:00",
    status: "available",
    notes: "Disponible para entrevistas iniciales."
  },
  {
    id: "2",
    date: "2023-06-21",
    startTime: "14:00",
    endTime: "17:00",
    status: "available",
    notes: "Disponible para evaluaciones técnicas."
  },
  {
    id: "3",
    date: "2023-06-22",
    startTime: "10:00",
    endTime: "13:00",
    status: "booked",
    notes: "Reunión con Ana Rodríguez - Entrevista Inicial."
  },
  {
    id: "4",
    date: "2023-06-23",
    startTime: "15:00",
    endTime: "17:00",
    status: "booked",
    notes: "Reunión con Carlos Mendoza - Evaluación Técnica."
  },
  {
    id: "5",
    date: "2023-06-15",
    startTime: "09:00",
    endTime: "12:00",
    status: "past",
    notes: "Reunión con María López - Entrevista Final."
  }
];

export const CompanyAvailability: React.FC = () => {
  const [availabilitySlots, setAvailabilitySlots] = React.useState<AvailabilitySlot[]>(availabilitySlotsMock);
  const [selectedSlot, setSelectedSlot] = React.useState<AvailabilitySlot | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<"all" | "available" | "booked" | "past">("all");
  
  // Form state
  const [formData, setFormData] = React.useState({
    date: "",
    startTime: "",
    endTime: "",
    notes: ""
  });
  
  // Form errors
  const [errors, setErrors] = React.useState({
    date: "",
    startTime: "",
    endTime: "",
    notes: ""
  });

  // Filter slots based on status
  const filteredSlots = availabilitySlots.filter(slot => {
    if (statusFilter === "all") return true;
    return slot.status === statusFilter;
  });

  // Sort slots by date and time
  const sortedSlots = [...filteredSlots].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "success";
      case "booked":
        return "primary";
      case "past":
        return "default";
      default:
        return "default";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible";
      case "booked":
        return "Reservado";
      case "past":
        return "Pasado";
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
      date: "",
      startTime: "",
      endTime: "",
      notes: ""
    };
    
    let isValid = true;
    
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
    
    if (!formData.startTime) {
      newErrors.startTime = "La hora de inicio es obligatoria";
      isValid = false;
    }
    
    if (!formData.endTime) {
      newErrors.endTime = "La hora de fin es obligatoria";
      isValid = false;
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = "La hora de fin debe ser posterior a la hora de inicio";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Create new availability slot
      const newSlot: AvailabilitySlot = {
        id: (availabilitySlots.length + 1).toString(),
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: "available",
        notes: formData.notes
      };
      
      setAvailabilitySlots([...availabilitySlots, newSlot]);
      setIsAddModalOpen(false);
      
      // Reset form
      setFormData({
        date: "",
        startTime: "",
        endTime: "",
        notes: ""
      });
      
      // Show success message
      addToast({
        title: "Disponibilidad agregada",
        description: "El horario de disponibilidad ha sido agregado correctamente",
        color: "success"
      });
    }
  };

  // View slot details
  const viewDetails = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
    setIsDetailsModalOpen(true);
  };

  // Delete slot
  const deleteSlot = () => {
    if (selectedSlot) {
      const updatedSlots = availabilitySlots.filter(slot => slot.id !== selectedSlot.id);
      setAvailabilitySlots(updatedSlots);
      setIsDeleteModalOpen(false);
      setIsDetailsModalOpen(false);
      
      // Show success message
      addToast({
        title: "Disponibilidad eliminada",
        description: "El horario de disponibilidad ha sido eliminado correctamente",
        color: "success"
      });
    }
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
            <h1 className="text-2xl font-bold text-foreground-900">Gestión de Disponibilidad</h1>
            <p className="text-foreground-600">
              Administra tus horarios disponibles para reuniones con egresados
            </p>
          </div>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:plus" width={18} height={18} />}
            onPress={() => setIsAddModalOpen(true)}
          >
            Agregar Disponibilidad
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
              Todos
            </Button>
            <Button
              color={statusFilter === "available" ? "success" : "default"}
              variant={statusFilter === "available" ? "flat" : "light"}
              size="sm"
              onPress={() => setStatusFilter("available")}
            >
              Disponibles
            </Button>
            <Button
              color={statusFilter === "booked" ? "primary" : "default"}
              variant={statusFilter === "booked" ? "flat" : "light"}
              size="sm"
              onPress={() => setStatusFilter("booked")}
            >
              Reservados
            </Button>
            <Button
              color={statusFilter === "past" ? "default" : "default"}
              variant={statusFilter === "past" ? "flat" : "light"}
              size="sm"
              onPress={() => setStatusFilter("past")}
            >
              Pasados
            </Button>
          </CardBody>
        </Card>
      </motion.div>

      {/* Availability slots list */}
      {sortedSlots.length > 0 ? (
        <motion.div variants={itemVariants}>
          <Card shadow="sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Horarios de Disponibilidad</h2>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              {sortedSlots.map((slot) => (
                <div 
                  key={slot.id} 
                  className="p-4 bg-content2 rounded-lg flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium">{formatDate(slot.date)}</h3>
                      <Chip
                        color={getStatusColor(slot.status)}
                        variant="flat"
                        size="sm"
                      >
                        {getStatusText(slot.status)}
                      </Chip>
                    </div>
                    <p className="text-default-600">
                      {slot.startTime} - {slot.endTime}
                    </p>
                    {slot.notes && (
                      <p className="text-small text-default-500 line-clamp-1 mt-1">
                        {slot.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 self-end md:self-center">
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={() => viewDetails(slot)}
                    >
                      Ver Detalles
                    </Button>
                    {slot.status === "available" && (
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() => {
                          setSelectedSlot(slot);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        Eliminar
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
          <Icon icon="lucide:calendar-x" className="mx-auto mb-4 text-default-400" width={48} height={48} />
          <h3 className="text-xl font-medium text-foreground-800">No se encontraron horarios</h3>
          <p className="text-default-500 mt-2">
            {statusFilter === "all" 
              ? "No tienes horarios de disponibilidad configurados." 
              : `No tienes horarios con estado "${getStatusText(statusFilter)}".`}
          </p>
          <Button
            color="primary"
            className="mt-6"
            startContent={<Icon icon="lucide:plus" width={18} height={18} />}
            onPress={() => setIsAddModalOpen(true)}
          >
            Agregar Disponibilidad
          </Button>
        </motion.div>
      )}

      {/* Slot details modal */}
      <Modal isOpen={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen} size="lg">
        <ModalContent>
          {(onClose) => selectedSlot && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detalles de Disponibilidad
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{formatDate(selectedSlot.date)}</h3>
                    <Chip
                      color={getStatusColor(selectedSlot.status)}
                      variant="flat"
                      className="mt-1"
                    >
                      {getStatusText(selectedSlot.status)}
                    </Chip>
                  </div>
                  
                  <div className="bg-content2 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-small text-default-500">Horario:</p>
                      <p className="font-medium">
                        {selectedSlot.startTime} - {selectedSlot.endTime}
                      </p>
                    </div>
                    
                    {selectedSlot.notes && (
                      <div>
                        <p className="text-small text-default-500">Notas:</p>
                        <p className="font-medium">{selectedSlot.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedSlot.status === "booked" && (
                    <div className="bg-content3 p-4 rounded-lg">
                      <p className="text-small">
                        <Icon icon="lucide:info" className="inline mr-1" width={16} height={16} />
                        Este horario ya ha sido reservado para una reunión. Para más detalles, consulta la sección de Reuniones.
                      </p>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                {selectedSlot.status === "available" && (
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Eliminar Disponibilidad
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add availability modal */}
      <Modal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Agregar Disponibilidad
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="time"
                      label="Hora de inicio"
                      value={formData.startTime}
                      onValueChange={(value) => handleChange("startTime", value)}
                      isInvalid={!!errors.startTime}
                      errorMessage={errors.startTime}
                      isRequired
                    />
                    
                    <Input
                      type="time"
                      label="Hora de fin"
                      value={formData.endTime}
                      onValueChange={(value) => handleChange("endTime", value)}
                      isInvalid={!!errors.endTime}
                      errorMessage={errors.endTime}
                      isRequired
                    />
                  </div>
                  
                  <Textarea
                    label="Notas (opcional)"
                    placeholder="Agrega notas o detalles sobre esta disponibilidad"
                    value={formData.notes}
                    onValueChange={(value) => handleChange("notes", value)}
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
                  Guardar Disponibilidad
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} size="sm">
        <ModalContent>
          {(onClose) => selectedSlot && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmar Eliminación
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro que deseas eliminar la disponibilidad del <strong>{formatDate(selectedSlot.date)}</strong> de <strong>{selectedSlot.startTime}</strong> a <strong>{selectedSlot.endTime}</strong>?
                </p>
                <p className="text-small text-danger mt-4">
                  <Icon icon="lucide:alert-triangle" className="inline mr-1" width={16} height={16} />
                  Esta acción no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={deleteSlot}
                >
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