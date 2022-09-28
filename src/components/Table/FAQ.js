import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Snackbar from "../Snackbar/Snackbar.js";
import Api from "Api/ApiUtils";
import EditFaq from "../../views/FAQ/EditFaq";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Button, Divider } from "@material-ui/core";
import TablePagination from "@mui/material/TablePagination";
import { isModuleAccesible } from "generalUtils.js";

export default function FAQ(props) {
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const access_criteria = "static_content_management";
  const listing = {
    page: 0,
    limits: 10,
  };

  const isEditAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "update"),
    []
  );
  const isDeleteAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "delete"),
    []
  );

  const [tableParams, settableParams] = useState(listing);
  const [loader, setLoader] = React.useState(true);
  const [FaqOpenModal, setFaqOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);
  const [viewFaqData, setViewFaqData] = useState({});
  const [open, setOpen] = useState([]);
  const [faqList, setFaqList] = useState([]);
  const [FaqId, setFaqId] = useState("");
  const [br, setBR] = useState(false);
  const [totalRecords, settotalRecords] = useState(0);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  let faq_list = [];

  useEffect(() => {
    if (props.getFaqDataCall) {
      getFaqList();
    }
  }, [props.getFaqDataCall]);
  useEffect(() => {
    getFaqList();
  }, [tableParams]);

  const handleLimit = (e) => {
    // console.log("e----", e.target.value);
    settableParams((prev) => ({
      ...prev,
      limits: e.target.value,
      page: 0,
    }));
  };

  const handlePagination = (e, page) => {
    // console.log("page----", page);
    settableParams((prev) => ({
      ...prev,
      page: page,
    }));
  };

  const handleClick = (idx) => {
    setOpen((prev) => {
      let newOpens = [...prev];
      newOpens[idx] = !newOpens[idx];
      return newOpens;
    });
  };
  const handleEdit = (data) => {
    console.log("hello edit--->", data);
    setViewFaqData(data);
    setFaqOpenModal(true);
  };

  const getFaqList = () => {
    // setLoader(true);
    //  console.log("inside func");
    const payload = {
      // hotel_id: 2,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    // console.log("payload hotel id--", payload);
    Api.faqListing(tableParams, payload)
      .then((res) => {
        setLoader(false);
        // console.log(res);
        if (res && res.data && res.data.data) {
          // console.log("list", res.data.data.rows);
          faq_list = [];
          res.data.data.rows.map((faqs, i) => {
            faq_list.push({
              id: faqs.id,
              hotel_id: faqs.hotel_id,
              question: faqs.question,
              answer: faqs.answer,
            });
          });
          setFaqList(faq_list);
          settotalRecords(res.data.data.count);
          setOpen(faqList.map((fl) => false));
          props.setGetFaqDataCall(false);
        } else {
          //   console.log("in else");
          //  console.log(res.msg);
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
          // console.log(err, "error----faqList");
        }
      });
  };

  const handleDeleteDialog = (data) => {
    setOpenDeleteDialog(true);
    setFaqId(data.id);
  };
  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setFaqId("");
  };

  //delete api
  const handleDelete = () => {
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      id: FaqId,
    };
    Api.deleteHotelFaq(payload)
      .then((res) => {
        if (res.data.status == 1) {
          // console.log(res.data);
          // props.setGetSuperAdminDataCall(true);
          handleCloseDelete();
          getFaqList();
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
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
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
        // console.log("inside catch", err?.message || err?.res?.message || err);
      });
  };

  return (
    <>
      <div>
        <List dense={dense}>
          {faqList &&
            faqList.map((f, idx) => {
              return (
                <>
                  <ListItem
                    secondaryAction={
                      <>
                        {isEditAccessible ? (
                          <IconButton edge="end" aria-label="edit">
                            <EditIcon
                              onClick={() => handleEdit(f)}
                              className="table-icon-color"
                            />
                          </IconButton>
                        ) : null}
                        {isDeleteAccessible ? (
                          <IconButton edge="end" aria-label="delete">
                            <DeleteIcon
                              onClick={() => handleDeleteDialog(f)}
                              className="table-icon-color"
                            />
                          </IconButton>
                        ) : null}
                      </>
                    }
                  >
                    <IconButton
                      edge="end"
                      aria-label="collapse"
                      onClick={() => handleClick(idx)}
                      style={{ marginRight: "0.5rem" }}
                    >
                      {open[idx] ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <ListItemText primary={f.question} />
                  </ListItem>
                  {open[idx] ? null : <Divider />}
                  <Collapse in={open[idx]} timeout="auto" unmountOnExit>
                    {/*} <List
                    component="div"
                    disablePadding
                    style={{ marginLeft: "5rem" }}
                >*/}
                    <ListItemText
                      primary={f.answer}
                      style={{ marginLeft: "4rem" }}
                    />
                    {/*} </List>*/}
                  </Collapse>
                  {open[idx] ? <Divider /> : null}
                </>
              );
            })}
        </List>
        <TablePagination
          component="div"
          count={totalRecords}
          page={tableParams.page}
          onPageChange={handlePagination}
          rowsPerPage={tableParams.limits}
          onRowsPerPageChange={handleLimit}
        />
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent className="dialog-delete-block">
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className="cancel-button" onClick={handleCloseDelete}>
              Cancel
            </Button>
            <Button className="cancel-button" onClick={handleDelete}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          place="tr"
          setBR={setBR}
          color={notification.type}
          message={notification.message}
          open={br}
          closeNotification={handleCloseMsg}
          close
        />
      </div>
      <EditFaq
        FaqOpenModal={FaqOpenModal}
        setFaqOpenModal={setFaqOpenModal}
        setGetFaqDataCall={props.setGetFaqDataCall}
        viewFaqData={viewFaqData}
        setViewFaqData={setViewFaqData}
      />
    </>
  );
}
