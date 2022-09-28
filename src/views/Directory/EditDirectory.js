import * as React from "react";
import Box from "@material-ui/core/Box";
import Button from "components/CustomButtons/Button.js";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
// import "assets/css/material-dashboard-react.css";
// import materail
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
import { validator, validateDirectoryData } from "./DirectoryValidator.js";
import Snackbar from "../../components/Snackbar/Snackbar";
import InputAdornment from "@mui/material/InputAdornment";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@material-ui/core";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";

export default function EditDirectory(props) {
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));

  const [open, setOpen] = React.useState(false);
  // const [customer_amenities, setCustomer_amenities] = React.useState([]);

  const [loader, setLoader] = React.useState(false);

  const [getDetails, setgetDetails] = useState({
    name: "",
    email: "",
    number: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    number: "",
  });

  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    setgetDetails((prev) => ({
      ...prev,
      name: props.viewDirectoryData.name,
      email: props.viewDirectoryData.email,
      number: props.viewDirectoryData.number,
    }));
  }, [props]);

  const handleDetails = (e) => {
    const { name, value } = e.target;
    setgetDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      name: getDetails.name,
      email: getDetails.email,
      number: getDetails.number,
      [name]: value,
    };
    let { isValid, errors } = validator(validation_object, name);
    //console.log(isValid, errors);

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
    //  console.log("props------->", props.openModal);
    //showDetails();
    if (props.openModal) {
      //  console.log("useEffect if");

      handleClickOpen();
    } else {
      //   console.log("useEffect else");
      handleClose();
    }
  }, [props.openModal]);

  const handleClickOpen = () => {
    // console.log("view super admin--->", props.openModal);
    setOpen(true);
    // showDetails();
  };
  //for edit details
  const handleClose = () => {
    // console.log("view super admin hndle close--->", props.setOpenModal);
    props.setOpenModal(false);
    setOpen(false);
    setFormErrors({});
    setgetDetails({ name: "", email: "", number: "" });
  };

  // edit api

  const editDetails = () => {
    setLoader(true);

    const payload = {
      ...getDetails,
      hotel_id: props.viewDirectoryData.hotel_id,
      id: props.viewDirectoryData.id,
    };

    let { isValid, errors } = validateDirectoryData(payload);
    // console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
      return;
    }

    Api.editDirectoryData(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status === 1) {
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          props.setGetDirectoryDataCall(true);
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
        //  console.log("inside catch", err?.message || err?.res?.message || err);
      });
  };

  return (
    <React.Fragment>
      {props.openModal ? (
        <Dialog
          // fullWidth={fullWidth}
          // maxWidth={maxWidth}
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">Edit Directory</DialogTitle>
          <DialogContent className="viewdetails">
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  //  className="View-details-page"
                  labelText="Name"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    name: "name",
                    value: getDetails.name,
                    onChange: (e) => handleDetails(e),
                    onBlur: (e) => handleDetails(e),
                    // onFocus: (e) => handleSetDirtyFields(e),
                  }}
                  labelProps={{ shrink: true }}
                  error={formErrors.name ? true : false}
                  helperText={formErrors.name}
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
                    value: getDetails.email,

                    //onChange: { handleDetails },
                    onChange: (e) => handleDetails(e),
                    onBlur: (e) => handleDetails(e),
                  }}
                  labelProps={{ shrink: true }}
                ></CustomInput>
              </GridItem>

              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Contact No."
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    name: "number",
                    value: getDetails.number,
                    //onChange: { handleDetails },
                    onChange: (e) => handleDetails(e),
                    onBlur: (e) => handleDetails(e),
                  }}
                  labelProps={{ shrink: true }}
                  error={formErrors.number ? true : false}
                  helperText={formErrors.number}
                ></CustomInput>
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
