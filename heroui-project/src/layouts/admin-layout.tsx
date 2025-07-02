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
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../feactures/login/auth-context";
import { AdminDashboard } from "../feactures/admin/pages/dashboard";
import { AdminProfile } from "../feactures/admin/pages/profile";
import { AdminCalendar } from "../feactures/admin/pages/calendar";
import { AdminWorkshops } from "../feactures/admin/pages/workshops";
import { AdminJobs } from "../feactures/admin/pages/jobs";
import { AdminEvents } from "../feactures/admin/pages/events";
import { AdminMeetings } from "../feactures/admin/pages/meetings";
import { AdminHistory } from "../feactures/admin/pages/history";
import { AdminGraduates } from "../feactures/admin/pages/graduates";
{
  /*import { AdminNotifications } from "../pages/admin/notifications";*/
}

export const AdminLayout: React.FC = () => {
  const { path, url } = useRouteMatch();
  const { user, logout } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Protect route if not authenticated or wrong role
  if (!user || user.role !== "admin") {
    return <Redirect to="/login" />;
  }

  const menuItems = [
    { name: "Dashboard", path: "dashboard", icon: "lucide:layout-dashboard" },
    { name: "Mi Perfil", path: "profile", icon: "lucide:user" },
    { name: "Calendario", path: "calendar", icon: "lucide:calendar" },
    { name: "Talleres", path: "workshops", icon: "lucide:book-open" },
    { name: "Convocatorias", path: "jobs", icon: "lucide:briefcase" },
    { name: "Egresados", path: "graduates", icon: "lucide:graduation-cap" },
    { name: "Eventos", path: "events", icon: "lucide:flag" },
    { name: "Reuniones", path: "meetings", icon: "lucide:users" },
    { name: "Histórico", path: "history", icon: "lucide:history" },
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
          <p className="font-bold text-inherit ml-2">UCV Admin</p>
        </NavbarBrand>

        <NavbarContent className="hidden lg:flex gap-4" justify="center">
          {menuItems.slice(0, 6).map((item) => (
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
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="light"
                endContent={
                  <Icon icon="lucide:chevron-down" width={16} height={16} />
                }
              >
                Más
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Más opciones"
              onAction={(key) => handleNavigation(key as string)}
            >
              {menuItems.slice(6).map((item) => (
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
        </NavbarContent>

        <NavbarContent justify="end">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="light"
                isIconOnly
                className="lg:hidden"
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
                color="secondary"
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
          <Route exact path={`${path}/dashboard`} component={AdminDashboard} />
          <Route path={`${path}/profile`} component={AdminProfile} />
          <Route path={`${path}/calendar`} component={AdminCalendar} />
          <Route path={`${path}/workshops`} component={AdminWorkshops} />
          <Route path={`${path}/jobs`} component={AdminJobs} />
          <Route path={`${path}/graduates`} component={AdminGraduates} />
          <Route path={`${path}/events`} component={AdminEvents} />
          <Route path={`${path}/meetings`} component={AdminMeetings} />
          <Route path={`${path}/history`} component={AdminHistory} />
          {/*<Route path={`${path}/notifications`} component={AdminNotifications} />*/}
          <Redirect to={`${path}/dashboard`} />
        </Switch>
      </main>
    </div>
  );
};
