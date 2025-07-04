import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Chip,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";
import { supabase } from "../../../supabase/client";

// Job type definition
interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  createdAt: string;
  closingDate: string;
  status: "active" | "closed";
  applicants: number;
}

// Applicant type definition
interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  applicationDate: string;
  status: "pending" | "reviewed" | "interviewed" | "selected" | "rejected";
  cv: string;
}

export const CompanyJobs: React.FC = () => {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [postulantes, setPostulantes] = React.useState([]);
  const [egresados, setEgresados] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "active" | "closed"
  >("all");
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);

  useEffect(() => {
    const getPostulantes = async () => {
      const { data, error } = await supabase
        .from("postulaciones")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;

      setPostulantes(data);
    };

    getPostulantes();
  }, []);

  useEffect(() => {
    if (!postulantes || postulantes.length === 0) return;

    const getConvocatorias = async () => {
      const { error, data } = await supabase
        .from("convocatorias")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;

      const updatedJobs = data.map((job: any) => {
        const applicantsCount = postulantes.filter(
          (p: any) => p.convocatoriaId === job.id
        ).length;

        return {
          ...job,
          applicants: applicantsCount,
        };
      });

      setJobs(updatedJobs);
    };

    getConvocatorias();
  }, [postulantes]);

  useEffect(() => {
    const getEgresados = async () => {
      const { error, data } = await supabase
        .from("egresados")
        .select("*")
        .order("id", { ascending: false });

      setEgresados(data);

      if (error) {
        throw error;
      }
    };

    getEgresados();
  }, []);

  useEffect(() => {
    const hoy = new Date().toISOString();

    const actualizarEstados = async () => {
      const expiradas = jobs.filter(
        (job) => job.closingDate < hoy && job.status === "active"
      );
      for (const job of expiradas) {
        await supabase
          .from("convocatorias")
          .update({ status: "closed" })
          .eq("id", job.id);
      }
    };

    actualizarEstados();
  }, [jobs]);

  const getApplicantsByConvocatoria = (convocatoriaId: number) => {
    return postulantes
      .filter((p) => p.convocatoriaId === convocatoriaId)
      .map((p) => {
        const egresado = egresados.find((e) => e.id === p.egresadoId);
        return {
          id: egresado?.id,
          name: egresado?.name,
          email: egresado?.email,
          phone: egresado?.celular,
          applicationDate: p.fecha_postulacion ?? new Date(),
          status: p.estado || "pending",
          cv: p.cvUrl,
        };
      });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && job.status === statusFilter;
  });

  const viewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto"
    >
      {/* Filters */}
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="mb-6">
        <Card shadow="sm">
          <CardBody className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Buscar convocatorias..."
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
            <div className="flex gap-2">
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
                color={statusFilter === "closed" ? "default" : "default"}
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
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
          <Card shadow="sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">Convocatorias</h2>
            </CardHeader>
            <Divider />
            <CardBody className="p-0">
              {filteredJobs.map((job, index) => (
                <div
                  key={job.id}
                  className={`p-4 ${
                    index !== filteredJobs.length - 1
                      ? "border-b border-default-100"
                      : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">{job.title}</h3>
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
                        Creada: {new Date(job.createdAt).toLocaleDateString()} |
                        Cierra: {new Date(job.closingDate).toLocaleDateString()}{" "}
                        | Postulantes: {job.applicants}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={() => viewDetails(job)}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="text-center py-12">
          <Icon
            icon="lucide:briefcase-x"
            className="mx-auto mb-4 text-default-400"
            width={48}
            height={48}
          />
          <h3 className="text-xl font-medium text-foreground-800">
            No se encontraron convocatorias
          </h3>
          <p className="text-default-500 mt-2">
            {searchTerm
              ? "No hay resultados para tu búsqueda."
              : statusFilter !== "all"
              ? `No tienes convocatorias ${
                  statusFilter === "active" ? "activas" : "cerradas"
                }.`
              : "No has publicado ninguna convocatoria aún."}
          </p>
        </motion.div>
      )}

      {/* Job details modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        size="2xl"
      >
        <ModalContent>
          {(onClose) =>
            selectedJob && (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedJob.title}
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Chip
                        color={
                          selectedJob.status === "active"
                            ? "success"
                            : "default"
                        }
                        variant="flat"
                      >
                        {selectedJob.status === "active" ? "Activa" : "Cerrada"}
                      </Chip>
                      <p className="text-small text-default-500">
                        Postulantes: {selectedJob.applicants}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-default-600 font-medium">
                          Fecha de creación:
                        </p>
                        <p>
                          {new Date(selectedJob.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-default-600 font-medium">
                          Fecha de cierre:
                        </p>
                        <p>
                          {new Date(
                            selectedJob.closingDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-default-600 font-medium">
                        Descripción:
                      </p>
                      <p className="text-default-700">
                        {selectedJob.description}
                      </p>
                    </div>

                    <div>
                      <p className="text-default-600 font-medium">
                        Requisitos:
                      </p>
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
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>
    </motion.div>
  );
};
