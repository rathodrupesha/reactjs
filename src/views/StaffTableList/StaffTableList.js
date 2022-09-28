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
import CircularProgress from "@mui/material/CircularProgress";
import { TextField, Typography } from "@material-ui/core";
import Api from "Api/ApiUtils";
import { useState, useEffect } from "react";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import "../../../src/assets/css/material-dashboard-react.css";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// import ViewStaffDetails from "./ViewStaffDetails.js";
import { validateStaffData } from "./StaffValidator.js";
import Snackbar from "../../components/Snackbar/Snackbar";
import StaffTable from "components/Table/StaffTable.js";
import { AddBusinessRounded } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import { validator } from "./StaffValidator.js";
import Autocomplete from "@mui/material/Autocomplete";
import { isModuleAccesible } from "generalUtils.js";

// import DatePicker from "@mui/lab/DatePicker";
// import DateAdapter from "@mui/lab/AdapterMoment";

// for multiple category select
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
const access_criteria = "staff_management";
export default function StaffTableList(props) {
  const createStaff = {
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    address: "",
    mobile_num: "",
    service_selected: "",
    loader: false,
    password: "",
    password_confirmation: "",
    passnotmatch: false,
    state_id: "",
    country_id: "",
    city_id: "",
    currency: "",
    currency_name: "",
    currency_symbol: "",
    pincode: "",
    state: "",
    city: "",
  };

  const classes = useStyles();
  const [getStaffDataCall, setGetStaffDataCall] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [addStaff, setAddStaff] = useState(createStaff);
  const [services, setServices] = useState([]);
  const [service_selected, setService_selected] = useState([]);
  const [loader, setLoader] = React.useState(false);
  const [selected_country, setSelected_country] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formErrors, setFormErrors] = useState({
    user_name: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile_num: "",
    password: "",
    password_confirmation: "",
    address: "",
    master_service_id: "",
    pincode: "",
    city_id: "",
    state_id: "",
    country_id: "",
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

  useEffect(() => {
    countryList();
  }, []);

  const handleCountryChange = (e, value) => {
    // console.log("e--value-->", e, value);
    if (value && value.id) {
      setSelected_country(value);
      setAddStaff((prev) => ({
        ...prev,
        country: value,
        state: null,
        city: null,
      }));

      const payload = {
        country_id: value.id,
      };
      Api.statesList(payload)
        .then((res) => {
          // console.log(" list of countries", res);
          // console.log("res", res.status);
          if (res.data.status === 1) {
            //  console.log("countries--->", res.data.data.rows);
            setStates(res.data.data.rows);
          }
        })
        .catch((err) => {
          if (err && err.msg) {
            // console.log("in catch");
            // console.log(err.msg);
          }
        });
    }
  };

  const handleStateChange = (e, value) => {
    //console.log("e--value-->", e, value);
    if (value && value.id) {
      setAddStaff((prev) => ({
        ...prev,
        state: value,
        city: null,
      }));

      const payload = {
        country_id: addStaff.country.id,
        state_id: value.id,
      };
      Api.citiesList(payload)
        .then((res) => {
          // console.log(" list of countries", res);
          // console.log("res", res.status);

          if (res.data.status == 1) {
            //  console.log("countries--->", res.data.data.rows);
            setCities(res.data.data.rows);
          }
        })

        .catch((err) => {
          if (err && err.msg) {
            //  console.log("in catch");
            // console.log(err.msg);
          }
        });
    }
  };
  const handleCityChange = (e, value) => {
    // console.log("e--value-->", e, value);
    if (value && value.id) {
      setAddStaff((prev) => ({
        ...prev,
        city: value,
      }));
    }
  };

  //country list api call
  const countryList = () => {
    Api.countriesList()
      .then((res) => {
        // console.log(" list of countries", res);
        // console.log("res", res.status);

        if (res.data.status == 1) {
          // console.log("countries--->", res.data.data.rows);
          setCountries(res.data.data.rows);
        }
      })

      .catch((err) => {
        if (err && err.msg) {
          // console.log("in catch");
          // console.log(err.msg);
        }
      });
  };

  // onchange function for add user
  const handleAddStaff = (e) => {
    const { name, value } = e.target;
    setAddStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      first_name: addStaff.fname,
      last_name: addStaff.last_name,
      email: addStaff.email,
      user_name: addStaff.user_name,
      mobile_num: addStaff.mobile_num,
      password: addStaff.password,
      password_confirmation: addStaff.password_confirmation,
      address: addStaff.address,

      // master_service_id: service_selected.join(","),
      [name]: value,
    };

    let { isValid, errors } = validator(validation_object, name);
    // console.log(isValid, errors);

    setFormErrors(() => ({
      ...formErrors,
      ...errors,
    }));
    //setFormErrors(errors);
    // setFormErrors(() => ({
    //   ...formErrors,
    //   name: errors.name
    // }));
    //  console.log("formErrors", formErrors);
    return;
  };

  const handleServices = (e) => {
    const { name, value } = e.target;

    setService_selected(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // const matchPassword = (e) => {
  //   if (e.target.name === "password_confirmation") {
  //     if (e.target.value !== addStaff.password) {
  //       setAddStaff({
  //         ...addStaff,
  //         password_confirmation: e.target.value,
  //         passnotmatch: true,
  //       });
  //     } else {
  //       setAddStaff({
  //         ...addStaff,
  //         password_confirmation: e.target.value,
  //         passnotmatch: false,
  //       });
  //     }
  //   }
  // };

  const handleViewSuperOpen = () => setOpen(true);
  const handleViewSuperClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAddStaff(createStaff);
    setService_selected([]);
    setFormErrors({});
  };
  const inputStyle = { width: "320px" };
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  useEffect(() => {
    serviceList();
  }, []);
  // service lists

  const serviceList = () => {
    // console.log("service list--");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.masterServiceList(payload)
      .then((res) => {
        //  console.log(" list of service", res);
        //  console.log("res", res.status);

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
          //  console.log("in catch");
          //  console.log(err.msg);
          setAddStaff(() => ({
            ...addStaff,
            loader: false,
          }));
        }
      });
  };
  // api call for add hotel staff
  const addHotelStaff = () => {
    setLoader(true);
    setFormErrors({});
    const payload = {
      first_name: addStaff.first_name,
      last_name: addStaff.last_name,
      user_name: addStaff.user_name,
      email: addStaff.email,

      address: addStaff.address,
      mobile_num: addStaff.mobile_num,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      master_service_id: service_selected.join(","),

      role_id: 4,
      password: addStaff.password,
      password_confirmation: addStaff.password_confirmation,
      country_id: addStaff.country?.id || "",
      state_id: addStaff.state?.id || "",
      city_id: addStaff.city?.id || "",
      currency: addStaff.country?.currency || "",
      currency_name: addStaff.country?.currency_name || "",
      currency_symbol: addStaff.country?.currency_symbol || "",
      pincode: addStaff.pincode,
    };
    // console.log(payload, "payload");
    let { isValid, errors } = validateStaffData(payload);
    // console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
      return;
    }

    Api.createHotelStaff(payload)
      .then((res) => {
        setLoader(false);
        // console.log(" in then for create hotel owner");
        // console.log("rew", res.status);

        if (res.data.status == 1) {
          setLoader(false);
          setAddStaff(() => ({
            ...addStaff,
            loader: false,
          }));
          setGetStaffDataCall(true);
          setBR(true);
          setNotification({
            type: "success",
            message: "Success! Hotel Staff Added.",
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
          //   console.log("in catch");
          //  console.log(err.msg);
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          setAddStaff(() => ({
            ...addStaff,
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
          <DialogTitle id="scroll-dialog-title">Add Staff</DialogTitle>
          <DialogContent>
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
                    value: addStaff.first_name,
                    onChange: (e) => handleAddStaff(e),
                    onBlur: (e) => handleAddStaff(e),
                    maxLength: 12,
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
                    value: addStaff.last_name,
                    onBlur: (e) => handleAddStaff(e),
                    onChange: (e) => handleAddStaff(e),
                    maxLength: 12,
                  }}
                  error={formErrors.last_name ? true : false}
                  helperText={formErrors.last_name}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Email address"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    name: "email",
                    value: addStaff.email,
                    onBlur: (e) => handleAddStaff(e),
                    //onChange: { handleAddStaff },
                    onChange: (e) => handleAddStaff(e),
                  }}
                  error={formErrors.email ? true : false}
                  helperText={formErrors.email}
                />
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
                    value: addStaff.user_name,
                    onChange: (e) => handleAddStaff(e),
                    onBlur: (e) => handleAddStaff(e),
                    max: 12,
                    min: 6,
                  }}
                  helperText={formErrors.user_name}
                />
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
                    value: addStaff.password,
                    //onChange: { handleAddStaff },
                    onBlur: (e) => handleAddStaff(e),
                    onChange: (e) => handleAddStaff(e),
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
                    value: addStaff.password_confirmation,
                    //onChange: { handleAddStaff },
                    onBlur: (e) => handleAddStaff(e),
                    onChange: (e) => handleAddStaff(e),
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
                    value: addStaff.address,
                    //onChange: { handleAddStaff },
                    onChange: (e) => handleAddStaff(e),
                    onBlur: (e) => handleAddStaff(e),
                    max: 100,
                    min: 3,
                  }}
                  error={formErrors.address ? true : false}
                  helperText={formErrors.address}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <Autocomplete
                  options={countries}
                  value={addStaff.country}
                  // getOptionLabel={(option) => option.name}
                  onChange={handleCountryChange}
                  onBlur={handleCountryChange}
                  // sx={{ width: 300 }}
                  renderInput={(params) => (
                    // console.log("params---->", params),
                    <TextField {...params} label="Choose Country" />
                  )}
                />
                {formErrors.country_id ? (
                  <FormHelperText>{formErrors.country_id}</FormHelperText>
                ) : null}
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <Autocomplete
                  options={states}
                  value={addStaff.state}
                  // getOptionLabel={(option) => option.name}
                  onChange={handleStateChange}
                  // sx={{ width: 300 }}
                  renderInput={(params) => (
                    // console.log("params---->", params),
                    <TextField {...params} label="Choose State" />
                  )}
                />
                {formErrors.state_id ? (
                  <FormHelperText>{formErrors.state_id}</FormHelperText>
                ) : null}
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={4}
                // style={{ marginTop: "27px" }}
              >
                <Autocomplete
                  options={cities}
                  value={addStaff.city}
                  // getOptionLabel={(option) => option.name}
                  onChange={handleCityChange}
                  // sx={{ width: 300 }}
                  renderInput={(params) => (
                    // console.log("params---->", params),
                    <TextField
                      {...params}
                      label="Choose City"
                      // error={formErrors.city_id ? true : false}

                      // helperText="hey error"

                      // helperText={formErrors.city_id}
                    />
                  )}
                />
                {formErrors.city_id ? (
                  <FormHelperText>{formErrors.city_id}</FormHelperText>
                ) : null}
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                  labelText="Pincode"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    name: "pincode",
                    value: addStaff.pincode,
                    onChange: (e) => handleAddStaff(e),
                    onBlur: (e) => handleAddStaff(e),
                  }}
                  error={formErrors.pincode ? true : false}
                  helperText={formErrors.pincode}
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
                    value: addStaff.mobile_num,
                    //onChange: { handleAddStaff },
                    onBlur: (e) => handleAddStaff(e),
                    onChange: (e) => handleAddStaff(e),
                  }}
                  error={formErrors.mobile_num ? true : false}
                  helperText={formErrors.mobile_num}
                ></CustomInput>
              </GridItem>
              <GridItem xs={12} sm={12} md={6} style={{ marginTop: "20px" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Services
                </InputLabel>

                <Select
                  label="Service"
                  multiple
                  variant="standard"
                  value={service_selected}
                  onChange={handleServices}
                  // onBlur:{handleAddStaff(e)},
                  name="service_selected"
                  style={{ width: "100%" }}
                  renderValue={(selected) =>
                    services
                      .filter((ser) => selected.includes(ser.id))
                      .map((record) => record.name)
                      .join(", ")
                  }
                  MenuProps={MenuProps}
                >
                  {services.map((ser) =>
                    ser.name != "Directory" ? (
                      <MenuItem key={ser.id} value={ser.id}>
                        <Checkbox
                          checked={service_selected.indexOf(ser.id) > -1}
                        />

                        <ListItemText primary={ser.name} />
                      </MenuItem>
                    ) : null
                  )}
                </Select>

                {formErrors.master_service_id ? (
                  <FormHelperText>
                    {formErrors.master_service_id}
                  </FormHelperText>
                ) : null}
              </GridItem>

              {/*} <GridItem xs={12} sm={12} md={6}>
                    <InputLabel id="demo-simple-select-standard-label">
                      Service
                    </InputLabel>
                    <Select
                      label="Service"
                      value={addStaff.service_selected}
                      onChange={handleAddStaff}
                      name="service_selected"
                      style={{ width: "100%" }}
                    >
                      {services.map((service) => (
                        <MenuItem key={service.id} value={service.id}>
                          {service.name}
                        </MenuItem>
                      ))}
                    </Select>
                      </GridItem>*/}
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
              onClick={addHotelStaff}
              color="primary"
              align="centre"
              disabled={loader}
              className="add-cancel-button"
            >
              Add Staff
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
              <h4 className={classes.cardTitleWhite}>Staff List</h4>
              {isAddAccessible ? (
                <Button onClick={handleOpen} className="header-tab-btn">
                  Add Staff
                </Button>
              ) : null}
            </div>
          </CardHeader>
          <CardBody>
            <StaffTable
              getStaffDataCall={getStaffDataCall}
              setGetStaffDataCall={setGetStaffDataCall}
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
