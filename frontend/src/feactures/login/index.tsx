import React from "react";
import { Card, CardBody, Input, Button, Link, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useAuth } from "../login/auth-context";
import { ForgotPasswordModal } from "./forgot-password-modal";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  
  const { login, isLoading } = useAuth();

  const validateForm = () => {
    let isValid = true;
    
    // Email validation
    if (!email) {
      setEmailError("El correo electrónico es obligatorio");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Ingrese un correo electrónico válido");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    // Password validation
    if (!password) {
      setPasswordError("La contraseña es obligatoria");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await login(email, password);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary-100 to-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mb-8"
      >
        <div className="flex items-center justify-center ">
        
          <img src="/logo.png" alt="Logo UCV" className="h-44 w-auto ml-1" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-medium text-foreground-800">Plataforma para agendar reuniones.</h2>
          <p className="text-foreground-600 mt-1">Inicia sesión para continuar</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Card shadow="sm" className="border border-content3">
          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
              
              <Input
                type="password"
                label="Contraseña"
                placeholder="Ingrese su contraseña"
                value={password}
                onValueChange={setPassword}
                isInvalid={!!passwordError}
                errorMessage={passwordError}
                startContent={
                  <Icon icon="lucide:lock" className="text-default-400" width={20} />
                }
                isRequired
              />
              
              <div className="flex justify-end">
                <Link 
                  color="primary" 
                  href="#" 
                  size="sm"
                  onPress={() => setShowForgotPassword(true)}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                color="primary" 
                fullWidth 
                isLoading={isLoading}
                className="font-medium"
              >
                Iniciar Sesión
              </Button>
              
              <Divider className="my-4" />
              
              
            </form>
          </CardBody>
        </Card>
      </motion.div>

      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  );
};