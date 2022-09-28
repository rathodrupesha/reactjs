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
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import PackagesTable from "../../components/Table/PackagesTable.js";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { validator, validatePackageData } from "./PackageValidator.js";
import { Link } from "react-router-dom";
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
const access_criteria = "premium_service_activities_management";
export default function StaffTableList(props) {
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));

  const createPackage = {
    name: "",
    duration: "",
    duration_unit: "",
    important_notes: "",
    amount: "",
    amount_unit: user[0].currency_symbol,
  };
  const inputStyle = { width: "320px" };
  const classes = useStyles();
  const location = useLocation();
  const params = useParams();
  const [loader, setLoader] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [addPackage, setAddPackage] = useState(createPackage);
  const [getPackageDataCall, setGetPackageDataCall] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    duration: "",
    duration_unit: "",
    important_notes: "",
    amount: "",
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
  const handleAddPackages = (e) => {
    const { name, value } = e.target;
    setAddPackage((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      name: "",
      duration: "",
      duration_unit: "",
      important_notes: "",
      amount: "",
      [name]: value,
    };
    let { isValid, errors } = validator(validation_object, name);
    console.log(isValid, errors);

    setFormErrors(() => ({
      ...formErrors,
      ...errors,
    }));

    console.log("formErrors", formErrors);
    return;
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAddPackage(createPackage);
    setFormErrors({});
  };

  // api call for add hotel staff
  const addHotelPackage = () => {
    setLoader(true);
    setFormErrors({});
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      name: addPackage.name,
      duration: addPackage.duration,
      duration_unit: addPackage.duration_unit,
      important_notes: addPackage.important_notes,
      amount: addPackage.amount,
      amount_unit: addPackage.amount_unit,
      ps_id: parseInt(params.psId),
    };
    console.log(payload, "payload");
    let { isValid, errors } = validatePackageData(payload);
    console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
      return;
    }

    Api.createHotelPackage(payload)
      .then((res) => {
        setLoader(false);
        console.log(" in then for create service");
        console.log("rew", res.status);

        if (res.data.status == 1) {
          setAddPackage(() => ({
            ...addPackage,
            loader: false,
          }));
          setGetPackageDataCall(true);
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
          console.log("in catch");
          console.log(err.msg);
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          setAddPackage(() => ({
            ...addPackage,
            loader: false,
          }));
        }
      });
  };

  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
      >
        <Link to="/superadmin/premium-services">
          <span style={{ color: "rgba(0, 0, 0, 0.6)" }}>Premium Service</span>
        </Link>
        <span style={{ color: "black" }}>Packages</span>
      </Breadcrumbs>
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
            <DialogTitle id="scroll-dialog-title">Add Package</DialogTitle>
            <DialogContent>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Package Name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "name",
                      value: addPackage.name,
                      onBlur: (e) => handleAddPackages(e),
                      onChange: (e) => handleAddPackages(e),
                      // maxLength: 12,
                    }}
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
                      value: addPackage.amount,
                      onBlur: (e) => handleAddPackages(e),
                      onChange: (e) => handleAddPackages(e),
                    }}
                    error={formErrors.amount ? true : false}
                    helperText={formErrors.amount}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Unit"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      disabled: true,
                      name: "amount_unit",
                      value: addPackage.amount_unit,
                      //onChange: (e) => handleAddMenu(e),
                      //onBlur: (e) => handleAddMenu(e),
                    }}
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
                      value: addPackage.duration,
                      onBlur: (e) => handleAddPackages(e),
                      onChange: (e) => handleAddPackages(e),
                    }}
                    error={formErrors.duration ? true : false}
                    helperText={formErrors.duration}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginTop: "1.18rem" }}
                >
                  <label>Duration Unit</label>
                  <Select
                    label=" Duration Unit"
                    variant="standard"
                    value={addPackage.duration_unit}
                    onChange={handleAddPackages}
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
                    <FormHelperText>{formErrors.duration_unit}</FormHelperText>
                  ) : null}
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Important Note"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "important_notes",
                      value: addPackage.important_notes,
                      onBlur: (e) => handleAddPackages(e),
                      onChange: (e) => handleAddPackages(e),
                    }}
                    error={formErrors.important_notes ? true : false}
                    helperText={formErrors.important_notes}
                  />
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
                onClick={addHotelPackage}
                color="primary"
                align="centre"
                disabled={loader}
                className="add-cancel-button"
              >
                Add Package
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
                <h4 className={classes.cardTitleWhite}>Package List</h4>
                {isAddAccessible ? (
                  <Button onClick={handleOpen} className="header-tab-btn">
                    Add Package
                  </Button>
                ) : null}
              </div>
            </CardHeader>
            <CardBody>
              <PackagesTable
                getPackageDataCall={getPackageDataCall}
                setGetPackageDataCall={setGetPackageDataCall}
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
    </>
  );
}
