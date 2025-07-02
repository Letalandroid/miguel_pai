import React from "react";
import { Card, CardBody, CardHeader, Divider, Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Pagination, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

// History record type definition
interface HistoryRecord {
  id: string;
  entityType: "graduate" | "company" | "meeting" | "workshop" | "job" | "event";
  entityId: string;
  entityName: string;
  action: "create" | "update" | "delete" | "status_change" | "enrollment" | "cancellation";
  previousState?: string;
  newState?: string;
  performedBy: string;
  performedByRole: "graduate" | "company" | "admin";
  timestamp: string;
  details?: string;
}

// Mock data
const historyRecordsMock: HistoryRecord[] = [
  {
    id: "1",
    entityType: "meeting",
    entityId: "m1",
    entityName: "Entrevista: Ana Rodríguez - Tech Solutions",
    action: "create",
    performedBy: "Admin User",
    performedByRole: "admin",
    timestamp: "2023-06-14T15:30:00",
    details: "Reunión programada para el 15/06/2023 a las 10:00"
  },
  {
    id: "2",
    entityType: "job",
    entityId: "j1",
    entityName: "Desarrollador Frontend - Tech Solutions",
    action: "status_change",
    previousState: "draft",
    newState: "active",
    performedBy: "Empresa ABC",
    performedByRole: "company",
    timestamp: "2023-06-14T14:20:00",
    details: "Convocatoria publicada"
  },
  {
    id: "3",
    entityType: "workshop",
    entityId: "w1",
    entityName: "Habilidades Blandas para el Éxito Profesional",
    action: "enrollment",
    performedBy: "Juan Pérez",
    performedByRole: "graduate",
    timestamp: "2023-06-14T12:45:00",
    details: "Inscripción al taller"
  },
  {
    id: "4",
    entityType: "meeting",
    entityId: "m2",
    entityName: "Evaluación: Carlos Mendoza - Marketing Pro",
    action: "update",
    performedBy: "Admin User",
    performedByRole: "admin",
    timestamp: "2023-06-14T11:10:00",
    details: "Actualización de hora y ubicación"
  },
  {
    id: "5",
    entityType: "graduate",
    entityId: "g1",
    entityName: "Juan Pérez",
    action: "update",
    performedBy: "Juan Pérez",
    performedByRole: "graduate",
    timestamp: "2023-06-14T10:30:00",
    details: "Actualización de perfil y CV"
  },
  {
    id: "6",
    entityType: "event",
    entityId: "e1",
    entityName: "Feria Laboral Virtual",
    action: "create",
    performedBy: "Admin User",
    performedByRole: "admin",
    timestamp: "2023-06-13T16:45:00",
    details: "Evento creado para el 25/06/2023"
  },
  {
    id: "7",
    entityType: "company",
    entityId: "c1",
    entityName: "Tech Solutions",
    action: "update",
    performedBy: "Empresa ABC",
    performedByRole: "company",
    timestamp: "2023-06-13T14:20:00",
    details: "Actualización de información de contacto"
  },
  {
    id: "8",
    entityType: "job",
    entityId: "j2",
    entityName: "Analista de Marketing Digital - Marketing Pro",
    action: "create",
    performedBy: "Empresa ABC",
    performedByRole: "company",
    timestamp: "2023-06-13T11:30:00",
    details: "Nueva convocatoria creada"
  },
  {
    id: "9",
    entityType: "meeting",
    entityId: "m3",
    entityName: "Orientación: María López - Universidad César Vallejo",
    action: "cancellation",
    previousState: "scheduled",
    newState: "cancelled",
    performedBy: "María López",
    performedByRole: "graduate",
    timestamp: "2023-06-13T09:15:00",
    details: "Reunión cancelada por el egresado"
  },
  {
    id: "10",
    entityType: "workshop",
    entityId: "w2",
    entityName: "Innovación y Emprendimiento",
    action: "status_change",
    previousState: "draft",
    newState: "open",
    performedBy: "Admin User",
    performedByRole: "admin",
    timestamp: "2023-06-12T16:40:00",
    details: "Taller publicado y abierto para inscripciones"
  },
  {
    id: "11",
    entityType: "event",
    entityId: "e2",
    entityName: "Hackathon de Innovación",
    action: "update",
    performedBy: "Admin User",
    performedByRole: "admin",
    timestamp: "2023-06-12T14:10:00",
    details: "Actualización de detalles del evento"
  },
  {
    id: "12",
    entityType: "graduate",
    entityId: "g2",
    entityName: "Ana Rodríguez",
    action: "create",
    performedBy: "Admin User",
    performedByRole: "admin",
    timestamp: "2023-06-12T10:20:00",
    details: "Nuevo egresado registrado"
  }
];

export const AdminHistory: React.FC = () => {
  const [records, setRecords] = React.useState<HistoryRecord[]>(historyRecordsMock);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [entityTypeFilter, setEntityTypeFilter] = React.useState<string>("all");
  const [actionFilter, setActionFilter] = React.useState<string>("all");
  const [roleFilter, setRoleFilter] = React.useState<string>("all");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
  // Filter records based on search term and filters
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.details && record.details.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesEntityType = entityTypeFilter === "all" || record.entityType === entityTypeFilter;
    const matchesAction = actionFilter === "all" || record.action === actionFilter;
    const matchesRole = roleFilter === "all" || record.performedByRole === roleFilter;
    
    return matchesSearch && matchesEntityType && matchesAction && matchesRole;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);
  const paginatedRecords = filteredRecords.slice((page - 1) * rowsPerPage, page * rowsPerPage);

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

  // Get entity type chip color
  const getEntityTypeColor = (type: string) => {
    switch (type) {
      case "graduate":
        return "primary";
      case "company":
        return "success";
      case "meeting":
        return "warning";
      case "workshop":
        return "secondary";
      case "job":
        return "danger";
      case "event":
        return "default";
      default:
        return "default";
    }
  };

  // Get entity type text
  const getEntityTypeText = (type: string) => {
    switch (type) {
      case "graduate":
        return "Egresado";
      case "company":
        return "Empresa";
      case "meeting":
        return "Reunión";
      case "workshop":
        return "Taller";
      case "job":
        return "Convocatoria";
      case "event":
        return "Evento";
      default:
        return "Desconocido";
    }
  };

  // Get action chip color
  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "success";
      case "update":
        return "primary";
      case "delete":
        return "danger";
      case "status_change":
        return "warning";
      case "enrollment":
        return "secondary";
      case "cancellation":
        return "danger";
      default:
        return "default";
    }
  };

  // Get action text
  const getActionText = (action: string) => {
    switch (action) {
      case "create":
        return "Creación";
      case "update":
        return "Actualización";
      case "delete":
        return "Eliminación";
      case "status_change":
        return "Cambio de estado";
      case "enrollment":
        return "Inscripción";
      case "cancellation":
        return "Cancelación";
      default:
        return "Desconocido";
    }
  };

  // Get role chip color
  const getRoleColor = (role: string) => {
    switch (role) {
      case "graduate":
        return "primary";
      case "company":
        return "success";
      case "admin":
        return "secondary";
      default:
        return "default";
    }
  };

  // Get role text
  const getRoleText = (role: string) => {
    switch (role) {
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
        <h1 className="text-2xl font-bold text-foreground-900">Histórico de Estados</h1>
        <p className="text-foreground-600">
          Registro de cambios y actividades en la plataforma
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card shadow="sm">
          <CardBody className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Buscar en el histórico..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                startContent={<Icon icon="lucide:search" className="text-default-400" width={20} />}
                className="flex-grow"
              />
              
              <Select
                label="Filas por página"
                className="w-40"
                selectedKeys={[rowsPerPage.toString()]}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
              >
                <SelectItem key="5">5 filas</SelectItem>
                <SelectItem key="10">10 filas</SelectItem>
                <SelectItem key="20">20 filas</SelectItem>
                <SelectItem key="50">50 filas</SelectItem>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Tipo de entidad"
                placeholder="Filtrar por tipo de entidad"
                selectedKeys={[entityTypeFilter]}
                onChange={(e) => setEntityTypeFilter(e.target.value)}
              >
                <SelectItem key="all">Todas las entidades</SelectItem>
                <SelectItem key="graduate">Egresados</SelectItem>
                <SelectItem key="company">Empresas</SelectItem>
                <SelectItem key="meeting">Reuniones</SelectItem>
                <SelectItem key="workshop">Talleres</SelectItem>
                <SelectItem key="job">Convocatorias</SelectItem>
                <SelectItem key="event">Eventos</SelectItem>
              </Select>
              
              <Select
                label="Tipo de acción"
                placeholder="Filtrar por tipo de acción"
                selectedKeys={[actionFilter]}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <SelectItem key="all">Todas las acciones</SelectItem>
                <SelectItem key="create">Creación</SelectItem>
                <SelectItem key="update">Actualización</SelectItem>
                <SelectItem key="delete">Eliminación</SelectItem>
                <SelectItem key="status_change">Cambio de estado</SelectItem>
                <SelectItem key="enrollment">Inscripción</SelectItem>
                <SelectItem key="cancellation">Cancelación</SelectItem>
              </Select>
              
              <Select
                label="Realizado por"
                placeholder="Filtrar por rol"
                selectedKeys={[roleFilter]}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <SelectItem key="all">Todos los roles</SelectItem>
                <SelectItem key="graduate">Egresados</SelectItem>
                <SelectItem key="company">Empresas</SelectItem>
                <SelectItem key="admin">Administradores</SelectItem>
              </Select>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* History records table */}
      <motion.div variants={itemVariants}>
        <Card shadow="sm">
          <CardHeader>
            <h2 className="text-xl font-semibold">Registros de Actividad</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <Table
              aria-label="Tabla de histórico de estados"
              removeWrapper
              bottomContent={
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={totalPages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              }
            >
              <TableHeader>
                <TableColumn>FECHA</TableColumn>
                <TableColumn>ENTIDAD</TableColumn>
                <TableColumn>ACCIÓN</TableColumn>
                <TableColumn>REALIZADO POR</TableColumn>
                <TableColumn>DETALLES</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No se encontraron registros">
                {paginatedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-small font-medium">{formatDate(record.timestamp).split(',')[0]}</span>
                        <span className="text-tiny text-default-500">{formatDate(record.timestamp).split(',')[1]}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <Chip
                            color={getEntityTypeColor(record.entityType)}
                            variant="flat"
                            size="sm"
                          >
                            {getEntityTypeText(record.entityType)}
                          </Chip>
                        </div>
                        <span className="text-small">{record.entityName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={getActionColor(record.action)}
                        variant="flat"
                        size="sm"
                      >
                        {getActionText(record.action)}
                      </Chip>
                      {record.previousState && record.newState && (
                        <div className="mt-1 text-tiny text-default-500">
                          {record.previousState} → {record.newState}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-small">{record.performedBy}</span>
                        <Chip
                          color={getRoleColor(record.performedByRole)}
                          variant="flat"
                          size="sm"
                        >
                          {getRoleText(record.performedByRole)}
                        </Chip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-small">{record.details}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </motion.div>

      {/* Export options */}
      <motion.div variants={itemVariants} className="mt-6">
        <Card shadow="sm">
          <CardHeader>
            <h3 className="text-lg font-semibold">Exportar Datos</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-wrap gap-4">
              <Button
                color="primary"
                variant="flat"
                startContent={<Icon icon="lucide:file-text" width={20} height={20} />}
              >
                Exportar a CSV
              </Button>
              <Button
                color="primary"
                variant="flat"
                startContent={<Icon icon="lucide:file" width={20} height={20} />}
              >
                Exportar a Excel
              </Button>
              <Button
                color="primary"
                variant="flat"
                startContent={<Icon icon="lucide:printer" width={20} height={20} />}
              >
                Imprimir
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};