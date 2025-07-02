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
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";
import * as XLSX from "xlsx";
import { supabase } from "../../../supabase/client";

// Tipo de egresado
interface Graduate {
  id: string;
  name: string;
  email: string;
  phone: string;
  career: string;
  graduationYear: string;
  status: "active" | "inactive";
}

// Datos mock
const graduatesMock: Graduate[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    phone: "987654321",
    career: "Ingeniería de Sistemas",
    graduationYear: "2022",
    status: "active",
  },
  {
    id: "2",
    name: "María López",
    email: "maria.lopez@example.com",
    phone: "987654322",
    career: "Administración",
    graduationYear: "2021",
    status: "inactive",
  },
];

export const AdminGraduates: React.FC = () => {
  const [graduates, setGraduates] = React.useState<Graduate[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedGraduate, setSelectedGraduate] =
    React.useState<Graduate | null>(null);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    career: "",
    graduationYear: "",
  });
  const [errors, setErrors] = React.useState({
    name: "",
    email: "",
    phone: "",
    career: "",
    graduationYear: "",
  });
  const [excelModalOpen, setExcelModalOpen] = React.useState(false);
  const [excelData, setExcelData] = React.useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const getGraduados = async () => {
      const { error, data } = await supabase
        .from("egresados")
        .select("*")
        .order("id", { ascending: false });

        setGraduates(data);

      if (error) {
        throw error;
      }
    };

    getGraduados();
  }, []);

  // Filtro de búsqueda
  const filteredGraduates = graduates.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.career.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Colores de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo";
      case "inactive":
        return "Inactivo";
      default:
        return "Desconocido";
    }
  };

  // Manejo de formulario
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      career: "",
      graduationYear: "",
    };
    let isValid = true;
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
      isValid = false;
    }
    if (!formData.career.trim()) {
      newErrors.career = "La carrera es obligatoria";
      isValid = false;
    }
    if (!formData.graduationYear.trim()) {
      newErrors.graduationYear = "El año de egreso es obligatorio";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleAddGraduate = async () => {
    if (!validateForm()) return;

    const addGraduate: Graduate = {
      id: (graduates.length + 1).toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      career: formData.career,
      graduationYear: formData.graduationYear,
      status: "active",
    };

    const { id, ...newGraduate } = addGraduate;

    const { error } = await supabase.from("egresados").insert(newGraduate);

    if (error) {
      console.error("Error al registrar egresado:", error.message);
      addToast({
        title: "Error",
        description: "No se pudo registrar al egresado",
        color: "danger",
      });
      return;
    }

    setGraduates([...graduates, addGraduate]);
    setIsAddModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      career: "",
      graduationYear: "",
    });

    addToast({
      title: "Egresado registrado",
      description: "El egresado ha sido registrado correctamente",
      color: "success",
    });
  };

  const handleEditGraduate = () => {
    if (validateForm() && selectedGraduate) {
      const updatedGraduates = graduates.map((g) =>
        g.id === selectedGraduate.id
          ? {
              ...g,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              career: formData.career,
              graduationYear: formData.graduationYear,
            }
          : g
      );
      setGraduates(updatedGraduates);
      setIsEditModalOpen(false);
      addToast({
        title: "Egresado actualizado",
        description: "El egresado ha sido actualizado correctamente",
        color: "success",
      });
    }
  };

  const editGraduate = (graduate: Graduate) => {
    setSelectedGraduate(graduate);
    setFormData({
      name: graduate.name,
      email: graduate.email,
      phone: graduate.phone,
      career: graduate.career,
      graduationYear: graduate.graduationYear,
    });
    setIsEditModalOpen(true);
  };

  // Manejar archivo Excel
  const handleExcelFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        if (!bstr) return;

        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { defval: "" });

        // Filtrar datos válidos
        const validData = data.filter(
          (row) => row && typeof row === "object" && Object.keys(row).length > 0
        );

        setExcelData(validData);
        setExcelModalOpen(true);

        if (validData.length === 0) {
          addToast({
            title: "Archivo vacío",
            description: "El archivo Excel no contiene datos válidos",
            color: "warning",
          });
        }
      } catch (error) {
        console.error("Error procesando el archivo Excel:", error);
        addToast({
          title: "Error",
          description:
            "Error al procesar el archivo Excel. Verifique el formato.",
          color: "danger",
        });
      }
    };

    reader.onerror = () => {
      addToast({
        title: "Error",
        description: "Error al leer el archivo",
        color: "danger",
      });
    };

    reader.readAsBinaryString(file);
  };

  // Confirmar importación
  const handleImportExcel = () => {
    try {
      // Mapear los datos del excel a Graduate
      const newGraduates: Graduate[] = excelData.map((row: any, idx) => ({
        id: (graduates.length + idx + 1).toString(),
        name: row["Nombre"] || row["name"] || "",
        email: row["Correo"] || row["email"] || "",
        phone: row["Teléfono"] || row["phone"] || "",
        career: row["Carrera"] || row["career"] || "",
        graduationYear: row["Año de Egreso"] || row["graduationYear"] || "",
        status: "active",
      }));

      setGraduates([...graduates, ...newGraduates]);
      setExcelModalOpen(false);
      setExcelData([]);

      // Limpiar el input file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      addToast({
        title: "Importación exitosa",
        description: `Se importaron ${newGraduates.length} egresados correctamente.`,
        color: "success",
      });
    } catch (error) {
      console.error("Error al importar datos:", error);
      addToast({
        title: "Error",
        description: "Error al importar los datos del Excel",
        color: "danger",
      });
    }
  };

  // Función para obtener las columnas disponibles
  const getExcelColumns = () => {
    if (
      excelData.length > 0 &&
      excelData[0] &&
      typeof excelData[0] === "object"
    ) {
      return Object.keys(excelData[0]);
    }
    return [];
  };

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
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
              Gestión de Egresados
            </h1>
            <p className="text-foreground-600">
              Administra los egresados registrados en el sistema
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              color="primary"
              startContent={<Icon icon="lucide:plus" width={18} height={18} />}
              onPress={() => setIsAddModalOpen(true)}
            >
              Registrar Egresado
            </Button>
            <Button
              color="secondary"
              startContent={
                <Icon icon="lucide:upload" width={18} height={18} />
              }
              onPress={() => fileInputRef.current?.click()}
            >
              Importar Excel
            </Button>
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleExcelFile}
            />
          </div>
        </div>
      </motion.div>
      <motion.div variants={itemVariants} className="mb-6">
        <Card shadow="sm">
          <CardBody className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Buscar egresados..."
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
          </CardBody>
        </Card>
      </motion.div>
      {filteredGraduates.length > 0 ? (
        <motion.div variants={itemVariants}>
          <Card shadow="sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Egresados Registrados</h2>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              {filteredGraduates.map((graduate) => (
                <div
                  key={graduate.id}
                  className="p-4 bg-content2 rounded-lg flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium">{graduate.name}</h3>
                      <Chip
                        color={getStatusColor(graduate.status)}
                        variant="flat"
                        size="sm"
                      >
                        {getStatusText(graduate.status)}
                      </Chip>
                    </div>
                    <p className="text-default-600 mb-1">
                      {graduate.career} | Egreso: {graduate.graduationYear}
                    </p>
                    <p className="text-small text-default-500">
                      {graduate.email} | {graduate.phone}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 self-end md:self-center">
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={() => editGraduate(graduate)}
                    >
                      Editar
                    </Button>
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
            No se encontraron egresados
          </h3>
          <p className="text-default-500 mt-2">
            Intenta con otros términos de búsqueda
          </p>
        </motion.div>
      )}
      {/* Modal de registro */}
      <Modal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Registrar Nuevo Egresado
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Nombre Completo"
                    placeholder="Ingrese el nombre completo"
                    value={formData.name}
                    onValueChange={(value) => handleChange("name", value)}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                    isRequired
                  />
                  <Input
                    label="Correo Electrónico"
                    placeholder="Ingrese el correo electrónico"
                    value={formData.email}
                    onValueChange={(value) => handleChange("email", value)}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                    isRequired
                  />
                  <Input
                    label="Teléfono"
                    placeholder="Ingrese el teléfono"
                    value={formData.phone}
                    onValueChange={(value) => handleChange("phone", value)}
                    isInvalid={!!errors.phone}
                    errorMessage={errors.phone}
                    isRequired
                  />
                  <Input
                    label="Carrera"
                    placeholder="Ingrese la carrera"
                    value={formData.career}
                    onValueChange={(value) => handleChange("career", value)}
                    isInvalid={!!errors.career}
                    errorMessage={errors.career}
                    isRequired
                  />
                  <Input
                    label="Año de Egreso"
                    placeholder="Ingrese el año de egreso"
                    value={formData.graduationYear}
                    onValueChange={(value) =>
                      handleChange("graduationYear", value)
                    }
                    isInvalid={!!errors.graduationYear}
                    errorMessage={errors.graduationYear}
                    isRequired
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleAddGraduate}>
                  Registrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Modal de edición */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        size="3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar Egresado
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Nombre Completo"
                    placeholder="Ingrese el nombre completo"
                    value={formData.name}
                    onValueChange={(value) => handleChange("name", value)}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                    isRequired
                  />
                  <Input
                    label="Correo Electrónico"
                    placeholder="Ingrese el correo electrónico"
                    value={formData.email}
                    onValueChange={(value) => handleChange("email", value)}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                    isRequired
                  />
                  <Input
                    label="Teléfono"
                    placeholder="Ingrese el teléfono"
                    value={formData.phone}
                    onValueChange={(value) => handleChange("phone", value)}
                    isInvalid={!!errors.phone}
                    errorMessage={errors.phone}
                    isRequired
                  />
                  <Input
                    label="Carrera"
                    placeholder="Ingrese la carrera"
                    value={formData.career}
                    onValueChange={(value) => handleChange("career", value)}
                    isInvalid={!!errors.career}
                    errorMessage={errors.career}
                    isRequired
                  />
                  <Input
                    label="Año de Egreso"
                    placeholder="Ingrese el año de egreso"
                    value={formData.graduationYear}
                    onValueChange={(value) =>
                      handleChange("graduationYear", value)
                    }
                    isInvalid={!!errors.graduationYear}
                    errorMessage={errors.graduationYear}
                    isRequired
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={handleEditGraduate}>
                  Guardar Cambios
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* Modal para previsualizar datos de Excel */}
      <Modal
        isOpen={excelModalOpen}
        onOpenChange={setExcelModalOpen}
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Previsualizar datos de Excel
              </ModalHeader>
              <ModalBody>
                {excelData.length > 0 ? (
                  <div className="overflow-x-auto max-h-[400px]">
                    <p className="mb-2 text-xs text-default-500">
                      Mostrando los primeros 20 registros de {excelData.length}{" "}
                      encontrados.
                    </p>
                    {getExcelColumns().length > 0 ? (
                      <table className="min-w-full border text-xs">
                        <thead>
                          <tr>
                            {getExcelColumns().map((key) => (
                              <th
                                key={key}
                                className="border px-2 py-1 bg-content2"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {excelData.slice(0, 20).map((row, idx) => (
                            <tr key={idx}>
                              {getExcelColumns().map((key, i) => (
                                <td key={i} className="border px-2 py-1">
                                  {String(row[key] ?? "")}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-center text-default-500">
                        El archivo no contiene columnas válidas.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icon
                      icon="lucide:file-x"
                      className="mx-auto mb-4 text-default-400"
                      width={48}
                      height={48}
                    />
                    <p className="text-default-500">
                      No se encontraron datos válidos en el archivo Excel.
                    </p>
                    <p className="text-sm text-default-400 mt-2">
                      Verifique que el archivo contenga datos y tenga el formato
                      correcto.
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={handleImportExcel}
                  isDisabled={excelData.length === 0}
                >
                  Importar ({excelData.length} registros)
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  );
};

export default AdminGraduates;
