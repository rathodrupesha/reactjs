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
import { useEffect, useState } from "react";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Api from "Api/ApiUtils.js";
import { validator, validateSubAdminData } from "./validateSubAdmin";
import Snackbar from "../../components/Snackbar/Snackbar";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import Autocomplete from "@mui/material/Autocomplete";

import CircularProgress from "@mui/material/CircularProgress";
import ModuleAccess from "./ModuleAccess.js";
import { Divider } from "@material-ui/core";

export default function ViewSubAdminDetails(props) {
  const [open, setOpen] = React.useState(false);

  const [loader, setLoader] = React.useState(false);
  const [viewloader, setViewLoader] = React.useState(false);
  const [editModuleSelect, setEditModuleSelect] = useState(false);
  const [viewModuleSelect, setViewModuleSelect] = useState(false);
  const [getSubAdminDetails, setGetSubAdminDetails] = useState({});

  let moduleDetails = [];

  const [editModuleAccess, setEditModuleAccess] = useState([]);
  const [formErrors, setFormErrors] = useState({
    user_name: "",
    first_name: "",
    last_name: "",
    mobile_num: "",
    address: "",
  });
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleSubAdminDetails = (e) => {
    const { name, value } = e.target;
    setGetSubAdminDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      first_name: getSubAdminDetails.first_name,
      last_name: getSubAdminDetails.last_name,
      user_name: getSubAdminDetails.user_name,
      mobile_num: getSubAdminDetails.mobile_num,
      address: getSubAdminDetails.address,

      [name]: value,
    };

    let { isValid, errors } = validator(validation_object, name);
    //  console.log(isValid, errors);

    setFormErrors(() => ({
      ...formErrors,
      ...errors,
    }));

    return;
  };

  const [br, setBR] = useState(false);
  const handleCloseMsg = () => {
    setBR(false);
  };

  //for edit data
  useEffect(() => {
    //console.log("props------->", props.subAdminOpenModal);
    //showDetails();
    if (props.subAdminOpenModal) {
      // console.log("useEffect if");

      handleClickOpen();
    } else {
      // console.log("useEffect else");
      handleClose();
    }
  }, [props.subAdminOpenModal]);

  //for view details
  useEffect(() => {
    // console.log("props------->", props.openDetailModal);
    //showDetails();
    if (props.openDetailModal) {
      handleClickOpen();
    } else {
      handleViewClose();
    }
  }, [props.openDetailModal]);

  const handleClickOpen = () => {
    //console.log("view super admin--->", props.subAdminOpenModal);
    setOpen(true);
    showDetails();
  };

  //for edit details
  const handleClose = () => {
    // console.log("view super admin hndle close--->", props.setSubAdminOpenModal);
    props.setSubAdminOpenModal(false);
    setOpen(false);
    setFormErrors({});
    setEditModuleSelect(false);
    setGetSubAdminDetails({});
  };
  //for view details
  const handleViewClose = () => {
    props.setOpenDetailModal(false);
    setOpen(false);
    setViewModuleSelect(false);
    setEditModuleSelect(false);
  };

  const showDetails = () => {
    moduleDetails = [];
    setViewLoader(true);
    const payload = {
      hotel_id: props.viewSubAdminData.hotel_id,
      subAdmin_Id: props.viewSubAdminData.user_id,
    };
    Api.subAdminProfileDetails(payload)
      .then((res) => {
        setViewLoader(false);
        console.log(res);
        if (res && res.data && res.data.data) {
          let userData = res.data.data;

          res.data.data.module_access.map((mod) => {
            moduleDetails.push({
              access_module: mod.accessModule,
              create: mod.create,
              view: mod.view,
              delete: mod.delete,
              module_id: mod.module_id,
              update: mod.update,
              user_id: mod.user_id,
            });
          });

          // setEditModuleAccess(res.data.data.module_access);

          setEditModuleAccess(moduleDetails);
          setGetSubAdminDetails({
            first_name: userData.first_name,
            last_name: userData.last_name,
            user_name: userData.user_name,
            email: userData.email,
            address: userData.address,
            mobile_num: userData.mobile_num,
          });
          setViewModuleSelect(true);
        } else {
          console.log("in else");
          console.log(res.msg);
          setGetSubAdminDetails((prev) => ({
            ...prev,
            loader: false,
          }));
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })
      .catch((err) => {
        setViewLoader(false);
        if (err && err.msg) {
          console.log(err, "error----getServiceDetails");
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
        }
      });
  };

  const editSubAdminDetails = () => {
    setLoader(true);
    setFormErrors({});
    const payload = {
      ...getSubAdminDetails,
      hotel_id: props.viewSubAdminData.hotel_id,
      subAdmin_Id: props.viewSubAdminData.user_id,
      accessModule: JSON.stringify(editModuleAccess),
      password: "123456",
      password_confirmation: "123456",
    };

    // console.log("payload", payload);
    let { isValid, errors } = validateSubAdminData(payload);
    // console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
      return;
    }
    Api.editHotelSubAdminDetails(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status == 1) {
          // console.log(res.data);
          setLoader(false);
          setEditModuleSelect(true);
          props.setGetSubAdminDataCall(true);
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          handleClose();
        } else {
          setLoader(false);
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })
      .catch((err) => {
        const error = err?.message || err?.res?.message || err;

        // console.log("inside catch", err?.message || err?.res?.message || err);
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
      });
  };

  return (
    <React.Fragment>
      {props.subAdminOpenModal ? (
        <Dialog
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">
            {!editModuleSelect
              ? "Edit Sub Admin Details"
              : "Edit Module Access Permission"}
          </DialogTitle>
          <Divider style={{ margin: "0rem 0.75rem" }} />
          {!viewloader ? (
            <DialogContent className="viewdetails">
              {!editModuleSelect ? (
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="First Name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: "first_name",
                        value: getSubAdminDetails.first_name,
                        onChange: (e) => handleSubAdminDetails(e),
                        onBlur: (e) => handleSubAdminDetails(e),
                      }}
                      labelProps={{ shrink: true }}
                      error={formErrors.first_name ? true : false}
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
                        value: getSubAdminDetails.last_name,
                        //onChange: { handleSubAdminDetails },
                        onChange: (e) => handleSubAdminDetails(e),
                        onBlur: (e) => handleSubAdminDetails(e),
                      }}
                      labelProps={{ shrink: true }}
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
                        value: getSubAdminDetails.mobile_num,
                        onBlur: (e) => handleSubAdminDetails(e),
                        onChange: (e) => handleSubAdminDetails(e),
                      }}
                      labelProps={{ shrink: true }}
                      error={formErrors.mobile_num ? true : false}
                      helperText={formErrors.mobile_num}
                    ></CustomInput>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Username"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        disabled: true,
                        name: "user_name",
                        value: getSubAdminDetails.user_name,
                        onChange: (e) => handleSubAdminDetails(e),
                      }}
                      labelProps={{ shrink: true }}
                      error={formErrors.user_name ? true : false}
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
                        disabled: true,
                        name: "email",
                        value: getSubAdminDetails.email,

                        //onChange: { handleSubAdminDetails },
                        onChange: (e) => handleSubAdminDetails(e),
                      }}
                      labelProps={{ shrink: true }}
                    ></CustomInput>
                  </GridItem>

                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Address"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: "address",
                        value: getSubAdminDetails.address,
                        onBlur: (e) => handleSubAdminDetails(e),
                        //onChange: { handleSubAdminDetails },
                        onChange: (e) => handleSubAdminDetails(e),
                      }}
                      labelProps={{ shrink: true }}
                      error={formErrors.address ? true : false}
                      helperText={formErrors.address}
                    />
                  </GridItem>
                </GridContainer>
              ) : (
                <ModuleAccess
                  editModuleSelect={editModuleSelect}
                  moduleAccess={editModuleAccess}
                  setModuleAccess={setEditModuleAccess}
                />
              )}

              {loader ? (
                <center>
                  <CircularProgress align="centre" color="primary" />
                </center>
              ) : (
                ""
              )}
              <DialogActions style={{ justifyContent: "center" }}>
                <center>
                  {editModuleSelect ? (
                    <Button
                      onClick={() => setEditModuleSelect(false)}
                      color="primary"
                      align="centre"
                      disabled={loader}
                      className="add-cancel-button"
                    >
                      Back
                    </Button>
                  ) : null}
                  {getSubAdminDetails.first_name &&
                  getSubAdminDetails.last_name &&
                  getSubAdminDetails.mobile_num &&
                  getSubAdminDetails.address ? (
                    <Button
                      color="primary"
                      //align="center"

                      onClick={
                        editModuleSelect
                          ? () => editSubAdminDetails()
                          : () => setEditModuleSelect(true)
                      }
                      disabled={loader}
                      className="add-cancel-button"
                    >
                      {editModuleSelect ? "Save" : "Next"}
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      //align="center"

                      // onClick={
                      //   editModuleSelect
                      //     ? () => editSubAdminDetails()
                      //     : () => setEditModuleSelect(true)
                      // }
                      disabled
                    >
                      Next
                    </Button>
                  )}

                  <Button
                    color="primary"
                    //align="centre"
                    onClick={handleClose}
                    className="add-cancel-button"
                  >
                    Cancel
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
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleViewClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">Sub Admin Details</DialogTitle>
          <Divider style={{ margin: "0rem 1rem" }} />

          {!viewloader ? (
            <DialogContent className="viewdetails">
              {!editModuleSelect ? (
                <GridContainer>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ marginTop: "25px" }}
                  >
                    <InputLabel className="View-details-page">
                      First Name
                    </InputLabel>
                    {getSubAdminDetails.first_name}
                  </GridItem>

                  <GridItem
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ marginTop: "25px" }}
                  >
                    <InputLabel className="View-details-page">
                      Last Name
                    </InputLabel>
                    {getSubAdminDetails.last_name}
                  </GridItem>

                  <GridItem
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ marginTop: "25px" }}
                  >
                    <InputLabel className="View-details-page">
                      Username
                    </InputLabel>
                    {getSubAdminDetails.user_name}
                  </GridItem>

                  <GridItem
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ marginTop: "25px" }}
                  >
                    <InputLabel className="View-details-page">
                      Email address
                    </InputLabel>
                    {getSubAdminDetails.email}
                  </GridItem>

                  <GridItem
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ marginTop: "25px" }}
                  >
                    <InputLabel className="View-details-page">
                      Address
                    </InputLabel>
                    {getSubAdminDetails.address}
                  </GridItem>

                  <GridItem
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ marginTop: "25px" }}
                  >
                    <InputLabel className="View-details-page">
                      Mobile Number
                    </InputLabel>
                    {getSubAdminDetails.mobile_num}
                  </GridItem>
                </GridContainer>
              ) : (
                <ModuleAccess
                  editModuleSelect={editModuleSelect}
                  moduleAccess={editModuleAccess}
                  setModuleAccess={setEditModuleAccess}
                  viewOnly={true}
                />
              )}
              <br />
              <br />
              <DialogActions style={{ justifyContent: "center" }}>
                <center>
                  {viewModuleSelect ? (
                    <Button
                      color="primary"
                      //align="centre"
                      onClick={
                        editModuleSelect
                          ? () => setEditModuleSelect(false)
                          : () => setEditModuleSelect(true)
                      }
                      className="add-cancel-button"
                    >
                      {editModuleSelect ? "Back" : "View Module Access"}
                    </Button>
                  ) : null}
                  <Button
                    color="primary"
                    style={{ marginLeft: "10px" }}
                    //align="centre"
                    onClick={handleViewClose}
                    className="add-cancel-button"
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
