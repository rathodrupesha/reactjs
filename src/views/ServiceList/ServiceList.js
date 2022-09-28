import React, { useMemo } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Modal from "@material-ui/core/Modal";
import { Dialog } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { TextField, Typography } from "@material-ui/core";
import Api from "Api/ApiUtils";
import { useState, useEffect } from "react";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import "../../../src/assets/css/material-dashboard-react.css";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "../../components/Snackbar/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import ServiceTable from "../../components/Table/ServiceTable.js";
import { validateServiceData } from "./ServiceValidator.js";
import { validator } from "./ServiceValidator.js";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import { isModuleAccesible } from "generalUtils.js";

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
const access_criteria = "service_management";
export default function ServiceTableList(props) {
  const createService = {
    name: "",
    description: "",
    master_ser_id: "",
    loader: false,
  };
  const inputStyle = { width: "320px" };
  const classes = useStyles();
  const [loader, setLoader] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [addService, setAddService] = useState(createService);
  const [services, setServices] = useState([]);
  const [getServiceDataCall, setGetServiceDataCall] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    master_ser_id: "",
  });
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  const isAddAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "create"),
    []
  );

  // onchange function for add user
  const handleAddService = (e) => {
    const { name, value } = e.target;
    setAddService((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      name: addService.name,
      description: addService.description,
      [name]: value,
    };
    let { isValid, errors } = validator(validation_object, name);
    console.log(isValid, errors);

    setFormErrors(() => ({
      ...formErrors,
      ...errors,
    }));
    //setFormErrors(errors);
    // setFormErrors(() => ({
    //   ...formErrors,
    //   name: errors.name
    // }));
    console.log("formErrors", formErrors);
    return;
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAddService(createService);
    setFormErrors({});
  };

  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));

  useEffect(() => {
    serviceList();
  }, []);

  // service lists

  const serviceList = () => {
    console.log("service list--");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.masterServiceList(payload)
      .then((res) => {
        console.log(" list of service", res);
        console.log("res", res.status);

        if (res.data.status == 1) {
          setServices(res.data.data);
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })

      .catch((err) => {
        if (err && err.msg) {
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          console.log("in catch");
          console.log(err.msg);
        }
      });
  };
  // api call for add hotel staff
  const addHotelService = () => {
    setLoader(true);
    setFormErrors({});
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      name: addService.name,
      description: addService.description,
      master_ser_id: addService.master_ser_id,
    };
    console.log(payload, "payload");
    let { isValid, errors } = validateServiceData(payload);
    console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
      return;
    }

    Api.createHotelService(payload)
      .then((res) => {
        setLoader(false);
        console.log(" in then for create service");
        console.log("rew", res.status);

        if (res.data.status == 1) {
          setAddService(() => ({
            ...addService,
            loader: false,
          }));
          setGetServiceDataCall(true);
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
        if (err && err.msg) {
          console.log("in catch");
          console.log(err.msg);
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          setAddService(() => ({
            ...addService,
            loader: false,
          }));
        }
      });
  };

  return (
    <GridContainer style={{ padding: "0px 15px !important" }}>
      <GridItem xs={12} sm={12} md={12}>
        <Dialog
          disableEnforceFocus
          fullWidth={true}
          maxWidth="md"
          open={open}
          onClose={handleClose}
          // aria-labelledby="modal-modal-title"
          // aria-describedby="modal-modal-description"
          // className="createCustomer"
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">Add Service</DialogTitle>
          <DialogContent>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                  labelText="Service Name"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    name: "name",
                    value: addService.name,
                    onBlur: (e) => handleAddService(e),
                    onChange: (e) => handleAddService(e),
                    // maxLength: 12,
                  }}
                  error={formErrors.name ? true : false}
                  helperText={formErrors.name}
                />
              </GridItem>

              <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                  labelText="Description"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    name: "description",
                    value: addService.description,
                    onBlur: (e) => handleAddService(e),
                    onChange: (e) => handleAddService(e),
                  }}
                  error={formErrors.description ? true : false}
                  helperText={formErrors.description}
                />
              </GridItem>

              <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Service
                </InputLabel>
                <Select
                  placeholder="Service"
                  label="Service"
                  variant="standard"
                  value={addService.master_ser_id}
                  onChange={handleAddService}
                  name="master_ser_id"
                  style={{ width: "100%" }}
                >
                  {/*} {services.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.name}
                        </MenuItem>
                     ))}*/}
                  <MenuItem key={1} value={1}>
                    Front Desk
                  </MenuItem>
                  <MenuItem key={2} value={2}>
                    House Keeping
                  </MenuItem>
                </Select>
                {formErrors.master_ser_id ? (
                  <FormHelperText>{formErrors.master_ser_id}</FormHelperText>
                ) : null}
              </GridItem>
            </GridContainer>
          </DialogContent>

          {loader ? (
            <center>
              <CircularProgress align="centre" color="primary" />
            </center>
          ) : (
            ""
          )}
          <DialogActions style={{ justifyContent: "center" }}>
            <Button
              onClick={handleClose}
              color="primary"
              align="centre"
              className="add-cancel-button"
            >
              Cancel
            </Button>
            <Button
              onClick={addHotelService}
              color="primary"
              align="centre"
              disabled={loader}
              className="add-cancel-button"
            >
              Add Service
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
              <h4 className={classes.cardTitleWhite}>Service List</h4>
              {isAddAccessible ? (
                <Button onClick={handleOpen} className="header-tab-btn">
                  Add Service
                </Button>
              ) : null}
            </div>
          </CardHeader>
          <CardBody>
            <ServiceTable
              getServiceDataCall={getServiceDataCall}
              setGetServiceDataCall={setGetServiceDataCall}
              accessCriteria={access_criteria}
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
