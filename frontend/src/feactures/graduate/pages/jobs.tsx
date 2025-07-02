import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Input, Chip, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";

// Job type definition
interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  closingDate: string;
  status: "active" | "closed";
  applied: boolean;
}

// Mock data
const jobsMock: Job[] = [
  {
    id: "1",
    title: "Desarrollador Frontend",
    company: "Tech Solutions",
    description: "Buscamos un desarrollador frontend con experiencia en React, TypeScript y diseño responsive para unirse a nuestro equipo de desarrollo.",
    requirements: [
      "Experiencia mínima de 2 años en desarrollo frontend",
      "Conocimientos sólidos de React y TypeScript",
      "Experiencia con frameworks CSS como Tailwind o Bootstrap",
      "Conocimientos de Git y metodologías ágiles"
    ],
    closingDate: "2023-06-30",
    status: "active",
    applied: false
  },
  {
    id: "2",
    title: "Analista de Marketing Digital",
    company: "Marketing Pro",
    description: "Estamos en búsqueda de un analista de marketing digital para gestionar campañas en redes sociales y analizar métricas de rendimiento.",
    requirements: [
      "Experiencia en gestión de campañas en redes sociales",
      "Conocimientos de Google Analytics y herramientas de análisis",
      "Capacidad para crear informes y presentaciones",
      "Conocimientos de SEO y SEM"
    ],
    closingDate: "2023-07-05",
    status: "active",
    applied: false
  },
  {
    id: "3",
    title: "Ingeniero de Datos",
    company: "Data Insights",
    description: "Buscamos un ingeniero de datos para diseñar e implementar soluciones de procesamiento y análisis de datos a gran escala.",
    requirements: [
      "Experiencia en Python, SQL y herramientas de ETL",
      "Conocimientos de bases de datos relacionales y NoSQL",
      "Experiencia con tecnologías de big data como Hadoop o Spark",
      "Capacidad para trabajar en equipo y comunicar resultados"
    ],
    closingDate: "2023-07-10",
    status: "active",
    applied: false
  },
  {
    id: "4",
    title: "Diseñador UX/UI",
    company: "Creative Solutions",
    description: "Estamos buscando un diseñador UX/UI para crear experiencias de usuario intuitivas y atractivas para nuestros productos digitales.",
    requirements: [
      "Experiencia en diseño de interfaces y experiencia de usuario",
      "Dominio de herramientas como Figma, Adobe XD o Sketch",
      "Conocimientos de principios de usabilidad y accesibilidad",
      "Capacidad para trabajar con equipos de desarrollo"
    ],
    closingDate: "2023-06-25",
    status: "active",
    applied: true
  },
  {
    id: "5",
    title: "Analista de Sistemas",
    company: "IT Solutions",
    description: "Buscamos un analista de sistemas para identificar necesidades, diseñar soluciones y mejorar procesos empresariales.",
    requirements: [
      "Experiencia en análisis de requerimientos y procesos",
      "Conocimientos de metodologías de desarrollo de software",
      "Capacidad para documentar y comunicar soluciones",
      "Experiencia en implementación de sistemas"
    ],
    closingDate: "2023-05-30",
    status: "closed",
    applied: false
  }
];

