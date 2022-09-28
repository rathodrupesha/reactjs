import React from "react";
// @material-ui/core components
import Avatar from "@material-ui/core/Avatar";
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
import BookingTable from "../../components/Table/BookingTable.js";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import CardAvatar from "components/Card/CardAvatar.js";
import avatar from "assets/img/hotel-logo.png";

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

export default function MasterAdminDetails(props) {
  const inputStyle = { width: "320px" };
  const classes = useStyles();
  const [getMasterAdminDetails, setGetMasterAdminDetails] = useState([]);

  useEffect(() => {
    showMasterAdminDetails();
  }, []);

  const showMasterAdminDetails = () => {
    Api.getMasterAdminData()
      .then((res) => {
        // console.log(res);
        if (res && res.data && res.data.status == 1) {
          //  console.log("id", res.data.data.id);
          const masterAdminDetails = res.data.data.map((ma) => ({
            name: ma.first_name + " " + ma.last_name,
            email: ma.email,
            mobile_num: ma.mobile_num,
            profile_image: ma.image,
          }));
          setGetMasterAdminDetails([...masterAdminDetails]);
        } else {
          setGetMasterAdminDetails([]);
        }
      })
      .catch((err) => {
        if (err) {
          //  console.log(err, "error----userprofile");
        }
      });
  };

  return (
    <GridContainer>
      {getMasterAdminDetails &&
        getMasterAdminDetails.map((masterAdmin) => (
          <GridItem xs={12} md={12} lg={6}>
            <Card profile style={{ marginBottom: "4rem" }}>
              <CardAvatar
                profile
                style={{
                  width: "130px",
                  height: "130px",
                  padding: "10px",
                  backgroundColor: "white",
                  overflow: "hidden",
                  boxShadow:
                    "0 16px 20px -12px rgb(0 0 0 / 56%), 0 4px 25px 0px rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(0 0 0 / 20%)",
                  backgroundImage: `url(${masterAdmin.profile_image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
              ></CardAvatar>

              <CardBody profile style={{ paddingBottom: "30px" }}>
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "1.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {masterAdmin.name}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    fontSize: "1rem",
                    color: "#555555",
                  }}
                >
                  <span>{masterAdmin.email}</span>
                  <span style={{ margin: "0 0.5rem" }}>|</span>
                  <span>{masterAdmin.mobile_num}</span>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        ))}
    </GridContainer>
  );
}
