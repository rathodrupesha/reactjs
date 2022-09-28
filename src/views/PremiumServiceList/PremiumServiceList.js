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
import { validatePremiumServiceData } from "./PremiumValidator";
import { validator } from "./PremiumValidator";
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
import PremiumServiceTable from "../../components/Table/PremiumServiceTable.js";
import { isModuleAccesible } from "generalUtils.js";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import AvailableTimings from "./AvailableTimings";

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
  sliderImage: {
    width: "100%",
    height: "auto",
  },
  sliderImageDeleteBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(255,0,0,0.7)",
    color: "white",
    padding: "0.25rem 0.5rem",
    border: "none",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "rgba(255,0,0,1)",
    },
  },
};

const useStyles = makeStyles(styles);
const access_criteria = "premium_service_activities_management";

// const WEEK_DAYS = [
//   { id: 0, name: "Monday", on: false, start_time: "", end_time: "" },
//   { id: 1, name: "Tuesday", on: false, start_time: "", end_time: "" },
//   { id: 2, name: "Wednesday", on: false, start_time: "", end_time: "" },
//   { id: 3, name: "Thursday", on: false, start_time: "", end_time: "" },
//   { id: 4, name: "Friday", on: false, start_time: "", end_time: "" },
//   { id: 5, name: "Saturday", on: false, start_time: "", end_time: "" },
//   { id: 6, name: "Sunday", on: false, start_time: "", end_time: "" },
// ];

const WEEK_DAYS = [
  { days: "Monday", openingStatus: false, openTime: "", closeTime: "" },
  { days: "Tuesday", openingStatus: false, openTime: "", closeTime: "" },
  { days: "Wednesday", openingStatus: false, openTime: "", closeTime: "" },
  { days: "Thursday", openingStatus: false, openTime: "", closeTime: "" },
  { days: "Friday", openingStatus: false, openTime: "", closeTime: "" },
  { days: "Saturday", openingStatus: false, openTime: "", closeTime: "" },
  { days: "Sunday", openingStatus: false, openTime: "", closeTime: "" },
];

