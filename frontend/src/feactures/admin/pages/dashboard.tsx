import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Link,
  Chip,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useAuth } from "../../login/auth-context";

// Mock data
const upcomingEvents = [
  {
    id: "1",
    title: "Feria Laboral Virtual",
    date: "2023-06-25T09:00:00",
    type: "feria",
    participants: 45,
  },
  {
    id: "2",
    title: "Hackathon de Innovación",
    date: "2023-07-10T08:00:00",
    type: "hackathon",
    participants: 32,
  },
];

const workshops = [
  {
    id: "1",
    title: "Habilidades Blandas para el Éxito Profesional",
    date: "2023-06-20T14:00:00",
    status: "upcoming",
    participants: 18,
  },
  {
    id: "2",
    title: "Innovación y Emprendimiento",
    date: "2023-06-25T09:00:00",
    status: "upcoming",
    participants: 12,
  },
  {
    id: "3",
    title: "LinkedIn: Optimiza tu Perfil Profesional",
    date: "2023-06-10T10:00:00",
    status: "completed",
    participants: 25,
  },
];

const jobOpenings = [
  {
    id: "1",
    title: "Desarrollador Frontend",
    company: "Tech Solutions",
    closingDate: "2023-06-30",
    status: "active",
    applicants: 12,
  },
  {
    id: "2",
    title: "Analista de Marketing Digital",
    company: "Marketing Pro",
    closingDate: "2023-07-05",
    status: "active",
    applicants: 8,
  },
];

