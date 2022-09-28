import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Snackbar from "../../components/Snackbar/Snackbar";
import { Dialog, Divider } from "@material-ui/core";
import Button from "components/CustomButtons/Button.js";
import Box from "@material-ui/core/Box";
import { TextField, Typography } from "@material-ui/core";
import Api from "Api/ApiUtils";
import { useState, useEffect } from "react";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import "../../../src/assets/css/material-dashboard-react.css";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ExtraItemsBillTable from "../../components/Table/ExtraItemsBillTable";

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

export default function ExtraItemsBill(props) {
  const inputStyle = { width: "320px" };
  const classes = useStyles();
  const [loader, setLoader] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [getExtraItemsDataCall, setGetExtraItemsDataCall] = useState(false);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [getAmenityDataCall, setGetAmenityDataCall] = useState(false);
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));

  const handleCloseMsg = () => {
    setBR(false);
  };

  useEffect(() => {
    if (props.extraBillOpenModal) {
      setOpen(true);
    }
  }, [props.extraBillOpenModal]);

  const handleClose = () => {
    props.setExtraBillOpenModal(false);
    setOpen(false);
  };

  const addExtraItems = (newData) => {
    console.log("add extra items--->", newData);

    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      item_name: newData.item_name,
      price: newData.price,
      check_in_datetime: props.billData.check_in_dateTime,
      user_id: props.billData.id,
    };
    console.log("add extra items psylosd--->", payload);

    Api.addExtraItemsBill(payload)
      .then((res) => {
        //  console.log(" in then for create category");
        // console.log("rew", res);

        if (res.data.status === 1) {
          setGetExtraItemsDataCall(true);
          setTimeout(() => {
            setBR(true);
            setNotification({
              type: "success",
              message: res.data.msg,
            });
          }, 1000);
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
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
        }
      });
  };
  const editExtraItems = (editItems) => {
    // console.log("editItems payload-->", editItems);
    const payload = {
      hotel_id: editItems.hotel_id,
      item_name: editItems.item_name,
      id: editItems.id,
      price: editItems.price,
      check_in_datetime: props.billData.check_in_dateTime,
      user_id: props.billData.id,
    };
    // console.log("editAmenity payload-->", payload);

    Api.editExtraItemsBill(payload)
      .then((res) => {
        if (res.data.status == 1) {
          //  console.log(res.data);
          setGetExtraItemsDataCall(true);
          setTimeout(() => {
            setBR(true);
            setNotification({
              type: "success",
              message: res.data.msg,
            });
          }, 1000);
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

        // console.log("inside catch", err?.message || err?.res?.message || err);
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
      });
  };

  const deleteExtraItems = (deleteData) => {
    const payload = {
      hotel_id: deleteData.hotel_id,
      id: deleteData.id,
    };
    // console.log("payload category--->", payload);
    Api.deleteExtraItemsBill(payload)
      .then((res) => {
        if (res.data.status == 1) {
          setGetExtraItemsDataCall(true);
          // console.log(res.data);
          setTimeout(() => {
            setBR(true);
            setNotification({
              type: "success",
              message: res.data.msg,
            });
          }, 1000);
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })
      .catch((err) => {
        const error = err?.message || err?.msg || err?.res?.message || err;

        //  console.log("inside catch", err?.message || err?.res?.message || err);
        setBR(true);
        setNotification({
          type: "danger",
          message: error,
        });
      });
  };

  return (
    <>
      {open ? (
        <Dialog
          disableEnforceFocus
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleClose}
          className="viewdetailsDialog"
        >
          {/*}   <DialogTitle id="scroll-dialog-title">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {/*}  <div>Extra Items Details</div>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
            {/*}   <Divider />
            </DialogTitle>}*/}

          <DialogContent style={{ margin: "0px 20px" }}>
            <ExtraItemsBillTable
              billData={props.billData}
              open={open}
              getHotelCurrentUserList={props.getHotelCurrentUserList}
              getExtraItemsDataCall={getExtraItemsDataCall}
              setGetExtraItemsDataCall={setGetExtraItemsDataCall}
              addExtraItems={addExtraItems}
              deleteExtraItems={deleteExtraItems}
              editExtraItems={editExtraItems}
            />
          </DialogContent>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              // marginLeft: "18rem",
              margin: "1rem 0",
            }}
          >
            <Button
              color="primary"
              // style={
              //   {
              //     // width: "15rem",
              //     // fontWeight: "500",
              //     // fontSize: "15px",
              //   }
              // }
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
          {/*} <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button onClick={handleClose}>Close</Button>
          </div>*/}
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
    </>
  );
}
