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
const publishedJobs = [
  {
    id: "1",
    title: "Desarrollador Frontend",
    createdAt: "2023-06-01",
    closingDate: "2023-06-30",
    status: "active",
    applicants: 12,
  },
  {
    id: "2",
    title: "Analista de Marketing Digital",
    createdAt: "2023-06-05",
    closingDate: "2023-07-05",
    status: "active",
    applicants: 8,
  },
  {
    id: "3",
    title: "Ingeniero de Datos",
    createdAt: "2023-05-20",
    closingDate: "2023-06-10",
    status: "closed",
    applicants: 15,
  },
];

const upcomingMeetings = [
  {
    id: "1",
    graduateName: "Ana Rodríguez",
    date: "2023-06-15T10:00:00",
    type: "Entrevista Inicial",
  },
  {
    id: "2",
    graduateName: "Carlos Mendoza",
    date: "2023-06-18T15:30:00",
    type: "Evaluación Técnica",
  },
];

const notifications = [
  {
    id: "1",
    title: "Nuevo postulante",
    description: "Tienes un nuevo postulante para Desarrollador Frontend",
    date: "2023-06-10T08:30:00",
    read: false,
  },
  {
    id: "2",
    title: "Recordatorio de reunión",
    description: "Tienes una reunión programada para mañana a las 10:00 AM",
    date: "2023-06-12T14:45:00",
    read: true,
  },
];

export const CompanyDashboard: React.FC = () => {
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
        {/* Convocatorias publicadas */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card shadow="sm">
            <CardHeader className="flex gap-3">
              <Icon
                icon="lucide:briefcase"
                width={24}
                height={24}
                className="text-primary"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">
                  Convocatorias Publicadas
                </p>
                <p className="text-small text-default-500">
                  Gestiona tus ofertas laborales
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
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-content2 rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{job.title}</p>
                          <Chip
                            color={
                              job.status === "active" ? "success" : "default"
                            }
                            variant="flat"
                            size="sm"
                          >
                            {job.status === "active" ? "Activa" : "Cerrada"}
                          </Chip>
                        </div>
                        <p className="text-small text-default-500">
                          Creada: {new Date(job.createdAt).toLocaleDateString()}{" "}
                          | Cierra:{" "}
                          {new Date(job.closingDate).toLocaleDateString()} |
                          Postulantes: {job.applicants}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <Button
                          as={RouterLink}
                          to="/company/jobs"
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
                  <p className="text-default-500">
                    No tienes convocatorias publicadas
                  </p>
                </div>
              )}
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                as={RouterLink}
                to="/company/jobs"
                color="primary"
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
                      className="flex items-start gap-2"
                    >
                      <div className="mt-1">
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        )}
                      </div>
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
                        <p className="text-small text-default-600">
                          {notification.description}
                        </p>
                        <p className="text-tiny text-default-500">
                          {new Date(notification.date).toLocaleDateString()}{" "}
                          {new Date(notification.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
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
                to="/company/notifications"
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

      {/* Próximas reuniones */}
      <motion.div variants={itemVariants} className="mt-6">
        <Card shadow="sm">
          <CardHeader className="flex gap-3">
            <Icon
              icon="lucide:calendar"
              width={24}
              height={24}
              className="text-secondary"
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Próximas Reuniones</p>
              <p className="text-small text-default-500">
                Reuniones programadas con egresados
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            {upcomingMeetings.length > 0 ? (
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-content2 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {meeting.type} con {meeting.graduateName}
                      </p>
                      <p className="text-small text-default-500">
                        {formatDate(meeting.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <Button
                        as={RouterLink}
                        to="/company/meetings"
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
                  No tienes reuniones programadas
                </p>
              </div>
            )}
          </CardBody>
          <Divider />
          <CardFooter>
            <Button
              as={RouterLink}
              to="/company/meetings"
              color="secondary"
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

      {/* Acciones rápidas */}
      <motion.div variants={itemVariants} className="mt-6">
        <Card shadow="sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Acciones Rápidas</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Button
                as={RouterLink}
                to="/company/profile"
                color="primary"
                variant="flat"
                startContent={
                  <Icon icon="lucide:building" width={20} height={20} />
                }
                className="h-12"
              >
                Editar Perfil
              </Button>
              <Button
                as={RouterLink}
                to="/company/jobs"
                color="success"
                variant="flat"
                startContent={
                  <Icon icon="lucide:file-plus" width={20} height={20} />
                }
                className="h-12"
              >
                Publicar Convocatoria
              </Button>
              <Button
                as={RouterLink}
                to="/company/meetings"
                color="secondary"
                variant="flat"
                startContent={
                  <Icon icon="lucide:calendar-plus" width={20} height={20} />
                }
                className="h-12"
              >
                Programar Reunión
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};