export const GraduateJobs: React.FC = () => {
  const [jobs, setJobs] = React.useState<Job[]>(jobsMock);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "closed" | "applied">("all");
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = React.useState(false);
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [coverLetter, setCoverLetter] = React.useState("");
  const [fileError, setFileError] = React.useState("");

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "active") return matchesSearch && job.status === "active";
    if (statusFilter === "closed") return matchesSearch && job.status === "closed";
    if (statusFilter === "applied") return matchesSearch && job.applied;
    
    return matchesSearch;
  });

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setFileError("El archivo debe ser PDF o DOC/DOCX");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFileError("El archivo no debe superar los 5MB");
        return;
      }
      
      setResumeFile(file);
      setFileError("");
    }
  };

  // Handle job application
  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
    setCoverLetter("");
    setResumeFile(null);
    setFileError("");
  };

  // Submit application
  const submitApplication = () => {
    if (!resumeFile) {
      setFileError("Por favor, adjunta tu CV");
      return;
    }

    if (selectedJob) {
      // Update job status
      const updatedJobs = jobs.map(j => 
        j.id === selectedJob.id ? { ...j, applied: true } : j
      );
      
      setJobs(updatedJobs);
      setIsApplyModalOpen(false);
      
      // Show success message
      addToast({
        title: "Postulación enviada",
        description: `Has postulado exitosamente a: ${selectedJob.title} en ${selectedJob.company}`,
        color: "success"
      });
    }
  };

  // View job details
  const viewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
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
        <h1 className="text-2xl font-bold text-foreground-900">Convocatorias Laborales</h1>
        <p className="text-foreground-600">
          Explora y postula a oportunidades laborales disponibles para egresados
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="mb-6">
        <Card shadow="sm">
          <CardBody className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Buscar convocatorias..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              startContent={<Icon icon="lucide:search" className="text-default-400" width={20} />}
              className="flex-grow"
            />
            
            <div className="flex gap-2 flex-wrap">
              <Button
                color={statusFilter === "all" ? "primary" : "default"}
                variant={statusFilter === "all" ? "flat" : "light"}
                size="sm"
                onPress={() => setStatusFilter("all")}
              >
                Todas
              </Button>
              <Button
                color={statusFilter === "active" ? "success" : "default"}
                variant={statusFilter === "active" ? "flat" : "light"}
                size="sm"
                onPress={() => setStatusFilter("active")}
              >
                Activas
              </Button>
              <Button
                color={statusFilter === "applied" ? "secondary" : "default"}
                variant={statusFilter === "applied" ? "flat" : "light"}
                size="sm"
                onPress={() => setStatusFilter("applied")}
              >
                Postuladas
              </Button>
              <Button
                color={statusFilter === "closed" ? "danger" : "default"}
                variant={statusFilter === "closed" ? "flat" : "light"}
                size="sm"
                onPress={() => setStatusFilter("closed")}
              >
                Cerradas
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Jobs list */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              variants={itemVariants}
              custom={index}
            >
              <Card shadow="sm">
                <CardBody className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-start gap-2 mb-2">
                        <div>
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <p className="text-default-600 font-medium">{job.company}</p>
                        </div>
                        <div className="flex gap-2 ml-auto md:ml-0">
                          <Chip
                            color={job.status === "active" ? "success" : "default"}
                            variant="flat"
                            size="sm"
                          >
                            {job.status === "active" ? "Activa" : "Cerrada"}
                          </Chip>
                          
                          {job.applied && (
                            <Chip color="secondary" variant="dot" size="sm">
                              Postulada
                            </Chip>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-small text-default-500 mb-4">
                        <span className="font-medium">Fecha de cierre:</span> {new Date(job.closingDate).toLocaleDateString()}
                      </p>
                      
                      <p className="text-default-700 line-clamp-2 mb-4">
                        {job.description}
                      </p>
                      
                      <div className="hidden md:block">
                        <p className="text-small font-medium mb-2">Requisitos principales:</p>
                        <ul className="text-small text-default-600 list-disc pl-5 space-y-1">
                          {job.requirements.slice(0, 2).map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                          {job.requirements.length > 2 && (
                            <li>Y {job.requirements.length - 2} requisitos más...</li>
                          )}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 md:min-w-[180px] justify-center">
                      <Button
                        color="primary"
                        variant="flat"
                        fullWidth
                        onPress={() => viewDetails(job)}
                      >
                        Ver Detalles
                      </Button>
                      
                      {job.status === "active" && !job.applied && (
                        <Button
                          color="success"
                          fullWidth
                          onPress={() => handleApply(job)}
                        >
                          Postular
                        </Button>
                      )}
                      
                      {job.applied && (
                        <Button
                          color="secondary"
                          variant="flat"
                          fullWidth
                          isDisabled
                          startContent={<Icon icon="lucide:check" width={16} height={16} />}
                        >
                          Postulación Enviada
                        </Button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div variants={itemVariants} className="text-center py-12">
          <Icon icon="lucide:search-x" className="mx-auto mb-4 text-default-400" width={48} height={48} />
          <h3 className="text-xl font-medium text-foreground-800">No se encontraron convocatorias</h3>
          <p className="text-default-500 mt-2">Intenta con otros términos de búsqueda o filtros</p>
        </motion.div>
      )}

      {/* Job details modal */}
      <Modal isOpen={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen} size="2xl">
        <ModalContent>
          {(onClose) => selectedJob && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedJob.title}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <p className="text-xl font-semibold">{selectedJob.company}</p>
                    <div className="flex gap-2 mt-1">
                      <Chip
                        color={selectedJob.status === "active" ? "success" : "default"}
                        variant="flat"
                      >
                        {selectedJob.status === "active" ? "Activa" : "Cerrada"}
                      </Chip>
                      
                      {selectedJob.applied && (
                        <Chip color="secondary" variant="dot">
                          Postulada
                        </Chip>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-default-600 font-medium">Fecha de cierre:</p>
                    <p>{new Date(selectedJob.closingDate).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-default-600 font-medium">Descripción:</p>
                    <p className="text-default-700">{selectedJob.description}</p>
                  </div>
                  
                  <div>
                    <p className="text-default-600 font-medium">Requisitos:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                {selectedJob.status === "active" && !selectedJob.applied && (
                  <Button
                    color="success"
                    onPress={() => {
                      onClose();
                      handleApply(selectedJob);
                    }}
                  >
                    Postular
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Apply modal */}
      <Modal isOpen={isApplyModalOpen} onOpenChange={setIsApplyModalOpen} size="xl">
        <ModalContent>
          {(onClose) => selectedJob && (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Postular a: {selectedJob.title}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <p className="text-default-600 font-medium">Empresa:</p>
                    <p>{selectedJob.company}</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-default-200 rounded-lg p-4 text-center">
                    <Icon icon="lucide:upload-cloud" width={40} height={40} className="mx-auto mb-2 text-default-400" />
                    <p className="text-default-600 mb-2">Adjunta tu CV actualizado</p>
                    <label className="cursor-pointer">
                      <span className="text-primary">Selecciona un archivo</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.doc,.docx" 
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-small text-default-500 mt-2">PDF, DOC o DOCX (máx. 5MB)</p>
                  </div>
                  
                  {resumeFile && (
                    <div className="flex items-center justify-between p-2 bg-content2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:file" width={20} height={20} className="text-primary" />
                        <span className="text-small truncate max-w-[250px]">{resumeFile.name}</span>
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => setResumeFile(null)}
                      >
                        <Icon icon="lucide:x" width={16} height={16} />
                      </Button>
                    </div>
                  )}
                  
                  {fileError && (
                    <p className="text-small text-danger">{fileError}</p>
                  )}
                  
                  <div>
                    <label className="block text-default-600 font-medium mb-2">
                      Carta de presentación (opcional):
                    </label>
                    <textarea
                      className="w-full p-2 border border-default-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={4}
                      placeholder="Escribe una breve carta de presentación..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                  </div>
                  
                  <div className="bg-content2 p-4 rounded-lg">
                    <p className="text-small flex items-center gap-1">
                      <Icon icon="lucide:info" width={16} height={16} className="text-primary" />
                      Al postular, aceptas que la empresa tenga acceso a tu información de contacto y CV.
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="success"
                  onPress={submitApplication}
                >
                  Enviar Postulación
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  );
};