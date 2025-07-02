import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { LoginPage } from "../src/feactures/login";
import { GraduateLayout } from "./layouts/graduate-layout";
import { AdminLayout } from "./layouts/admin-layout";
import { CompanyLayout } from "./layouts/company-layout";
import { AuthProvider } from "../src/feactures/login/auth-context";

export default function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/graduate" component={GraduateLayout} />
        <Route path="/admin" component={AdminLayout} />
        <Route path="/company" component={CompanyLayout} />
        <Redirect to="/" />
      </Switch>
    </AuthProvider>
  );
}