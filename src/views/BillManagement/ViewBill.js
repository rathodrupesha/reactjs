import React from "react";
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
import { Dialog, Divider } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { TextField, Typography } from "@material-ui/core";
import Api from "Api/ApiUtils";
import { useState, useEffect } from "react";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import "../../../src/assets/css/material-dashboard-react.css";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import CircularProgress from "@mui/material/CircularProgress";
import ViewBillDetails from "../../components/Table/ViewBillDetails.js";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

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
    fontWeight: "300",
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

export default function ViewBill(props) {
  const inputStyle = { width: "320px" };
  const classes = useStyles();
  const [loader, setLoader] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openGenerate, setOpenGenerate] = React.useState(false);

  useEffect(() => {
    if (props.viewBillOpenModal) {
      console.log("view bill details--", props.viewBillOpenModal);
      setOpen(true);
    }
  }, [props.viewBillOpenModal]);

  useEffect(() => {
    if (props.generateBillOpenModal) {
      console.log("generate bill details--", props.generateBillOpenModal);
      setOpenGenerate(true);
    }
  }, [props.generateBillOpenModal]);

  const handleClose = () => {
    props.setViewBillOpenModal(false);
    props.setGenerateBillOpenModal(false);
    setOpen(false);
    setOpenGenerate(false);
  };

  return (
    <>
      {open || openGenerate ? (
        <Dialog
          disableEnforceFocus
          open={open ? open : openGenerate}
          fullWidth={true}
          maxWidth="md"
          onClose={handleClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>Bill Details</div>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <Divider />
          </DialogTitle>

          <DialogContent style={{ margin: "0px 20px" }}>
            <ViewBillDetails
              billData={props.billData}
              open={open}
              openGenerate={openGenerate}
              setOpenGenerate={setOpenGenerate}
              getHotelCurrentUserList={props.getHotelCurrentUserList}
            />
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
