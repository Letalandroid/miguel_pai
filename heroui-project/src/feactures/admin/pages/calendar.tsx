import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Chip, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";

// Calendar date type definition
interface CalendarDate {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "graduate" | "company" | "both";
  status: "available" | "booked" | "past";
  notes?: string;
}

// Mock data
const calendarDatesMock: CalendarDate[] = [
  {
    id: "1",
    date: "2023-06-20",
    startTime: "09:00",
    endTime: "12:00",
    type: "graduate",
    status: "available",
    notes: "Disponible para reuniones con egresados."
  },
  {
    id: "2",
    date: "2023-06-21",
    startTime: "14:00",
    endTime: "17:00",
    type: "company",
    status: "available",
    notes: "Disponible para reuniones con empresas."
  },
  {
    id: "3",
    date: "2023-06-22",
    startTime: "10:00",
    endTime: "16:00",
    type: "both",
    status: "available",
    notes: "Disponible para cualquier tipo de reunión."
  },
  {
    id: "4",
    date: "2023-06-23",
    startTime: "15:00",
    endTime: "17:00",
    type: "graduate",
    status: "booked",
    notes: "Reunión con Ana Rodríguez - Orientación Profesional."
  },
  {
    id: "5",
    date: "2023-06-15",
    startTime: "09:00",
    endTime: "12:00",
    type: "company",
    status: "past",
    notes: "Reunión con Tech Solutions - Presentación de convocatorias."
  }
];

