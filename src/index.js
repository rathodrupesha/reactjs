/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
// import { makeStyles } from "@material-ui/core/styles";
// import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";
import { ThemeProvider } from "@mui/material";

// core components
import Admin from "layouts/Admin.js";
// import Login from "views/Login/Login.js";
import NewLogin from "views/Login/NewLogin.js";
import Landing from "views/LandingPage/Landing.js";
import RTL from "layouts/RTL.js";
import PublicRoute from "./base/PublicRoute.js";
import ProtectedRoute from "./base/ProtectedRoute.js";
import { theme } from "theme.js";
import "assets/css/material-dashboard-react.css";
import HelpCenter from "views/LandingPage/HelpCenter.js";
import "./index.css";
import TermOfService from "views/LandingPage/TermOfService.js";
import Privacy from "views/LandingPage/Privacy.js";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Switch>
        <PublicRoute exact path="/superadmin/login" component={NewLogin} />
        <PublicRoute exact path="/landing" component={Landing} />
        <PublicRoute exact path="/helpcenter" component={HelpCenter} />
        <PublicRoute exact path="/termofservice" component={TermOfService} />
        <PublicRoute exact path="/privacy" component={Privacy} />
        <ProtectedRoute path="/superadmin" component={Admin} />
        <ProtectedRoute path="/rtl" component={RTL} />
        <Route path="*">
          <Redirect to="/superadmin/login" />
        </Route>
      </Switch>
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById("root")
);
