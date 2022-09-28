import * as React from "react";
import Button from "components/CustomButtons/Button.js";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useEffect, useState } from "react";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Api from "Api/ApiUtils.js";
import { validateSuperAdminData } from "./validator";
import { validator } from "./validator";
import Snackbar from "../../components/Snackbar/Snackbar";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@material-ui/core";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";

export default function ViewSuperAdmin(props) {
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));

  const [open, setOpen] = React.useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [loader, setLoader] = React.useState(false);
  const [viewloader, setViewLoader] = React.useState(false);
  const [cities, setCities] = useState([]);
  const [getDetails, setgetDetails] = useState({
    country: null,
    state: null,
    city: null,
  });

  const [formErrors, setFormErrors] = useState({
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    address: "",
    mobile_num: "",
    check_in_datetime: "",
    room_no: "",
    pincode: "",
    city_id: "",
    state_id: "",
    country_id: "",
  });

  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleDetails = (e) => {
    const { name, value } = e.target;
    setgetDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      first_name: getDetails.first_name,
      last_name: getDetails.last_name,
      email: getDetails.email,
      user_name: getDetails.user_name,
      check_in_datetime: getDetails.check_in_datetime,
      room_no: getDetails.room_no,
      mobile_num: getDetails.mobile_num,
      address: getDetails.address,
      pincode: getDetails.pincode,
      no_of_user: getDetails.no_of_user,
      [name]: value,
    };
    let { isValid, errors } = validator(validation_object, name);

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
    if (props.openModal) {
      handleClickOpen();
    } else {
      handleClose();
    }
  }, [props.openModal]);

  //for view details
  useEffect(() => {
    if (props.openDetailModal) {
      handleClickOpen();
    } else {
      handleViewClose();
    }
  }, [props.openDetailModal]);

  const handleClickOpen = () => {
    setOpen(true);
    showDetails();
  };
  //for edit details
  const handleClose = () => {
    props.setOpenModal(false);
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

    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    let countryId = null,
      stateId = null;
    try {
      const res = await Api.showCustomerDetails(
        props.viewCustomerData.user_id,
        payload
      );
      setViewLoader(false);
      if (res && res.data && res.data.data) {
        let userData = res.data.data;
        let customer_data = userData.user;
        countryId = userData.country?.id || null;
        stateId = userData.state?.id || null;

        setgetDetails({
          first_name: userData.first_name,
          last_name: userData.last_name,
          user_name: userData.user_name,
          email: userData.email,
          address: userData.address,
          mobile_num: userData.mobile_num,

          check_in_datetime: customer_data.check_in_datetime
            ? moment(customer_data.check_in_datetime).format("YYYY-MM-DD")
            : null,
          check_out_datetime: customer_data.check_out_datetime
            ? moment(customer_data.check_out_datetime).format("YYYY-MM-DD")
            : null,
          room_no: customer_data.room_no,
          country: userData.country ? userData.country : null,
          state: userData.state ? userData.state : null,
          city: userData.city ? userData.city : null,
          pincode: userData.pincode,
          no_of_user: customer_data.no_of_user,
        });
      } else {
        setBR(true);
        setNotification({
          type: "danger",
          message: res.data.msg,
        });

        setgetDetails(() => ({
          ...getDetails,
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
    if (value && value.id) {
      setgetDetails((prev) => ({
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
          if (res.data.status == 1) {
            setStates(res.data.data.rows);
          }
        })
        .catch((err) => {
          if (err && err.msg) {
            setBR(true);
            setNotification({
              type: "danger",
              message: err.msg,
            });
          }
        });
    }
  };

  const handleStateChange = (e, value) => {
    if (value && value.id) {
      setgetDetails((prev) => ({
        ...prev,
        state: value,
        city: null,
      }));

      const payload = {
        country_id: getDetails.country.id,
        state_id: value.id,
      };
      Api.citiesList(payload)
        .then((res) => {
          if (res.data.status == 1) {
            setCities(res.data.data.rows);
          }
        })

        .catch((err) => {
          if (err && err.msg) {
            setBR(true);
            setNotification({
              type: "danger",
              message: err.msg,
            });
          }
        });
    }
  };

  const handleCityChange = (e, value) => {
    if (value && value.id) {
      setgetDetails((prev) => ({
        ...prev,
        city: value,
      }));
    }
  };

  const editDetails = () => {
    setLoader(true);

    const payload = {
      ...getDetails,
      hotel_id: props.viewCustomerData.hotel_id,
      password: "123456",
      password_confirmation: "123456",
      country_id: getDetails.country?.id || null,
      state_id: getDetails.state?.id || null,
      city_id: getDetails.city?.id || null,
      currency: getDetails.country?.currency || null,
      currency_name: getDetails.country?.currency_name || null,
      currency_symbol: getDetails.country?.currency_symbol || null,
    };
    delete payload.state;
    delete payload.country;
    delete payload.city;

    let { isValid, errors } = validateSuperAdminData(payload);

    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
      return;
    }

    Api.editSuperAdminDetails(props.viewCustomerData.user_id, payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status === 1) {
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          props.setGetCustomerDataCall(true);
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
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
      });
  };

  return (
    <React.Fragment>
      {props.openModal ? (
        <Dialog
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">
            Customer Details: {getDetails.user_name}
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
                      value: getDetails.first_name,
                      onChange: (e) => handleDetails(e),
                      onBlur: (e) => handleDetails(e),
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
                      value: getDetails.last_name,

                      onChange: (e) => handleDetails(e),
                      onBlur: (e) => handleDetails(e),
                    }}
                    labelProps={{ shrink: true }}
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
                      disabled: true,
                      name: "email",
                      value: getDetails.email,

                      onChange: (e) => handleDetails(e),
                    }}
                    labelProps={{ shrink: true }}
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
                      value: getDetails.user_name,
                      onChange: (e) => handleDetails(e),
                      onBlur: (e) => handleDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.user_name ? true : false}
                    helperText={formErrors.user_name}
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
                      value: getDetails.address,

                      onChange: (e) => handleDetails(e),
                      onBlur: (e) => handleDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.address ? true : false}
                    helperText={formErrors.address}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <Autocomplete
                    options={countries}
                    value={getDetails.country}
                    onChange={handleCountryChange}
                    renderInput={(params) => (
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
                    value={getDetails.state}
                    onChange={handleStateChange}
                    renderInput={(params) => (
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
                    value={getDetails.city}
                    onChange={handleCityChange}
                    renderInput={(params) => (
                      <TextField {...params} label="Choose City" />
                    )}
                  />
                  {formErrors.city_id ? (
                    <FormHelperText>{formErrors.city_id}</FormHelperText>
                  ) : null}
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Pincode"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "pincode",
                      value: getDetails.pincode,
                      onChange: (e) => handleDetails(e),
                      onBlur: (e) => handleDetails(e),
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
                      value: getDetails.mobile_num,

                      onChange: (e) => handleDetails(e),
                      onBlur: (e) => handleDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.mobile_num ? true : false}
                    helperText={formErrors.mobile_num}
                  ></CustomInput>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Room No."
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "room_no",
                      value: getDetails.room_no,

                      onChange: (e) => handleDetails(e),
                      onBlur: (e) => handleDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.room_no ? true : false}
                    helperText={formErrors.room_no}
                  ></CustomInput>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="No.Of Person"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "no_of_user",
                      value: getDetails.no_of_user,
                      type: "number",
                      onChange: (e) => handleDetails(e),
                      onBlur: (e) => handleDetails(e),
                    }}
                    error={formErrors.no_of_user ? true : false}
                    helperText={formErrors.no_of_user}
                  ></CustomInput>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Check-In Date"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "check_in_datetime",
                      type: "date",
                      value: getDetails.check_in_datetime,
                      onChange: (e) => handleDetails(e),
                      onBlur: (e) => handleDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.check_in_datetime ? true : false}
                    helperText={formErrors.check_in_datetime}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Check-Out Date"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "check_out_datetime",
                      type: "date",
                      value: getDetails.check_out_datetime,
                      onChange: (e) => handleDetails(e),
                    }}
                    labelProps={{ shrink: true }}
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
                    onClick={editDetails}
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
          // fullWidth={fullWidth}
          // maxWidth={maxWidth}
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleViewClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">
            Customer Details: {getDetails.user_name}{" "}
          </DialogTitle>
          {!viewloader ? (
            <DialogContent className="viewdetails">
              <GridContainer>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <div className="View-details-page">First Name</div>
                  {getDetails.first_name}
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <div className="View-details-page">Last Name</div>
                  {getDetails.last_name}
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <div className="View-details-page">Email address</div>
                  {getDetails.email}
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <div className="View-details-page">Username</div>
                  {getDetails.user_name}
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ marginBottom: "15px" }}
                >
                  <div className="View-details-page">Address</div>
                  {getDetails.address}
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ marginBottom: "15px" }}
                >
                  <div className="View-details-page">Mobile No.</div>
                  {getDetails.mobile_num}
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <div className="View-details-page">Country</div>
                  {getDetails && getDetails.country && getDetails.country.name}
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <div className="View-details-page">State</div>
                  {getDetails && getDetails.state && getDetails.state.name
                    ? getDetails.state.name
                    : "-"}
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <div className="View-details-page">City</div>
                  {getDetails && getDetails.city && getDetails.city.name
                    ? getDetails.city.name
                    : "-"}
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <div className="View-details-page">Pincode</div>
                  {getDetails.pincode ? getDetails.pincode : "-"}
                </GridItem>

                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <div className="View-details-page">Room No.</div>
                  {getDetails.room_no}
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <div className="View-details-page">No. of Person</div>
                  {getDetails.no_of_user}
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <div className="View-details-page">Check-In Date</div>
                  {moment(getDetails.check_in_datetime).format("LL")}
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={6}
                  style={{ marginBottom: "15px" }}
                >
                  <div className="View-details-page">Check-Out Date</div>
                  {getDetails.check_out_datetime
                    ? moment(getDetails.check_out_datetime).format("LL")
                    : "-"}
                </GridItem>
              </GridContainer>
              <br />
              <br />
              <DialogActions style={{ justifyContent: "center" }}>
                <center>
                  <Button color="primary" onClick={handleViewClose}>
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
