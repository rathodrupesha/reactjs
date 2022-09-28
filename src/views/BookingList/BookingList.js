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
import Snackbar from "../../components/Snackbar/Snackbar";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import BookingTable from "../../components/Table/BookingTable.js";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
import Rating from "@mui/material/Rating";

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

export default function RequestTableList(props) {
  const inputStyle = { width: "320px" };
  const classes = useStyles();

  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const [loader, setLoader] = React.useState(false);
  const [viewBookingData, setViewBookingData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [getBookingDetails, setGetBookingDetails] = useState({});
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [br, setBR] = useState(false);

  const handleCloseMsg = () => {
    setBR(false);
  };

  useEffect(() => {
    if (openModal) {
      console.log("openmodal-->", openModal);
      handleClickOpen();
    }
  }, [openModal]);

  //for view details
  const handleViewClose = () => {
    // setOpen(false);
    setOpenModal(false);
  };

  const handleClickOpen = () => {
    // setOpen(true);
    console.log("view request details--->", viewBookingData);
    showDetails();
  };

  const showDetails = () => {
    setLoader(true);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      booking_id: viewBookingData.id,
    };
    Api.showBookingDetails(payload)
      .then((res) => {
        setLoader(false);
        console.log(res);
        if (res && res.data && res.data.data) {
          console.log("response menu details--->", res.data.data);
          let bookingData = res.data.data;

          setGetBookingDetails({
            order_id: bookingData.order_id,
            room_no: bookingData.room_no,
            start_time: moment(bookingData.start_time, "HH:mm:ss").format(
              "LTS"
            ),
            end_time: moment(bookingData.end_time, "HH:mm:ss").format("LTS"),
            duration: bookingData.duration + " " + bookingData.duration_unit,
            status: bookingData.status,
            total_amount:
              bookingData.amount_unit + " " + bookingData.total_amount,
            pService_name: bookingData.premiumServices.name,
            package_name: bookingData.premiumPackageServices.name,
            cancel_bookings: bookingData.cancel_bookings,
            spl_notes: bookingData.premiumServices.important_notes,
            booking_complaints: bookingData.booking_complaints,
            no_of_person: bookingData.no_of_person,
            bookingReview: bookingData.bookingReviewId,

            // cancel_requests: requestData.cancel_requests,
          });
        } else {
          console.log("in else");
          console.log(res.msg);

          setGetBookingDetails((prev) => ({
            ...prev,
          }));
        }
      })
      .catch((err) => {
        setLoader(false);
        if (err) {
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
        }
      });
  };

  return (
    <>
      {openModal ? (
        <Dialog
          open={openModal}
          fullWidth={true}
          maxWidth="md"
          onClose={handleViewClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">Booking Details</DialogTitle>
          <Divider />
          <DialogContent className="viewdetails">
            {!loader ? (
              <GridContainer>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Order Id
                  </InputLabel>
                  {getBookingDetails.order_id}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">Room No</InputLabel>
                  {getBookingDetails.room_no}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Premium Service Name
                  </InputLabel>
                  {getBookingDetails.pService_name}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Package Name
                  </InputLabel>
                  {getBookingDetails.package_name}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    No.of Person
                  </InputLabel>
                  {getBookingDetails.no_of_person}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Duration
                  </InputLabel>
                  {getBookingDetails.duration}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Start Time
                  </InputLabel>
                  {getBookingDetails.start_time}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    End Time
                  </InputLabel>
                  {getBookingDetails.end_time}
                </GridItem>

                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Total Amount
                  </InputLabel>
                  {getBookingDetails.total_amount}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">Status</InputLabel>
                  {getBookingDetails.status}
                </GridItem>
                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Special Note
                  </InputLabel>
                  {getBookingDetails.spl_notes}
                </GridItem>
                {getBookingDetails.bookingReview ? (
                  <>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      style={{ marginTop: "25px" }}
                    >
                      <InputLabel
                        className="View-details-page"
                        style={{ fontSize: "20px" }}
                      >
                        Reviews
                      </InputLabel>
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      style={{ marginTop: "10px" }}
                    >
                      <InputLabel className="View-details-page">
                        Rating
                      </InputLabel>
                      <Rating
                        name="half-rating-read"
                        precision={0.5}
                        value={
                          getBookingDetails.bookingReview?.num_of_stars
                            ? getBookingDetails.bookingReview?.num_of_stars
                            : 0
                        }
                        readOnly
                      />
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      style={{ marginTop: "10px" }}
                    >
                      <InputLabel className="View-details-page">
                        Comment
                      </InputLabel>
                      {getBookingDetails.bookingReview?.comments}
                    </GridItem>
                  </>
                ) : null}
                {getBookingDetails.cancel_bookings ? (
                  <>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      style={{ marginTop: "25px" }}
                    >
                      <InputLabel
                        className="View-details-page"
                        style={{ fontSize: "20px" }}
                      >
                        Cancel Bookings
                      </InputLabel>
                    </GridItem>

                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      style={{ marginTop: "10px" }}
                    >
                      <InputLabel className="View-details-page">
                        Reason
                      </InputLabel>
                      {getBookingDetails.cancel_bookings.reason}
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      style={{ marginTop: "10px" }}
                    >
                      <InputLabel className="View-details-page">
                        Status
                      </InputLabel>
                      {getBookingDetails.cancel_bookings.status}
                    </GridItem>
                  </>
                ) : null}
                {getBookingDetails.booking_complaints ? (
                  <>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      style={{ marginTop: "25px" }}
                    >
                      <InputLabel
                        className="View-details-page"
                        style={{ fontSize: "20px" }}
                      >
                        Booking Complain
                      </InputLabel>
                    </GridItem>

                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      style={{ marginTop: "10px" }}
                    >
                      <InputLabel className="View-details-page">
                        Comment
                      </InputLabel>
                      {getBookingDetails.booking_complaints.comment}
                    </GridItem>
                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      style={{ marginTop: "10px" }}
                    >
                      <InputLabel className="View-details-page">
                        Status
                      </InputLabel>
                      {getBookingDetails.booking_complaints.status}
                    </GridItem>
                  </>
                ) : null}
              </GridContainer>
            ) : (
              <center>
                <CircularProgress align="centre" color="primary" />
              </center>
            )}
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
        </Dialog>
      ) : null}
      <GridContainer style={{ padding: "0px 15px !important" }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h4 className={classes.cardTitleWhite}>Booking List</h4>
              </div>
            </CardHeader>
            <CardBody>
              <BookingTable
                setViewBookingData={setViewBookingData}
                openModal={openModal}
                setOpenModal={setOpenModal}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
}
