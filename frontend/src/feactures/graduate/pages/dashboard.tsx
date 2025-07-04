import React, { useEffect, useState } from "react";
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
import { supabase } from "../../../supabase/client";

// Mock data
const upcomingMeetings = [
  { id: "1", date: "2023-06-15T10:00:00", type: "Orientación Profesional" },
  { id: "2", date: "2023-06-18T15:30:00", type: "Revisión de CV" },
];

const enrolledWorkshops = [
  {
    id: "1",
    title: "Habilidades Blandas para el Éxito Profesional",
    date: "2023-06-20T14:00:00",
  },
  {
    id: "2",
    title: "Innovación y Emprendimiento",
    date: "2023-06-25T09:00:00",
  },
];

const jobOpenings = [
  {
    id: "1",
    title: "Desarrollador Frontend",
    company: "Tech Solutions",
    closingDate: "2023-06-30",
  },
  {
    id: "2",
    title: "Analista de Marketing Digital",
    company: "Marketing Pro",
    closingDate: "2023-07-05",
  },
  {
    id: "3",
    title: "Ingeniero de Datos",
    company: "Data Insights",
    closingDate: "2023-07-10",
  },
];

const notifications = [
  {
    id: "1",
    title: "Nuevo taller disponible",
    date: "2023-06-10T08:30:00",
    read: false,
  },
  {
    id: "2",
    title: "Recordatorio de reunión",
    date: "2023-06-12T14:45:00",
    read: true,
  },
  {
    id: "3",
    title: "Nueva convocatoria laboral",
    date: "2023-06-13T10:15:00",
    read: false,
  },
];

export const GraduateDashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const getConvocatorias = async () => {
      const { error, data } = await supabase
        .from("convocatorias")
        .select("*")
        .order("id", { ascending: false });

      setJobs(data);

      if (error) {
        throw error;
      }
    };

    getConvocatorias();
  }, []);

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
          Este es tu panel de control. Aquí puedes ver un resumen de tus
          actividades.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Próximas reuniones */}
        <motion.div variants={itemVariants}>
          <Card shadow="sm" className="h-full">
            <CardHeader className="flex gap-3">
              <Icon
                icon="lucide:calendar"
                width={24}
                height={24}
                className="text-primary"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Próximas Reuniones</p>
                <p className="text-small text-default-500">
                  Reuniones programadas
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              {upcomingMeetings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingMeetings.slice(0, 3).map((meeting) => (
                    <div
                      key={meeting.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{meeting.type}</p>
                        <p className="text-small text-default-500">
                          {formatDate(meeting.date)}
                        </p>
                      </div>
                      <Button
                        as={RouterLink}
                        to="/graduate/meetings"
                        size="sm"
                        color="primary"
                        variant="flat"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-default-500">
                    No tienes reuniones programadas
                  </p>
                </div>
              )}
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                as={RouterLink}
                to="/graduate/meetings"
                color="primary"
                variant="light"
                fullWidth
                endContent={
                  <Icon icon="lucide:arrow-right" width={16} height={16} />
                }
              >
                Ver todas las reuniones
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Talleres inscritos */}
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
                <p className="text-lg font-semibold">Talleres Inscritos</p>
                <p className="text-small text-default-500">
                  Talleres en los que participas
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              {enrolledWorkshops.length > 0 ? (
                <div className="space-y-4">
                  {enrolledWorkshops.slice(0, 3).map((workshop) => (
                    <div
                      key={workshop.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{workshop.title}</p>
                        <p className="text-small text-default-500">
                          {formatDate(workshop.date)}
                        </p>
                      </div>
                      <Button
                        as={RouterLink}
                        to="/graduate/workshops"
                        size="sm"
                        color="secondary"
                        variant="flat"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-default-500">
                    No estás inscrito en ningún taller
                  </p>
                </div>
              )}
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                as={RouterLink}
                to="/graduate/workshops"
                color="secondary"
                variant="light"
                fullWidth
                endContent={
                  <Icon icon="lucide:arrow-right" width={16} height={16} />
                }
              >
                Ver talleres disponibles
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Notificaciones */}
        <motion.div variants={itemVariants}>
          <Card shadow="sm" className="h-full">
            <CardHeader className="flex gap-3">
              <Icon
                icon="lucide:bell"
                width={24}
                height={24}
                className="text-warning"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Notificaciones</p>
                <p className="text-small text-default-500">
                  Últimas actualizaciones
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        )}
                        <div>
                          <p
                            className={`font-medium ${
                              !notification.read
                                ? "text-foreground-900"
                                : "text-foreground-600"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-small text-default-500">
                            {new Date(notification.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-default-500">No tienes notificaciones</p>
                </div>
              )}
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                as={RouterLink}
                to="/graduate/notifications"
                color="warning"
                variant="light"
                fullWidth
                endContent={
                  <Icon icon="lucide:arrow-right" width={16} height={16} />
                }
              >
                Ver todas las notificaciones
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Convocatorias laborales */}
      <motion.div variants={itemVariants} className="mt-6">
        <Card shadow="sm">
          <CardHeader className="flex gap-3">
            <Icon
              icon="lucide:briefcase"
              width={24}
              height={24}
              className="text-success"
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Convocatorias Laborales</p>
              <p className="text-small text-default-500">
                Oportunidades laborales disponibles
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            {jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                  >
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-small text-default-500">
                        {job.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      {job.status === "active" ? (
                        <Chip color="success" variant="flat" size="sm">
                          Cierra:{" "}
                          {new Date(job.closingDate).toLocaleDateString()}
                        </Chip>
                      ) : (
                        <Chip color="danger" variant="flat" size="sm">
                          Cerró
                        </Chip>
                      )}
                      {job.status === "active" ? (
                        <Button
                          as={RouterLink}
                          to="/graduate/jobs"
                          size="sm"
                          color="success"
                        >
                          Postular
                        </Button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-default-500">
                  No hay convocatorias disponibles
                </p>
              </div>
            )}
          </CardBody>
          <Divider />
          <CardFooter>
            <Button
              as={RouterLink}
              to="/graduate/jobs"
              color="success"
              variant="light"
              fullWidth
              endContent={
                <Icon icon="lucide:arrow-right" width={16} height={16} />
              }
            >
              Ver todas las convocatorias
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Acciones rápidas */}
      <motion.div variants={itemVariants} className="mt-6">
        <Card shadow="sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Acciones Rápidas</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                as={RouterLink}
                to="/graduate/profile"
                color="primary"
                variant="flat"
                startContent={
                  <Icon icon="lucide:user" width={20} height={20} />
                }
                className="h-12"
              >
                Editar Perfil
              </Button>
              <Button
                as={RouterLink}
                to="/graduate/profile"
                color="secondary"
                variant="flat"
                startContent={
                  <Icon icon="lucide:file-text" width={20} height={20} />
                }
                className="h-12"
              >
                Actualizar CV
              </Button>
              <Button
                as={RouterLink}
                to="/graduate/workshops"
                color="warning"
                variant="flat"
                startContent={
                  <Icon icon="lucide:book-open" width={20} height={20} />
                }
                className="h-12"
              >
                Ver Talleres
              </Button>
              <Button
                as={RouterLink}
                to="/graduate/meetings"
                color="success"
                variant="flat"
                startContent={
                  <Icon icon="lucide:calendar-plus" width={20} height={20} />
                }
                className="h-12"
              >
                Reservar Reunión
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};
