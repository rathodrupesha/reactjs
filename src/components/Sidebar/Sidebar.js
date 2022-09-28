/*eslint-disable*/
import React, { useState } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import { useEffect } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Icon from "@material-ui/core/Icon";
// core components
import AdminNavbarLinks from "components/Navbars/AdminNavbarLinks.js";
import RTLNavbarLinks from "components/Navbars/RTLNavbarLinks.js";

import styles from "assets/jss/material-dashboard-react/components/sidebarStyle.js";
import "assets/css/material-dashboard-react.css";
import Logo from "../../assets/img/hotel-logo.png";
import { Link } from "react-router-dom";
import { isModuleAccesible } from "generalUtils";

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
  const classes = useStyles();
  let location = useLocation();
  // verifies if routeName is the one active (in browser input)
  function activeRoute(routeName) {
    return location.pathname === routeName;
  }
  const { color, logo, image, logoText, routes } = props;
  const [selectedIndex, setselectedIndex] = React.useState(0);
  const [menusOpen, setMenusOpen] = useState(
    props.routes
      .filter((r) => r.type === "menu")
      .map((r) => ({ menuId: r.menuId, open: false }))
  );

  const handleListItemClick = (event, index) => {
    setselectedIndex(index);
  };

  useEffect(() => {
    routes.forEach((rt, index) => {
      if (rt.type === "menu") {
        rt.items.forEach((it, idx) => {
          if (location.pathname === it.layout + it.path)
            setselectedIndex(`${rt.menuId}-${idx}`);
        });
      } else if (location.pathname === rt.layout + rt.path) {
        setselectedIndex(index);
      }
    });
  }, []);

  useEffect(() => {
    var parts = location.pathname.split("/");
    var lastSegment = parts.pop() || parts.pop();
    routes.map((obj, key) => {
      if (obj.path == "/" + lastSegment) setselectedIndex(key);
    });
  }, [selectedIndex]);

  // function LinkItem(prop, index)
  function LinkItem(prop, index, child = false) {
    if (
      !isModuleAccesible(prop.access_criteria, "view") &&
      !prop.openlyAccessible
    )
      return null;
    const key = index;
    var activePro = " ";
    var listItemClasses;
    if (prop.path === "/upgrade-to-pro") {
      activePro = classes.activePro + " ";
      listItemClasses = classNames({
        [" " + classes[color]]: true,
      });
    } else {
      listItemClasses = classNames({
        [" " + classes[color]]: activeRoute(prop.layout + prop.path),
      });
    }
    const whiteFontClasses = classNames({
      [" " + classes.whiteFont]: activeRoute(prop.layout + prop.path),
    });
    return (
      <NavLink
        to={prop.layout + prop.path}
        className={activePro + classes.item}
        activeClassName="active"
        key={key}
      >
        {/*} put condition for view access*/}
        <ListItem
          button
          className={classes.itemLink + listItemClasses}
          // style={selectedIndex === key ? { backgroundColor: "white" } : {}}
          // style={
          //   selectedIndex === key
          //     ? { backgroundColor: "white", marginLeft: child ? "35px" : "" }
          //     : { marginLeft: child ? "35px" : "" }
          // }
          style={
            selectedIndex === key
              ? {
                  backgroundColor: "#333252b8",
                  marginLeft: child ? "35px" : "",
                }
              : { marginLeft: child ? "35px" : "" }
          }
          selected={key === selectedIndex}
          onClick={(event) => handleListItemClick(event, key)}
        >
          {typeof prop.icon === "string" ? (
            <Icon
              className={classNames(classes.itemIcon, whiteFontClasses, {
                [classes.itemIconRTL]: props.rtlActive,
              })}
              // style={selectedIndex === key ? { color: "#874ABE" } : {}}
              style={selectedIndex === key ? { color: "white" } : {}}
            >
              {prop.icon}
            </Icon>
          ) : (
            <prop.icon
              className={classNames(classes.itemIcon, whiteFontClasses, {
                [classes.itemIconRTL]: props.rtlActive,
              })}
              // style={selectedIndex === key ? { color: "#874ABE" } : {}}
              style={selectedIndex === key ? { color: "white" } : {}}
            />
          )}
          <ListItemText
            primary={props.rtlActive ? prop.rtlName : prop.name}
            className={classNames(classes.itemText, whiteFontClasses, {
              [classes.itemTextRTL]: props.rtlActive,
            })}
            disableTypography={true}
            // style={
            //   selectedIndex === key
            //     ? { color: "#874ABE", fontWeight: "400" }
            //     : {}
            // }
            style={
              selectedIndex === key ? { color: "white", fontWeight: "400" } : {}
            }
          />
        </ListItem>
      </NavLink>
    );
  }

  function LinkMenu(prop, index) {
    let isAnySubMenuModuleAccessible = prop.items.reduce((tillNow, curr) => {
      return (
        tillNow ||
        isModuleAccesible(curr.access_criteria, "view") ||
        curr.openlyAccessible
      );
    }, false);

    if (!isAnySubMenuModuleAccessible) return null;
    let active = false;
    prop.items.forEach((item) => {
      active |= activeRoute(item.layout + item.path);
    });

    const key = index;
    let listItemClasses = "";

    listItemClasses = classNames(classes.item, {
      [" " + classes[color]]: active,
    });
    const whiteFontClasses = classNames({
      [" " + classes.whiteFont]: active,
    });
    const isCurrentMenuOpen = menusOpen.filter(
      (mn) => mn.menuId === prop.menuId
    )[0]?.open;

    return (
      <>
        <ListItem
          button
          className={listItemClasses + " " + classes.item}
          onClick={() =>
            setMenusOpen((prev) => {
              return prev.map((mn) =>
                mn.menuId === prop.menuId
                  ? { ...mn, open: !mn.open }
                  : { ...mn }
              );
            })
          }
          // style={active ? { backgroundColor: "white" } : {}}
          style={selectedIndex === key ? { backgroundColor: "#333252b8" } : {}}
          selected={active}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "14px",
              marginTop: "10px",
            }}
          >
            {typeof prop.icon === "string" ? (
              <Icon
                className={classNames(classes.itemIcon, whiteFontClasses, {
                  [classes.itemIconRTL]: props.rtlActive,
                })}
                // style={active ? { color: "#874ABE" } : {}}]
                style={active ? { color: "white" } : {}}
              >
                {prop.icon}
              </Icon>
            ) : (
              <prop.icon
                className={classNames(classes.itemIcon, whiteFontClasses, {
                  [classes.itemIconRTL]: props.rtlActive,
                })}
                // style={active ? { color: "#874ABE" } : {}}
                style={active ? { color: "white" } : {}}
              />
            )}
            <ListItemText
              primary={props.rtlActive ? prop.rtlName : prop.name}
              className={classNames(classes.itemText, whiteFontClasses, {
                [classes.itemTextRTL]: props.rtlActive,
              })}
              disableTypography={true}
              // style={active ? { color: "#874ABE", fontWeight: "400" } : {}}
              style={active ? { color: "white", fontWeight: "400" } : {}}
            />
            {isCurrentMenuOpen ? (
              <Icon
                className={classNames(classes.itemIcon, whiteFontClasses, {
                  [classes.itemIconRTL]: props.rtlActive,
                })}
                // style={active ? { color: "#874ABE" } : {}}
                style={active ? { color: "white" } : {}}
              >
                expand_less
              </Icon>
            ) : (
              <Icon
                className={classNames(classes.itemIcon, whiteFontClasses, {
                  [classes.itemIconRTL]: props.rtlActive,
                })}
                // style={active ? { color: "#874ABE" } : {}}
                style={active ? { color: "white" } : {}}
              >
                expand_more
              </Icon>
            )}
          </div>
        </ListItem>

        {isCurrentMenuOpen
          ? prop.items &&
            // prop.items.map((mi, idx) => LinkItem(mi, `${prop.menuId}-${idx}`))
            prop.items.map((mi, idx) =>
              LinkItem(mi, `${prop.menuId}-${idx}`, true)
            )
          : null}
      </>
    );
  }

  var links = (
    <List className={classes.list}>
      {routes.map((prop, index) => {
        if (prop.hidden) return null;
        if (prop.type && prop.type === "menu") {
          return LinkMenu(prop, index);
        } else return LinkItem(prop, index);
      })}
    </List>
  );
  var brand = (
    <div className={classes.logo}>
      {/*}  <a
        href="/superadmin/dashboard"
        className={classNames(classes.logoLink, {
          [classes.logoLinkRTL]: props.rtlActive,
        })}
        target="_blank"
      >*/}
      <div className={classes.logoImage}>
        <Link to="/superadmin/dashboard">
          <img src={logo} alt="logo" className={classes.img} />
        </Link>
      </div>
    </div>
  );
  // var brand = (
  //   <div className={classes.logo}>
  //     <a
  //       href="#"
  //       className={classNames(classes.logoLink, {
  //         [classes.logoLinkRTL]: props.rtlActive,
  //       })}
  //       target="_blank"
  //     >
  //       <div className={classes.logoImage}>
  //         <img src={logo} alt="logo" className={classes.img} />
  //       </div>
  //       HAMROSTAY
  //     </a>
  //   </div>
  // );
  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>
            {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />}
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(classes.drawerPaper, {
              [classes.drawerPaperRTL]: props.rtlActive,
            }),
          }}
        >
          {brand}
          <div className={classes.sidebarWrapper}>{links}</div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
