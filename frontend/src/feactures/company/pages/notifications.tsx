import React from "react";
import { Card, CardBody, CardHeader, Button, Chip, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";

// Notification type definition
interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "info" | "success" | "warning" | "danger";
  read: boolean;
}

// Mock data
const notificationsMock: Notification[] = [
  {
    id: "1",
    title: "Nuevo postulante",
    message: "Has recibido una nueva postulación para la convocatoria 'Desarrollador Frontend'.",
    date: "2023-06-10T08:30:00",
    type: "info",
    read: false
  },
  {
    id: "2",
    title: "Recordatorio de reunión",
    message: "Tienes una reunión programada para mañana a las 10:00 AM con Ana Rodríguez.",
    date: "2023-06-12T14:45:00",
    type: "warning",
    read: true
  },
  {
    id: "3",
    title: "Convocatoria cerrada",
    message: "La convocatoria 'Ingeniero de Datos' ha sido cerrada automáticamente por fecha de vencimiento.",
    date: "2023-06-11T10:15:00",
    type: "info",
    read: false
  },
  {
    id: "4",
    title: "Reunión confirmada",
    message: "Carlos Mendoza ha confirmado la reunión de Evaluación Técnica para el 18 de junio.",
    date: "2023-06-08T16:20:00",
    type: "success",
    read: true
  },
  {
    id: "5",
    title: "Actualización de términos",
    message: "Se han actualizado los términos y condiciones de la plataforma. Por favor, revísalos.",
    date: "2023-06-05T09:45:00",
    type: "danger",
    read: false
  }
];

export const CompanyNotifications: React.FC = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>(notificationsMock);
  const [filter, setFilter] = React.useState<"all" | "unread" | "read">("all");

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Hoy, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Ayer, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
  };

  // Mark all as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
    setNotifications(updatedNotifications);
    
    addToast({
      title: "Notificaciones leídas",
      description: "Todas las notificaciones han sido marcadas como leídas",
      color: "success"
    });
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    
    addToast({
      title: "Notificación eliminada",
      description: "La notificación ha sido eliminada correctamente",
      color: "success"
    });
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Icon icon="lucide:info" className="text-primary" width={20} height={20} />;
      case "success":
        return <Icon icon="lucide:check-circle" className="text-success" width={20} height={20} />;
      case "warning":
        return <Icon icon="lucide:alert-triangle" className="text-warning" width={20} height={20} />;
      case "danger":
        return <Icon icon="lucide:alert-circle" className="text-danger" width={20} height={20} />;
      default:
        return <Icon icon="lucide:bell" className="text-default-500" width={20} height={20} />;
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
      className="max-w-4xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl font-bold text-foreground-900">Notificaciones</h1>
        <p className="text-foreground-600">
          Mantente al día con las últimas actualizaciones y novedades
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <Card shadow="sm">
          <CardHeader className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                color={filter === "all" ? "primary" : "default"}
                variant={filter === "all" ? "flat" : "light"}
                size="sm"
                onPress={() => setFilter("all")}
              >
                Todas
              </Button>
              <Button
                color={filter === "unread" ? "primary" : "default"}
                variant={filter === "unread" ? "flat" : "light"}
                size="sm"
                onPress={() => setFilter("unread")}
              >
                No leídas
              </Button>
              <Button
                color={filter === "read" ? "primary" : "default"}
                variant={filter === "read" ? "flat" : "light"}
                size="sm"
                onPress={() => setFilter("read")}
              >
                Leídas
              </Button>
            </div>
            
            <Button
              color="primary"
              variant="light"
              size="sm"
              onPress={markAllAsRead}
              isDisabled={!notifications.some(n => !n.read)}
            >
              Marcar todas como leídas
            </Button>
          </CardHeader>
          <Divider />
          <CardBody className="p-0">
            {filteredNotifications.length > 0 ? (
              <div>
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    variants={itemVariants}
                    custom={index}
                    className={`p-4 flex gap-3 ${index !== filteredNotifications.length - 1 ? 'border-b border-default-100' : ''} ${!notification.read ? 'bg-content2' : ''}`}
                  >
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-medium ${!notification.read ? 'text-foreground-900' : 'text-foreground-700'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                          )}
                          <span className="text-tiny text-default-500">
                            {formatDate(notification.date)}
                          </span>
                        </div>
                      </div>
                      <p className="text-default-600 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex justify-end mt-2 gap-2">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            onPress={() => markAsRead(notification.id)}
                          >
                            Marcar como leída
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => deleteNotification(notification.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon icon="lucide:bell-off" className="mx-auto mb-4 text-default-400" width={48} height={48} />
                <h3 className="text-xl font-medium text-foreground-800">No hay notificaciones</h3>
                <p className="text-default-500 mt-2">
                  {filter === "all" 
                    ? "No tienes notificaciones en este momento." 
                    : filter === "unread" 
                      ? "No tienes notificaciones sin leer." 
                      : "No tienes notificaciones leídas."}
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};