export default function PremiumServiceList(props) {
  const createPremiumService = {
    name: "",
    description: "",
    important_notes: "",
    premium_image: null,
    main_image: null,
  };

  const isAddAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "create"),
    []
  );
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const classes = useStyles();

  const [getPremiumDataCall, setGetPremiumDataCall] = useState(false);
  const [selMulImage, setSelMulImage] = useState([]);
  const [generalService, setGeneralService] = useState(false);
  const [showTimingsSelection, setShowTimingsSelection] = useState(false);
  const [timings, setTimings] = useState([...WEEK_DAYS]);
  // const [customer_amenities, setCustomer_amenities] = React.useState([]);
  const [open, setOpen] = useState(false);
  const [addPremiumService, setAddPremiumService] = useState(
    createPremiumService
  );

  const [loader, setLoader] = useState(false);

  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    important_notes: "",
    premium_image: [],
    main_image: "",
    timings: "",
  });
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  useEffect(() => {
    console.log("setMultiple---->", selMulImage);
  }, [selMulImage]);

  // onchange function for add premium service
  const handleAddPremiumService = (e) => {
    // setFormErrors({});
    const { name, value } = e.target;
    setAddPremiumService((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      name: addPremiumService.name,
      description: addPremiumService.description,
      important_notes: addPremiumService.important_notes,
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
    setAddPremiumService(createPremiumService);
    setFormErrors({});
    setSelMulImage([]);
    setGeneralService(false);
    setShowTimingsSelection(false);
    setTimings([...WEEK_DAYS]);
  };
  const inputStyle = { width: "320px" };

  const removeImage = (i) => {
    // console.log("image i", i);
    // setSelMulImage((prev) => prev.slice(1));

    // const tmp = [...selMulImage.slice(0,i),...selMulImage.slice(i+1)]
    // setSelMulImage(tmp)

    const temp = [...selMulImage];
    temp.splice(i, 1);
    setSelMulImage(temp);
  };

  const handleGeneralChange = (e) => {
    console.log("e--->", e.target.checked);
    setGeneralService(e.target.checked);
  };

  const validateOnNext = () => {
    const payload = {
      name: addPremiumService.name,
      description: addPremiumService.description,
      important_notes: addPremiumService.important_notes,
      premium_image: addPremiumService.main_image,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    let { isValid, errors } = validatePremiumServiceData(payload);

    if (!isValid) {
      setFormErrors(errors);
    }
    return isValid;
  };

  // api call for add Premium Services
  const addHotelPremiumService = () => {
    console.log("----->images", selMulImage.length);
    setLoader(true);

    const payload = {
      name: addPremiumService.name,
      description: addPremiumService.description,
      important_notes: addPremiumService.important_notes,
      // premium_image: addPremiumService.premium_image,
      premium_image: addPremiumService.main_image,
      openForAll: generalService,
      openHours: generalService ? JSON.stringify(timings) : null,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    console.log(payload, "payload");
    let { isValid, errors } = validatePremiumServiceData(payload);
    //  console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      if (errors.timings) {
        setBR(true);
        setNotification({ type: "danger", message: errors.timings });
      }
      setFormErrors(errors);
      return;
    }

    // Api.createHotelCustomer(payload)
    Api.createHotelPremiumServices(payload)
      .then((res) => {
        // console.log(" in then for create hotel owner");
        // console.log("rew", res.data.data);
        if (res.data.status === 1) {
          if (selMulImage.length > 0) {
            const image_payload = {
              hotel_id:
                user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
              ps_id: res.data.data.id,
              multi_premium_image: selMulImage ? selMulImage : null,
            };
            Api.uploadPremiumImages(image_payload)
              .then((res) => {
                console.log("res image--", res);
                setLoader(false);
                if (res.data.status === 1) {
                  setAddPremiumService((prev) => ({
                    ...prev,
                  }));
                  setGetPremiumDataCall(true);
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
                }
              });
          } else {
            setLoader(false);
            setAddPremiumService((prev) => ({
              ...prev,
            }));
            setGetPremiumDataCall(true);
            setBR(true);
            setNotification({
              type: "success",
              message: res.data.msg,
            });
            handleClose();
          }
          // setLoader(false);
          // setAddPremiumService((prev) => ({
          //   ...prev,
          // }));
          // setGetPremiumDataCall(true);
          // setBR(true);
          // setNotification({
          //   type: "success",
          //   message: res.data.msg,
          // });
          // handleClose();
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
        setLoader(false);
        if (err && err.msg) {
          // console.log("in catch");
          // console.log(err.msg);
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          setAddPremiumService((prev) => ({
            ...prev,
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
          // className="createPremiumService"
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">
            {!showTimingsSelection ? "Add Premium Services" : "Select Timings"}
          </DialogTitle>
          <DialogContent>
            {showTimingsSelection ? (
              <AvailableTimings timings={timings} setTimings={setTimings} />
            ) : (
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1rem" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={generalService}
                        onChange={handleGeneralChange}
                      />
                    }
                    label="Open for All"
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} className="ps-name">
                  <CustomInput
                    labelText="Premium Service Name"
                    className="ps-name"
                    formControlProps={{
                      fullWidth: true,
                      // helperText: formErrors.description || "",
                    }}
                    error={formErrors.name ? true : false}
                    inputProps={{
                      name: "name",
                      value: addPremiumService.name,
                      onChange: (e) => handleAddPremiumService(e),
                      onBlur: (e) => handleAddPremiumService(e),
                      // maxLength: 12,
                    }}
                    helperText={formErrors.name}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Description"
                    formControlProps={{
                      fullWidth: true,
                      // helperText: formErrors.description || "",
                    }}
                    error={formErrors.description ? true : false}
                    inputProps={{
                      name: "description",
                      value: addPremiumService.description,
                      onChange: (e) => handleAddPremiumService(e),
                      onBlur: (e) => handleAddPremiumService(e),

                      // max: 12,
                      // min: 6,
                    }}
                    helperText={formErrors.description}
                  />
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Important Note"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "important_notes",
                      value: addPremiumService.important_notes,
                      //onChange: { handleAddPremiumService },
                      onChange: (e) => handleAddPremiumService(e),
                      onBlur: (e) => handleAddPremiumService(e),

                      // max: 100,
                      // min: 3,
                    }}
                    error={formErrors.important_notes ? true : false}
                    helperText={formErrors.important_notes}
                  />
                </GridItem>

                <br />
                <br />
                <br />
                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "40px" }}>
                  <label for="MainImage">Main Image : </label>
                  <input
                    type="file"
                    name="MainImage"
                    accept="image/png, image/jpeg,image/jpg"
                    onChange={(e) => {
                      console.log("images---", e.target.files);
                      const imageUrl = URL.createObjectURL(e.target.files[0]);

                      // setSelMulImage((prev) => [...prev, ...e.target.files]);
                      setAddPremiumService((prev) => ({
                        ...prev,
                        main_image: e.target.files[0],
                        image: imageUrl,
                      }));
                    }}
                  />
                  {formErrors.premium_image ? (
                    <FormHelperText>{formErrors.premium_image}</FormHelperText>
                  ) : null}
                </GridItem>
                {addPremiumService.image ? (
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    style={{ marginTop: "12px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <img
                        src={addPremiumService.image}
                        alt="Main Image"
                        width="50%"
                      />
                    </div>
                  </GridItem>
                ) : null}

                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ marginTop: "40px", marginBottom: "40px" }}
                >
                  <label for="PremiumImage">Premium Service Images : </label>
                  <input
                    type="file"
                    name="PremiumImage"
                    accept="image/png, image/jpeg,image/jpg"
                    onChange={(e) => {
                      console.log("images---", e.target.files);

                      if (e.target.files.length <= 5) {
                        setSelMulImage((prev) => [...prev, ...e.target.files]);
                      } else {
                        setBR(true);
                        setNotification({
                          type: "danger",
                          message: "You can upload 5 images at a time.",
                        });
                      }
                    }}
                    multiple
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  md={12}
                  sm={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {selMulImage
                    ? selMulImage.map((imag, i) => {
                        return (
                          <div
                            style={{
                              position: "relative",
                              marginBottom: "50px",
                              width: "60%",
                              display: "flex",
                              marginRight: "auto",
                              marginLeft: "auto",
                            }}
                          >
                            <img
                              key={i}
                              src={URL.createObjectURL(imag)}
                              alt="Premium Service Image"
                              className={classes.sliderImage}
                            />
                            <button
                              className={classes.sliderImageDeleteBtn}
                              onClick={() => removeImage(i)}
                            >
                              &#10005;
                            </button>
                          </div>
                        );
                      })
                    : null}
                </GridItem>
              </GridContainer>
            )}
          </DialogContent>
          {loader ? (
            <center>
              <CircularProgress align="centre" color="primary" />
            </center>
          ) : null}
          <DialogActions style={{ justifyContent: "center" }}>
            <Button
              onClick={
                showTimingsSelection
                  ? () => setShowTimingsSelection(false)
                  : handleClose
              }
              color="primary"
              align="centre"
              className="add-cancel-button"
            >
              {showTimingsSelection ? "Back" : "Cancel"}
            </Button>
            <Button
              onClick={
                !generalService || (generalService && showTimingsSelection)
                  ? addHotelPremiumService
                  : () => {
                      if (validateOnNext()) {
                        setShowTimingsSelection(true);
                      }
                    }
              }
              color="primary"
              align="centre"
              disabled={loader}
              className="add-cancel-button"
            >
              {!generalService || (generalService && showTimingsSelection)
                ? "Add Premium Services"
                : "Select Available Timings"}
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
              <h4 className={classes.cardTitleWhite}>Premium Services List</h4>
              {isAddAccessible ? (
                <Button onClick={handleOpen} className="header-tab-btn">
                  Add Premium Services
                </Button>
              ) : null}
            </div>
          </CardHeader>
          <CardBody>
            <PremiumServiceTable
              getPremiumDataCall={getPremiumDataCall}
              setGetPremiumDataCall={setGetPremiumDataCall}
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
