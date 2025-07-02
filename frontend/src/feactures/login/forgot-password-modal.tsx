import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../login/auth-context";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const { forgotPassword, isLoading } = useAuth();

  const validateEmail = () => {
    if (!email) {
      setEmailError("El correo electrónico es obligatorio");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Ingrese un correo electrónico válido");
      return false;
    }
    
    setEmailError("");
    return true;
  };

  const handleSubmit = async () => {
    if (validateEmail()) {
      await forgotPassword(email);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Recuperar contraseña
            </ModalHeader>
            <ModalBody>
              <p className="text-default-500 mb-4">
                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
              </p>
              <Input
                type="email"
                label="Correo electrónico"
                placeholder="ejemplo@dominio.com"
                value={email}
                onValueChange={setEmail}
                isInvalid={!!emailError}
                errorMessage={emailError}
                startContent={
                  <Icon icon="lucide:mail" className="text-default-400" width={20} />
                }
                isRequired
              />
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button 
                color="primary" 
                onPress={handleSubmit}
                isLoading={isLoading}
              >
                Enviar instrucciones
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};