export const AdminCalendar: React.FC = () => {
  const [calendarDates, setCalendarDates] = React.useState<CalendarDate[]>(calendarDatesMock);
  const [selectedDate, setSelectedDate] = React.useState<CalendarDate | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [typeFilter, setTypeFilter] = React.useState<"all" | "graduate" | "company" | "both">("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "available" | "booked" | "past">("all");
  
  // Form state
  const [formData, setFormData] = React.useState({
    date: "",
    startTime: "",
    endTime: "",
    type: "",
    notes: ""
  });
  
  // Form errors
  const [errors, setErrors] = React.useState({
    date: "",
    startTime: "",
    endTime: "",
    type: "",
    notes: ""
  });

  // Filter dates based on type and status
  const filteredDates = calendarDates.filter(date => {
    const matchesType = typeFilter === "all" || date.type === typeFilter;
    const matchesStatus = statusFilter === "all" || date.status === statusFilter;
    return matchesType && matchesStatus;
  });

  // Sort dates by date and time
  const sortedDates = [...filteredDates].sort((a, b) => {
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

  // Get type chip color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "graduate":
        return "primary";
      case "company":
        return "success";
      case "both":
        return "secondary";
      default:
        return "default";
    }
  };

  // Get type text
  const getTypeText = (type: string) => {
    switch (type) {
      case "graduate":
        return "Egresados";
      case "company":
        return "Empresas";
      case "both":
        return "Ambos";
      default:
        return "Desconocido";
    }
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
      type: "",
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
    
    if (!formData.type) {
      newErrors.type = "El tipo de disponibilidad es obligatorio";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Create new calendar date
      const newDate: CalendarDate = {
        id: (calendarDates.length + 1).toString(),
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        type: formData.type as "graduate" | "company" | "both",
        status: "available",
        notes: formData.notes
      };
      
      setCalendarDates([...calendarDates, newDate]);
      setIsAddModalOpen(false);
      
      // Reset form
      setFormData({
        date: "",
        startTime: "",
        endTime: "",
        type: "",
        notes: ""
      });
      
      // Show success message
      addToast({
        title: "Fecha agregada",
        description: "La fecha ha sido agregada al calendario correctamente",
        color: "success"
      });
    }
  };

  // View date details
  const viewDetails = (date: CalendarDate) => {
    setSelectedDate(date);
    setIsDetailsModalOpen(true);
  };

  // Delete date
  const deleteDate = () => {
    if (selectedDate) {
      const updatedDates = calendarDates.filter(date => date.id !== selectedDate.id);
      setCalendarDates(updatedDates);
      setIsDeleteModalOpen(false);
      setIsDetailsModalOpen(false);
      
      // Show success message
      addToast({
        title: "Fecha eliminada",
        description: "La fecha ha sido eliminada del calendario correctamente",
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
            <h1 className="text-2xl font-bold text-foreground-900">Gestión de Calendario</h1>
            <p className="text-foreground-600">
              Administra las fechas disponibles para reuniones con egresados y empresas
            </p>
          </div>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:plus" width={18} height={18} />}
            onPress={() => setIsAddModalOpen(true)}
          >
            Agregar Fecha
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card shadow="sm">
          <CardBody className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-wrap gap-2">
              <p className="text-small font-medium mr-2 self-center">Tipo:</p>
              <Button
                color={typeFilter === "all" ? "primary" : "default"}
                variant={typeFilter === "all" ? "flat" : "light"}
                size="sm"
                onPress={() => setTypeFilter("all")}
              >
                Todos
              </Button>
              <Button
                color={typeFilter === "graduate" ? "primary" : "default"}
                variant={typeFilter === "graduate" ? "flat" : "light"}
                size="sm"
                onPress={() => setTypeFilter("graduate")}
              >
                Egresados
              </Button>
              <Button
                color={typeFilter === "company" ? "success" : "default"}
                variant={typeFilter === "company" ? "flat" : "light"}
                size="sm"
                onPress={() => setTypeFilter("company")}
              >
                Empresas
              </Button>
              <Button
                color={typeFilter === "both" ? "secondary" : "default"}
                variant={typeFilter === "both" ? "flat" : "light"}
                size="sm"
                onPress={() => setTypeFilter("both")}
              >
                Ambos
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <p className="text-small font-medium mr-2 self-center">Estado:</p>
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
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Calendar dates list */}
      {sortedDates.length > 0 ? (
        <motion.div variants={itemVariants}>
          <Card shadow="sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Fechas del Calendario</h2>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              {sortedDates.map((date) => (
                <div 
                  key={date.id} 
                  className="p-4 bg-content2 rounded-lg flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium">{formatDate(date.date)}</h3>
                      <Chip
                        color={getTypeColor(date.type)}
                        variant="flat"
                        size="sm"
                      >
                        {getTypeText(date.type)}
                      </Chip>
                      <Chip
                        color={getStatusColor(date.status)}
                        variant="flat"
                        size="sm"
                      >
                        {getStatusText(date.status)}
                      </Chip>
                    </div>
                    <p className="text-default-600">
                      {date.startTime} - {date.endTime}
                    </p>
                    {date.notes && (
                      <p className="text-small text-default-500 line-clamp-1 mt-1">
                        {date.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 self-end md:self-center">
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={() => viewDetails(date)}
                    >
                      Ver Detalles
                    </Button>
                    {date.status === "available" && (
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() => {
                          setSelectedDate(date);
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
          <h3 className="text-xl font-medium text-foreground-800">No se encontraron fechas</h3>
          <p className="text-default-500 mt-2">
            {typeFilter !== "all" || statusFilter !== "all" 
              ? "No hay fechas que coincidan con los filtros seleccionados." 
              : "No hay fechas configuradas en el calendario."}
          </p>
          <Button
            color="primary"
            className="mt-6"
            startContent={<Icon icon="lucide:plus" width={18} height={18} />}
            onPress={() => setIsAddModalOpen(true)}
          >
            Agregar Fecha
          </Button>
        </motion.div>
      )}

      {/* Date details modal */}
      <Modal isOpen={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen} size="lg">
        <ModalContent>
          {(onClose) => selectedDate && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detalles de la Fecha
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{formatDate(selectedDate.date)}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Chip
                        color={getTypeColor(selectedDate.type)}
                        variant="flat"
                      >
                        {getTypeText(selectedDate.type)}
                      </Chip>
                      <Chip
                        color={getStatusColor(selectedDate.status)}
                        variant="flat"
                      >
                        {getStatusText(selectedDate.status)}
                      </Chip>
                    </div>
                  </div>
                  
                  <div className="bg-content2 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-small text-default-500">Horario:</p>
                      <p className="font-medium">
                        {selectedDate.startTime} - {selectedDate.endTime}
                      </p>
                    </div>
                    
                    {selectedDate.notes && (
                      <div>
                        <p className="text-small text-default-500">Notas:</p>
                        <p className="font-medium">{selectedDate.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedDate.status === "booked" && (
                    <div className="bg-content3 p-4 rounded-lg">
                      <p className="text-small">
                        <Icon icon="lucide:info" className="inline mr-1" width={16} height={16} />
                        Esta fecha ya ha sido reservada para una reunión. Para más detalles, consulta la sección de Reuniones.
                      </p>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                {selectedDate.status === "available" && (
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Eliminar Fecha
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add date modal */}
      <Modal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Agregar Fecha al Calendario
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
                  
                  <Select
                    label="Tipo de disponibilidad"
                    placeholder="Seleccione el tipo de disponibilidad"
                    selectedKeys={formData.type ? [formData.type] : []}
                    onChange={(e) => handleChange("type", e.target.value)}
                    isInvalid={!!errors.type}
                    errorMessage={errors.type}
                    isRequired
                  >
                    <SelectItem key="graduate">Egresados</SelectItem>
                    <SelectItem key="company">Empresas</SelectItem>
                    <SelectItem key="both">Ambos</SelectItem>
                  </Select>
                  
                  <Textarea
                    label="Notas (opcional)"
                    placeholder="Agrega notas o detalles sobre esta fecha"
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
                  Guardar Fecha
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} size="sm">
        <ModalContent>
          {(onClose) => selectedDate && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmar Eliminación
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro que deseas eliminar la fecha del <strong>{formatDate(selectedDate.date)}</strong> de <strong>{selectedDate.startTime}</strong> a <strong>{selectedDate.endTime}</strong>?
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
                  onPress={deleteDate}
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