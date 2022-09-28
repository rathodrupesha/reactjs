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
import OrderTable from "../../components/Table/OrderTable.js";
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

export default function OrderTableList(props) {
  const inputStyle = { width: "320px" };
  const classes = useStyles();

  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const [loader, setLoader] = React.useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [viewOrderData, setViewOrderData] = useState({});
  const [getOrderDetails, setGetOrderDetails] = useState({});
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
    console.log("view request details--->", viewOrderData);
    showDetails();
  };

  const showDetails = () => {
    setLoader(true);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      order_id: viewOrderData.id,
    };
    Api.showOrderDetails(payload)
      .then((res) => {
        setLoader(false);
        console.log(res);
        if (res && res.data && res.data.data) {
          console.log("response menu details--->", res.data.data);
          let orderData = res.data.data;

          setGetOrderDetails({
            order_id: orderData.order_id,
            room_number: orderData.room_number,
            total_amount: orderData.total_amount,
            status: orderData.status,
            comment: orderData.comment,
            order_complaints: orderData.order_complaints,
            orderReview: orderData.orderReviewId,
            cancel_orders: orderData.cancel_orders,
            order_items: orderData.order_items
              .map((o_items) => o_items.units + " x " + o_items.name)
              .join(" , "),
          });
        } else {
          console.log("in else");
          console.log(res.msg);

          setGetOrderDetails((prev) => ({
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
          <DialogTitle id="scroll-dialog-title">Order Details</DialogTitle>
          <Divider />
          <DialogContent className="viewdetails">
            {!loader ? (
              <GridContainer>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Order Id
                  </InputLabel>
                  {getOrderDetails.order_id}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">Status</InputLabel>
                  {getOrderDetails.status}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">Room No</InputLabel>
                  {getOrderDetails.room_number}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Total Amount
                  </InputLabel>
                  {getOrderDetails.total_amount}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Order Items
                  </InputLabel>
                  {getOrderDetails.order_items}
                </GridItem>
                {/*   <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                <InputLabel className="View-details-page">
                  Cancel Orders
                </InputLabel>
                {getOrderDetails.cancel_orders}
      </GridItem>*/}

                {getOrderDetails.comment ? (
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    style={{ marginTop: "25px" }}
                  >
                    <InputLabel className="View-details-page">
                      Comment
                    </InputLabel>
                    {getOrderDetails.comment}
                  </GridItem>
                ) : null}
                {getOrderDetails.orderReview ? (
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
                          getOrderDetails.orderReview?.num_of_stars
                            ? getOrderDetails.orderReview?.num_of_stars
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
                      {getOrderDetails.orderReview?.comments}
                    </GridItem>
                  </>
                ) : null}
                {getOrderDetails.cancel_orders ? (
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
                        Cancel Orders
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
                      {getOrderDetails.cancel_orders.reason}
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
                      {getOrderDetails.cancel_orders.status}
                    </GridItem>
                  </>
                ) : null}
                {getOrderDetails.order_complaints ? (
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
                        Order Complain
                      </InputLabel>
                    </GridItem>

                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      style={{ marginTop: "10px" }}
                    >
                      <InputLabel className="View-details-page">
                        Complain
                      </InputLabel>
                      {getOrderDetails.order_complaints.comment}
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
                      {getOrderDetails.order_complaints.status}
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
                <h4 className={classes.cardTitleWhite}>Order List</h4>
              </div>
            </CardHeader>
            <CardBody>
              <OrderTable
                openModal={openModal}
                setOpenModal={setOpenModal}
                setViewOrderData={setViewOrderData}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
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
