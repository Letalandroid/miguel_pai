import React from "react";
import { useHistory } from "react-router-dom";
import { addToast } from "@heroui/react";

// Define user types
export type UserRole = "graduate" | "admin" | "company";

export interface User {
  id: string;
  name: string;
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
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const history = useHistory();

  // Check if user is already logged in
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find user by email (mock authentication)
      const foundUser = mockUsers.find((u) => u.email === email);

      if (foundUser && password === "password") {
        // Simple password check
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));

        // Redirect based on role
        switch (foundUser.role) {
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
          description: `Bienvenido, ${foundUser.name}`,
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
