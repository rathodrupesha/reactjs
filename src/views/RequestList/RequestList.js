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
import RequestTable from "../../components/Table/RequestTable.js";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
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
  const [openModal, setOpenModal] = useState(false);
  const [viewRequestData, setViewRequestData] = useState({});
  const [getRequestDetails, setGetRequestDetails] = useState({});
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
    console.log("view request details--->", viewRequestData);
    showDetails();
  };

  const showDetails = () => {
    setLoader(true);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      request_id: viewRequestData.id,
    };
    Api.showRequestDetails(payload)
      .then((res) => {
        setLoader(false);
        console.log(res);
        if (res && res.data && res.data.data) {
          console.log("response menu details--->", res.data.data);
          let requestData = res.data.data;

          setGetRequestDetails({
            requested_text: requestData.requested_text,
            status: requestData.status,
            accept_by: requestData.accept_by,
            // request_reject_by: requestData.request_reject_by,
            rejection_reason: requestData.rejection_reason,
            cancel_requests: requestData.cancel_requests,
            request_complaints: requestData.request_complaints,
            main_category_name: requestData.main_category.name,
            sub_category_name: requestData.sub_category.name,
            reviews: requestData.requestServiceReview,
            review_comment: requestData.requestServiceReview?.comments,
            review_rating: requestData.requestServiceReview?.num_of_stars,
          });
        } else {
          console.log("in else");
          console.log(res.msg);

          setGetRequestDetails((prev) => ({
            ...prev,
          }));
        }
      })
      .catch((err) => {
        setLoader(false);
        if (err) {
          console.log(err, "error----getRequestDetails");
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
          <DialogTitle id="scroll-dialog-title">Request Details</DialogTitle>
          <Divider />
          <DialogContent className="viewdetails">
            {!loader ? (
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">Request</InputLabel>
                  {getRequestDetails.requested_text}
                </GridItem>
                <GridItem xs={12} sm={12} md={4} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">Status</InputLabel>
                  {getRequestDetails.status}
                </GridItem>
                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Request Accepted By
                  </InputLabel>
                  {getRequestDetails.accept_by
                    ? getRequestDetails.accept_by?.first_name +
                      " " +
                      getRequestDetails.accept_by?.last_name
                    : "-"}
                </GridItem>

                {/*    {getRequestDetails.request_reject_by ? (
                  <GridItem
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ marginTop: "25px" }}
                  >
                    <InputLabel className="View-details-page">
                      Request Rejected By
                    </InputLabel>
                    {getRequestDetails.request_reject_by}
                  </GridItem>
            ) : null}*/}
                <GridItem xs={12} sm={12} md={4} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Main Category
                  </InputLabel>

                  {getRequestDetails.main_category_name}
                </GridItem>
                <GridItem xs={12} sm={12} md={4} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Sub Category
                  </InputLabel>

                  {getRequestDetails.sub_category_name}
                </GridItem>

                {getRequestDetails.reviews ? (
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
                          getRequestDetails.review_rating
                            ? getRequestDetails.review_rating
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
                      {getRequestDetails.review_comment}
                    </GridItem>
                  </>
                ) : null}

                {getRequestDetails.cancel_requests ? (
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
                        Cancel Requests
                      </InputLabel>
                    </GridItem>

                    <GridItem
                      xs={12}
                      sm={12}
                      md={6}
                      style={{ marginTop: "10px" }}
                    >
                      <InputLabel className="View-details-page">
                        Cancel Reason
                      </InputLabel>
                      {getRequestDetails.cancel_requests.reason}
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
                      {getRequestDetails.cancel_requests.status}
                    </GridItem>
                  </>
                ) : null}

                {getRequestDetails.rejection_reason ? (
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    style={{ marginTop: "10px" }}
                  >
                    <InputLabel className="View-details-page">
                      Request Rejection Reason
                    </InputLabel>
                    {getRequestDetails.rejection_reason}
                  </GridItem>
                ) : null}

                {getRequestDetails.request_complaints ? (
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
                        Request Complain
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
                      {getRequestDetails.request_complaints.comment}
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
                      {getRequestDetails.request_complaints.status}
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
                <h4 className={classes.cardTitleWhite}>Request List</h4>
              </div>
            </CardHeader>
            <CardBody>
              <RequestTable
                openModal={openModal}
                setOpenModal={setOpenModal}
                setViewRequestData={setViewRequestData}
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
