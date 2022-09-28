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
import Snackbar from "../../components/Snackbar/Snackbar";
import { validator, validateFaqData } from "./FAQValidator.js";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField } from "@material-ui/core";

export default function EditFaq(props) {
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = React.useState(false);
  const [getFaqDetails, setGetFaqDetails] = useState({
    question: "",
    answer: "",
  });
  const [formErrors, setFormErrors] = useState({
    question: "",
    answer: "",
  });
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleFaqDetails = (e) => {
    const { name, value } = e.target;
    setGetFaqDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      question: getFaqDetails.question,
      answer: getFaqDetails.answer,
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
  const [br, setBR] = useState(false);
  const handleCloseMsg = () => {
    setBR(false);
  };

  //for edit data
  useEffect(() => {
    console.log("props------->", props.FaqOpenModal);
    //showDetails();
    if (props.FaqOpenModal) {
      console.log("useEffect if");

      handleClickOpen();
    } else {
      console.log("useEffect else");
      handleClose();
    }
  }, [props.FaqOpenModal]);

  useEffect(() => {
    setGetFaqDetails((prev) => ({
      ...prev,
      question: props.viewFaqData.question,
      answer: props.viewFaqData.answer,
    }));
  }, [props]);

  const handleClickOpen = () => {
    // console.log("view super admin--->", props.FaqOpenModal);
    setOpen(true);

    // showServiceDetails();
  };
  //for edit details
  const handleClose = () => {
    console.log("view Faq", props.setFaqOpenModal);
    props.setFaqOpenModal(false);
    // props.setOpenDetailModal(false);
    setOpen(false);
    setFormErrors({});
    setGetFaqDetails({ question: "", answer: "" });
  };

  const editFaqDetails = () => {
    setLoader(true);
    setFormErrors({});
    const payload = {
      ...getFaqDetails,
      hotel_id: props.viewFaqData.hotel_id,
      id: props.viewFaqData.id,
    };
    console.log("payload", payload);
    let { isValid, errors } = validateFaqData(payload);
    console.log(isValid, errors);
    if (!isValid) {
      setFormErrors(errors);
      setLoader(false);
      return;
    }
    Api.editHotelFaqDetails(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status == 1) {
          setLoader(false);
          console.log(res.data);
          props.setGetFaqDataCall(true);
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
      {props.FaqOpenModal ? (
        <Dialog
          disableEnforceFocus
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">Edit FAQ</DialogTitle>
          <DialogContent className="viewdetails">
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <TextField
                  label="Question"
                  multiline
                  fullWidth
                  name="question"
                  value={getFaqDetails.question}
                  onChange={handleFaqDetails}
                  onBlur={handleFaqDetails}
                  variant="standard"
                />
                {/*<CustomInput
                  labelText="Question"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    name: "question",
                    value: getFaqDetails.question,
                    onChange: (e) => handleFaqDetails(e),
                    onBlur: (e) => handleFaqDetails(e),
                  }}
                  labelProps={{ shrink: true }}
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
                  value={getFaqDetails.answer}
                  onChange={handleFaqDetails}
                  onBlur={handleFaqDetails}
                  variant="standard"
                />
                {formErrors.answer ? (
                  <FormHelperText>{formErrors.answer}</FormHelperText>
                ) : null}
                {/*}     <CustomInput
                  labelText="Answer"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    name: "answer",
                    value: getFaqDetails.answer,
                    onChange: (e) => handleFaqDetails(e),
                    onBlur: (e) => handleFaqDetails(e),
                  }}
                  labelProps={{ shrink: true }}
                  error={formErrors.answer ? true : false}
                  helperText={formErrors.answer}
                />*/}
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
                  onClick={editFaqDetails}
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
