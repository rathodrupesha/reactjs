import * as React from "react";
import Box from "@material-ui/core/Box";
import Button from "components/CustomButtons/Button.js";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
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
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { validator, validatePackageData } from "./PackageValidator.js";
import FormHelperText from "@mui/material/FormHelperText";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { Divider } from "@material-ui/core";

export default function ViewMenuDetails(props) {
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const params = useParams();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [viewloader, setViewLoader] = React.useState(false);
  const [getPackageDetails, setGetPackageDetails] = useState({});
  const [formErrors, setFormErrors] = useState({
    name: "",
    duration: "",
    duration_unit: "",
    important_notes: "",
    amount: "",
  });
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handlePackageDetails = (e) => {
    const { name, value } = e.target;
    setGetPackageDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      name: getPackageDetails.name,
      amount: getPackageDetails.amount,
      duration: getPackageDetails.duration,
      duration_unit: getPackageDetails.duration_unit,
      important_notes: getPackageDetails.important_notes,
      [name]: value,
    };
    let { isValid, errors } = validator(validation_object, name);
    console.log(isValid, errors);

    setFormErrors(() => ({
      ...formErrors,
      ...errors,
    }));

    // console.log("formErrors", formErrors);
    return;
  };
  const [br, setBR] = useState(false);
  const handleCloseMsg = () => {
    setBR(false);
  };

  //for edit data
  useEffect(() => {
    console.log("props------->", props.packageOpenModal);

    if (props.packageOpenModal) {
      console.log("useEffect if");

      handleClickOpen();
    } else {
      console.log("useEffect else");
      handleClose();
    }
  }, [props.packageOpenModal]);

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
    // console.log("view super admin--->", props.packageOpenModal);
    setOpen(true);
    showDetails();
  };

  //for edit details
  const handleClose = () => {
    // console.log("view super admin hndle close--->", props.setPackageOpenModal);
    props.setPackageOpenModal(false);
    setOpen(false);
    setFormErrors({});
  };
  //for view details
  const handleViewClose = () => {
    props.setOpenDetailModal(false);
    setOpen(false);
  };

  //   useEffect(() => {
  //     console.log("props.viewMenu--->", props.viewPackageData);
  //   }, [props.viewPackageData]);

  const showDetails = () => {
    setViewLoader(true);
    console.log("menu details", props.viewPackageData);
    // console.log("menu details meal id ", props.viewPackageData.id);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      packagesId: props.viewPackageData.id,
    };
    Api.showPackageDetails(payload)
      .then((res) => {
        setViewLoader(false);
        console.log(res);
        if (res && res.data && res.data.data) {
          console.log("response menu details--->", res.data.data);
          let packageData = res.data.data;

          setGetPackageDetails({
            packagesId: packageData.id,
            name: packageData.name,
            amount: packageData.amount,
            amount_unit: user[0].currency_symbol,
            duration: packageData.duration,
            duration_unit: packageData.duration_unit,
            important_notes: packageData.important_notes,
          });
        } else {
          console.log("in else");
          console.log(res.msg);
        }
      })
      .catch((err) => {
        setViewLoader(false);
        if (err) {
          console.log(err, "error----getPackageDetails");
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
        }
      });
  };

  const editPackageDetails = () => {
    setLoader(true);
    setFormErrors({});
    const payload = {
      ...getPackageDetails,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      ps_id: parseInt(params.psId),
    };

    console.log("payload", payload);
    let { isValid, errors } = validatePackageData(payload);
    console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
      return;
    }
    Api.editHotelPackageDetails(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status == 1) {
          setLoader(false);
          console.log(res.data);
          props.setGetPackageDataCall(true);
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
        const error = err?.message || err?.res?.message || err;

        console.log("inside catch", err?.message || err?.res?.message || err);
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
      });
  };

  return (
    <React.Fragment>
      {props.packageOpenModal ? (
        <Dialog
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleClose}
          className="viewdetailsDialog"
        >
          <DialogTitle>Package Details</DialogTitle>
          <Divider
            style={{
              margin: "0rem 0.75rem",
            }}
          />
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
                      value: getPackageDetails.name,
                      onChange: (e) => handlePackageDetails(e),
                      onBlur: (e) => handlePackageDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.name ? true : false}
                    helperText={formErrors.name}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Amount"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "amount",
                      value: getPackageDetails.amount,
                      //onChange: { handlePackageDetails },
                      onChange: (e) => handlePackageDetails(e),
                      onBlur: (e) => handlePackageDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.amount ? true : false}
                    helperText={formErrors.amount}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Amount Unit"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      disabled: true,
                      name: "amount_unit",
                      value: getPackageDetails.amount_unit,
                      // onChange: (e) => handlePackageDetails(e),
                      // onBlur: (e) => handlePackageDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    // error={formErrors.unit ? true : false}
                    // helperText={formErrors.unit}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Duration"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "duration",
                      value: getPackageDetails.duration,
                      //onChange: { handlePackageDetails },
                      onChange: (e) => handlePackageDetails(e),
                      onBlur: (e) => handlePackageDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.duration ? true : false}
                    helperText={formErrors.duration}
                  ></CustomInput>
                </GridItem>

                {getPackageDetails.duration_unit ? (
                  <GridItem
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ marginTop: "1.18rem" }}
                  >
                    <label>Duration Unit</label>
                    <Select
                      label="Duration Unit"
                      variant="standard"
                      value={getPackageDetails.duration_unit}
                      onChange={handlePackageDetails}
                      name="duration_unit"
                      style={{ width: "100%" }}
                    >
                      <MenuItem key={1} value="hours">
                        Hours
                      </MenuItem>
                      <MenuItem key={2} value="minutes">
                        Minutes
                      </MenuItem>
                      <MenuItem key={3} value="seconds">
                        Seconds
                      </MenuItem>
                    </Select>
                    {formErrors.duration_unit ? (
                      <FormHelperText>
                        {formErrors.duration_unit}
                      </FormHelperText>
                    ) : null}
                  </GridItem>
                ) : null}

                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Important Note"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "important_notes",
                      value: getPackageDetails.important_notes,
                      //onChange: { handlePackageDetails },
                      onChange: (e) => handlePackageDetails(e),
                      onBlur: (e) => handlePackageDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.important_notes ? true : false}
                    helperText={formErrors.important_notes}
                  />
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
                    onClick={editPackageDetails}
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
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleViewClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">Package Details</DialogTitle>
          <Divider style={{ margin: "0rem 1.5rem" }} />
          {!viewloader ? (
            <DialogContent className="viewdetails">
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Package Name
                  </InputLabel>
                  {getPackageDetails.name}
                </GridItem>

                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">Amount</InputLabel>
                  {props.viewPackageData.total_amountUnit}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Duration
                  </InputLabel>
                  {console.log("Get menu Details", getPackageDetails)}
                  {props.viewPackageData.total_durationUnit}
                </GridItem>

                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Important Notes
                  </InputLabel>
                  {getPackageDetails.important_notes}
                </GridItem>
              </GridContainer>
              <br />
              <br />
              <DialogActions style={{ justifyContent: "center" }}>
                <center>
                  <Button
                    color="primary"
                    //align="centre"
                    onClick={handleViewClose}
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
