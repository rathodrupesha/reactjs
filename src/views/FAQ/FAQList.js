import React, { useMemo } from "react";
import FAQ from "../../components/Table/FAQ";
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
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import { validator, validateFaqData } from "./FAQValidator";
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
export default function FAQList(props) {
  const inputStyle = { width: "320px" };
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));

  const createFaq = {
    question: "",
    answer: "",
  };
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [addFaq, setAddFaq] = useState(createFaq);
  const [getFaqDataCall, setGetFaqDataCall] = useState(false);
  const [formErrors, setFormErrors] = useState({
    question: "",
    answer: "",
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
  const handleAddFaq = (e) => {
    const { name, value } = e.target;
    setAddFaq((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      question: addFaq.question,
      answer: addFaq.answer,
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAddFaq(createFaq);
    setFormErrors({});
  };

  const addHotelFaq = () => {
    setLoader(true);
    setFormErrors({});
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      question: addFaq.question,
      answer: addFaq.answer,
    };
    console.log(payload, "payload");
    let { isValid, errors } = validateFaqData(payload);
    console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
      return;
    }

    Api.createHotelFaq(payload)
      .then((res) => {
        setLoader(false);

        console.log("rew", res.status);

        if (res.data.status == 1) {
          setAddFaq(() => ({
            ...addFaq,
            loader: false,
          }));
          setGetFaqDataCall(true);
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
        if (err && err.msg) {
          console.log("in catch");
          console.log(err.msg);
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          setAddFaq(() => ({
            ...addFaq,
            loader: false,
          }));
        }
      });
  };

  return (
    <>
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
        <DialogTitle id="scroll-dialog-title">Add FAQ</DialogTitle>
        <DialogContent>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <TextField
                label="Question"
                multiline
                fullWidth
                name="question"
                value={addFaq.question}
                onChange={handleAddFaq}
                onBlur={handleAddFaq}
                variant="standard"
              />
              {/*<CustomInput
                labelText="Question"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: "question",
                  type: "textarea",
                  value: addFaq.question,
                  onBlur: (e) => handleAddFaq(e),
                  onChange: (e) => handleAddFaq(e),
                  // maxLength: 12,
                }}
                error={formErrors.question ? true : false}
                helperText={formErrors.question}
              />*/}
              {formErrors.question ? (
                <FormHelperText>{formErrors.question}</FormHelperText>
              ) : null}
            </GridItem>

            <GridItem xs={12} sm={12} md={12} style={{ marginTop: "1.5rem" }}>
              <TextField
                label="Answer"
                multiline
                fullWidth
                name="answer"
                value={addFaq.answer}
                onChange={handleAddFaq}
                onBlur={handleAddFaq}
                variant="standard"
              />
              {/*} <CustomInput
                labelText="Answer"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: "answer",
                  value: addFaq.answer,
                  onBlur: (e) => handleAddFaq(e),
                  onChange: (e) => handleAddFaq(e),
                  multiline: true,
                }}
                error={formErrors.answer ? true : false}
                helperText={formErrors.answer}
              />*/}
              {formErrors.answer ? (
                <FormHelperText>{formErrors.answer}</FormHelperText>
              ) : null}
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
            onClick={addHotelFaq}
            color="primary"
            align="centre"
            disabled={loader}
            className="add-cancel-button"
          >
            Add FAQ
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
            <h4 className={classes.cardTitleWhite}>FAQ</h4>
            {isAddAccessible ? (
              <Button className="header-tab-btn" onClick={handleOpen}>
                Add FAQ
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardBody>
          <FAQ
            getFaqDataCall={getFaqDataCall}
            setGetFaqDataCall={setGetFaqDataCall}
          />
        </CardBody>
      </Card>
    </>
  );
}
