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
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";
import { supabase } from "../../../supabase/client";
import { MeetingSend, sendNotification } from "../../../utils/sendNotification";
import { useAuth } from "../../login/auth-context";

// Meeting type definition
interface Meeting {
  id: string;
  graduateId?: number;
  graduateName: string;
  graduateEmail: string;
  companyName: string;
  companyEmail: string;
  companyId?: number;
  dateInit: string;
  dateEnd: string;
  endTime: string;
  type: "entrevista" | "orientacion" | "seguimiento" | "otro";
  status: "scheduled" | "completed" | "cancelled";
  location: string;
  notes: string;
  createdBy: "graduate" | "company" | "admin";
}

export const AdminMeetings: React.FC = () => {
  const [meetings, setMeetings] = React.useState<Meeting[]>([]);
  const [companies, setCompanies] = React.useState([]);
  const [egresados, setEgresados] = React.useState([]);
  const [reload, setReload] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<
    "all" | "entrevista" | "orientacion" | "seguimiento" | "otro"
  >("all");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "scheduled" | "completed" | "cancelled"
  >("all");
  const [selectedMeeting, setSelectedMeeting] = React.useState<Meeting | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = React.useState({
    graduateId: 0,
    graduateName: "",
    graduateEmail: "",
    companyId: 0,
    companyName: "",
    companyEmail: "",
    date: "",
    time: "",
    endTime: "",
    type: "",
    location: "",
    notes: "",
  });

  // Form errors
  const [errors, setErrors] = React.useState({
    graduateId: "",
    graduateName: "",
    graduateEmail: "",
    companyId: "",
    companyName: "",
    companyEmail: "",
    date: "",
    time: "",
    endTime: "",
    type: "",
    location: "",
    notes: "",
  });

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
  }, [reload]);

  useEffect(() => {
    const getMeetings = async () => {
      const { error, data } = await supabase
        .from("meetings")
        .select("*")
        .order("id", { ascending: false });

      setMeetings(data);

      if (error) {
        throw error;
      }
    };

    getMeetings();
  }, [reload]);

  useEffect(() => {
    const getCompanies = async () => {
      const { error, data } = await supabase
        .from("empresas")
        .select("*")
        .order("id", { ascending: false });

      setCompanies(data);

      if (error) {
        throw error;
      }
    };

    getCompanies();
  }, []);

  // Filter meetings based on search term, type and status
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.graduateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.notes.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || meeting.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || meeting.status === statusFilter;

    try {
      const {
        id: companyId,
        name: companyName,
        email: companyEmail,
      } = companies.find((c) => {
        return c.id == meeting.companyId;
      });
      // Set company data
      meeting.companyId = companyId;
      meeting.companyName = companyName;
      meeting.companyEmail = companyEmail;
    } catch (error) {
      console.error(error);
    }

    try {
      const {
        id: graduateId,
        name: graduateName,
        email: graduateEmail,
      } = egresados.find((e) => {
        return e.id == meeting.graduateId;
      });

      // Set graduate data
      meeting.graduateId = graduateId;
      meeting.graduateName = graduateName;
      meeting.graduateEmail = graduateEmail;
    } catch (error) {
      console.error(error);
    }

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
      case "entrevista":
        return "primary";
      case "orientacion":
        return "secondary";
      case "seguimiento":
        return "success";
      case "otro":
        return "warning";
      default:
        return "default";
    }
  };

  // Get type text
  const getTypeText = (type: string) => {
    switch (type) {
      case "entrevista":
        return "Entrevista";
      case "orientacion":
        return "Orientación";
      case "seguimiento":
        return "Seguimiento";
      case "otro":
        return "Otro";
      default:
        return "Reunión";
    }
  };

  // Get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "primary";
      case "completed":
        return "success";
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

  // Get creator text
  const getCreatorText = (creator: string) => {
    switch (creator) {
      case "graduate":
        return "Egresado";
      case "company":
        return "Empresa";
      case "admin":
        return "Administrador";
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
      graduateId: "",
      graduateName: "",
      graduateEmail: "",
      companyId: "",
      companyName: "",
      companyEmail: "",
      date: "",
      time: "",
      endTime: "",
      type: "",
      location: "",
      notes: "",
    };

    let isValid = true;

    // if (!formData.graduateName.trim()) {
    //   newErrors.graduateName = "El nombre del egresado es obligatorio";
    //   isValid = false;
    // }

    // if (!formData.graduateEmail.trim()) {
    //   newErrors.graduateEmail = "El correo del egresado es obligatorio";
    //   isValid = false;
    // } else if (!/\S+@\S+\.\S+/.test(formData.graduateEmail)) {
    //   newErrors.graduateEmail = "Ingrese un correo electrónico válido";
    //   isValid = false;
    // }

    // if (!formData.companyName.trim()) {
    //   newErrors.companyName = "El nombre de la empresa es obligatorio";
    //   isValid = false;
    // }

    // if (!formData.companyEmail.trim()) {
    //   newErrors.companyEmail = "El correo de la empresa es obligatorio";
    //   isValid = false;
    // } else if (!/\S+@\S+\.\S+/.test(formData.companyEmail)) {
    //   newErrors.companyEmail = "Ingrese un correo electrónico válido";
    //   isValid = false;
    // }

    // if (!formData.graduateId) {
    //   newErrors.graduateId = "El egresado es obligatorio";
    //   isValid = false;
    // }

    if (!formData.companyId) {
      newErrors.companyId = "La compañia es obligatoria";
      isValid = false;
    }

    if (!formData.date) {
      newErrors.date = "La fecha es obligatoria";
      isValid = false;
    }

    if (!formData.time) {
      newErrors.time = "La hora de inicio es obligatoria";
      isValid = false;
    }

    if (!formData.endTime) {
      newErrors.endTime = "La hora de fin es obligatoria";
      isValid = false;
    } else if (
      formData.time &&
      formData.endTime &&
      formData.endTime <= formData.time
    ) {
      newErrors.endTime =
        "La hora de fin debe ser posterior a la hora de inicio";
      isValid = false;
    }

    if (!formData.type) {
      newErrors.type = "El tipo de reunión es obligatorio";
      isValid = false;
    }

    // if (!formData.location.trim()) {
    //   newErrors.location = "La ubicación es obligatoria";
    //   isValid = false;
    // }

    console.log(newErrors);
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission for adding a new meeting
  const handleAddMeeting = async () => {
    if (validateForm()) {
      setLoading(true);
      // Create new meeting
      const newMeeting: Meeting = {
        id: (meetings.length + 1).toString(),
        graduateId: parseInt(formData.graduateName),
        graduateName: formData.graduateName,
        graduateEmail: formData.graduateEmail,
        companyId: formData.companyId,
        companyName: formData.companyName,
        companyEmail: formData.companyEmail,
        dateInit: `${formData.date}T${formData.time}`,
        dateEnd: `${formData.date}T${formData.endTime}`,
        endTime: `${formData.date}T${formData.endTime}`,
        type: formData.type as
          | "entrevista"
          | "orientacion"
          | "seguimiento"
          | "otro",
        status: "scheduled",
        location: formData.location,
        notes: formData.notes,
        createdBy: "admin",
      };

      const {
        id,
        notes,
        companyEmail,
        companyName,
        createdBy,
        endTime,
        graduateEmail,
        location,
        ...meetingData
      } = newMeeting;

      const { error } = await supabase
        .from("meetings")
        .insert([{ observations: notes, ...meetingData }]);

      const cEmail = companies.find((c) => {
        return c.id == formData.companyId;
      });
      const eEmail = egresados.find((e) => {
        return e.id == formData.graduateId;
      });

      const meet: MeetingSend = {
        type: formData.type,
        comanyName: formData.companyName,
        graduateName: formData.graduateName,
        dateInit: newMeeting.dateInit,
        dateEnd: newMeeting.dateEnd,
        emails: [cEmail?.email ?? "", eEmail?.email ?? "", user?.email ?? ""],
        status: "scheduled",
      };

      await sendNotification(meet);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setMeetings([...meetings, newMeeting]);
      setIsAddModalOpen(false);
      setLoading(false);

      // Reset form
      setFormData({
        graduateId: 0,
        graduateName: "",
        graduateEmail: "",
        companyId: 0,
        companyName: "",
        companyEmail: "",
        date: "",
        time: "",
        endTime: "",
        type: "",
        location: "",
        notes: "",
      });

      // Show success message
      addToast({
        title: "Reunión creada",
        description: "La reunión ha sido programada correctamente",
        color: "success",
      });
    }
  };

  // Handle form submission for editing a meeting
  const handleEditMeeting = () => {
    if (validateForm() && selectedMeeting) {
      // Update meeting
      const updatedMeetings = meetings.map((meeting) =>
        meeting.id === selectedMeeting.id
          ? {
              ...meeting,
              graduateName: formData.graduateName,
              graduateEmail: formData.graduateEmail,
              companyName: formData.companyName,
              companyEmail: formData.companyEmail,
              date: `${formData.date}T${formData.time}`,
              endTime: `${formData.date}T${formData.endTime}`,
              type: formData.type as
                | "entrevista"
                | "orientacion"
                | "seguimiento"
                | "otro",
              location: formData.location,
              notes: formData.notes,
            }
          : meeting
      );

      setMeetings(updatedMeetings);
      setIsEditModalOpen(false);

      // Show success message
      addToast({
        title: "Reunión actualizada",
        description: "La reunión ha sido actualizada correctamente",
        color: "success",
      });
    }
  };

  // Delete meeting
  const handleDeleteMeeting = () => {
    if (selectedMeeting) {
      const updatedMeetings = meetings.filter(
        (meeting) => meeting.id !== selectedMeeting.id
      );
      setMeetings(updatedMeetings);
      setIsDeleteModalOpen(false);
      setIsDetailsModalOpen(false);

      // Show success message
      addToast({
        title: "Reunión eliminada",
        description: "La reunión ha sido eliminada correctamente",
        color: "success",
      });
    }
  };

  // Change meeting status
  const handleChangeStatus = async (
    meetingId: string,
    newStatus: "scheduled" | "completed" | "cancelled"
  ) => {
    const updatedMeetings = meetings.map((meeting) =>
      meeting.id === meetingId ? { ...meeting, status: newStatus } : meeting
    );

    const getMeet = meetings.find((m) => { return m.id == meetingId});

    const { error } = await supabase
      .from("meetings")
      .update({ status: newStatus })
      .eq("id", meetingId);

    if (error) {
      console.error(error);
      addToast({
        title: "Error",
        description: "No se pudo cancelar la reunión",
        color: "danger",
      });
      return;
    }

    const cEmail = companies.find((c) => {
      return c.id == formData.companyId;
    });
    const eEmail = egresados.find((e) => {
      return e.id == formData.graduateId;
    });

    const meet: MeetingSend = {
      type: getMeet.type,
      comanyName: getMeet.companyName,
      graduateName: getMeet.graduateName,
      dateInit: getMeet.dateInit,
      dateEnd: getMeet.dateEnd,
      emails: [cEmail?.email ?? "", eEmail?.email ?? "", user?.email ?? ""],
      status: newStatus,
    };

    await sendNotification(meet);

    setMeetings(updatedMeetings);

    // Update selected meeting if it's the one being changed
    if (selectedMeeting && selectedMeeting.id === meetingId) {
      setSelectedMeeting({ ...selectedMeeting, status: newStatus });
    }

    // Show success message
    addToast({
      title: "Estado actualizado",
      description: `La reunión ahora está ${
        newStatus === "scheduled"
          ? "programada"
          : newStatus === "completed"
          ? "completada"
          : "cancelada"
      }`,
      color: "success",
    });
  };

  // View meeting details
  const viewDetails = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDetailsModalOpen(true);
  };

  // Edit meeting
  const editMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);

    // Parse date and time
    const meetingDate = new Date(meeting.dateInit);
    const date = meetingDate.toISOString().split("T")[0];
    const time = meetingDate.toTimeString().slice(0, 5);

    const meetingEndTime = new Date(meeting.endTime);
    const endTime = meetingEndTime.toTimeString().slice(0, 5);

    setFormData({
      graduateId: meeting.graduateId,
      graduateName: meeting.graduateName,
      graduateEmail: meeting.graduateEmail,
      companyId: meeting.companyId,
      companyName: meeting.companyName,
      companyEmail: meeting.companyEmail,
      date: date,
      time: time,
      endTime: endTime,
      type: meeting.type,
      location: meeting.location,
      notes: meeting.notes,
    });

    setIsEditModalOpen(true);
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
              Gestión de Reuniones
            </h1>
            <p className="text-foreground-600">
              Administra las reuniones entre egresados y empresas
            </p>
          </div>
          <Button
            color="primary"
            startContent={<Icon icon="lucide:plus" width={18} height={18} />}
            onPress={() => setIsAddModalOpen(true)}
          >
            Programar Reunión
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card shadow="sm">
          <CardBody className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Buscar reuniones..."
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
                  color={statusFilter === "scheduled" ? "primary" : "default"}
                  variant={statusFilter === "scheduled" ? "flat" : "light"}
                  size="sm"
                  onPress={() => setStatusFilter("scheduled")}
                >
                  Programadas
                </Button>
                <Button
                  color={statusFilter === "completed" ? "success" : "default"}
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
                Todas
              </Button>
              <Button
                color={typeFilter === "entrevista" ? "primary" : "default"}
                variant={typeFilter === "entrevista" ? "flat" : "light"}
                size="sm"
                onPress={() => setTypeFilter("entrevista")}
              >
                Entrevistas
              </Button>
              <Button
                color={typeFilter === "orientacion" ? "secondary" : "default"}
                variant={typeFilter === "orientacion" ? "flat" : "light"}
                size="sm"
                onPress={() => setTypeFilter("orientacion")}
              >
                Orientación
              </Button>
              <Button
                color={typeFilter === "seguimiento" ? "success" : "default"}
                variant={typeFilter === "seguimiento" ? "flat" : "light"}
                size="sm"
                onPress={() => setTypeFilter("seguimiento")}
              >
                Seguimiento
              </Button>
              <Button
                color={typeFilter === "otro" ? "warning" : "default"}
                variant={typeFilter === "otro" ? "flat" : "light"}
                size="sm"
                onPress={() => setTypeFilter("otro")}
              >
                Otro
              </Button>
            </div>
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
                      <h3 className="text-lg font-medium">
                        {getTypeText(meeting.type)}: {meeting.graduateName} -{" "}
                        {meeting.companyName}
                      </h3>
                      <Chip
                        color={getStatusColor(meeting.status)}
                        variant="flat"
                        size="sm"
                      >
                        {getStatusText(meeting.status)}
                      </Chip>
                    </div>
                    <p className="text-small text-default-500 flex items-center gap-1 mb-1">
                      <Icon icon="lucide:calendar" width={14} height={14} />
                      {formatDate(meeting.dateInit)}
                    </p>
                    {/* <p className="text-small text-default-500 flex items-center gap-1">
                      <Icon icon="lucide:map-pin" width={14} height={14} />
                      {meeting.location}
                    </p> */}
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
                          onPress={() =>
                            handleChangeStatus(meeting.id, "completed")
                          }
                        >
                          Marcar Completada
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          variant="flat"
                          onPress={() =>
                            handleChangeStatus(meeting.id, "cancelled")
                          }
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
          <Icon
            icon="lucide:search-x"
            className="mx-auto mb-4 text-default-400"
            width={48}
            height={48}
          />
          <h3 className="text-xl font-medium text-foreground-800">
            No se encontraron reuniones
          </h3>
          <p className="text-default-500 mt-2">
            Intenta con otros términos de búsqueda o filtros
          </p>
        </motion.div>
      )}

      {/* Meeting details modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        size="3xl"
      >
        <ModalContent>
          {(onClose) =>
            selectedMeeting && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {getTypeText(selectedMeeting.type)}:{" "}
                  {selectedMeeting.graduateName} - {selectedMeeting.companyName}
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Chip
                      color={getTypeColor(selectedMeeting.type)}
                      variant="flat"
                    >
                      {getTypeText(selectedMeeting.type)}
                    </Chip>

                    <Chip
                      color={getStatusColor(selectedMeeting.status)}
                      variant="flat"
                    >
                      {getStatusText(selectedMeeting.status)}
                    </Chip>

                    {/* <Chip variant="flat" color="default">
                      <div className="flex items-center gap-1">
                        <Icon icon="lucide:user" width={14} height={14} />
                        Creado por: {getCreatorText(selectedMeeting.createdBy)}
                      </div>
                    </Chip> */}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="space-y-3">
                      {selectedMeeting.graduateId ? (
                        <div>
                          <h4 className="text-md font-semibold mb-1">
                            Egresado
                          </h4>
                          <p className="text-default-700">
                            {selectedMeeting.graduateName}
                          </p>
                          <p className="text-default-600 flex items-center gap-1">
                            <Icon icon="lucide:mail" width={14} height={14} />
                            {selectedMeeting.graduateEmail}
                          </p>
                        </div>
                      ) : (
                        ""
                      )}

                      <div>
                        <h4 className="text-md font-semibold mb-1">
                          Fecha y hora
                        </h4>
                        <p className="text-default-600 flex items-center gap-1">
                          <Icon icon="lucide:calendar" width={14} height={14} />
                          {formatDate(selectedMeeting.dateInit)}
                        </p>
                        <p className="text-default-600 flex items-center gap-1">
                          <Icon icon="lucide:clock" width={14} height={14} />
                          Duración:{" "}
                          {new Date(
                            selectedMeeting.dateInit
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {new Date(selectedMeeting.dateEnd).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedMeeting.companyId ? (
                        <div>
                          <h4 className="text-md font-semibold mb-1">
                            Empresa
                          </h4>
                          <p className="text-default-700">
                            {selectedMeeting.companyName}
                          </p>
                          <p className="text-default-600 flex items-center gap-1">
                            <Icon icon="lucide:mail" width={14} height={14} />
                            {selectedMeeting.companyEmail}
                          </p>
                        </div>
                      ) : (
                        ""
                      )}

                      {/* <div>
                        <h4 className="text-md font-semibold mb-1">
                          Ubicación
                        </h4>
                        <p className="text-default-600 flex items-center gap-1">
                          <Icon icon="lucide:map-pin" width={14} height={14} />
                          {selectedMeeting.location}
                        </p>
                      </div> */}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-semibold mb-1">Notas</h4>
                    <div className="p-3 bg-content2 rounded-lg">
                      <p className="text-default-700">
                        {selectedMeeting.notes || "No hay notas disponibles."}
                      </p>
                    </div>
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
                      editMeeting(selectedMeeting);
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

      {/* Add meeting modal */}
      <Modal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Programar Nueva Reunión
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <Select
                      label="Usuario"
                      placeholder="Selecciona un usuario"
                      selectedKeys={
                        formData.companyId
                          ? [formData.companyId.toString()]
                          : []
                      }
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0].toString();
                        setFormData({
                          ...formData,
                          companyId: selectedKey ? parseInt(selectedKey) : 0,
                        });
                      }}
                      isInvalid={!!errors.companyId}
                      errorMessage={errors.companyId}
                      isRequired
                    >
                      <>
                        {companies.map((c) => (
                          <SelectItem
                            key={c.id.toString()}
                            textValue={`${c.name} - ${c.email}`}
                          >
                            {c.name} - {c.email}
                          </SelectItem>
                        ))}
                      </>
                      <>
                        {egresados.map((c) => (
                          <SelectItem
                            key={c.id.toString()}
                            textValue={`${c.name} - ${c.email}`}
                          >
                            {c.name} - {c.email}
                          </SelectItem>
                        ))}
                      </>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      label="Hora de inicio"
                      value={formData.time}
                      onValueChange={(value) => handleChange("time", value)}
                      isInvalid={!!errors.time}
                      errorMessage={errors.time}
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

                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <Select
                      label="Tipo de reunión"
                      placeholder="Seleccione el tipo de reunión"
                      selectedKeys={formData.type ? [formData.type] : []}
                      onChange={(e) => handleChange("type", e.target.value)}
                      isInvalid={!!errors.type}
                      errorMessage={errors.type}
                      isRequired
                    >
                      <SelectItem key="entrevista">Entrevista</SelectItem>
                      <SelectItem key="orientacion">Orientación</SelectItem>
                      <SelectItem key="seguimiento">Seguimiento</SelectItem>
                      <SelectItem key="otro">Otro</SelectItem>
                    </Select>

                    {/* <Input
                      label="Ubicación"
                      placeholder="Ingrese la ubicación de la reunión"
                      value={formData.location}
                      onValueChange={(value) => handleChange("location", value)}
                      isInvalid={!!errors.location}
                      errorMessage={errors.location}
                      isRequired
                    /> */}
                  </div>

                  <Textarea
                    label="Notas"
                    placeholder="Ingrese notas o detalles adicionales sobre la reunión"
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
                  onPress={handleAddMeeting}
                  isLoading={loading}
                >
                  Programar Reunión
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit meeting modal */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar Reunión
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre del egresado"
                      placeholder="Ingrese el nombre del egresado"
                      value={formData.graduateName}
                      onValueChange={(value) =>
                        handleChange("graduateName", value)
                      }
                      isInvalid={!!errors.graduateName}
                      errorMessage={errors.graduateName}
                      isRequired
                    />

                    <Input
                      label="Correo del egresado"
                      placeholder="ejemplo@dominio.com"
                      value={formData.graduateEmail}
                      onValueChange={(value) =>
                        handleChange("graduateEmail", value)
                      }
                      isInvalid={!!errors.graduateEmail}
                      errorMessage={errors.graduateEmail}
                      isRequired
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre de la empresa"
                      placeholder="Ingrese el nombre de la empresa"
                      value={formData.companyName}
                      onValueChange={(value) =>
                        handleChange("companyName", value)
                      }
                      isInvalid={!!errors.companyName}
                      errorMessage={errors.companyName}
                      isRequired
                    />

                    <Input
                      label="Correo de la empresa"
                      placeholder="empresa@dominio.com"
                      value={formData.companyEmail}
                      onValueChange={(value) =>
                        handleChange("companyEmail", value)
                      }
                      isInvalid={!!errors.companyEmail}
                      errorMessage={errors.companyEmail}
                      isRequired
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      label="Hora de inicio"
                      value={formData.time}
                      onValueChange={(value) => handleChange("time", value)}
                      isInvalid={!!errors.time}
                      errorMessage={errors.time}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Tipo de reunión"
                      placeholder="Seleccione el tipo de reunión"
                      selectedKeys={formData.type ? [formData.type] : []}
                      onChange={(e) => handleChange("type", e.target.value)}
                      isInvalid={!!errors.type}
                      errorMessage={errors.type}
                      isRequired
                    >
                      <SelectItem key="entrevista">Entrevista</SelectItem>
                      <SelectItem key="orientacion">Orientación</SelectItem>
                      <SelectItem key="seguimiento">Seguimiento</SelectItem>
                      <SelectItem key="otro">Otro</SelectItem>
                    </Select>

                    <Input
                      label="Ubicación"
                      placeholder="Ingrese la ubicación de la reunión"
                      value={formData.location}
                      onValueChange={(value) => handleChange("location", value)}
                      isInvalid={!!errors.location}
                      errorMessage={errors.location}
                      isRequired
                    />
                  </div>

                  <Textarea
                    label="Notas"
                    placeholder="Ingrese notas o detalles adicionales sobre la reunión"
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
                <Button color="primary" onPress={handleEditMeeting}>
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
            selectedMeeting && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Confirmar Eliminación
                </ModalHeader>
                <ModalBody>
                  <p>
                    ¿Estás seguro que deseas eliminar la reunión entre{" "}
                    <strong>{selectedMeeting.graduateName}</strong> y{" "}
                    <strong>{selectedMeeting.companyName}</strong>?
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
                  <Button color="danger" onPress={handleDeleteMeeting}>
                    Eliminar
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
