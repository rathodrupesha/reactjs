import React, { useMemo } from "react";
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
import DialogContentText from "@mui/material/DialogContentText";
import { validateSuperAdminData } from "./validator";
import { validator } from "./validator";
import Snackbar from "../../components/Snackbar/Snackbar";
import InputAdornment from "@mui/material/InputAdornment";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useEffect, useState } from "react";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Api from "Api/ApiUtils.js";
import { Dialog } from "@material-ui/core";
import CustomerTable from "../../components/Table/CustomerTable.js";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
// import DatePicker from "@mui/lab/DatePicker";
// import DateAdapter from "@mui/lab/AdapterMoment";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@material-ui/core";
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

const access_criteria = "customer_management";

export default function TableList(props) {
  const createCustomer = {
    first_name: "",
    last_name: "",
    user_name: "",
    email: "",
    address: "",
    mobile_num: "",
    check_in_datetime: "",
    check_out_date: "",
    room_no: "",
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
    no_of_user: "",
  };
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const classes = useStyles();

  const [getCustomerDataCall, setGetCustomerDataCall] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [roomAvailable, setRoomAvailable] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [addUser, setaddUser] = useState(createCustomer);
  const [selected_country, setSelected_country] = useState({});
  const [loader, setLoader] = React.useState(false);
  const [dialogloader, setDialogLoader] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formErrors, setFormErrors] = useState({
    user_name: "",
    check_in_datetime: "",
    room_no: "",
    first_name: "",
    last_name: "",
    email: "",
    mobile_num: "",
    password: "",
    password_confirmation: "",
    address: "",
    pincode: "",
    city_id: "",
    state_id: "",
    country_id: "",
    no_of_user: "",
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
    if (value && value.id) {
      setSelected_country(value);
      setaddUser((prev) => ({
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
          }
        });
    }
  };

  const handleStateChange = (e, value) => {
    if (value && value.id) {
      setaddUser((prev) => ({
        ...prev,
        state: value,
        city: null,
      }));

      const payload = {
        country_id: addUser.country.id,
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
          }
        });
    }
  };
  const handleCityChange = (e, value) => {
    if (value && value.id) {
      setaddUser((prev) => ({
        ...prev,
        city: value,
      }));
    }
  };

  //country list api call
  const countryList = () => {
    Api.countriesList()
      .then((res) => {
        if (res.data.status == 1) {
          setCountries(res.data.data.rows);
        }
      })

      .catch((err) => {
        if (err && err.msg) {
        }
      });
  };

  // onchange function for add user
  const handleAddUser = (e) => {
    const { name, value } = e.target;
    setaddUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      first_name: addUser.first_name,
      last_name: addUser.last_name,
      email: addUser.email,
      user_name: addUser.user_name,
      check_in_datetime: addUser.check_in_datetime,

      room_no: addUser.room_no,
      mobile_num: addUser.mobile_num,
      password: addUser.password,
      password_confirmation: addUser.password_confirmation,
      address: addUser.address,
      no_of_user: addUser.no_of_user,

      [name]: value,
    };
    let { isValid, errors } = validator(validation_object, name);

    setFormErrors(() => ({
      ...formErrors,
      ...errors,
    }));
    return;
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setaddUser(createCustomer);
    setFormErrors({});
  };
  const inputStyle = { width: "320px" };

  // api call for add hotel customer
  const addHotelCustomer = () => {
    setLoader(true);
    const payload = {
      first_name: addUser.first_name,
      last_name: addUser.last_name,
      user_name: addUser.user_name,
      email: addUser.email,
      address: addUser.address,
      mobile_num: addUser.mobile_num,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      room_no: addUser.room_no,
      check_in_datetime: moment(addUser.check_in_datetime).format("YYYY-MM-DD"),
      check_out_datetime: addUser.check_out_date,
      role_id: 3,
      password: addUser.password,
      password_confirmation: addUser.password_confirmation,
      country_id: addUser.country?.id || "",
      state_id: addUser.state?.id || "",
      city_id: addUser.city?.id || "",
      currency: addUser.country?.currency || "",
      currency_name: addUser.country?.currency_name || "",
      currency_symbol: addUser.country?.currency_symbol || "",
      pincode: addUser.pincode,
      no_of_user: addUser.no_of_user,
    };
    // console.log(payload, "payload");
    let { isValid, errors } = validateSuperAdminData(payload);
    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
      return;
    }

    Api.roomAvailable(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status == 1) {
          console.log("----------->", res.data.data);
          setRoomAvailable(res.data.data.is_Aailable);
          // setOpenDialog(true);
          if (res.data.data.is_Aailable) {
            setLoader(true);
            Api.createHotelCustomer(payload)
              .then((res) => {
                setLoader(false);
                if (res.data.status == 1) {
                  setaddUser(() => ({
                    ...addUser,
                    loader: false,
                  }));
                  setGetCustomerDataCall(true);
                  setBR(true);
                  setNotification({
                    type: "success",
                    message: "Success! Customer Added.",
                  });

                  handleClose();
                  setRoomAvailable(false);
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
                  setaddUser(() => ({
                    ...addUser,
                    loader: false,
                  }));
                }
              });
          } else {
            setOpenDialog(true);
          }
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
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
        }
      });
  };
  const handleRoomAvailable = () => {
    setDialogLoader(true);
    const payload = {
      first_name: addUser.first_name,
      last_name: addUser.last_name,
      user_name: addUser.user_name,
      email: addUser.email,
      address: addUser.address,
      mobile_num: addUser.mobile_num,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      room_no: addUser.room_no,
      check_in_datetime: moment(addUser.check_in_datetime).format("YYYY-MM-DD"),
      check_out_datetime: addUser.check_out_date,
      role_id: 3,
      password: addUser.password,
      password_confirmation: addUser.password_confirmation,
      country_id: addUser.country?.id || "",
      state_id: addUser.state?.id || "",
      city_id: addUser.city?.id || "",
      currency: addUser.country?.currency || "",
      currency_name: addUser.country?.currency_name || "",
      currency_symbol: addUser.country?.currency_symbol || "",
      pincode: addUser.pincode,
      no_of_user: addUser.no_of_user,
    };
    Api.createHotelCustomer(payload)
      .then((res) => {
        setDialogLoader(false);
        if (res.data.status == 1) {
          setaddUser(() => ({
            ...addUser,
            loader: false,
          }));
          setGetCustomerDataCall(true);
          setBR(true);
          setNotification({
            type: "success",
            message: "Success! Customer Added.",
          });
          setOpenDialog(false);
          handleClose();
          setRoomAvailable(false);
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })

      .catch((err) => {
        setDialogLoader(false);
        if (err && err.msg) {
          // console.log("in catch");
          // console.log(err.msg);
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          setaddUser(() => ({
            ...addUser,
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
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle>Add Customer</DialogTitle>
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
                    value: addUser.first_name,
                    onChange: (e) => handleAddUser(e),
                    onBlur: (e) => handleAddUser(e),
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
                    value: addUser.last_name,
                    //onChange: { handleAddUser },
                    onChange: (e) => handleAddUser(e),
                    onBlur: (e) => handleAddUser(e),

                    // maxLength: 12,
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
                    value: addUser.email,

                    //onChange: { handleAddUser },
                    onChange: (e) => handleAddUser(e),
                    onBlur: (e) => handleAddUser(e),
                  }}
                  error={formErrors.email ? true : false}
                  helperText={formErrors.email}
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
                    value: addUser.user_name,
                    onChange: (e) => handleAddUser(e),
                    onBlur: (e) => handleAddUser(e),

                    // max: 12,
                    // min: 6,
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
                    value: addUser.password,
                    //onChange: { handleAddUser },
                    onChange: (e) => handleAddUser(e),
                    onBlur: (e) => handleAddUser(e),
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
                    value: addUser.password_confirmation,
                    //onChange: { handleAddUser },
                    onChange: (e) => handleAddUser(e),
                    onBlur: (e) => handleAddUser(e),
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
                    value: addUser.address,
                    //onChange: { handleAddUser },
                    onChange: (e) => handleAddUser(e),
                    onBlur: (e) => handleAddUser(e),
                  }}
                  error={formErrors.address ? true : false}
                  helperText={formErrors.address}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <Autocomplete
                  options={countries}
                  value={addUser.country}
                  onChange={handleCountryChange}
                  onBlur={handleCountryChange}
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
                  value={addUser.state}
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
                  value={addUser.city}
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
                    value: addUser.pincode,
                    onChange: (e) => handleAddUser(e),
                    onBlur: (e) => handleAddUser(e),
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
                    value: addUser.mobile_num,
                    //onChange: { handleAddUser },
                    onChange: (e) => handleAddUser(e),
                    onBlur: (e) => handleAddUser(e),
                    // maxLength: 13,
                  }}
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
                    value: addUser.room_no,
                    //onChange: { handleAddUser },
                    onChange: (e) => handleAddUser(e),
                    onBlur: (e) => handleAddUser(e),
                  }}
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
                    value: addUser.no_of_user,
                    type: "number",
                    //onChange: { handleAddUser },
                    onChange: (e) => handleAddUser(e),
                    onBlur: (e) => handleAddUser(e),
                    // maxLength: 13,
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

                    value: addUser.check_in_datetime,

                    onChange: (e) => handleAddUser(e),
                    onBlur: (e) => handleAddUser(e),
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
                    name: "check_out_date",
                    type: "date",
                    // placeholder: false,
                    value: addUser.check_out_date,
                    // onfocus: "(type='date')",
                    //onChange: { handleAddUser },

                    onChange: (e) => handleAddUser(e),
                    onBlur: (e) => handleAddUser(e),
                  }}
                  labelProps={{ shrink: true }}
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
              onClick={addHotelCustomer}
              color="primary"
              align="centre"
              disabled={loader}
              className="add-cancel-button"
            >
              Add Customer
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
              <h4 className={classes.cardTitleWhite}>Customer List</h4>
              {isAddAccessible ? (
                <Button
                  onClick={handleOpen}
                  className="header-tab-btn"
                  // color="white"
                  // style={{
                  //   color: "#ffb400",
                  //   fontWeight: "540",
                  //   fontSize: "14px",
                  // }}
                >
                  Add Customer
                </Button>
              ) : null}
            </div>
          </CardHeader>
          <CardBody>
            <CustomerTable
              getCustomerDataCall={getCustomerDataCall}
              setGetCustomerDataCall={setGetCustomerDataCall}
              accessCriteria={access_criteria}
            />
          </CardBody>
        </Card>
      </GridItem>
      <Dialog
        open={openDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className="dialog-delete-block">
          <DialogContentText id="alert-dialog-description">
            Room is already Booked.Still want to continue?
          </DialogContentText>
          {dialogloader ? (
            <center>
              <CircularProgress align="centre" color="primary" />
            </center>
          ) : (
            ""
          )}
        </DialogContent>
        <DialogActions>
          <Button
            className="cancel-button"
            onClick={() => {
              setRoomAvailable(false);
              setOpenDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="cancel-button"
            onClick={handleRoomAvailable}
            disabled={dialogloader}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
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
