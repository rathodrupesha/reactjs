import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// // @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";
import Api from "../Api/ApiUtils";
import routes from "routes.js";

import bgImage from "assets/img/sidebar-2.jpg";
import logo from "assets/img/Frame.png";
import ProtectedRoute from "base/ProtectedRoute";
import { isModuleAccesible } from "../generalUtils";
import LocalStorage from "../Api/LocalStorage.js";
import Snackbar from "components/Snackbar/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";

let ps;

const getRoute = (item, key) => {
  console.log(item.path, "->", isModuleAccesible(item.access_criteria, "view"));
  if (item.access_criteria) {
    return (
      <ProtectedRoute
        path={item.layout + item.path}
        component={item.component}
        key={key}
        exact={item.exact ?? false}
        allowCondition={
          isModuleAccesible(item.access_criteria, "view")
            ? true
            : item.openlyAccessible
            ? true
            : false
        }
        redirectionPath="/superadmin/dashboard"
      />
    );
  } else
    return (
      <Route
        path={item.layout + item.path}
        component={item.component}
        key={key}
        exact={item.exact ?? false}
      />
    );
};

const switchRoutes = () => {
  return (
    <Switch>
      {routes.flatMap((prop, key) => {
        if (prop.layout === "/superadmin") {
          if (prop.type === "menu") {
            return prop.items.flatMap((item, key) => getRoute(item, key));
          }
          return getRoute(prop, key);
        }
        return null;
      })}
      <Redirect from="/superadmin" to="/superadmin/dashboard" />
    </Switch>
  );
};

const useStyles = makeStyles(styles);

const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));

export default function Admin({ ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  // states and functions
  const [image, setImage] = React.useState(bgImage);
  const [color, setColor] = React.useState("white");
  const [fixedClasses, setFixedClasses] = React.useState("dropdown show");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [br, setBR] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(true);
  const [notification, setNotification] = React.useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  const handleImageClick = (image) => {
    setImage(image);
  };
  const handleColorClick = (color) => {
    setColor(color);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/superadmin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (!mainPanel.current) return;
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);

  {
    /* useEffect(async () => {
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      subAdmin_Id: user[0]?.id,
    };
    let currentInfo = await LocalStorage.getItem("HamroSuperAdminInfo");
    if (currentInfo) {
      // call only if subadmin
      if (currentInfo[0]?.role_id !== 5) {
        setShowLoader(false);
        return;
      }
    }
    try {
      let res = await Api.setSubAdminInfo(payload);
      if (res.data.status === 1) {
        await LocalStorage.setItem(
          "HamroSuperAdminInfo",
          JSON.stringify(res.data.data)
        );
      } else {
        setBR(true);
        setNotification({
          type: "danger",
          message: res.msg,
        });
      }
    } catch (err) {
      if (err && err.msg) {
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
      }
    } finally {
      setShowLoader(false);
    }
  }, []);

  if (showLoader)
    return (
      <div className={classes.wrapper}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <CircularProgress align="centre" color="primary" />
          <h4>Fetching your details. Please wait...</h4>
        </div>
        </div>
    );*/
  }
  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"Creative Tim"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes()}</div>
          </div>
        ) : (
          <div className={classes.map}>{switchRoutes()}</div>
        )}
        {/* {getRoute() ? <Footer /> : null} */}
        {/* <FixedPlugin
          handleImageClick={handleImageClick}
          handleColorClick={handleColorClick}
          bgColor={color}
          bgImage={image}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
        /> */}
      </div>

      <Snackbar
        place="tr"
        setBR={setBR}
        color={notification.type}
        message={notification.message}
        open={br}
        closeNotification={handleCloseMsg}
        close
      />
    </div>
  );
}
