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
import { validateStaffData } from "./StaffValidator.js";
import Snackbar from "../../components/Snackbar/Snackbar";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import { validator } from "./StaffValidator.js";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@material-ui/core";
import CircularProgress from "@mui/material/CircularProgress";

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

export default function ViewStaffDetails(props) {
  const [open, setOpen] = React.useState(false);
  const [services, setServices] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [viewloader, setViewLoader] = React.useState(false);
  const [services_selected, setServices_selected] = useState([]);

  useEffect(() => {
    //console.log(services_selected);
  }, [services_selected]);

  let staff_details = [];
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [getStaffDetails, setGetStaffDetails] = useState({
    country: null,
    state: null,
    city: null,
  });
  const [formErrors, setFormErrors] = useState({
    user_name: "",
    first_name: "",
    last_name: "",
    mobile_num: "",
    address: "",
    master_service_id: "",
    pincode: "",
    city_id: "",
    state_id: "",
    country_id: "",
  });
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleStaffDetails = (e) => {
    const { name, value } = e.target;
    setGetStaffDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      first_name: getStaffDetails.first_name,
      last_name: getStaffDetails.last_name,

      user_name: getStaffDetails.user_name,
      mobile_num: getStaffDetails.mobile_num,

      address: getStaffDetails.address,
      pincode: getStaffDetails.pincode,
      // master_service_id: service_selected.join(","),
      [name]: value,
    };

    let { isValid, errors } = validator(validation_object, name);
    //  console.log(isValid, errors);

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
    setServices_selected(e.target.value);
  };
  const [br, setBR] = useState(false);
  const handleCloseMsg = () => {
    setBR(false);
  };

  // useEffect(() => {
  //   console.log("props------->", props.staffOpenModal);
  //   //showDetails();
  //   if (props.staffOpenModal) {
  //     console.log("useEffect if");

  //     handleClickOpen();
  //   } else {
  //     console.log("useEffect else");
  //     handleClose();
  //   }
  // }, [props.staffOpenModal]);

  //for edit data
  useEffect(() => {
    //console.log("props------->", props.staffOpenModal);
    //showDetails();
    if (props.staffOpenModal) {
      // console.log("useEffect if");

      handleClickOpen();
    } else {
      // console.log("useEffect else");
      handleClose();
    }
  }, [props.staffOpenModal]);

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
    //console.log("view super admin--->", props.staffOpenModal);
    setOpen(true);
    showDetails();
  };

  //for edit details
  const handleClose = () => {
    // console.log("view super admin hndle close--->", props.setStaffOpenModal);
    props.setStaffOpenModal(false);
    setOpen(false);
    setFormErrors({});
  };
  //for view details
  const handleViewClose = () => {
    props.setOpenDetailModal(false);
    setOpen(false);
  };

  const showDetails = async () => {
    setViewLoader(true);
    // console.log("show details api ", props.viewStaffData);
    // console.log("show details api id ", props.viewStaffData.user_id);
    const payload = {
      hotel_id: props.viewStaffData.hotel_id,
    };
    let countryId = null,
      stateId = null;
    try {
      const res = await Api.showStaffDetails(
        props.viewStaffData.user_id,
        payload
      );
      setViewLoader(false);

      if (res && res.data && res.data.data) {
        let userData = res.data.data;
        // console.log(userData);
        let staff_services_selected = userData.staffHotelId.hotel_staff.map(
          (si) => si.current_master_service.id
        );
        //  console.log("----->", staff_services_selected);
        countryId = userData.country?.id || null;
        stateId = userData.state?.id || null;

        setGetStaffDetails({
          first_name: userData.first_name,
          last_name: userData.last_name,
          user_name: userData.user_name,
          email: userData.email,
          address: userData.address,
          mobile_num: userData.mobile_num,
          country: userData.country ? userData.country : null,
          state: userData.state ? userData.state : null,
          city: userData.city ? userData.city : null,
          pincode: userData.pincode,
          services: userData.staffHotelId.hotel_staff.map(
            (si) => si.current_master_service.name
          ),
        });
        setServices_selected(staff_services_selected);
        // console.log("getStaffDetails", getStaffDetails);
      } else {
        // console.log("in else");
        //  console.log(res.data.msg);
        setBR(true);
        setNotification({
          type: "danger",
          message: res.data.msg,
        });
        setGetStaffDetails((prev) => ({
          ...prev,
          loader: false,
        }));
      }
      // country api
      const countriesResponse = await Api.countriesList();
      if (countriesResponse.data.status === 1) {
        setCountries(countriesResponse.data.data.rows);
      }
      if (countryId) {
        const statesResponse = await Api.statesList({
          country_id: countryId,
        });
        if (statesResponse.data.status === 1) {
          setStates(statesResponse.data.data.rows);
        }
      }
      if (stateId) {
        const citiesResponse = await Api.citiesList({
          country_id: countryId,
          state_id: stateId,
        });
        if (citiesResponse.data.status === 1) {
          setCities(citiesResponse.data.data.rows);
        }
      }

      // service lists

      const servicesResponse = await Api.masterServiceList(payload);
      if (servicesResponse.data.status == 1) {
        setServices(servicesResponse.data.data);
        // console.log("<<-->>", servicesResponse.data.data);
      }
    } catch (err) {
      setViewLoader(false);
      console.error(err);
      setBR(true);
      setNotification({
        type: "danger",
        message: err.msg,
      });
    }
  };
  //country change
  const handleCountryChange = (e, value) => {
    //console.log("e--value-->", e, value);
    if (value && value.id) {
      setGetStaffDetails((prev) => ({
        ...prev,
        country: value,
        state: null,
        city: null,
      }));
      // setValue(newvalue);

      const payload = {
        country_id: value.id,
      };
      // getStaffDetails.country.id = value.id;
      Api.statesList(payload)
        .then((res) => {
          // console.log(" list of countries", res);
          // console.log("res", res.status);
          if (res.data.status == 1) {
            // console.log("countries--->", res.data.data.rows);
            setStates(res.data.data.rows);
            // setStateValue(res.data.data.rows[0]);
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
            //   console.log("in catch");
            //   console.log(err.msg);
          }
        });
    }
  };

  const handleStateChange = (e, value) => {
    // console.log("e--value-->", e, value);
    if (value && value.id) {
      setGetStaffDetails((prev) => ({
        ...prev,
        state: value,
        city: null,
      }));

      const payload = {
        country_id: getStaffDetails.country.id,
        state_id: value.id,
      };
      Api.citiesList(payload)
        .then((res) => {
          // console.log(" list of countries", res);
          // console.log("res", res.status);

          if (res.data.status == 1) {
            //  console.log("countries--->", res.data.data.rows);
            setCities(res.data.data.rows);
            // setCityValue(res.data.data.rows[0]);
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
            //    console.log("in catch");
            //    console.log(err.msg);
          }
        });
    }
  };

  const handleCityChange = (e, value) => {
    //  console.log("e--value-->", e, value);
    if (value && value.id) {
      setGetStaffDetails((prev) => ({
        ...prev,
        city: value,
      }));
    }
  };

  const editStaffDetails = () => {
    setLoader(true);
    setFormErrors({});
    const payload = {
      ...getStaffDetails,
      hotel_id: props.viewStaffData.hotel_id,
      password: "123456",
      password_confirmation: "123456",
      master_service_id: services_selected.join(","),
      country_id: getStaffDetails.country?.id || null,
      state_id: getStaffDetails.state?.id || null,
      city_id: getStaffDetails.city?.id || null,
      currency: getStaffDetails.country?.currency || null,
      currency_name: getStaffDetails.country?.currency_name || null,
      currency_symbol: getStaffDetails.country?.currency_symbol || null,
    };
    delete payload.state;
    delete payload.country;
    delete payload.city;

    // console.log("payload", payload);
    let { isValid, errors } = validateStaffData(payload);
    // console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
      return;
    }
    Api.editHotelStaffDetails(props.viewStaffData.user_id, payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status == 1) {
          // console.log(res.data);
          setLoader(false);
          props.setGetStaffDataCall(true);
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

  // const deleteDetails = () => {
  //   const payload = {
  //     hotel_id: props.viewStaffData.hotel_id,
  //   };
  //   Api.deleteHotelStaff(props.viewStaffData.user_id, payload)
  //     .then((res) => {
  //       if (res.data.status == 1) {
  //         console.log(res.data);
  //         props.setGetStaffDataCall(true);
  //         setBR(true);
  //         setNotification({
  //           type: "success",
  //           message: "Success! Super Admin Deleted",
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
      {props.staffOpenModal ? (
        <Dialog
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">
            User Details: {getStaffDetails.user_name}{" "}
          </DialogTitle>
          {!viewloader ? (
            <DialogContent className="viewdetails">
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="First Name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "first_name",
                      value: getStaffDetails.first_name,
                      onChange: (e) => handleStaffDetails(e),
                      onBlur: (e) => handleStaffDetails(e),
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
                      value: getStaffDetails.last_name,
                      //onChange: { handleStaffDetails },
                      onChange: (e) => handleStaffDetails(e),
                      onBlur: (e) => handleStaffDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.last_name ? true : false}
                    helperText={formErrors.last_name}
                  />
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
                      value: getStaffDetails.user_name,
                      onChange: (e) => handleStaffDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.user_name ? true : false}
                    helperText={formErrors.user_name}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Email address"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      disabled: true,
                      name: "email",
                      value: getStaffDetails.email,

                      //onChange: { handleStaffDetails },
                      onChange: (e) => handleStaffDetails(e),
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
                      value: getStaffDetails.address,
                      onBlur: (e) => handleStaffDetails(e),
                      //onChange: { handleStaffDetails },
                      onChange: (e) => handleStaffDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.address ? true : false}
                    helperText={formErrors.address}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Autocomplete
                    options={countries}
                    value={getStaffDetails.country}
                    // value={value}
                    // inputValue={getStaffDetails.country}
                    // inputValue={inputValue}
                    // getOptionLabel={(option) => {option.name}}
                    // getOptionSelected={getStaffDetails.country_id}
                    onChange={handleCountryChange}
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
                    value={getStaffDetails.state}
                    // value={statevalue}
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
                <GridItem xs={12} sm={12} md={4}>
                  <Autocomplete
                    options={cities}
                    value={getStaffDetails.city}
                    // value={cityvalue}
                    // getOptionLabel={(option) => option.name}
                    onChange={handleCityChange}
                    // sx={{ width: 300 }}
                    renderInput={(params) => (
                      // console.log("params---->", params),
                      <TextField {...params} label="Choose City" />
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
                      value: getStaffDetails.pincode,
                      onChange: (e) => handleStaffDetails(e),
                      onBlur: (e) => handleStaffDetails(e),
                    }}
                    labelProps={{ shrink: true }}
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
                      value: getStaffDetails.mobile_num,
                      onBlur: (e) => handleStaffDetails(e),
                      onChange: (e) => handleStaffDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.mobile_num ? true : false}
                    helperText={formErrors.mobile_num}
                  ></CustomInput>
                </GridItem>

                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Services
                  </InputLabel>
                  <Select
                    label="Service"
                    multiple
                    value={services_selected}
                    onChange={handleServices}
                    name="services_selected"
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
                            checked={services_selected.indexOf(ser.id) > -1}
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
                value={getStaffDetails.service_selected}
                onChange={handleStaffDetails}
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
                    onClick={editStaffDetails}
                    disabled={loader}
                    className="add-cancel-button"
                  >
                    Save
                  </Button>
                  {/*} <Button
                color="primary"
                //align="centre"
                onClick={deleteDetails}
              >
                Delete
              </Button>*/}
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
          <DialogTitle id="scroll-dialog-title">
            User Detail: {getStaffDetails.user_name}
          </DialogTitle>
          {!viewloader ? (
            <DialogContent className="viewdetails">
              <GridContainer>
                {/* {console.log("getStaffDetails", getStaffDetails)} */}
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <InputLabel className="View-details-page">
                    First Name
                  </InputLabel>
                  {getStaffDetails.first_name}
                </GridItem>

                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <InputLabel className="View-details-page">
                    Last Name
                  </InputLabel>
                  {getStaffDetails.last_name}
                </GridItem>

                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <InputLabel className="View-details-page">
                    Username
                  </InputLabel>
                  {getStaffDetails.user_name}
                </GridItem>

                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <InputLabel className="View-details-page">
                    Email address
                  </InputLabel>
                  {getStaffDetails.email}
                </GridItem>

                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <InputLabel className="View-details-page">Address</InputLabel>
                  {getStaffDetails.address}
                </GridItem>

                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <InputLabel className="View-details-page">Country</InputLabel>
                  {getStaffDetails &&
                    getStaffDetails.country &&
                    getStaffDetails.country.name}
                </GridItem>

                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <InputLabel className="View-details-page">State</InputLabel>
                  {getStaffDetails &&
                  getStaffDetails.state &&
                  getStaffDetails.state.name
                    ? getStaffDetails.state.name
                    : "-"}
                </GridItem>

                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <InputLabel className="View-details-page">City</InputLabel>
                  {getStaffDetails &&
                  getStaffDetails.city &&
                  getStaffDetails.city.name
                    ? getStaffDetails.city.name
                    : "-"}
                </GridItem>

                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <InputLabel className="View-details-page">Pincode</InputLabel>
                  {getStaffDetails.pincode ? getStaffDetails.pincode : "-"}
                </GridItem>

                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <InputLabel className="View-details-page">
                    Mobile Number
                  </InputLabel>
                  {getStaffDetails.mobile_num}
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <InputLabel className="View-details-page">
                    Services
                  </InputLabel>
                  {getStaffDetails.services &&
                    getStaffDetails.services.join(", ")}
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
