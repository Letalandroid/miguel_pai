import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Input,
  Button,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useAuth } from "../../login/auth-context";
import { addToast } from "@heroui/react";

export const CompanyProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);

  // Form state
  const [formData, setFormData] = React.useState({
    ruc: user?.ruc,
    companyName: user?.name,
    industry: user?.rubro,
    phone: user?.phone,
    email: user?.email,
    website: user?.site,
    address: user?.address,
  });

  // Form errors
  const [errors, setErrors] = React.useState({
    ruc: "",
    companyName: "",
    industry: "",
    phone: "",
    email: "",
    website: "",
    address: "",
  });

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
      ruc: "",
      companyName: "",
      industry: "",
      phone: "",
      email: "",
      website: "",
      address: "",
    };

    let isValid = true;

    if (!formData.ruc.trim()) {
      newErrors.ruc = "El RUC es obligatorio";
      isValid = false;
    } else if (!/^\d{11}$/.test(formData.ruc)) {
      newErrors.ruc = "El RUC debe tener 11 dígitos";
      isValid = false;
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "La razón social es obligatoria";
      isValid = false;
    }

    if (!formData.industry.trim()) {
      newErrors.industry = "El rubro es obligatorio";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
      isValid = false;
    } else if (!/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = "El teléfono debe tener 9 dígitos";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingrese un correo válido";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Simulate API call
      setTimeout(() => {
        setIsEditing(false);
        addToast({
          title: "Perfil actualizado",
          description:
            "Los datos de la empresa han sido actualizados correctamente",
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
        <h1 className="text-2xl font-bold text-foreground-900">
          Perfil de Empresa
        </h1>
        <p className="text-foreground-600">
          Gestiona la información de tu empresa
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card shadow="sm">
          <CardHeader className="flex justify-between items-center">
            <div className="flex gap-3">
              <Icon
                icon="lucide:building"
                width={24}
                height={24}
                className="text-primary"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">
                  Información de la Empresa
                </p>
                <p className="text-small text-default-500">
                  Datos generales y de contacto
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
                  label="RUC"
                  placeholder="Ingrese el RUC de la empresa"
                  value={formData.ruc}
                  onValueChange={(value) => handleChange("ruc", value)}
                  isInvalid={!!errors.ruc}
                  errorMessage={errors.ruc}
                  isDisabled={!isEditing}
                  isRequired
                  maxLength={11}
                />

                <Input
                  label="Razón Social"
                  placeholder="Ingrese la razón social"
                  value={formData.companyName}
                  onValueChange={(value) => handleChange("companyName", value)}
                  isInvalid={!!errors.companyName}
                  errorMessage={errors.companyName}
                  isDisabled={!isEditing}
                  isRequired
                />
              </div>

              <Input
                label="Rubro"
                placeholder="Ingrese el rubro de la empresa"
                value={formData.industry}
                onValueChange={(value) => handleChange("industry", value)}
                isInvalid={!!errors.industry}
                errorMessage={errors.industry}
                isDisabled={!isEditing}
                isRequired
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Teléfono"
                  placeholder="Ingrese el número de teléfono"
                  value={formData.phone}
                  onValueChange={(value) => handleChange("phone", value)}
                  isInvalid={!!errors.phone}
                  errorMessage={errors.phone}
                  isDisabled={!isEditing}
                  isRequired
                />

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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Sitio web"
                  placeholder="www.ejemplo.com"
                  value={formData.website}
                  onValueChange={(value) => handleChange("website", value)}
                  isInvalid={!!errors.website}
                  errorMessage={errors.website}
                  isDisabled={!isEditing}
                />

                <Input
                  label="Dirección"
                  placeholder="Ingrese la dirección"
                  value={formData.address}
                  onValueChange={(value) => handleChange("address", value)}
                  isInvalid={!!errors.address}
                  errorMessage={errors.address}
                  isDisabled={!isEditing}
                />
              </div>
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
                  <Button
                    color="primary"
                    onPress={() =>
                      handleSubmit({
                        preventDefault: () => {},
                      } as React.FormEvent)
                    }
                  >
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
              icon="lucide:info"
              width={24}
              height={24}
              className="text-secondary"
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Información Adicional</p>
              <p className="text-small text-default-500">
                Datos complementarios de la empresa
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div className="bg-content2 p-4 rounded-lg">
              <h3 className="text-md font-medium mb-2">
                Verificación de Empresa
              </h3>
              <div className="flex items-center gap-2">
                <Icon
                  icon="lucide:check-circle"
                  className="text-success"
                  width={20}
                  height={20}
                />
                <p className="text-default-700">Empresa verificada</p>
              </div>
              <p className="text-small text-default-500 mt-2">
                Tu empresa ha sido verificada por nuestro equipo. Esto permite
                mayor visibilidad en las convocatorias laborales.
              </p>
            </div>

            <div className="bg-content2 p-4 rounded-lg">
              <h3 className="text-md font-medium mb-2">Estadísticas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-small text-default-500">
                    Convocatorias publicadas
                  </p>
                  <p className="text-xl font-semibold">12</p>
                </div>
                <div>
                  <p className="text-small text-default-500">
                    Egresados contratados
                  </p>
                  <p className="text-xl font-semibold">5</p>
                </div>
                <div>
                  <p className="text-small text-default-500">
                    Reuniones realizadas
                  </p>
                  <p className="text-xl font-semibold">18</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};
