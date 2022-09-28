import * as React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import "../../../src/assets/css/material-dashboard-react.css";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "../../components/Snackbar/Snackbar";
import { useEffect, useState } from "react";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Api from "Api/ApiUtils.js";
import { Dialog, Divider } from "@material-ui/core";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@material-ui/core";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import SubAdminTable from "../../components/Table/SubAdminTable.js";
import { validator, validateSubAdminData } from "./validateSubAdmin";
import ModuleAccess from "./ModuleAccess";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "400",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

export default function SubAdminList(props) {
  const createSubAdmin = {
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    address: "",
    mobile_num: "",
    password: "",
    password_confirmation: "",
  };
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [addSubAdmin, setAddSubAdmin] = useState(createSubAdmin);
  const [moduleSelect, setModuleSelect] = useState(false);
  const [getSubAdminDataCall, setGetSubAdminDataCall] = useState(false);
  const [loader, setLoader] = React.useState(false);
  // structure : [{view: true, update: false, delete: false, create: false, module_id}]
  const [moduleAccess, setModuleAccess] = useState([]);

  const [formErrors, setFormErrors] = useState({
    user_name: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile_num: "",
    address: "",
    password: "",
    password_confirmation: "",
  });
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  // onchange function for add user
  const handleAddSubAdmin = (e) => {
    // setFormErrors({});
    const { name, value } = e.target;
    setAddSubAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      first_name: addSubAdmin.first_name,
      last_name: addSubAdmin.last_name,
      email: addSubAdmin.email,
      user_name: addSubAdmin.user_name,
      mobile_num: addSubAdmin.mobile_num,
      address: addSubAdmin.address,
      password: addSubAdmin.password,
      password_confirmaton: addSubAdmin.password_confirmaton,
      [name]: value,
    };
    let { isValid, errors } = validator(validation_object, name);
    //console.log(isValid, errors);

    setFormErrors(() => ({
      ...formErrors,
      ...errors,
    }));

    //console.log("formErrors", formErrors);
    return;
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAddSubAdmin(createSubAdmin);
    setFormErrors({});
    setModuleSelect(false);
  };
  const inputStyle = { width: "320px" };

  const validateOnNext = () => {
    const payload = {
      first_name: addSubAdmin.first_name,
      last_name: addSubAdmin.last_name,
      user_name: addSubAdmin.user_name,
      email: addSubAdmin.email,
      address: addSubAdmin.address,
      mobile_num: addSubAdmin.mobile_num,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      role_id: 5,
      password: addSubAdmin.password,
      password_confirmation: addSubAdmin.password_confirmation,
    };
    let { isValid, errors } = validateSubAdminData(payload);
    //  console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
    }
    return isValid;
  };

  // api call for add hotel customer
  const addHotelSubAdmin = () => {
    setLoader(true);
    // setFormErrors({});
    const payload = {
      first_name: addSubAdmin.first_name,
      last_name: addSubAdmin.last_name,
      user_name: addSubAdmin.user_name,
      email: addSubAdmin.email,
      address: addSubAdmin.address,
      mobile_num: addSubAdmin.mobile_num,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      role_id: 5,
      password: addSubAdmin.password,
      password_confirmation: addSubAdmin.password_confirmation,
      accessModule: JSON.stringify(moduleAccess),
    };
    console.log("accessmodule--->", payload.accessModule);
    if (payload.accessModule.length < 0) {
      setBR(true);

      setNotification({
        type: "danger",
        message: "Please Select Module",
      });
      return;
    }

    // console.log(payload, "payload");
    let { isValid, errors } = validateSubAdminData(payload);
    //  console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
      return;
    }

    Api.createHotelSubAdmin(payload)
      .then((res) => {
        setLoader(false);
        // console.log(" in then for create hotel owner");
        // console.log("rew", res.status);
        if (res.data.status == 1) {
          setAddSubAdmin(() => ({
            ...addSubAdmin,
            loader: false,
          }));
          setModuleSelect(true);
          setGetSubAdminDataCall(true);
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          handleClose();
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })

      .catch((err) => {
        setLoader(false);
        if (err && err.msg) {
          // console.log("in catch");
          // console.log(err.msg);
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          setAddSubAdmin(() => ({
            ...addSubAdmin,
            loader: false,
          }));
        }
      });
  };

  return (
    <GridContainer style={{ padding: "0px 15px !important" }}>
      <GridItem xs={12} sm={12} md={12}>
        <Dialog
          fullWidth={true}
          maxWidth="md"
          open={open}
          onClose={handleClose}
          // aria-labelledby="modal-modal-title"
          // aria-describedby="modal-modal-description"
          // className="createCustomer"
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">
            {!moduleSelect ? "Add Sub Admin" : "Module Access Permission"}
          </DialogTitle>
          <Divider />
          <DialogContent>
            {!moduleSelect ? (
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="First Name"
                    formControlProps={{
                      fullWidth: true,
                      // helperText: formErrors.user_name || "",
                    }}
                    error={formErrors.first_name ? true : false}
                    inputProps={{
                      name: "first_name",
                      value: addSubAdmin.first_name,
                      onChange: (e) => handleAddSubAdmin(e),
                      onBlur: (e) => handleAddSubAdmin(e),
                      // maxLength: 12,
                    }}
                    helperText={formErrors.first_name}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Last Name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "last_name",
                      value: addSubAdmin.last_name,
                      //onChange: { handleAddSubAdmin },
                      onChange: (e) => handleAddSubAdmin(e),
                      onBlur: (e) => handleAddSubAdmin(e),

                      // maxLength: 12,
                    }}
                    error={formErrors.last_name ? true : false}
                    helperText={formErrors.last_name}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Mobile No."
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "mobile_num",
                      value: addSubAdmin.mobile_num,
                      //onChange: { handleAddSubAdmin },
                      onChange: (e) => handleAddSubAdmin(e),
                      onBlur: (e) => handleAddSubAdmin(e),
                      // maxLength: 13,
                    }}
                    error={formErrors.mobile_num ? true : false}
                    helperText={formErrors.mobile_num}
                  ></CustomInput>
                </GridItem>

                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="User Name"
                    formControlProps={{
                      fullWidth: true,
                      // helperText: formErrors.user_name || "",
                    }}
                    error={formErrors.user_name ? true : false}
                    inputProps={{
                      name: "user_name",
                      value: addSubAdmin.user_name,
                      onChange: (e) => handleAddSubAdmin(e),
                      onBlur: (e) => handleAddSubAdmin(e),

                      // max: 12,
                      // min: 6,
                    }}
                    helperText={formErrors.user_name}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Email address"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "email",
                      value: addSubAdmin.email,

                      //onChange: { handleAddSubAdmin },
                      onChange: (e) => handleAddSubAdmin(e),
                      onBlur: (e) => handleAddSubAdmin(e),
                    }}
                    error={formErrors.email ? true : false}
                    helperText={formErrors.email}
                  ></CustomInput>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Enter Password"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "password",
                      // type: "password",
                      value: addSubAdmin.password,
                      //onChange: { handleAddSubAdmin },
                      onChange: (e) => handleAddSubAdmin(e),
                      onBlur: (e) => handleAddSubAdmin(e),
                      max: 12,
                      min: 6,
                    }}
                    error={formErrors.password ? true : false}
                    helperText={formErrors.password}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Confirm Password"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "password_confirmation",
                      // type: "password",
                      value: addSubAdmin.password_confirmation,
                      //onChange: { handleAddSubAdmin },
                      onChange: (e) => handleAddSubAdmin(e),
                      onBlur: (e) => handleAddSubAdmin(e),
                    }}
                    error={formErrors.password_confirmation ? true : false}
                    helperText={formErrors.password_confirmation}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Address"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "address",
                      value: addSubAdmin.address,
                      //onChange: { handleAddSubAdmin },
                      onChange: (e) => handleAddSubAdmin(e),
                      onBlur: (e) => handleAddSubAdmin(e),

                      // max: 100,
                      // min: 3,
                    }}
                    error={formErrors.address ? true : false}
                    helperText={formErrors.address}
                  />
                </GridItem>
              </GridContainer>
            ) : (
              <ModuleAccess
                moduleAccess={moduleAccess}
                setModuleAccess={setModuleAccess}
              />
            )}
          </DialogContent>
          {loader ? (
            <center>
              <CircularProgress align="centre" color="primary" />
            </center>
          ) : (
            ""
          )}
          <DialogActions style={{ justifyContent: "center" }}>
            {moduleSelect ? (
              <Button
                onClick={() => setModuleSelect(false)}
                color="primary"
                align="centre"
                disabled={loader}
                className="add-cancel-button"
              >
                Back
              </Button>
            ) : null}
            <Button
              onClick={
                moduleSelect
                  ? () => addHotelSubAdmin()
                  : () => {
                      if (validateOnNext()) {
                        setModuleSelect(true);
                      }
                    }
              }
              color="primary"
              align="centre"
              disabled={loader}
              className="add-cancel-button"
            >
              {moduleSelect ? "Add Sub Admin" : "Next"}
            </Button>

            <Button
              onClick={handleClose}
              color="primary"
              align="centre"
              style={{ marginLeft: "10px" }}
              className="add-cancel-button"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Card>
          <CardHeader color="primary">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4 className={classes.cardTitleWhite}>Sub Admin List</h4>

              <Button onClick={handleOpen} className="header-tab-btn">
                Add Sub Admin
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <SubAdminTable
              getSubAdminDataCall={getSubAdminDataCall}
              setGetSubAdminDataCall={setGetSubAdminDataCall}
            />
          </CardBody>
        </Card>
      </GridItem>

      <Snackbar
        place="tr"
        setBR={setBR}
        color={notification.type}
        message={notification.message}
        open={br}
        closeNotification={handleCloseMsg}
        close
      />
    </GridContainer>
  );
}
