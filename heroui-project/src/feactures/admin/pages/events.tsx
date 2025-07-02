import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Input, Chip, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Image, Textarea, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";

// Event type definition
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  type: "feria" | "hackathon" | "conferencia" | "networking";
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
  registrationType: "graduate" | "company";
  registrationDate: string;
  status: "confirmed" | "pending" | "cancelled";
}

// Mock data
const eventsMock: Event[] = [
  {
    id: "1",
    title: "Feria Laboral Virtual 2023",
    description: "Conecta con las mejores empresas del sector tecnológico y descubre oportunidades laborales adaptadas a tu perfil profesional.",
    date: "2023-06-25T09:00:00",
    endDate: "2023-06-25T18:00:00",
    location: "Plataforma Virtual",
    type: "feria",
    status: "upcoming",
    image: "https://img.heroui.chat/image/ai?w=800&h=400&u=event1",
    link: "https://meet.google.com/abc-defg-hij",
    participants: 45,
    maxParticipants: 200
  },
  {
    id: "2",
    title: "Hackathon de Innovación Tecnológica",
    description: "Participa en este desafío de 48 horas para desarrollar soluciones innovadoras a problemas reales del sector empresarial.",
    date: "2023-07-10T08:00:00",
    endDate: "2023-07-12T20:00:00",
    location: "Campus Universitario",
    type: "hackathon",
    status: "upcoming",
    image: "https://img.heroui.chat/image/ai?w=800&h=400&u=event2",
    link: "https://meet.google.com/klm-nopq-rst",
    participants: 32,
    maxParticipants: 50
  },
  {
    id: "3",
    title: "Conferencia: Tendencias Tecnológicas 2023",
    description: "Expertos del sector tecnológico compartirán las últimas tendencias y cómo estas impactarán el mercado laboral en los próximos años.",
    date: "2023-06-15T14:00:00",
    endDate: "2023-06-15T17:00:00",
    location: "Auditorio Principal",
    type: "conferencia",
    status: "completed",
    image: "https://img.heroui.chat/image/ai?w=800&h=400&u=event3",
    link: "https://meet.google.com/uvw-xyz-123",
    participants: 120,
    maxParticipants: 150
  },
  {
    id: "4",
    title: "Networking: Conectando Profesionales",
    description: "Evento diseñado para facilitar conexiones profesionales entre egresados y representantes de empresas líderes en el sector.",
    date: "2023-06-20T18:00:00",
    endDate: "2023-06-20T21:00:00",
    location: "Centro de Convenciones",
    type: "networking",
    status: "active",
    image: "https://img.heroui.chat/image/ai?w=800&h=400&u=event4",
    link: "https://meet.google.com/456-789-012",
    participants: 65,
    maxParticipants: 100
  }
];

