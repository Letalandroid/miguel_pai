import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { addToast } from "@heroui/react";
import { supabase } from "../../supabase/client";

// Define user types
export type UserRole = "graduate" | "admin" | "company";

export interface User {
  id: string;
  name: string;
  career?: string;
  graduationYear?: string;
  phone?: string;
  status?: string;
  email: string;
  role: UserRole;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

// Create context
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "Juan Pérez",
    email: "graduate@example.com",
    role: "graduate",
  },
  { id: "2", name: "Jefa de Area", email: "admin@example.com", role: "admin" },
  { id: "3", name: "TOTTUS", email: "company@example.com", role: "company" },
];

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [graduates, setGraduates] = React.useState<User[] | null>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const history = useHistory();

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

  // Check if user is already logged in
  // React.useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Buscar en usuarios mock (admin, company, etc.)
      const foundUser = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      // Buscar en egresados de Supabase
      const graduateUser = graduates.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      // Validar login
      if ((foundUser || graduateUser) && password === "password") {
        const user = foundUser || { ...graduateUser, role: "graduate" };

        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        // Redirigir según el rol
        switch (user.role) {
          case "graduate":
            history.push("/graduate/dashboard");
            break;
          case "admin":
            history.push("/admin/dashboard");
            break;
          case "company":
            history.push("/company/dashboard");
            break;
        }

        addToast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${user.name}`,
          color: "success",
        });
      } else {
        throw new Error("Credenciales inválidas");
      }
    } catch (error) {
      addToast({
        title: "Error de inicio de sesión",
        description:
          error instanceof Error ? error.message : "Ocurrió un error",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    history.push("/login");
    addToast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
      color: "primary",
    });
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if email exists
      const foundUser = mockUsers.find((u) => u.email === email);

      if (foundUser) {
        addToast({
          title: "Correo enviado",
          description:
            "Se ha enviado un correo con instrucciones para restablecer tu contraseña",
          color: "success",
        });
      } else {
        throw new Error("Correo electrónico no encontrado");
      }
    } catch (error) {
      addToast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Ocurrió un error",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
