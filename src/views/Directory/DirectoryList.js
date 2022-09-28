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
import { validator, validateDirectoryData } from "./DirectoryValidator.js";
import Snackbar from "../../components/Snackbar/Snackbar";
import InputAdornment from "@mui/material/InputAdornment";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useEffect, useState } from "react";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Api from "Api/ApiUtils.js";
import { Dialog, Divider } from "@material-ui/core";
import CustomerTable from "../../components/Table/CustomerTable.js";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import DirectoryTable from "../../components/Table/DirectoryTable.js";
import { isModuleAccesible } from "generalUtils";

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
const access_criteria = "static_content_management";

export default function DirectoryList(props) {
  const createDirectory = {
    name: "",
    email: "",
    number: "",
  };
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const classes = useStyles();

  const [getDirectoryDataCall, setGetDirectoryDataCall] = useState(false);

  // const [customer_amenities, setCustomer_amenities] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [addDirectory, setAddDirectory] = useState(createDirectory);
  const [loader, setLoader] = React.useState(false);
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    number: "",
  });
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  // onchange function for add user
  const handleAddDirectory = (e) => {
    // setFormErrors({});
    const { name, value } = e.target;
    setAddDirectory((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      name: addDirectory.name,
      email: addDirectory.email,
      number: addDirectory.number,
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

  const isAddAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "create"),
    []
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAddDirectory(createDirectory);
    setFormErrors({});
  };
  const inputStyle = { width: "320px" };

  // api call for add hotel customer
  const addHotelDirectory = () => {
    setLoader(true);
    setFormErrors({});
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      name: addDirectory.name,
      email: addDirectory.email,
      number: addDirectory.number,
    };

    let { isValid, errors } = validateDirectoryData(payload);
    //  console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
      return;
    }

    Api.createHotelDirectory(payload)
      .then((res) => {
        setLoader(false);

        if (res.data.status == 1) {
          setAddDirectory(() => ({
            ...addDirectory,
            loader: false,
          }));
          setGetDirectoryDataCall(true);
          setBR(true);
          setNotification({
            type: "success",
            message: "Success! Directory Added.",
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
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          setAddDirectory(() => ({
            ...addDirectory,
            loader: false,
          }));
        }
      });
  };

  return (
    <>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={open}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="scroll-dialog-title">Add Directory</DialogTitle>
        <Divider />
        <DialogContent>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <CustomInput
                labelText="Name"
                formControlProps={{
                  fullWidth: true,
                }}
                error={formErrors.name ? true : false}
                inputProps={{
                  name: "name",
                  value: addDirectory.name,
                  onChange: (e) => handleAddDirectory(e),
                  onBlur: (e) => handleAddDirectory(e),
                }}
                helperText={formErrors.name}
              />
            </GridItem>

            <GridItem xs={12} sm={12} md={12}>
              <CustomInput
                labelText="Email address"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: "email",
                  value: addDirectory.email,

                  onChange: (e) => handleAddDirectory(e),
                  onBlur: (e) => handleAddDirectory(e),
                }}
                error={formErrors.email ? true : false}
                helperText={formErrors.email}
              ></CustomInput>
            </GridItem>

            <GridItem xs={12} sm={12} md={12}>
              <CustomInput
                labelText="Contact No."
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: "number",
                  value: addDirectory.number,

                  onChange: (e) => handleAddDirectory(e),
                  onBlur: (e) => handleAddDirectory(e),
                }}
                error={formErrors.number ? true : false}
                helperText={formErrors.number}
              ></CustomInput>
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
            onClick={addHotelDirectory}
            color="primary"
            align="centre"
            disabled={loader}
            className="add-cancel-button"
          >
            Add Directory
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
            <h4 className={classes.cardTitleWhite}>Directory List</h4>
            {isAddAccessible ? (
              <Button onClick={handleOpen} className="header-tab-btn">
                Add Directory
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardBody>
          <DirectoryTable
            getDirectoryDataCall={getDirectoryDataCall}
            setGetDirectoryDataCall={setGetDirectoryDataCall}
            accessCriteria={access_criteria}
          />
        </CardBody>
      </Card>

      <Snackbar
        place="tr"
        setBR={setBR}
        color={notification.type}
        message={notification.message}
        open={br}
        closeNotification={handleCloseMsg}
        close
      />
    </>
  );
}
