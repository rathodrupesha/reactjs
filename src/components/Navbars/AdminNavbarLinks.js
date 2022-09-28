import React from "react";
import classNames from "classnames";
// @material-ui/core components
import Modal from "@material-ui/core/Modal";
import GridItem from "components/Grid/GridItem.js";
import Box from "@material-ui/core/Box";
import Snackbar from "../../components/Snackbar/Snackbar";
import { TextField, Typography } from "@material-ui/core";
import GridContainer from "components/Grid/GridContainer.js";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { useState, useEffect } from "react";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";
import { useHistory } from "react-router-dom";
import Api from "Api/ApiUtils";
import {
  validator,
  validatePassword,
} from "../../views/UserProfile/EditProfileValidator";
import CircularProgress from "@mui/material/CircularProgress";

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const userState = {
    user_id: "",
    loader: false,
    old_password: "",
    confirm_password: "",
    new_password: "",
  };
  const boxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const classes = useStyles();
  const [openNotification, setOpenNotification] = React.useState(null);
  const history = useHistory();
  const [loader, setLoader] = React.useState(false);

  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [br, setBR] = useState(false);
  const handleCloseMsg = () => {
    setBR(false);
  };
  const [openProfile, setOpenProfile] = React.useState(null);
  const [formErrors, setFormErrors] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [open, setOpen] = React.useState(false);
  const [editprofile, setEditProfile] = useState(userState);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    // console.log("close--->>>>>");
    setOpen(false);
    //history.push("/masteradmin/login");
    //getSuperAdminProfile();
    setEditProfile((prev) => ({
      ...prev,
      old_password: "",
      new_password: "",
      confirm_password: "",
    }));
    setFormErrors({});
  };
  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    //console.log("handle edit change-----", e);
    setEditProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      old_password: editprofile.old_password,
      new_password: editprofile.new_password,
      confirm_password: editprofile.confirm_password,
      [name]: value,
    };
    let { isValid, form_errors } = validator(validation_object, name);
    // console.log(isValid, form_errors);

    setFormErrors((prev) => ({
      ...prev,
      ...form_errors,
    }));

    return;
  };

  const updatePassword = () => {
    setLoader(true);
    const payload = {
      old_password: editprofile.old_password,
      new_password: editprofile.new_password,
      confirm_password: editprofile.confirm_password,
    };
    // console.log("update password payload", payload);
    let { isValid, form_errors } = validatePassword(editprofile);
    if (!isValid) {
      setLoader(false);
      setFormErrors(form_errors);
      return;
    }
    Api.superAdminChangePassword(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status == 1) {
          setLoader(false);
          // console.log("Ressss Data from COnfirm Password", res.data);
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          localStorage.clear();
          handleClose();
          history.push("/superadmin/login");
        } else {
          setLoader(false);
          //console.log("Eslee COnstionnnnnnn", res.data);
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })
      .catch((err) => {
        const error = err?.message || err?.res?.message || err;

        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
        // setEditProfile((prev) => ({
        //   ...prev,
        //   loader: false,
        //   old_password: "",
        //   new_password: "",
        //   confirm_password: "",
        // }));
        // console.log("inside catch", err?.message || err?.res?.message || err);
      });
  };

  const handleClickNotification = (event) => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  const handleLogout = () => {
    localStorage.clear();
    history.push("/masteradmin/login");
  };
  return (
    <div>
      {/*<div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openNotification ? "notification-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickNotification}
          className={classes.buttonLink}
        >
          <Notifications className={classes.icons} />
          <span className={classes.notifications}>5</span>
          <Hidden mdUp implementation="css">
            <p onClick={handleCloseNotification} className={classes.linkText}>
              Notification
            </p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openNotification)}
          anchorEl={openNotification}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openNotification }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="notification-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseNotification}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      Mike John responded to your email
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      You have 5 new tasks
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      You{"'"}re now friend with Andrew
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      Another Notification
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={classes.dropdownItem}
                    >
                      Another One
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
            </div>*/}
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden>
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    {/* <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      Profile
                    </MenuItem> */}
                    <MenuItem
                      onClick={handleOpen}
                      className={classes.dropdownItem}
                    >
                      Change Password
                    </MenuItem>
                    <Divider light />
                    <MenuItem
                      onClick={handleLogout}
                      className={classes.dropdownItem}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>

        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <GridContainer>
                <Snackbar
                  place="tr"
                  setBR={setBR}
                  color={notification.type}
                  message={notification.message}
                  open={br}
                  closeNotification={handleCloseMsg}
                  close
                />
                <GridItem xs={12} sm={12} md={8}>
                  <Box sx={boxStyle}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      <center> Change Password</center>
                      <br />
                    </Typography>

                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                          labelText="Enter Current Password"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            name: "old_password",
                            // type: "password",
                            value: editprofile.old_password,

                            onChange: (e) => handleChangePassword(e),
                            onBlur: (e) => handleChangePassword(e),
                          }}
                          error={formErrors.old_password ? true : false}
                          helperText={formErrors.old_password}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                          labelText="New Password"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          error={formErrors.new_password ? true : false}
                          helperText={formErrors.new_password}
                          inputProps={{
                            name: "new_password",
                            // type: "password",
                            value: editprofile.new_password,
                            onChange: (e) => handleChangePassword(e),
                            onBlur: (e) => handleChangePassword(e),
                            max: 12,
                            min: 6,
                          }}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={12}>
                        <CustomInput
                          labelText="Confirm Password"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          error={formErrors.confirm_password ? true : false}
                          helperText={formErrors.confirm_password}
                          inputProps={{
                            name: "confirm_password",
                            // type: "password",
                            value: editprofile.confirm_password,
                            onChange: (e) => handleChangePassword(e),
                            onBlur: (e) => handleChangePassword(e),
                          }}
                        />
                      </GridItem>

                      <GridItem
                        xs={12}
                        sm={12}
                        md={12}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        {loader ? (
                          <CircularProgress
                            align="centre"
                            color="primary"
                            style={{ marginBottom: "1.25rem" }}
                          />
                        ) : null}
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Button
                            color="primary"
                            onClick={handleClose}
                            style={{ marginRight: "1rem" }}
                          >
                            Cancel
                          </Button>

                          <Button color="primary" onClick={updatePassword}>
                            Change
                          </Button>
                        </div>
                      </GridItem>
                    </GridContainer>
                  </Box>
                </GridItem>
              </GridContainer>
            </Modal>
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