const meetings = [
  {
    id: "1",
    graduateName: "Ana Rodríguez",
    companyName: "Tech Solutions",
    date: "2023-06-15T10:00:00",
    type: "Entrevista",
  },
  {
    id: "2",
    graduateName: "Carlos Mendoza",
    companyName: "Marketing Pro",
    date: "2023-06-18T15:30:00",
    type: "Evaluación",
  },
];

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

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
          Bienvenido, {user?.name}
        </h1>
        <p className="text-foreground-600">
          Este es tu panel de control. Aquí puedes ver un resumen de las
          actividades.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Próximos eventos */}
        <motion.div variants={itemVariants}>
          <Card shadow="sm" className="h-full">
            <CardHeader className="flex gap-3">
              <Icon
                icon="lucide:flag"
                width={24}
                height={24}
                className="text-primary"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Próximos Eventos</p>
                <p className="text-small text-default-500">
                  Eventos organizados
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-content2 rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{event.title}</p>
                          <Chip color="primary" variant="flat" size="sm">
                            {event.type === "feria" ? "Feria" : "Hackathon"}
                          </Chip>
                        </div>
                        <p className="text-small text-default-500">
                          {formatDate(event.date)} | Participantes:{" "}
                          {event.participants}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <Button
                          as={RouterLink}
                          to="/admin/events"
                          size="sm"
                          color="primary"
                          variant="flat"
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-default-500">No hay eventos próximos</p>
                </div>
              )}
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                as={RouterLink}
                to="/admin/events"
                color="primary"
                variant="light"
                fullWidth
                endContent={
                  <Icon icon="lucide:arrow-right" width={16} height={16} />
                }
              >
                Gestionar eventos
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Talleres */}
        <motion.div variants={itemVariants}>
          <Card shadow="sm" className="h-full">
            <CardHeader className="flex gap-3">
              <Icon
                icon="lucide:book-open"
                width={24}
                height={24}
                className="text-secondary"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Talleres</p>
                <p className="text-small text-default-500">
                  Talleres organizados
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              {workshops.length > 0 ? (
                <div className="space-y-4">
                  {workshops.map((workshop) => (
                    <div
                      key={workshop.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-content2 rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{workshop.title}</p>
                          <Chip
                            color={
                              workshop.status === "upcoming"
                                ? "success"
                                : "default"
                            }
                            variant="flat"
                            size="sm"
                          >
                            {workshop.status === "upcoming"
                              ? "Próximo"
                              : "Completado"}
                          </Chip>
                        </div>
                        <p className="text-small text-default-500">
                          {formatDate(workshop.date)} | Participantes:{" "}
                          {workshop.participants}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <Button
                          as={RouterLink}
                          to="/admin/workshops"
                          size="sm"
                          color="secondary"
                          variant="flat"
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-default-500">
                    No hay talleres organizados
                  </p>
                </div>
              )}
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                as={RouterLink}
                to="/admin/workshops"
                color="secondary"
                variant="light"
                fullWidth
                endContent={
                  <Icon icon="lucide:arrow-right" width={16} height={16} />
                }
              >
                Gestionar talleres
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Convocatorias */}
        <motion.div variants={itemVariants}>
          <Card shadow="sm" className="h-full">
            <CardHeader className="flex gap-3">
              <Icon
                icon="lucide:briefcase"
                width={24}
                height={24}
                className="text-success"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Convocatorias</p>
                <p className="text-small text-default-500">
                  Ofertas laborales activas
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              {jobOpenings.length > 0 ? (
                <div className="space-y-4">
                  {jobOpenings.map((job) => (
                    <div
                      key={job.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-content2 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{job.title}</p>
                        <p className="text-small text-default-500">
                          {job.company} | Cierra:{" "}
                          {new Date(job.closingDate).toLocaleDateString()} |
                          Postulantes: {job.applicants}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <Button
                          as={RouterLink}
                          to="/admin/jobs"
                          size="sm"
                          color="success"
                          variant="flat"
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-default-500">
                    No hay convocatorias activas
                  </p>
                </div>
              )}
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                as={RouterLink}
                to="/admin/jobs"
                color="success"
                variant="light"
                fullWidth
                endContent={
                  <Icon icon="lucide:arrow-right" width={16} height={16} />
                }
              >
                Gestionar convocatorias
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Reuniones */}
        <motion.div variants={itemVariants}>
          <Card shadow="sm" className="h-full">
            <CardHeader className="flex gap-3">
              <Icon
                icon="lucide:calendar"
                width={24}
                height={24}
                className="text-warning"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Reuniones</p>
                <p className="text-small text-default-500">
                  Reuniones programadas
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              {meetings.length > 0 ? (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-content2 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{meeting.type}</p>
                        <p className="text-small text-default-500">
                          {meeting.graduateName} con {meeting.companyName} |{" "}
                          {formatDate(meeting.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <Button
                          as={RouterLink}
                          to="/admin/meetings"
                          size="sm"
                          color="warning"
                          variant="flat"
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-default-500">
                    No hay reuniones programadas
                  </p>
                </div>
              )}
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                as={RouterLink}
                to="/admin/meetings"
                color="warning"
                variant="light"
                fullWidth
                endContent={
                  <Icon icon="lucide:arrow-right" width={16} height={16} />
                }
              >
                Gestionar reuniones
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Acciones rápidas */}
      <motion.div variants={itemVariants} className="mt-6">
        <Card shadow="sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Acciones Rápidas</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Button
                as={RouterLink}
                to="/admin/calendar"
                color="primary"
                variant="flat"
                startContent={
                  <Icon icon="lucide:calendar" width={20} height={20} />
                }
                className="h-12"
              >
                Gestionar Calendario
              </Button>
              <Button
                as={RouterLink}
                to="/admin/events"
                color="secondary"
                variant="flat"
                startContent={
                  <Icon icon="lucide:flag" width={20} height={20} />
                }
                className="h-12"
              >
                Organizar Evento
              </Button>
              <Button
                as={RouterLink}
                to="/admin/workshops"
                color="success"
                variant="flat"
                startContent={
                  <Icon icon="lucide:book-open" width={20} height={20} />
                }
                className="h-12"
              >
                Publicar Taller
              </Button>
              <Button
                as={RouterLink}
                to="/admin/jobs"
                color="warning"
                variant="flat"
                startContent={
                  <Icon icon="lucide:briefcase" width={20} height={20} />
                }
                className="h-12"
              >
                Gestionar Convocatorias
              </Button>
              <Button
                as={RouterLink}
                to="/admin/meetings"
                color="danger"
                variant="flat"
                startContent={
                  <Icon icon="lucide:users" width={20} height={20} />
                }
                className="h-12"
              >
                Administrar Reuniones
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};
