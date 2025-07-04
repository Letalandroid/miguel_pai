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
  ruc?: string;
  razonSocial?: string;
  rubro?: string;
  site?: string;
  address?: string;
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
  const [graduates, setGraduates] = React.useState<User[]>([]);
  const [companies, setCompanies] = React.useState<User[]>([]);
  const [isGraduatesLoaded, setIsGraduatesLoaded] = React.useState(false);
  const [isCompaniesLoaded, setIsCompaniesLoaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [egresadosRes, empresasRes] = await Promise.all([
          supabase
            .from("egresados")
            .select("*")
            .order("id", { ascending: false }),
          supabase
            .from("empresas")
            .select("*")
            .order("id", { ascending: false }),
        ]);

        if (egresadosRes.data) setGraduates(egresadosRes.data);
        if (empresasRes.data) setCompanies(empresasRes.data);

        if (egresadosRes.error)
          console.error("Error egresados", egresadosRes.error);
        if (empresasRes.error)
          console.error("Error empresas", empresasRes.error);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      } finally {
        setIsGraduatesLoaded(true);
        setIsCompaniesLoaded(true);
      }
    };

    fetchUsers();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // 🔁 Esperar a que graduates esté cargado antes de continuar
      if (!isGraduatesLoaded) {
        await new Promise((resolve) => {
          const check = setInterval(() => {
            if (isGraduatesLoaded) {
              clearInterval(check);
              resolve(true);
            }
          }, 100);
        });
      }

      if (!isCompaniesLoaded) {
        await new Promise((resolve) => {
          const check = setInterval(() => {
            if (isCompaniesLoaded) {
              clearInterval(check);
              resolve(true);
            }
          }, 100);
        });
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación

      const foundUser = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      const graduateUser = graduates.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      const companyUser = companies.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      const user = foundUser ?? graduateUser ?? companyUser;

      if (user && password === "password") {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));

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
