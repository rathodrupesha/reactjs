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
import PackagesTable from "../../components/Table/PackagesTable.js";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { validator, validateSlotData } from "./SlotValidator";
import SlotTable from "../../components/Table/SlotTable.js";
import { Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import moment from "moment";

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

export default function SlotTableList(props) {
  const params = useParams();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));

  const createSlot = {
    date: "",
    start_time: "",
    end_time: "",
  };
  const inputStyle = { width: "320px" };
  const classes = useStyles();

  const [loader, setLoader] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [addSlot, setAddSlot] = useState(createSlot);
  const [getSlotDataCall, setGetSlotDataCall] = useState(false);
  const [formErrors, setFormErrors] = useState({
    date: "",
    start_time: "",
    end_time: "",
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
    console.log("hello---duration", location?.state?.duration);
  }, [location]);

  useEffect(() => {
    const duration = location?.state?.duration;
    const duration_unit = location?.state?.duration_unit;
    const endTime = moment(addSlot?.start_time, "HH:mm:ss")
      .add(duration, String(duration_unit))
      .format("HH:mm:ss");
    setAddSlot((prev) => ({ ...prev, end_time: endTime }));
  }, [addSlot.start_time]);

  // api for edit category
  const editHotelSlot = (editSlot) => {
    // console.log("editSlot payload-->", editSlot);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      slotId: editSlot.id,
      start_time: editSlot.start_time,
      end_time: editSlot.end_time,
      premium_service_packages_id: params.packageId,
    };
    //  console.log("editCategory payload-->", payload);

    Api.editHotelSlotDetails(payload)
      .then((res) => {
        if (res.data.status == 1) {
          // console.log(res.data);

          setTimeout(() => {
            setBR(true);
            setNotification({
              type: "success",
              message: res.data.msg,
            });
          }, 1000);
          setGetSlotDataCall(true);
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
        if (error) {
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
        }
        //console.log("inside catch", err?.message || errj?.res?.message || err);
      });
  };
  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="small" />}
      >
        <Link to="/superadmin/premium-services">
          <span style={{ color: "rgba(0, 0, 0, 0.6)" }}>Premium Service</span>
        </Link>
        <Link to={`/superadmin/premium-services/${params.psId}/packages`}>
          <span style={{ color: "rgba(0, 0, 0, 0.6)" }}>Packages</span>
        </Link>
        <span style={{ color: "black" }}>Slots</span>
      </Breadcrumbs>

      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>Slot List</h4>
        </CardHeader>
        <CardBody>
          <SlotTable
            getSlotDataCall={getSlotDataCall}
            setGetSlotDataCall={setGetSlotDataCall}
            package_id={params.packageId}
            editHotelSlot={editHotelSlot}
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
