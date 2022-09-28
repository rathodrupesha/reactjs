import React, { Component } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";

import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { useState, useEffect } from "react";
import avatar from "assets/img/hotel-logo.png";
import Modal from "@material-ui/core/Modal";
import Box from "@material-ui/core/Box";
import { TextField, Typography } from "@material-ui/core";
import LocalStorage from "Api/LocalStorage";
import Api from "Api/ApiUtils";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import Snackbar from "../../components/Snackbar/Snackbar";
import {
  validator,
  validatePassword,
  validateUserProfileDetails,
} from "./EditProfileValidator";
import CircularProgress from "@mui/material/CircularProgress";
import { convertStringToCamelCase } from "../../generalUtils.js";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontSize: "22px",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    fontWeight: "400",
  },
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

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const userState = {
    user_id: "",
    first_name: "",
    last_name: "",
    user_name: "",
    hotel_name: "",
    email: "",
    mobile_num: "",
    address: "",
    loader: false,
    old_password: "",
    confirm_password: "",
    new_password: "",
    profile_image: "",
  };

  const [editprofile, setEditProfile] = useState(userState);
  const [loader, setLoader] = React.useState(false);
  const [formErrors, setFormErrors] = useState({
    first_name: "",
    last_name: "",
    user_name: "",
    hotel_name: "",
    description: "",
    mobile_num: "",
    address: "",
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    // console.log("close--->>>>>");
    setOpen(false);
    getSuperAdminProfile();
    setEditProfile((prev) => ({
      ...prev,
      old_password: "",
      new_password: "",
      confirm_password: "",
    }));
    setFormErrors({});
  };
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [br, setBR] = useState(false);
  const handleCloseMsg = () => {
    setBR(false);
  };

  const handleCancel = () => {
    getSuperAdminProfile();
    setFormErrors({});
  };
  // const matchPassword = (e) => {
  //   if (e.target.name === "confirm_pass") {
  //     if (e.target.value !== editprofile.new_pass) {
  //       setEditProfile({
  //         ...editprofile,
  //         confirm_pass: e.target.value,
  //         passnotmatch: true,
  //       });
  //     } else {
  //       setEditProfile({
  //         ...editprofile,
  //         confirm_pass: e.target.value,
  //         passnotmatch: false,
  //       });
  //     }
  //   }
  // };

  const handleEditChange = (e) => {
    // window.alert("form input props");
    const { name, value } = e.target;
    //console.log("handle edit change-----", e);
    setEditProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      first_name: editprofile.first_name,
      last_name: editprofile.last_name,
      user_name: editprofile.user_name,
      mobile_num: editprofile.mobile_num,
      address: editprofile.address,
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

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    // console.log("handle edit change-----", e);
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
    const payload = {
      old_password: editprofile.old_password,
      new_password: editprofile.new_password,
      confirm_password: editprofile.confirm_password,
    };
    // console.log("update password payload", payload);
    let { isValid, form_errors } = validatePassword(editprofile);
    if (!isValid) {
      setFormErrors(form_errors);
      return;
    }
    Api.superAdminChangePassword(payload)
      .then((res) => {
        if (res.data.status == 1) {
          // console.log("res.data", res.data);
          handleClose();
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });

          getSuperAdminProfile();
          setEditProfile((prev) => ({
            ...prev,
            loader: false,
            old_password: "",
            new_password: "",
            confirm_password: "",
          }));
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
          // setEditProfile((prev) => ({
          //   ...prev,
          //   loader: false,
          //   old_pass: "",
          //   confirm_pass: "",
          //   new_pass: "",
          // }));
        }
      })
      .catch((err) => {
        const error = err?.message || err?.res?.message || err;

        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
        setEditProfile((prev) => ({
          ...prev,
          loader: false,
          old_password: "",
          new_password: "",
          confirm_password: "",
        }));
        // console.log("inside catch", err?.message || err?.res?.message || err);
      });
  };
  const updateProfile = () => {
    // setLoader(true);
    // console.log("update profile-----", editprofile);
    setEditProfile((prev) => ({
      ...prev,
      loader: true,
    }));
    // console.log("payload", editprofile.first_name);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      first_name: editprofile.first_name,
      last_name: editprofile.last_name,
      user_name: editprofile.user_name,
      address: editprofile.address,
      mobile_num: editprofile.mobile_num,
      hotel_description: editprofile.description,
    };
    let { isValid, form_errors } = validateUserProfileDetails(payload);
    if (!isValid) {
      setLoader(false);
      setFormErrors(form_errors);
      return;
    }
    //console.log("update profile payload", payload);
    Api.superAdminUpdateProfile(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status == 1) {
          setLoader(false);
          //console.log("gfgdfg");
          // console.log(res.data);
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          getSuperAdminProfile();
        } else {
          setLoader(false);
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
          // getSuperAdminProfile();
        }
      })
      .catch((err) => {
        const error = err?.message || err?.res?.message || err;
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
        // console.log("inside catch", err?.message || err?.res?.message || err);
      });
  };

  const getSuperAdminProfile = () => {
    Api.getProfileData()
      .then((res) => {
        // console.log(res);
        if (res && res.data && res.data.data) {
          //  console.log("id", res.data.data.id);
          setEditProfile((prev) => ({
            ...prev,
            user_id: res.data.data.id,
            first_name: res.data.data.first_name,
            last_name: res.data.data.last_name,
            user_name: res.data.data.user_name,
            hotel_name: res.data.data.hotel_name,
            mobile_num: res.data.data.mobile_num,
            email: res.data.data.email,
            address: res.data.data.address,
            loader: false,
            profile_image: res.data.data.profile_image,
            description: res.data.data.description,
          }));
        } else {
          // console.log("in else");
          //   console.log(res.msg);

          setEditProfile((prev) => ({
            ...prev,
            loader: false,
          }));
        }
      })
      .catch((err) => {
        if (err) {
          //  console.log(err, "error----userprofile");
        }
      });
  };
  useEffect(() => {
    getSuperAdminProfile();
  }, []);

  const classes = useStyles();
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Profile</h4>
              {/*}  <p className={classes.cardCategoryWhite}>Complete your profile</p>*/}
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="First Name"
                    // onChange={() => {
                    //   console.log("onchange--", editprofile.first_name);
                    //   handleEditChange();
                    // }}
                    error={formErrors.first_name ? true : false}
                    helperText={formErrors.first_name}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "first_name",
                      value: editprofile.first_name,
                      onChange: (e) => handleEditChange(e),
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Last Name"
                    onChange={handleEditChange}
                    formControlProps={{
                      fullWidth: true,
                    }}
                    error={formErrors.last_name ? true : false}
                    helperText={formErrors.last_name}
                    inputProps={{
                      name: "last_name",
                      value: editprofile.last_name,
                      //onChange: { handleEditChange },
                      onChange: (e) => handleEditChange(e),
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Username"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    error={formErrors.user_name ? true : false}
                    helperText={formErrors.user_name}
                    inputProps={{
                      name: "user_name",
                      value: editprofile.user_name,
                      //onChange: { handleEditChange },
                      onChange: (e) => handleEditChange(e),
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Email address"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      disabled: true,
                      name: "email",
                      value: editprofile.email,
                      //onChange: { handleEditChange },
                      onChange: (e) => handleEditChange(e),
                    }}
                  ></CustomInput>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Hotel Name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      disabled: true,
                      name: "hotel_name",
                      value: convertStringToCamelCase(user[0].hotel_name),
                    }}
                    labelProps={{ shrink: true }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Hotel Description"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "description",
                      value: editprofile.description,
                      onChange: (e) => handleEditChange(e),
                    }}
                    labelProps={{ shrink: true }}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Mobile No."
                    formControlProps={{
                      fullWidth: true,
                    }}
                    error={formErrors.mobile_num ? true : false}
                    helperText={formErrors.mobile_num}
                    inputProps={{
                      name: "mobile_num",
                      value: editprofile.mobile_num,
                      //onChange: { handleEditChange },
                      onChange: (e) => handleEditChange(e),
                    }}
                  ></CustomInput>
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Address"
                    id="address"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    error={formErrors.address ? true : false}
                    helperText={formErrors.address}
                    inputProps={{
                      name: "address",
                      value: editprofile.address,
                      //onChange: { handleEditChange },
                      onChange: (e) => handleEditChange(e),
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            {loader ? (
              <center>
                <CircularProgress align="centre" color="primary" />
              </center>
            ) : null}
            <CardFooter>
              <Button
                color="primary"
                onClick={handleCancel}
                className="add-cancel-button"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={updateProfile}
                className="add-cancel-button"
              >
                Update Profile
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
        {/*}   <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar
              profile
              style={{
                width: "130px",
                height: "130px",
                padding: "10px",
                backgroundColor: "white",
                boxShadow:
                  "0 16px 20px -12px rgb(0 0 0 / 56%), 0 4px 25px 0px rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(0 0 0 / 20%)",
              }}
            >
              <a
                href="#pablo"
                onClick={(e) => e.preventDefault()}
                style={{ position: "relative" }}
              >
                <img
                  src={avatar}
                  alt="..."
                  style={{
                    position: "absolute",
                    width: "130px",
                    transform: "translate(-50%, 100%)",
                  }}
                />
              </a>
                </CardAvatar>
            <CardBody profile>
              {/*<h6 className={classes.cardCategory}>HamroStay</h6>
              <h4 className={classes.cardTitle}>Hotel Management App</h4>
              <p className={classes.description}>
                Don{"'"}t be scared of the truth because we need to restart the
                human foundation in truth And I love you like Kanye loves Kanye
                I love Rick Owens’ bed design but the back is...
              </p>

              <Button color="primary" round onClick={handleOpen}>
                Change Password
              </Button>
            </CardBody>
          </Card>
        </GridItem>*/}
      </GridContainer>

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
