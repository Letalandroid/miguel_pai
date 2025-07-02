import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Input,
  Button,
  Divider,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useAuth } from "../../login/auth-context";
import { addToast } from "@heroui/react";

export const AdminProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    firstName: "Admin",
    lastName: "User",
    email: user?.email || "",
    phone: "987654321",
    department: "Seguimiento al Egresado",
    position: "Coordinador",
    employeeId: "EMP-2023-001",
  });

  // Form errors
  const [errors, setErrors] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    employeeId: "",
  });

  // Department options
  const departments = [
    { value: "seguimiento", label: "Seguimiento al Egresado" },
    { value: "bolsa", label: "Bolsa de Trabajo" },
    { value: "capacitacion", label: "Capacitación y Desarrollo" },
    { value: "convenios", label: "Convenios Empresariales" },
  ];

  // Position options
  const positions = [
    { value: "coordinador", label: "Coordinador" },
    { value: "asistente", label: "Asistente" },
    { value: "analista", label: "Analista" },
    { value: "director", label: "Director" },
  ];

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
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      employeeId: "",
    };

    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es obligatorio";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingrese un correo válido";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
      isValid = false;
    } else if (!/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = "El teléfono debe tener 9 dígitos";
      isValid = false;
    }

    if (!formData.department.trim()) {
      newErrors.department = "El departamento es obligatorio";
      isValid = false;
    }

    if (!formData.position.trim()) {
      newErrors.position = "El cargo es obligatorio";
      isValid = false;
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = "El ID de empleado es obligatorio";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      // Simulate API call
      setTimeout(() => {
        setIsEditing(false);
        addToast({
          title: "Perfil actualizado",
          description: "Tus datos han sido actualizados correctamente",
          color: "success",
        });
      }, 1000);
    }
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
      className="max-w-4xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl font-bold text-foreground-900">Mi Perfil</h1>
        <p className="text-foreground-600">
          Gestiona tu información personal y profesional
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card shadow="sm">
          <CardHeader className="flex justify-between items-center">
            <div className="flex gap-3">
              <Icon
                icon="lucide:user"
                width={24}
                height={24}
                className="text-primary"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Información Personal</p>
                <p className="text-small text-default-500">
                  Tus datos personales y profesionales
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button
                color="primary"
                variant="flat"
                size="sm"
                startContent={
                  <Icon icon="lucide:edit" width={16} height={16} />
                }
                onPress={() => setIsEditing(true)}
              >
                Editar
              </Button>
            )}
          </CardHeader>
          <Divider />
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nombres"
                  placeholder="Ingrese sus nombres"
                  value={formData.firstName}
                  onValueChange={(value) => handleChange("firstName", value)}
                  isInvalid={!!errors.firstName}
                  errorMessage={errors.firstName}
                  isDisabled={!isEditing}
                  isRequired
                />

                <Input
                  label="Apellidos"
                  placeholder="Ingrese sus apellidos"
                  value={formData.lastName}
                  onValueChange={(value) => handleChange("lastName", value)}
                  isInvalid={!!errors.lastName}
                  errorMessage={errors.lastName}
                  isDisabled={!isEditing}
                  isRequired
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Correo electrónico"
                  placeholder="ejemplo@dominio.com"
                  type="email"
                  value={formData.email}
                  onValueChange={(value) => handleChange("email", value)}
                  isInvalid={!!errors.email}
                  errorMessage={errors.email}
                  isDisabled={!isEditing}
                  isRequired
                />

                <Input
                  label="Teléfono"
                  placeholder="Ingrese su número de teléfono"
                  value={formData.phone}
                  onValueChange={(value) => handleChange("phone", value)}
                  isInvalid={!!errors.phone}
                  errorMessage={errors.phone}
                  isDisabled={!isEditing}
                  isRequired
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Departamento"
                  placeholder="Seleccione un departamento"
                  selectedKeys={[formData.department]}
                  onChange={(e) => handleChange("department", e.target.value)}
                  isInvalid={!!errors.department}
                  errorMessage={errors.department}
                  isDisabled={!isEditing}
                  isRequired
                >
                  {departments.map((dept) => (
                    <SelectItem key={dept.value}>{dept.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Cargo"
                  placeholder="Seleccione un cargo"
                  selectedKeys={[formData.position]}
                  onChange={(e) => handleChange("position", e.target.value)}
                  isInvalid={!!errors.position}
                  errorMessage={errors.position}
                  isDisabled={!isEditing}
                  isRequired
                >
                  {positions.map((pos) => (
                    <SelectItem key={pos.value}>{pos.label}</SelectItem>
                  ))}
                </Select>
              </div>

              <Input
                label="ID de Empleado"
                placeholder="Ingrese su ID de empleado"
                value={formData.employeeId}
                onValueChange={(value) => handleChange("employeeId", value)}
                isInvalid={!!errors.employeeId}
                errorMessage={errors.employeeId}
                isDisabled={!isEditing || true} // Always disabled as it's a system-assigned ID
                isRequired
              />
            </form>
          </CardBody>
          {isEditing && (
            <>
              <Divider />
              <CardFooter>
                <div className="flex gap-2 ml-auto">
                  <Button
                    color="default"
                    variant="light"
                    onPress={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button color="primary" onPress={handleSubmit}>
                    Guardar Cambios
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6">
        <Card shadow="sm">
          <CardHeader className="flex gap-3">
            <Icon
              icon="lucide:shield"
              width={24}
              height={24}
              className="text-secondary"
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Permisos y Accesos</p>
              <p className="text-small text-default-500">
                Nivel de acceso y permisos asignados
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div className="bg-content2 p-4 rounded-lg">
              <h3 className="text-md font-medium mb-2">Rol de Usuario</h3>
              <div className="flex items-center gap-2">
                <Icon
                  icon="lucide:user-check"
                  className="text-success"
                  width={20}
                  height={20}
                />
                <p className="text-default-700">Administrador / Encargado</p>
              </div>
              <p className="text-small text-default-500 mt-2">
                Tienes acceso completo a todas las funcionalidades de la
                plataforma, incluyendo la gestión de usuarios, eventos, talleres
                y convocatorias.
              </p>
            </div>

            <div className="bg-content2 p-4 rounded-lg">
              <h3 className="text-md font-medium mb-2">Módulos Asignados</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:check-circle"
                    className="text-success"
                    width={16}
                    height={16}
                  />
                  <p className="text-default-700">Gestión de Egresados</p>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:check-circle"
                    className="text-success"
                    width={16}
                    height={16}
                  />
                  <p className="text-default-700">Gestión de Empresas</p>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:check-circle"
                    className="text-success"
                    width={16}
                    height={16}
                  />
                  <p className="text-default-700">Gestión de Eventos</p>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:check-circle"
                    className="text-success"
                    width={16}
                    height={16}
                  />
                  <p className="text-default-700">Gestión de Talleres</p>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:check-circle"
                    className="text-success"
                    width={16}
                    height={16}
                  />
                  <p className="text-default-700">Gestión de Convocatorias</p>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:check-circle"
                    className="text-success"
                    width={16}
                    height={16}
                  />
                  <p className="text-default-700">Gestión de Reuniones</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};