// Mock participants data
const participantsMock: Participant[] = [
  { id: "1", name: "Ana Rodríguez", email: "ana.rodriguez@example.com", registrationType: "graduate", registrationDate: "2023-06-01T10:30:00", status: "confirmed" },
  { id: "2", name: "Carlos Mendoza", email: "carlos.mendoza@example.com", registrationType: "graduate", registrationDate: "2023-06-02T14:15:00", status: "confirmed" },
  { id: "3", name: "Tech Solutions", email: "contact@techsolutions.com", registrationType: "company", registrationDate: "2023-06-03T09:45:00", status: "pending" },
  { id: "4", name: "Juan Pérez", email: "juan.perez@example.com", registrationType: "graduate", registrationDate: "2023-06-01T16:20:00", status: "confirmed" },
  { id: "5", name: "Marketing Pro", email: "info@marketingpro.com", registrationType: "company", registrationDate: "2023-06-04T11:10:00", status: "cancelled" }
];

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = React.useState<Event[]>(eventsMock);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<"all" | "feria" | "hackathon" | "conferencia" | "networking">("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "upcoming" | "active" | "completed">("all");
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = React.useState(false);
  const [participants, setParticipants] = React.useState<Participant[]>(participantsMock);
  
  // Form state
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endDate: "",
    endTime: "",
    location: "",
    type: "",
    link: "",
    maxParticipants: "",
    image: null as File | null
  });
  
  // Form errors
  const [errors, setErrors] = React.useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endDate: "",
    endTime: "",
    location: "",
    type: "",
    link: "",
    maxParticipants: "",
    image: ""
  });

  // Filter events based on search term, type and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
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

  // Get type chip color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "feria":
        return "primary";
      case "hackathon":
        return "secondary";
      case "conferencia":
        return "success";
      case "networking":
        return "warning";
      default:
        return "default";
    }
  };

  // Get type text
  const getTypeText = (type: string) => {
    switch (type) {
      case "feria":
        return "Feria";
      case "hackathon":
        return "Hackathon";
      case "conferencia":
        return "Conferencia";
      case "networking":
        return "Networking";
      default:
        return "Evento";
    }
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
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
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
      case "confirmed":
        return "Confirmado";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Cancelado";
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

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          image: "El archivo debe ser una imagen (JPEG, PNG, GIF)"
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          image: "La imagen no debe superar los 5MB"
        });
        return;
      }
      
      setFormData({
        ...formData,
        image: file
      });
      
      setErrors({
        ...errors,
        image: ""
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
      endDate: "",
      endTime: "",
      location: "",
      type: "",
      link: "",
      maxParticipants: "",
      image: ""
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
      newErrors.date = "La fecha de inicio es obligatoria";
      isValid = false;
    }
    
    if (!formData.time) {
      newErrors.time = "La hora de inicio es obligatoria";
      isValid = false;
    }
    
    if (!formData.endDate) {
      newErrors.endDate = "La fecha de fin es obligatoria";
      isValid = false;
    }
    
    if (!formData.endTime) {
      newErrors.endTime = "La hora de fin es obligatoria";
      isValid = false;
    }
    
    // Check if end date/time is after start date/time
    if (formData.date && formData.time && formData.endDate && formData.endTime) {
      const startDateTime = new Date(`${formData.date}T${formData.time}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      if (endDateTime <= startDateTime) {
        newErrors.endDate = "La fecha/hora de fin debe ser posterior a la fecha/hora de inicio";
        isValid = false;
      }
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "La ubicación es obligatoria";
      isValid = false;
    }
    
    if (!formData.type) {
      newErrors.type = "El tipo de evento es obligatorio";
      isValid = false;
    }
    
    if (formData.link && !formData.link.startsWith('http')) {
      newErrors.link = "Ingrese un enlace válido (debe comenzar con http:// o https://)";
      isValid = false;
    }
    
    if (!formData.maxParticipants) {
      newErrors.maxParticipants = "El número máximo de participantes es obligatorio";
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

  // Handle form submission for adding a new event
  const handleAddEvent = () => {
    if (validateForm()) {
      // Create new event
      const newEvent: Event = {
        id: (events.length + 1).toString(),
        title: formData.title,
        description: formData.description,
        date: `${formData.date}T${formData.time}`,
        endDate: `${formData.endDate}T${formData.endTime}`,
        location: formData.location,
        type: formData.type as "feria" | "hackathon" | "conferencia" | "networking",
        status: "upcoming",
        image: formData.image ? URL.createObjectURL(formData.image) : "https://img.heroui.chat/image/ai?w=800&h=400&u=event" + (events.length + 1),
        link: formData.link,
        participants: 0,
        maxParticipants: parseInt(formData.maxParticipants)
      };
      
      setEvents([...events, newEvent]);
      setIsAddModalOpen(false);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        endDate: "",
        endTime: "",
        location: "",
        type: "",
        link: "",
        maxParticipants: "",
        image: null
      });
      
      // Show success message
      addToast({
        title: "Evento creado",
        description: "El evento ha sido creado correctamente",
        color: "success"
      });
    }
  };

  // Handle form submission for editing an event
  const handleEditEvent = () => {
    if (validateForm() && selectedEvent) {
      // Update event
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id 
          ? {
              ...event,
              title: formData.title,
              description: formData.description,
              date: `${formData.date}T${formData.time}`,
              endDate: `${formData.endDate}T${formData.endTime}`,
              location: formData.location,
              type: formData.type as "feria" | "hackathon" | "conferencia" | "networking",
              link: formData.link,
              maxParticipants: parseInt(formData.maxParticipants),
              image: formData.image ? URL.createObjectURL(formData.image) : event.image
            } 
          : event
      );
      
      setEvents(updatedEvents);
      setIsEditModalOpen(false);
      
      // Show success message
      addToast({
        title: "Evento actualizado",
        description: "El evento ha sido actualizado correctamente",
        color: "success"
      });
    }
  };

  // Delete event
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
      setEvents(updatedEvents);
      setIsDeleteModalOpen(false);
      setIsDetailsModalOpen(false);
      
      // Show success message
      addToast({
        title: "Evento eliminado",
        description: "El evento ha sido eliminado correctamente",
        color: "success"
      });
    }
  };

  // View event details
  const viewDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  // Edit event
  const editEvent = (event: Event) => {
    setSelectedEvent(event);
    
    // Parse date and time
    const eventDate = new Date(event.date);
    const date = eventDate.toISOString().split('T')[0];
    const time = eventDate.toTimeString().slice(0, 5);
    
    const eventEndDate = new Date(event.endDate);
    const endDate = eventEndDate.toISOString().split('T')[0];
    const endTime = eventEndDate.toTimeString().slice(0, 5);
    
    setFormData({
      title: event.title,
      description: event.description,
      date: date,
      time: time,
      endDate: endDate,
      endTime: endTime,
      location: event.location,
      type: event.type,
      link: event.link || "",
      maxParticipants: event.maxParticipants.toString(),
      image: null
    });
    
    setIsEditModalOpen(true);
  };

  // View participants
  const viewParticipants = (event: Event) => {
    setSelectedEvent(event);
    setIsParticipantsModalOpen(true);
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
            <h1 className="text-2xl font-bold text-foreground-900">Gestión de Eventos</h1>
            <p className="text-foreground-600">
              Administra los eventos para egresados y empresas
            </p>
          </div>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:plus" width={18} height={18} />}
            onPress={() => setIsAddModalOpen(true)}
          >
            Crear Evento
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card shadow="sm">
          <CardBody className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                startContent={<Icon icon="lucide:search" className="text-default-400" width={20} />}
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
            </div>
            
            <div className="flex gap-2 flex-wrap">
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
                color={typeFilter === "feria" ? "primary" : "default"}
                variant={typeFilter === "feria" ? "flat" : "light"}
                size="sm"
                onPress={() => setTypeFilter("feria")}
              >
                Ferias
              </Button>
              <Button
                color={typeFilter === "hackathon" ? "secondary" : "default"}
                variant={typeFilter === "hackathon" ? "flat" : "light"}
                size="sm"
                onPress={() => setTypeFilter("hackathon")}
              >
                Hackathons
              </Button>
              <Button
                color={typeFilter === "conferencia" ? "success" : "default"}
                variant={typeFilter === "conferencia" ? "flat" : "light"}
                size="sm"
                onPress={() => setTypeFilter("conferencia")}
              >
                Conferencias
              </Button>
              <Button
                color={typeFilter === "networking" ? "warning" : "default"}
                variant={typeFilter === "networking" ? "flat" : "light"}
                size="sm"
                onPress={() => setTypeFilter("networking")}
              >
                Networking
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Events list */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              variants={itemVariants}
              custom={index}
              className="h-full"
            >
              <Card shadow="sm" className="h-full">
                <CardHeader className="p-0">
                  <Image
                    removeWrapper
                    alt={event.title}
                    className="object-cover w-full h-48"
                    src={event.image}
                  />
                </CardHeader>
                <CardBody className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <div className="flex gap-1">
                      <Chip
                        color={getTypeColor(event.type)}
                        variant="flat"
                        size="sm"
                      >
                        {getTypeText(event.type)}
                      </Chip>
                      <Chip
                        color={getStatusColor(event.status)}
                        variant="flat"
                        size="sm"
                      >
                        {getStatusText(event.status)}
                      </Chip>
                    </div>
                  </div>
                  
                  <p className="text-small text-default-500 flex items-center gap-1">
                    <Icon icon="lucide:calendar" width={14} height={14} />
                    {formatDate(event.date)}
                  </p>
                  
                  <p className="text-small text-default-500 flex items-center gap-1">
                    <Icon icon="lucide:map-pin" width={14} height={14} />
                    {event.location}
                  </p>
                  
                  <p className="text-default-700 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Icon icon="lucide:users" width={14} height={14} className="text-default-500" />
                    <p className="text-small text-default-500">
                      {event.participants}/{event.maxParticipants} participantes
                    </p>
                  </div>
                </CardBody>
                <CardFooter className="flex gap-2">
                  <Button
                    color="primary"
                    variant="flat"
                    fullWidth
                    onPress={() => viewDetails(event)}
                  >
                    Ver Detalles
                  </Button>
                  <Button
                    color="secondary"
                    variant="light"
                    fullWidth
                    onPress={() => viewParticipants(event)}
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
          <Icon icon="lucide:search-x" className="mx-auto mb-4 text-default-400" width={48} height={48} />
          <h3 className="text-xl font-medium text-foreground-800">No se encontraron eventos</h3>
          <p className="text-default-500 mt-2">Intenta con otros términos de búsqueda o filtros</p>
        </motion.div>
      )}

      {/* Event details modal */}
      <Modal isOpen={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen} size="3xl">
        <ModalContent>
          {(onClose) => selectedEvent && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedEvent.title}
              </ModalHeader>
              <ModalBody>
                <Image
                  removeWrapper
                  alt={selectedEvent.title}
                  className="object-cover w-full h-64 rounded-lg"
                  src={selectedEvent.image}
                />
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Chip
                    color={getTypeColor(selectedEvent.type)}
                    variant="flat"
                  >
                    {getTypeText(selectedEvent.type)}
                  </Chip>
                  
                  <Chip
                    color={getStatusColor(selectedEvent.status)}
                    variant="flat"
                  >
                    {getStatusText(selectedEvent.status)}
                  </Chip>
                  
                  <Chip variant="flat" color="default">
                    <div className="flex items-center gap-1">
                      <Icon icon="lucide:users" width={14} height={14} />
                      {selectedEvent.participants}/{selectedEvent.maxParticipants} participantes
                    </div>
                  </Chip>
                </div>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Descripción</h4>
                    <p className="text-default-700">
                      {selectedEvent.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-md font-semibold mb-1">Fecha y hora de inicio</h4>
                      <p className="text-default-600 flex items-center gap-1">
                        <Icon icon="lucide:calendar" width={16} height={16} />
                        {formatDate(selectedEvent.date)}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-md font-semibold mb-1">Fecha y hora de fin</h4>
                      <p className="text-default-600 flex items-center gap-1">
                        <Icon icon="lucide:calendar-check" width={16} height={16} />
                        {formatDate(selectedEvent.endDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold mb-1">Ubicación</h4>
                    <p className="text-default-600 flex items-center gap-1">
                      <Icon icon="lucide:map-pin" width={16} height={16} />
                      {selectedEvent.location}
                    </p>
                  </div>
                  
                  {selectedEvent.link && (
                    <div className="p-4 bg-content2 rounded-lg">
                      <h4 className="text-md font-semibold mb-2">Enlace de acceso</h4>
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:link" width={18} height={18} className="text-primary" />
                        <a 
                          href={selectedEvent.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedEvent.link}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={() => {
                  setIsDeleteModalOpen(true);
                }}>
                  Eliminar
                </Button>
                <Button color="default" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    editEvent(selectedEvent);
                  }}
                >
                  Editar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add event modal */}
      <Modal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Crear Nuevo Evento
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Título"
                    placeholder="Ingrese el título del evento"
                    value={formData.title}
                    onValueChange={(value) => handleChange("title", value)}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    isRequired
                  />
                  
                  <Textarea
                    label="Descripción"
                    placeholder="Ingrese la descripción del evento"
                    value={formData.description}
                    onValueChange={(value) => handleChange("description", value)}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    minRows={3}
                    isRequired
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-small font-medium mb-1">Fecha y hora de inicio *</p>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          placeholder="Fecha"
                          value={formData.date}
                          onValueChange={(value) => handleChange("date", value)}
                          isInvalid={!!errors.date}
                          errorMessage={errors.date}
                          isRequired
                          className="flex-1"
                        />
                        <Input
                          type="time"
                          placeholder="Hora"
                          value={formData.time}
                          onValueChange={(value) => handleChange("time", value)}
                          isInvalid={!!errors.time}
                          errorMessage={errors.time}
                          isRequired
                          className="flex-1"
                        />
                      </div>
                      {(errors.date || errors.time) && (
                        <p className="text-tiny text-danger mt-1">
                          {errors.date || errors.time}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-small font-medium mb-1">Fecha y hora de fin *</p>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          placeholder="Fecha"
                          value={formData.endDate}
                          onValueChange={(value) => handleChange("endDate", value)}
                          isInvalid={!!errors.endDate}
                          errorMessage={errors.endDate}
                          isRequired
                          className="flex-1"
                        />
                        <Input
                          type="time"
                          placeholder="Hora"
                          value={formData.endTime}
                          onValueChange={(value) => handleChange("endTime", value)}
                          isInvalid={!!errors.endTime}
                          errorMessage={errors.endTime}
                          isRequired
                          className="flex-1"
                        />
                      </div>
                      {(errors.endDate || errors.endTime) && (
                        <p className="text-tiny text-danger mt-1">
                          {errors.endDate || errors.endTime}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Input
                    label="Ubicación"
                    placeholder="Ingrese la ubicación del evento"
                    value={formData.location}
                    onValueChange={(value) => handleChange("location", value)}
                    isInvalid={!!errors.location}
                    errorMessage={errors.location}
                    isRequired
                  />
                  
                  <Select
                    label="Tipo de evento"
                    placeholder="Seleccione el tipo de evento"
                    selectedKeys={formData.type ? [formData.type] : []}
                    onChange={(e) => handleChange("type", e.target.value)}
                    isInvalid={!!errors.type}
                    errorMessage={errors.type}
                    isRequired
                  >
                    <SelectItem key="feria">Feria</SelectItem>
                    <SelectItem key="hackathon">Hackathon</SelectItem>
                    <SelectItem key="conferencia">Conferencia</SelectItem>
                    <SelectItem key="networking">Networking</SelectItem>
                  </Select>
                  
                  <Input
                    label="Enlace de acceso (opcional)"
                    placeholder="https://meet.google.com/..."
                    value={formData.link}
                    onValueChange={(value) => handleChange("link", value)}
                    isInvalid={!!errors.link}
                    errorMessage={errors.link}
                  />
                  
                  <Input
                    type="number"
                    label="Máximo de participantes"
                    placeholder="Ingrese el número máximo de participantes"
                    value={formData.maxParticipants}
                    onValueChange={(value) => handleChange("maxParticipants", value)}
                    isInvalid={!!errors.maxParticipants}
                    errorMessage={errors.maxParticipants}
                    isRequired
                  />
                  
                  <div>
                    <p className="text-small font-medium mb-2">Imagen del evento *</p>
                    <div className="border-2 border-dashed border-default-200 rounded-lg p-4 text-center">
                      <Icon icon="lucide:upload-cloud" width={40} height={40} className="mx-auto mb-2 text-default-400" />
                      <p className="text-default-600 mb-2">Arrastra y suelta una imagen aquí o</p>
                      <label className="cursor-pointer">
                        <span className="text-primary">Selecciona un archivo</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="text-small text-default-500 mt-2">PNG, JPG, GIF (máx. 5MB)</p>
                    </div>
                    
                    {formData.image && (
                      <div className="flex items-center justify-between p-2 bg-content2 rounded-lg mt-2">
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:image" width={20} height={20} className="text-primary" />
                          <span className="text-small truncate max-w-[150px]">{formData.image.name}</span>
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => setFormData({...formData, image: null})}
                        >
                          <Icon icon="lucide:x" width={16} height={16} />
                        </Button>
                      </div>
                    )}
                    
                    {errors.image && (
                      <p className="text-small text-danger mt-1">{errors.image}</p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={handleAddEvent}
                >
                  Crear Evento
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit event modal */}
      <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar Evento
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Título"
                    placeholder="Ingrese el título del evento"
                    value={formData.title}
                    onValueChange={(value) => handleChange("title", value)}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title}
                    isRequired
                  />
                  
                  <Textarea
                    label="Descripción"
                    placeholder="Ingrese la descripción del evento"
                    value={formData.description}
                    onValueChange={(value) => handleChange("description", value)}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    minRows={3}
                    isRequired
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-small font-medium mb-1">Fecha y hora de inicio *</p>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          placeholder="Fecha"
                          value={formData.date}
                          onValueChange={(value) => handleChange("date", value)}
                          isInvalid={!!errors.date}
                          errorMessage={errors.date}
                          isRequired
                          className="flex-1"
                        />
                        <Input
                          type="time"
                          placeholder="Hora"
                          value={formData.time}
                          onValueChange={(value) => handleChange("time", value)}
                          isInvalid={!!errors.time}
                          errorMessage={errors.time}
                          isRequired
                          className="flex-1"
                        />
                      </div>
                      {(errors.date || errors.time) && (
                        <p className="text-tiny text-danger mt-1">
                          {errors.date || errors.time}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-small font-medium mb-1">Fecha y hora de fin *</p>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          placeholder="Fecha"
                          value={formData.endDate}
                          onValueChange={(value) => handleChange("endDate", value)}
                          isInvalid={!!errors.endDate}
                          errorMessage={errors.endDate}
                          isRequired
                          className="flex-1"
                        />
                        <Input
                          type="time"
                          placeholder="Hora"
                          value={formData.endTime}
                          onValueChange={(value) => handleChange("endTime", value)}
                          isInvalid={!!errors.endTime}
                          errorMessage={errors.endTime}
                          isRequired
                          className="flex-1"
                        />
                      </div>
                      {(errors.endDate || errors.endTime) && (
                        <p className="text-tiny text-danger mt-1">
                          {errors.endDate || errors.endTime}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Input
                    label="Ubicación"
                    placeholder="Ingrese la ubicación del evento"
                    value={formData.location}
                    onValueChange={(value) => handleChange("location", value)}
                    isInvalid={!!errors.location}
                    errorMessage={errors.location}
                    isRequired
                  />
                  
                  <Select
                    label="Tipo de evento"
                    placeholder="Seleccione el tipo de evento"
                    selectedKeys={formData.type ? [formData.type] : []}
                    onChange={(e) => handleChange("type", e.target.value)}
                    isInvalid={!!errors.type}
                    errorMessage={errors.type}
                    isRequired
                  >
                    <SelectItem key="feria">Feria</SelectItem>
                    <SelectItem key="hackathon">Hackathon</SelectItem>
                    <SelectItem key="conferencia">Conferencia</SelectItem>
                    <SelectItem key="networking">Networking</SelectItem>
                  </Select>
                  
                  <Input
                    label="Enlace de acceso (opcional)"
                    placeholder="https://meet.google.com/..."
                    value={formData.link}
                    onValueChange={(value) => handleChange("link", value)}
                    isInvalid={!!errors.link}
                    errorMessage={errors.link}
                  />
                  
                  <Input
                    type="number"
                    label="Máximo de participantes"
                    placeholder="Ingrese el número máximo de participantes"
                    value={formData.maxParticipants}
                    onValueChange={(value) => handleChange("maxParticipants", value)}
                    isInvalid={!!errors.maxParticipants}
                    errorMessage={errors.maxParticipants}
                    isRequired
                  />
                  
                  <div>
                    <p className="text-small font-medium mb-2">Imagen del evento (opcional)</p>
                    <div className="border-2 border-dashed border-default-200 rounded-lg p-4 text-center">
                      <Icon icon="lucide:upload-cloud" width={40} height={40} className="mx-auto mb-2 text-default-400" />
                      <p className="text-default-600 mb-2">Arrastra y suelta una imagen aquí o</p>
                      <label className="cursor-pointer">
                        <span className="text-primary">Selecciona un archivo</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="text-small text-default-500 mt-2">PNG, JPG, GIF (máx. 5MB)</p>
                    </div>
                    
                    {formData.image && (
                      <div className="flex items-center justify-between p-2 bg-content2 rounded-lg mt-2">
                        <div className="flex items-center gap-2">
                          <Icon icon="lucide:image" width={20} height={20} className="text-primary" />
                          <span className="text-small truncate max-w-[150px]">{formData.image.name}</span>
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => setFormData({...formData, image: null})}
                        >
                          <Icon icon="lucide:x" width={16} height={16} />
                        </Button>
                      </div>
                    )}
                    
                    {errors.image && (
                      <p className="text-small text-danger mt-1">{errors.image}</p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={handleEditEvent}
                >
                  Guardar Cambios
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} size="sm">
        <ModalContent>
          {(onClose) => selectedEvent && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmar Eliminación
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro que deseas eliminar el evento <strong>{selectedEvent.title}</strong>?
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
                  onPress={handleDeleteEvent}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Participants modal */}
      <Modal isOpen={isParticipantsModalOpen} onOpenChange={setIsParticipantsModalOpen} size="2xl">
        <ModalContent>
          {(onClose) => selectedEvent && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Participantes - {selectedEvent.title}
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-default-700">
                    <span className="font-medium">{selectedEvent.participants}</span> de <span className="font-medium">{selectedEvent.maxParticipants}</span> participantes
                  </p>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    startContent={<Icon icon="lucide:plus" width={16} height={16} />}
                  >
                    Agregar Participante
                  </Button>
                </div>
                
                {participants.length > 0 ? (
                  <div className="space-y-3">
                    {participants.map((participant) => (
                      <div key={participant.id} className="p-3 bg-content2 rounded-lg flex flex-col sm:flex-row justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{participant.name}</p>
                            <Chip
                              color={participant.status === "confirmed" ? "success" : participant.status === "pending" ? "warning" : "default"}
                              variant="flat"
                              size="sm"
                            >
                              {getStatusText(participant.status)}
                            </Chip>
                            <Chip
                              color={participant.registrationType === "graduate" ? "primary" : "success"}
                              variant="flat"
                              size="sm"
                            >
                              {participant.registrationType === "graduate" ? "Egresado" : "Empresa"}
                            </Chip>
                          </div>
                          <p className="text-small text-default-500">{participant.email}</p>
                          <p className="text-tiny text-default-400">Registrado: {new Date(participant.registrationDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Select
                            size="sm"
                            className="w-32"
                            selectedKeys={[participant.status]}
                            aria-label="Cambiar estado"
                          >
                            <SelectItem key="confirmed">Confirmado</SelectItem>
                            <SelectItem key="pending">Pendiente</SelectItem>
                            <SelectItem key="cancelled">Cancelado</SelectItem>
                          </Select>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                          >
                            <Icon icon="lucide:trash-2" width={16} height={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icon icon="lucide:users-x" className="mx-auto mb-4 text-default-400" width={48} height={48} />
                    <h3 className="text-lg font-medium text-foreground-800">No hay participantes</h3>
                    <p className="text-default-500 mt-2">Este evento aún no tiene participantes registrados.</p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                >
                  Guardar Cambios
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  );
};