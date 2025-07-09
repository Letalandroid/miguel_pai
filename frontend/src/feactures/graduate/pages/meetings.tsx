import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";
import { supabase } from "../../../supabase/client";
import { useAuth } from "../../login/auth-context";

// Meeting type definition
interface Meeting {
  id: string;
  graduateName: string;
  graduateId: string;
  companyId?: number;
  dateInit: string;
  dateEnd: string;
  type: string;
  status: "scheduled" | "completed" | "cancelled";
  observations?: string;
}

const meetingTypes = [
  { value: "Asesoria", label: "Asesoría" },
  { value: "Entrevista", label: "Entrevista" },
  { value: "Reunion", label: "Reunión" },
];

export const GraduateMeetings: React.FC = () => {
  const [meetings, setMeetings] = React.useState<Meeting[]>([]);
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [companies, setCompanies] = React.useState([]);
  const [formData, setFormData] = React.useState({
    companyId: 0,
    date: "",
    timeInit: "",
    timeEnd: "",
    type: "",
    observations: "",
  });
  const [errors, setErrors] = React.useState({
    companyId: 0,
    date: "",
    timeInit: "",
    timeEnd: "",
    type: "",
    observations: "",
  });
  const [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [selectedMeeting, setSelectedMeeting] = React.useState<Meeting | null>(
    null
  );
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "scheduled" | "completed" | "cancelled"
  >("all");
  const { user } = useAuth();

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

  // Filtrar reuniones por estado
  const filteredMeetings = meetings.filter((meeting) => {
    if (meeting.graduateId !== user.id) return false;

    if (statusFilter === "all") return true;
    return meeting.status === statusFilter;
  });

  // Validar formulario
  const validateForm = () => {
    const newErrors = {
      companyId: 0,
      date: "",
      timeInit: "",
      timeEnd: "",
      type: "",
      observations: "",
    };

    let isValid = true;

    if (!formData.date) {
      newErrors.date = "La fecha es obligatoria";
      isValid = false;
    }

    if (!formData.timeInit) {
      newErrors.timeInit = "La hora de inicio es obligatoria";
      isValid = false;
    }

    if (!formData.timeEnd) {
      newErrors.timeEnd = "La hora de fin es obligatoria";
      isValid = false;
    }

    if (formData.timeEnd < formData.timeInit) {
      newErrors.timeEnd = "Debe colocar una hora mayor a la inicial.";
      isValid = false;
    }

    if (!formData.type) {
      newErrors.type = "El tipo de reunión es obligatorio";
      isValid = false;
    }

    if (!formData.companyId || formData.companyId <= 0) {
      newErrors.type = "El tipo de company es obligatorio";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  function hasConflict(newMeeting: Meeting, meetings: Meeting[]): boolean {
    const newStart = new Date(newMeeting.dateInit).getTime();
    const newEnd = new Date(newMeeting.dateEnd).getTime();

    return meetings.some((m) => {
      // Asegura que los IDs sean comparables (números o strings)
      if (String(m.graduateId) !== String(newMeeting.graduateId)) return false;

      const existingStart = new Date(m.dateInit).getTime();
      const existingEnd = new Date(m.dateEnd).getTime();

      return newStart < existingEnd && newEnd > existingStart;
    });
  }

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true);
      const { name: companyName } = companies.find((c) => {
        return c.id === formData.companyId;
      });

      const newMeeting: Meeting = {
        id: (meetings.length + 1).toString(),
        graduateName: user.name,
        graduateId: user.id,
        companyId: formData.companyId,
        dateInit: `${formData.date}T${formData.timeInit}:00`,
        dateEnd: `${formData.date}T${formData.timeEnd}:00`,
        type: `${formData.type} - ${companyName}`,
        status: "scheduled",
        observations: formData.observations,
      };

      if (hasConflict(newMeeting, meetings)) {
        setErrors({
          ...errors,
          timeInit: "Por favor elegir otro horario.",
          timeEnd: "Por favor elegir otro horario.",
        });
        setIsLoading(false);
        return;
      }

      const { id, ...meetingData } = newMeeting;

      const { error } = await supabase.from("meetings").insert(meetingData);

      if (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }

      setMeetings([newMeeting, ...meetings]);
      setIsScheduleModalOpen(false);

      // Resetear formulario
      setFormData({
        companyId: 0,
        date: "",
        timeInit: "",
        timeEnd: "",
        type: "",
        observations: "",
      });

      addToast({
        title: "Reunión solicitada",
        description: "Tu reunión ha sido solicitada correctamente.",
        color: "success",
      });
    }
  };

  // Cancel meeting
  const cancelMeeting = async () => {
    if (selectedMeeting) {
      const { error } = await supabase
        .from("meetings")
        .update({ status: "cancelled" })
        .eq("id", selectedMeeting.id);

      if (error) {
        console.error(error);
        addToast({
          title: "Error",
          description: "No se pudo cancelar la reunión",
          color: "danger",
        });
        return;
      }

      // Update local state
      const updatedMeetings = meetings.map((m) =>
        m.id === selectedMeeting.id ? { ...m, status: "cancelled" as const } : m
      );

      setMeetings(updatedMeetings);
      setIsScheduleModalOpen(false);
      setIsDetailsModalOpen(false);

      // Show success message
      addToast({
        title: "Reunión cancelada",
        description: `La reunión con ${selectedMeeting.graduateName} ha sido cancelada`,
        color: "success",
      });
    }
  };

  // Formatear fecha
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

  const viewDetails = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDetailsModalOpen(true);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground-900">
            Mis Reuniones
          </h1>
          <p className="text-foreground-600">
            Gestiona tus reuniones programadas con asesores y empresas
          </p>
        </div>
        <Button
          color="primary"
          startContent={
            <Icon icon="lucide:calendar-plus" width={18} height={18} />
          }
          onPress={() => setIsScheduleModalOpen(true)}
        >
          Solicitar Nueva Reunión
        </Button>
      </div>

      {/* Filtros */}
      <Card shadow="sm" className="mb-6">
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

      {/* Lista de reuniones */}
      {filteredMeetings.length > 0 ? (
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
                <div>
                  <h3 className="text-lg font-medium">{meeting.type}</h3>
                  <p className="flex items-center gap-1 text-default-600">
                    <Icon icon="lucide:calendar" width={16} height={16} />{" "}
                    {formatDate(meeting.dateInit)} -
                    {formatDate(meeting.dateEnd).split(", ")[1]}
                  </p>
                  {meeting.observations && (
                    <p className="text-small text-default-500">
                      Observaciones: {meeting.observations}
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
                    <Button
                      size="sm"
                      color="danger"
                      variant="light"
                      onPress={() => cancelMeeting()}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      ) : (
        <div className="text-center py-12">
          <Icon
            icon="lucide:calendar-x"
            className="mx-auto mb-4 text-default-400"
            width={48}
            height={48}
          />
          <h3 className="text-xl font-medium text-foreground-800">
            No se encontraron reuniones
          </h3>
          <p className="text-default-500 mt-2">
            No tienes reuniones programadas. Solicita una nueva reunión.
          </p>
        </div>
      )}

      {/* Modal para solicitar reunión */}
      <Modal
        isOpen={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Solicitar Nueva Reunión</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Select
                    label="Empresa"
                    placeholder="Selecciona una empresa"
                    selectedKeys={
                      formData.companyId ? [formData.companyId.toString()] : []
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
                    {companies.map((c) => (
                      <SelectItem
                        key={c.id.toString()}
                        textValue={`${c.name} - ${c.email}`}
                      >
                        {c.name} - {c.email}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="date"
                    label="Fecha"
                    value={formData.date}
                    onValueChange={(value) =>
                      setFormData({ ...formData, date: value })
                    }
                    isInvalid={!!errors.date}
                    errorMessage={errors.date}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="time"
                      label="Hora Inicio"
                      value={formData.timeInit}
                      onValueChange={(value) =>
                        setFormData({ ...formData, timeInit: value })
                      }
                      isInvalid={!!errors.timeInit}
                      errorMessage={errors.timeInit}
                      isRequired
                    />

                    <Input
                      type="time"
                      label="Hora Fin"
                      value={formData.timeEnd}
                      onValueChange={(value) =>
                        setFormData({ ...formData, timeEnd: value })
                      }
                      isInvalid={!!errors.timeEnd}
                      errorMessage={errors.timeEnd}
                      isRequired
                    />
                  </div>
                  <Select
                    label="Tipo de reunión"
                    placeholder="Selecciona el tipo de reunión"
                    selectedKeys={formData.type ? [formData.type] : []}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    isInvalid={!!errors.type}
                    errorMessage={errors.type}
                  >
                    {meetingTypes.map((type) => (
                      <SelectItem key={type.value}>{type.label}</SelectItem>
                    ))}
                  </Select>
                  <Textarea
                    label="Observaciones"
                    placeholder="Agrega notas o detalles sobre la reunión"
                    value={formData.observations}
                    onValueChange={(value) =>
                      setFormData({ ...formData, observations: value })
                    }
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
                  isLoading={isLoading}
                >
                  Solicitar Reunión
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal para ver detalles */}
      <Modal
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        size="lg"
      >
        <ModalContent>
          {(onClose) =>
            selectedMeeting && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Detalles de la Reunión
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {selectedMeeting.type}
                      </h3>
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
                        <p className="text-small text-default-500">
                          Fecha y hora:
                        </p>
                        <p className="font-medium flex items-center gap-2">
                          <Icon icon="lucide:calendar" width={16} height={16} />
                          {formatDate(selectedMeeting.dateInit)} -
                          {formatDate(selectedMeeting.dateEnd).split(", ")[1]}
                        </p>
                      </div>

                      {selectedMeeting.observations && (
                        <div>
                          <p className="text-small text-default-500">
                            Observaciones:
                          </p>
                          <p className="font-medium">
                            {selectedMeeting.observations}
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedMeeting.status === "scheduled" && (
                      <div className="bg-content3 p-4 rounded-lg">
                        <p className="text-small">
                          <Icon
                            icon="lucide:info"
                            className="inline mr-1"
                            width={16}
                            height={16}
                          />
                          Recuerda estar disponible 5 minutos antes de la hora
                          programada.
                        </p>
                      </div>
                    )}
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
    </motion.div>
  );
};
