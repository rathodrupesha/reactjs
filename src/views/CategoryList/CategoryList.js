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
// import ViewStaffDetails from "./ViewStaffDetails.js";
// import { validateStaffData } from "./StaffValidator.js";
import Snackbar from "../../components/Snackbar/Snackbar";
import CategoryTable from "../../components/Table/CategoryTable.js";
import { AddBusinessRounded } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

// import DatePicker from "@mui/lab/DatePicker";
// import DateAdapter from "@mui/lab/AdapterMoment";

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

export default function CategoryList(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [getCategoryDataCall, setGetCategoryDataCall] = useState(false);

  const handleCloseMsg = () => {
    setBR(false);
  };

  // useEffect(() => {
  //   console.log("props category list  -->", props);
  // }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const inputStyle = { width: "320px" };

  // api call for add hotel category
  const addHotelCategory = (newData) => {
    // console.log("add category--->", newData);

    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      category_name: newData.name,
      category_image: newData.cImage,
    };
    console.log(payload, "payload");

    Api.createHotelCategory(payload)
      .then((res) => {
        //  console.log(" in then for create category");
        //  console.log("rew", res.status);

        if (res.data.status == 1) {
          setGetCategoryDataCall(true);
          setTimeout(() => {
            setBR(true);
            setNotification({
              type: "success",
              message: res.data.msg,
            });
          }, 1000);
          // setBR(true);
          // setNotification({
          //   type: "success",
          //   message: res.data.msg,
          // });

          // window.location.reload();
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
          //  console.log("in catch");
          //  console.log(err.msg);
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          // setAddStaff(() => ({
          //   ...addStaff,
          //   loader: false,
          // }));
        }
      });
  };

  // api for edit category
  const editHotelCategory = (editCategory) => {
    // console.log("editCategory payload-->", editCategory);
    const payload = {
      hotel_id: editCategory.hotel_id,
      category_name: editCategory.name,
      category_image: editCategory.cImage,
      id: editCategory.id,
    };
    //  console.log("editCategory payload-->", payload);

    Api.editHotelCategoryDetails(payload)
      .then((res) => {
        if (res.data.status == 1) {
          // console.log(res.data);
          setGetCategoryDataCall(true);
          setTimeout(() => {
            setBR(true);
            setNotification({
              type: "success",
              message: res.data.msg,
            });
          }, 1000);
          // setBR(true);
          // setNotification({
          //   type: "success",
          //   message: res.data.msg,
          // });
          // handleClose();
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

        //console.log("inside catch", err?.message || err?.res?.message || err);
        if (error) {
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
        }
      });
  };

  // delete category
  const deleteCategory = (deleteData) => {
    const payload = {
      hotel_id: deleteData.hotel_id,
      id: deleteData.id,
    };
    //console.log("payload category--->", payload);
    Api.deleteHotelCategory(payload)
      .then((res) => {
        if (res.data.status == 1) {
          setGetCategoryDataCall(true);
          // console.log(res.data);
          setTimeout(() => {
            setBR(true);
            setNotification({
              type: "success",
              message: res.data.msg,
            });
          }, 1000);
          // setBR(true);
          // setNotification({
          //   type: "success",
          //   message: res.data.msg,
          // });
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

        //  console.log("inside catch", err?.message || err?.res?.message || err);
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
      });
  };

  return (
    <GridContainer style={{ padding: "0px 15px !important" }}>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Category List</h4>

            <p className={classes.cardCategoryWhite}></p>
          </CardHeader>
          <CardBody>
            <CategoryTable
              getCategoryDataCall={getCategoryDataCall}
              setGetCategoryDataCall={setGetCategoryDataCall}
              addHotelCategory={addHotelCategory}
              editHotelCategory={editHotelCategory}
              deleteCategory={deleteCategory}
            />
          </CardBody>
        </Card>
      </GridItem>

      <Snackbar
        place="tr"
        setBR={setBR}
        color={notification.type}
        message={notification.message}
        open={br}
        closeNotification={handleCloseMsg}
        close
      />
    </GridContainer>
  );
}
