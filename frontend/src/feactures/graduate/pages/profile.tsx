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

export const GraduateProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  function getRandomBirthDate(minAge = 20, maxAge = 35): string {
    const today = new Date();
    const randomAge =
      Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
    const birthYear = today.getFullYear() - randomAge;

    // Crear la fecha con el mismo mes y día que hoy
    const birthDate = new Date(birthYear, today.getMonth(), today.getDate());

    return birthDate.toISOString().split("T")[0]; // "YYYY-MM-DD"
  }

  // Form state
  const [formData, setFormData] = React.useState({
    firstName: user?.name,
    lastName: '',
    email: user?.email || "juan.perez@ejemplo.com",
    altEmail: user?.email,
    phone: user?.phone,
    gender: "Prefiere no decirlo",
    city: "Lima",
    birthDate: getRandomBirthDate(),
    career: user?.career,
    graduationYear: user?.graduationYear,
    academicDegree: user?.role,
    cv: null, // No hay archivo cargado por defecto en gestión de CV
  });

  // Nuevo estado para el CV actual del usuario
  const [currentCV, setCurrentCV] = React.useState<{
    name: string;
    url: string;
  } | null>({
    name: `CV_${user?.name.replace(" ", "_")}.pdf`,
    url: "#",
  });

  // Form errors
  const [errors, setErrors] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    altEmail: "",
    phone: "",
    gender: "",
    city: "",
    birthDate: "",
    career: "",
    graduationYear: "",
    academicDegree: "",
    cv: "",
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

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          cv: "El archivo debe ser PDF o DOC/DOCX",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          cv: "El archivo no debe superar los 5MB",
        });
        return;
      }

      setFormData({
        ...formData,
        cv: file,
      });

      setErrors({
        ...errors,
        cv: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      altEmail: "",
      phone: "",
      gender: "",
      city: "",
      birthDate: "",
      career: "",
      graduationYear: "",
      academicDegree: "",
      cv: "",
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

    if (formData.altEmail && !/\S+@\S+\.\S+/.test(formData.altEmail)) {
      newErrors.altEmail = "Ingrese un correo alternativo válido";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
      isValid = false;
    } else if (!/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = "El teléfono debe tener 9 dígitos";
      isValid = false;
    }

    if (!formData.career.trim()) {
      newErrors.career = "La carrera es obligatoria";
      isValid = false;
    }

    if (!formData.graduationYear.trim()) {
      newErrors.graduationYear = "El año de egreso es obligatorio";
      isValid = false;
    } else if (!/^\d{4}$/.test(formData.graduationYear)) {
      newErrors.graduationYear = "Ingrese un año válido (4 dígitos)";
      isValid = false;
    }

    if (!formData.academicDegree.trim()) {
      newErrors.academicDegree = "El grado académico es obligatorio";
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

  // Handle CV upload
  const handleUploadCV = () => {
    if (!formData.cv) {
      setErrors({
        ...errors,
        cv: "Seleccione un archivo para subir",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            // Actualiza el CV actual con el nuevo
            setCurrentCV({
              name: formData.cv.name,
              url: "#", // Aquí iría la URL real tras subirlo
            });
            setFormData({ ...formData, cv: null });
            addToast({
              title: "CV actualizado",
              description: "Tu CV ha sido actualizado correctamente",
              color: "success",
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Información personal */}
        <motion.div variants={itemVariants} className="md:col-span-2">
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
                    Tus datos personales y académicos
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
                    isDisabled={true}
                    isRequired
                  />

                  <Input
                    label="Apellidos"
                    placeholder="Ingrese sus apellidos"
                    value={formData.lastName}
                    onValueChange={(value) => handleChange("lastName", value)}
                    isInvalid={!!errors.lastName}
                    errorMessage={errors.lastName}
                    isDisabled={true}
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
                    label="Correo alternativo"
                    placeholder="ejemplo2@dominio.com"
                    type="email"
                    value={formData.altEmail}
                    onValueChange={(value) => handleChange("altEmail", value)}
                    isInvalid={!!errors.altEmail}
                    errorMessage={errors.altEmail}
                    isDisabled={!isEditing}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <Input
                    label="Género"
                    placeholder="Masculino/Femenino/Otro"
                    value={formData.gender}
                    onValueChange={(value) => handleChange("gender", value)}
                    isInvalid={!!errors.gender}
                    errorMessage={errors.gender}
                    isDisabled={true}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Ciudad"
                    placeholder="Ingrese su ciudad"
                    value={formData.city}
                    onValueChange={(value) => handleChange("city", value)}
                    isInvalid={!!errors.city}
                    errorMessage={errors.city}
                    isDisabled={true}
                  />

                  <Input
                    label="Fecha de nacimiento"
                    placeholder="YYYY-MM-DD"
                    type="date"
                    value={formData.birthDate}
                    onValueChange={(value) => handleChange("birthDate", value)}
                    isInvalid={!!errors.birthDate}
                    errorMessage={errors.birthDate}
                    isDisabled={true}
                  />
                </div>
                <Input
                  label="Carrera profesional"
                  placeholder="Ingrese su carrera"
                  value={formData.career}
                  onValueChange={(value) => handleChange("career", value)}
                  isInvalid={!!errors.career}
                  errorMessage={errors.career}
                  isDisabled={true}
                  isRequired
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Año de egreso"
                    placeholder="Ej: 2022"
                    type="number"
                    value={formData.graduationYear}
                    onValueChange={(value) =>
                      handleChange("graduationYear", value)
                    }
                    isInvalid={!!errors.graduationYear}
                    errorMessage={errors.graduationYear}
                    isDisabled={true}
                    isRequired
                  />

                  <Input
                    label="Grado académico"
                    placeholder="Ej: Bachiller, Licenciado, Magíster"
                    value={formData.academicDegree}
                    onValueChange={(value) =>
                      handleChange("academicDegree", value)
                    }
                    isInvalid={!!errors.academicDegree}
                    errorMessage={errors.academicDegree}
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
                    <Button color="primary" onPress={handleSubmit}>
                      Guardar Cambios
                    </Button>
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        </motion.div>

        {/* CV Actual */}
        <motion.div variants={itemVariants} className="md:col-span-1">
          <Card shadow="sm" className="mb-6">
            <CardHeader className="flex gap-3">
              <Icon
                icon="lucide:file-check"
                width={24}
                height={24}
                className="text-success"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">CV Actual</p>
                <p className="text-small text-default-500">
                  Este es el CV actualmente registrado
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              {currentCV ? (
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:file"
                    width={20}
                    height={20}
                    className="text-primary"
                  />
                  <span className="text-small truncate max-w-[150px]">
                    {currentCV.name}
                  </span>
                  <a
                    href={currentCV.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline text-xs ml-2"
                  >
                    Descargar
                  </a>
                </div>
              ) : (
                <div className="text-small text-default-500">
                  No hay CV registrado
                </div>
              )}
            </CardBody>
          </Card>

          {/* Gestión de CV dentro del grid, debajo de CV Actual */}
          <Card shadow="sm" className="h-3xl">
            <CardHeader className="flex gap-3">
              <Icon
                icon="lucide:file-text"
                width={24}
                height={24}
                className="text-secondary"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Gestión de CV</p>
                <p className="text-small text-default-500">
                  Sube o actualiza tu CV
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              <div className="border-2 border-dashed border-default-200 rounded-lg p-4 text-center">
                <Icon
                  icon="lucide:upload-cloud"
                  width={40}
                  height={40}
                  className="mx-auto mb-2 text-default-400"
                />
                <p className="text-default-600 mb-2">
                  Arrastra y suelta tu CV aquí o
                </p>
                <label className="cursor-pointer">
                  <span className="text-primary">Selecciona un archivo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, cv: file });
                      }
                    }}
                  />
                </label>
                <p className="text-small text-default-500 mt-2">
                  PDF, DOC o DOCX (máx. 5MB)
                </p>
              </div>

              {formData.cv === null && (
                <div className="text-small text-default-500 text-center">
                  No hay CV cargado actualmente
                </div>
              )}

              {formData.cv && (
                <div className="flex items-center justify-between p-2 bg-content2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="lucide:file"
                      width={20}
                      height={20}
                      className="text-primary"
                    />
                    <span className="text-small truncate max-w-[150px]">
                      {formData.cv.name}
                    </span>
                    {/* Si hay url, muestra enlace de descarga */}
                    {formData.cv.url && (
                      <a
                        href={formData.cv.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline text-xs ml-2"
                      >
                        Descargar
                      </a>
                    )}
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => setFormData({ ...formData, cv: null })}
                    isDisabled={isUploading}
                  >
                    <Icon icon="lucide:x" width={16} height={16} />
                  </Button>
                </div>
              )}

              {errors.cv && (
                <p className="text-small text-danger">{errors.cv}</p>
              )}

              {/* Si ya hay un CV, al seleccionar uno nuevo se reemplaza automáticamente */}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                id="cv-upload-input"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFormData({ ...formData, cv: e.target.files[0] });
                  }
                }}
              />
            </CardBody>
            <Divider />
            <CardFooter>
              <Button
                color="secondary"
                fullWidth
                startContent={
                  <Icon icon="lucide:upload" width={18} height={18} />
                }
                onPress={() => {
                  if (formData.cv) {
                    setIsUploading(true);
                    setUploadProgress(0);
                    const interval = setInterval(() => {
                      setUploadProgress((prev) => {
                        const newProgress = prev + 10;
                        if (newProgress >= 100) {
                          clearInterval(interval);
                          setTimeout(() => {
                            setIsUploading(false);
                            setCurrentCV({ name: formData.cv.name, url: "#" });
                            setFormData({ ...formData, cv: null });
                            addToast({
                              title: "CV actualizado",
                              description:
                                "Tu CV ha sido actualizado correctamente",
                              color: "success",
                            });
                          }, 500);
                          return 100;
                        }
                        return newProgress;
                      });
                    }, 300);
                  }
                }}
                isLoading={isUploading}
                isDisabled={isUploading || !formData.cv}
              >
                {isUploading ? `Subiendo ${uploadProgress}%` : "Subir CV"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
