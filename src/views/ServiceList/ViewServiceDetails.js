import * as React from "react";
import Box from "@material-ui/core/Box";
import Button from "components/CustomButtons/Button.js";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import { useEffect, useState } from "react";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Api from "Api/ApiUtils.js";
import Snackbar from "../../components/Snackbar/Snackbar";
import { validateServiceData } from "./ServiceValidator.js";
import { validator } from "./ServiceValidator.js";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import { Divider } from "@material-ui/core";

export default function ViewServiceDetails(props) {
  //   const details = {
  //     name: "",
  //     last_name: "",
  //     user_name: "",
  //     email: "",
  //     address: "",
  //     mobile_num: "",
  //     loader: false,
  //     password: "",
  //     service_selected: "",
  //   };
  const [open, setOpen] = React.useState(false);
  const [services, setServices] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [viewloader, setViewLoader] = React.useState(false);

  const [getServiceDetails, setGetServiceDetails] = useState({});
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    master_ser_id: "",
  });
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleServiceDetails = (e) => {
    const { name, value } = e.target;
    setGetServiceDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      name: getServiceDetails.name,
      description: getServiceDetails.description,
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
  const [br, setBR] = useState(false);
  const handleCloseMsg = () => {
    setBR(false);
  };

  //for edit data
  useEffect(() => {
    console.log("props------->", props.serviceOpenModal);
    //showDetails();
    if (props.serviceOpenModal) {
      console.log("useEffect if");

      handleClickOpen();
    } else {
      console.log("useEffect else");
      handleClose();
    }
  }, [props.serviceOpenModal]);

  //for view details
  useEffect(() => {
    console.log("props------->", props.openDetailModal);
    //showDetails();
    if (props.openDetailModal) {
      handleClickOpen();
    } else {
      handleViewClose();
    }
  }, [props.openDetailModal]);

  const handleClickOpen = () => {
    // console.log("view super admin--->", props.serviceOpenModal);
    setOpen(true);
    showServiceDetails();
  };
  //for edit details
  const handleClose = () => {
    console.log("view super admin hndle close--->", props.setServiceOpenModal);
    props.setServiceOpenModal(false);
    props.setOpenDetailModal(false);
    setOpen(false);
    setFormErrors({});
  };
  //for view details
  const handleViewClose = () => {
    props.setOpenDetailModal(false);
    props.setServiceOpenModal(false);
    setOpen(false);
  };

  const showServiceDetails = () => {
    setViewLoader(true);
    console.log("show details api ", props.viewServiceData);
    console.log("show details api id ", props.viewServiceData.id);
    const payload = {
      hotel_id: props.viewServiceData.hotel_id,
      serviceId: props.viewServiceData.id,
    };
    Api.getServiceDetails(payload)
      .then((res) => {
        setViewLoader(false);
        console.log(res);
        if (res && res.data && res.data.data) {
          let userData = res.data.data;
          console.log("service selected-->", userData.master_service.name);
          // let staff_service =
          //   userData.staffHotelId.hotel_staff[0].current_master_service;
          setGetServiceDetails({
            serviceId: userData.id,
            name: userData.name,
            description: userData.description,
            master_ser_id: userData.master_ser_id,
            master_service: userData.master_service,
          });
        } else {
          console.log("in else");
          console.log(res.msg);

          //   setGetServiceDetails((prev) => ({
          //     ...prev,
          //     loader: false,
          //   }));
        }
      })
      .catch((err) => {
        setViewLoader(false);
        if (err) {
          console.log(err, "error----getServiceDetails");
        }
      });

    // service lists
    console.log("service list--");
    const service_payload = {
      hotel_id: props.viewServiceData.hotel_id,
    };
    Api.masterServiceList(service_payload)
      .then((res) => {
        console.log(" list of service", res);
        console.log("res", res.status);

        if (res.data.status == 1) {
          setServices(res.data.data);
        }
      })

      .catch((err) => {
        if (err && err.msg) {
          console.log("in catch");
          console.log(err.msg);
        }
      });
  };

  const editServiceDetails = () => {
    setLoader(true);
    setFormErrors({});
    const payload = {
      ...getServiceDetails,
      hotel_id: props.viewServiceData.hotel_id,
    };
    console.log("payload", payload);
    let { isValid, errors } = validateServiceData(payload);
    console.log(isValid, errors);
    if (!isValid) {
      setFormErrors(errors);
      setLoader(false);
      return;
    }
    Api.editHotelServiceDetails(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status == 1) {
          setLoader(false);
          console.log(res.data);
          props.setGetServiceDataCall(true);
          setBR(true);
          setNotification({
            type: "success",
            message: "Sub Service edited successfully!",
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
        const error = err?.message || err?.res?.message || err;

        console.log("inside catch", err?.message || err?.res?.message || err);
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
      });
  };
  // const deleteServiceDetails = () => {
  //   const payload = {
  //     hotel_id: props.viewServiceData.hotel_id,
  //     serviceId: props.viewServiceData.id,
  //   };
  //   Api.deleteHotelService(payload)
  //     .then((res) => {
  //       if (res.data.status == 1) {
  //         console.log(res.data);
  //         props.setGetServiceDataCall(true);
  //         setBR(true);
  //         setNotification({
  //           type: "success",
  //           message: "Success! Service Deleted",
  //         });
  //         handleClose();
  //       } else {
  //         setBR(true);
  //         setNotification({
  //           type: "danger",
  //           message: res.data.msg,
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       const error = err?.message || err?.res?.message || err;

  //       console.log("inside catch", err?.message || err?.res?.message || err);
  //       setBR(true);
  //       setNotification({
  //         type: "danger",
  //         message: err.msg,
  //       });
  //     });
  // };

  return (
    <React.Fragment>
      {props.serviceOpenModal ? (
        <Dialog
          disableEnforceFocus
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">Service Details</DialogTitle>
          {!viewloader ? (
            <DialogContent className="viewdetails">
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "name",
                      value: getServiceDetails.name,
                      onChange: (e) => handleServiceDetails(e),
                      onBlur: (e) => handleServiceDetails(e),
                    }}
                    labelProps={{ shrink: true }}
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
                      value: getServiceDetails.description,
                      //onChange: { handleServiceDetails },
                      onChange: (e) => handleServiceDetails(e),
                      onBlur: (e) => handleServiceDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.description ? true : false}
                    helperText={formErrors.description}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  {getServiceDetails && getServiceDetails.master_ser_id ? (
                    <>
                      <InputLabel id="demo-simple-select-standard-label">
                        Service
                      </InputLabel>

                      <Select
                        label="Service"
                        value={getServiceDetails.master_ser_id}
                        onChange={handleServiceDetails}
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
                      <FormHelperText>
                        {formErrors.master_ser_id
                          ? "Service is required"
                          : null}
                      </FormHelperText>
                    </>
                  ) : null}
                </GridItem>
              </GridContainer>
              <br />
              <br />

              {loader ? (
                <center>
                  <CircularProgress align="centre" color="primary" />
                </center>
              ) : (
                ""
              )}
              <DialogActions style={{ justifyContent: "center" }}>
                <center>
                  <Button
                    color="primary"
                    //align="centre"
                    onClick={handleClose}
                    className="add-cancel-button"
                    style={{ marginRight: "1rem" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    //align="center"
                    onClick={editServiceDetails}
                    disabled={loader}
                    className="add-cancel-button"
                  >
                    Save
                  </Button>
                </center>
              </DialogActions>
            </DialogContent>
          ) : (
            <center>
              <CircularProgress align="centre" color="primary" />
            </center>
          )}
        </Dialog>
      ) : null}
      {props.openDetailModal ? (
        <Dialog
          disableEnforceFocus
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleViewClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">Service Details</DialogTitle>
          <Divider style={{ margin: "0 1rem" }} />
          {!viewloader ? (
            <DialogContent className="viewdetails">
              <GridContainer>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">Name</InputLabel>
                  {getServiceDetails.name}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">Service</InputLabel>
                  {getServiceDetails &&
                    getServiceDetails.master_service &&
                    getServiceDetails.master_service.name}
                </GridItem>

                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Description
                  </InputLabel>
                  {getServiceDetails.description}
                </GridItem>
              </GridContainer>
              <br />
              <br />
              <DialogActions style={{ justifyContent: "center" }}>
                <center>
                  <Button
                    color="primary"
                    //align="centre"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </center>
              </DialogActions>
            </DialogContent>
          ) : (
            <center>
              <CircularProgress align="centre" color="primary" />
            </center>
          )}
        </Dialog>
      ) : null}
      <Snackbar
        place="tr"
        setBR={setBR}
        color={notification.type}
        message={notification.message}
        open={br}
        closeNotification={handleCloseMsg}
        close
      />
    </React.Fragment>
  );
}
