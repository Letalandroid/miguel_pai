import React from "react";
import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../feactures/login/auth-context";
import { GraduateDashboard } from "../feactures/graduate/pages/dashboard";
import { GraduateProfile } from "../feactures/graduate/pages/profile";
import { GraduateWorkshops } from "../feactures/graduate/pages/workshops";
import { GraduateMeetings } from "../feactures/graduate/pages/meetings";
import { GraduateJobs } from "../feactures/graduate/pages/jobs";
import { GraduateNotifications } from "../feactures/graduate/pages/notifications";

export const GraduateLayout: React.FC = () => {
  const { path, url } = useRouteMatch();
  const { user, logout } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Protect route if not authenticated or wrong role
  if (!user || user.role !== "graduate") {
    return <Redirect to="/login" />;
  }

  const menuItems = [
    { name: "Dashboard", path: "dashboard", icon: "lucide:layout-dashboard" },
    { name: "Mi Perfil", path: "profile", icon: "lucide:user" },
    { name: "Talleres", path: "workshops", icon: "lucide:book-open" },
    { name: "Reuniones", path: "meetings", icon: "lucide:calendar" },
    { name: "Convocatorias", path: "jobs", icon: "lucide:briefcase" },
    { name: "Notificaciones", path: "notifications", icon: "lucide:bell" },
  ];

  const handleNavigation = (path: string) => {
    history.push(`${url}/${path}`);
    setIsMenuOpen(false);
  };

  const isActive = (itemPath: string) => {
    return location.pathname === `${url}/${itemPath}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isBordered maxWidth="xl" className="bg-content1">
        <NavbarBrand>
          <Icon
            icon="logos:university"
            width={30}
            height={30}
            className="university-logo"
          />
          <p className="font-bold text-inherit ml-2">UCV Egresados</p>
        </NavbarBrand>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems.map((item) => (
            <NavbarItem key={item.path}>
              <Button
                variant="light"
                color={isActive(item.path) ? "primary" : "default"}
                className="flex items-center gap-1"
                onPress={() => handleNavigation(item.path)}
              >
                <Icon icon={item.icon} width={18} height={18} />
                <span>{item.name}</span>
              </Button>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="light"
                isIconOnly
                className="sm:hidden"
                onPress={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Icon icon="lucide:menu" width={24} height={24} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Menu de navegación"
              onAction={(key) => handleNavigation(key as string)}
            >
              {menuItems.map((item) => (
                <DropdownItem
                  key={item.path}
                  startContent={
                    <Icon icon={item.icon} width={18} height={18} />
                  }
                >
                  {item.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={user.name}
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Acciones de perfil"
              onAction={(key) => {
                if (key === "profile") {
                  handleNavigation("profile");
                } else if (key === "logout") {
                  logout();
                }
              }}
            >
              <DropdownItem key="profile">Mi Perfil</DropdownItem>
              <DropdownItem key="settings">Configuración</DropdownItem>
              <DropdownItem key="logout" color="danger">
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      <main className="flex-grow p-4 md:p-6">
        <Switch>
          <Route
            exact
            path={`${path}/dashboard`}
            component={GraduateDashboard}
          />
          <Route path={`${path}/profile`} component={GraduateProfile} />
          <Route path={`${path}/workshops`} component={GraduateWorkshops} />
          <Route path={`${path}/meetings`} component={GraduateMeetings} />
          <Route path={`${path}/jobs`} component={GraduateJobs} />
          <Route
            path={`${path}/notifications`}
            component={GraduateNotifications}
          />
          <Redirect to={`${path}/dashboard`} />
        </Switch>
      </main>
    </div>
  );
};
