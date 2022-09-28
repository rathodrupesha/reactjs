import React from "react";
import ModalImage from "react-modal-image";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import "assets/css/material-dashboard-react.css";
// core components
//import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import MaterialTable, { MTableToolbar } from "material-table";
import Api from "Api/ApiUtils";
import moment from "moment";
import { Select, MenuItem, Button } from "@material-ui/core";
import Snackbar from "../Snackbar/Snackbar.js";
import InputLabel from "@mui/material/InputLabel";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ViewBill from "../../views/BillManagement/ViewBill.js";
import ExtraItemsBill from "../../views/BillManagement/ExtraItemsBill.js";
import { convertStringToCamelCase } from "../../generalUtils.js";
import ExportIcon from "../../assets/img/exportIcon.jpg";
import Tooltip from "@mui/material/Tooltip";
import CustomInput from "components/CustomInput/CustomInput.js";

const styles = {
  settingimage: {
    width: "80px",
    borderRadius: "50%",
    height: "59px",
    objectFit: "contain",
  },
};

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const history = useHistory();
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor } = props;
  const listing = {
    search: "",
    page: 0,
    limits: 10,
    sortValue: "desc",
    sortField: "createdAt",
    room_no: "all",
    payment_status: "un-paid",
    check_in_date: "",
    check_out_date: "",
  };

  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const [loader, setLoader] = React.useState(true);
  const [billData, setBillData] = React.useState({});
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [viewBookingComplainData, setViewBookingComplainData] = useState({});
  const [viewBillOpenModal, setViewBillOpenModal] = useState(false);
  const [extraBillOpenModal, setExtraBillOpenModal] = useState(false);
  const [generateBillOpenModal, setGenerateBillOpenModal] = useState(false);
  const [tableParams, settableParams] = useState(listing);
  const [currentUserList, setCurrentUserList] = useState([]);
  const [totalRecords, settotalRecords] = useState(0);
  const [roomNoOptions, setRoomNoOptions] = useState([]);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  let currentUser_list = [];
  const column = [
    { title: "Name", field: "name" },
    { title: "Room No", field: "room_number" },
    { title: "Check-In Date", field: "check_in_date" },
    { title: "Check-Out Date", field: "check_out_date" },
    { title: "Mobile No", field: "mobile_num" },
    { title: "Status", field: "status" },
  ];

  useEffect(() => {
    getRoomNoList();
  }, []);

  useEffect(() => {
    getHotelCurrentUserList();
  }, [tableParams]);

  const handleShowDetails = (event, rowData) => {
    setViewBillOpenModal(true);
    setBillData(rowData);
  };

  const handleExtraItems = (event, rowData) => {
    setExtraBillOpenModal(true);
    setBillData(rowData);
  };
  const handleGenerateBill = (event, rowData) => {
    setGenerateBillOpenModal(true);
    setBillData(rowData);
  };

  const handleSearch = (e) => {
    console.log("search------->", e.target.value);

    settableParams((prev) => ({
      ...prev,
      search: e.target.value,
      page: 0,
    }));
  };

  const handleLimit = (e) => {
    //console.log("e----", e.target.value);
    settableParams((prev) => ({
      ...prev,
      limits: e.target.value,
      page: 0,
    }));
  };
  const handleSortValueChange = (e) => {
    settableParams((prev) => ({
      ...prev,
      sortValue: e.target.value,
      page: 0,
    }));
  };
  const handleSortFieldChange = (e) => {
    settableParams((prev) => ({
      ...prev,
      sortField: e.target.value,
      page: 0,
    }));
  };
  const handlePagination = (e, page) => {
    //  console.log("page----", page);
    settableParams((prev) => ({
      ...prev,
      page: page,
    }));
  };
  const handleRoomNoChange = (e) => {
    settableParams((prev) => ({
      ...prev,
      room_no: e.target.value,
      page: 0,
    }));
  };
  const handlePaymentStatusChange = (e) => {
    settableParams((prev) => ({
      ...prev,
      payment_status: e.target.value,
      page: 0,
    }));
  };
  const handleCheckIn = (e) => {
    settableParams((prev) => ({
      ...prev,
      check_in_date: e.target.value,
      page: 0,
    }));
  };
  const handleCheckOut = (e) => {
    settableParams((prev) => ({
      ...prev,
      check_out_date: e.target.value,
      page: 0,
    }));
  };

  const getRoomNoList = () => {
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.roomList(payload)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setRoomNoOptions(res.data.data.rows);
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
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

  const getHotelCurrentUserList = () => {
    setLoader(true);
    //  console.log("inside func");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    // console.log("payload hotel id--", payload);
    Api.getCurrentUserListing(tableParams, payload)
      .then((res) => {
        setLoader(false);
        // console.log(res);
        if (res && res.data && res.data.data) {
          // console.log("list", res.data.data.rows);
          currentUser_list = [];
          //   console.log("data---", res.data.data.rows);
          res.data.data.rows.map((current_users) => {
            currentUser_list.push({
              id: current_users.id,
              name: current_users.first_name + " " + current_users.last_name,
              room_number: current_users.room_number,
              check_in_date: current_users.check_in_datetime
                ? moment(current_users.check_in_datetime).format("LL")
                : "",
              check_out_date: current_users.check_out_datetime
                ? moment(current_users.check_out_datetime).format("LL")
                : "",
              check_in_dateTime: current_users.check_in_datetime,
              check_out_dateTime: current_users.check_out_datetime,
              mobile_num: current_users.mobile_num,
              status: convertStringToCamelCase(current_users.status),
              bill_id: current_users.bill_id,
            });
          });

          setCurrentUserList(currentUser_list);
          settotalRecords(res.data.data.count);
          //   props.setGetPremiumDataCall(false);
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
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
          // console.log(err, "error----currentUserList");
        }
      });
  };

  //export csv
  const handleExportCSV = () => {
    setLoader(true);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.exportBillCSV(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status === 1) {
          const csvLink = res.data.data;
          const fileLink = document.createElement("a");
          fileLink.href = csvLink;
          fileLink.download = "download.csv";
          fileLink.style.display = "none";
          document.body.appendChild(fileLink);
          fileLink.click();
          document.body.removeChild(document.body.lastChild);
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
    <div className={classes.tableResponsive}>
      {currentUserList ? (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              // marginBottom: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <InputLabel id="roomno-label">Room No. &nbsp; &nbsp;</InputLabel>

              <Select
                name="room_no"
                className="sort-by-changes-css"
                value={tableParams.room_no}
                onChange={handleRoomNoChange}
                style={{ marginRight: "30px" }}
                autoWidth
                label="Room Number"
                labelId="roomno-label"
                MenuProps={MenuProps}
              >
                <MenuItem value="all">All</MenuItem>
                {roomNoOptions.map((rno) => (
                  <MenuItem value={rno.room_no}>{rno.room_no}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Status &nbsp; &nbsp;
              </InputLabel>
              <Select
                name="payment_status"
                className="sort-by-changes-css"
                value={tableParams.payment_status}
                onChange={handlePaymentStatusChange}
                style={{ marginRight: "30px" }}
                label="Payment Status"
              >
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="un-paid">Unpaid</MenuItem>
              </Select>
            </Box>
            <div style={{ marginRight: "30px", marginBottom: "30px" }}>
              <CustomInput
                labelText="Check-In Date"
                isNotDisabled
                formControlProps={
                  {
                    // fullWidth: true,
                  }
                }
                inputProps={{
                  name: "check_in_datetime",
                  type: "date",

                  value: tableParams.check_in_datetime,

                  onChange: (e) => handleCheckIn(e),
                }}
                labelProps={{ shrink: true }}
              />
            </div>
            <div style={{ marginRight: "30px", marginBottom: "30px" }}>
              <CustomInput
                labelText="Check-Out Date"
                isNotDisabled
                formControlProps={
                  {
                    // fullWidth: true,
                  }
                }
                inputProps={{
                  name: "check_out_date",
                  type: "date",
                  value: tableParams.check_out_date,
                  onChange: (e) => handleCheckOut(e),
                }}
                labelProps={{ shrink: true }}
              />
            </div>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Sort by &nbsp; &nbsp;
              </InputLabel>

              <Select
                name="sortField"
                className="sort-by-changes-css"
                value={tableParams.sortField}
                onChange={handleSortFieldChange}
                style={{ marginRight: "30px" }}
              >
                <MenuItem value="createdAt">Created At</MenuItem>
                <MenuItem value="first_name">First Name</MenuItem>
                <MenuItem value="last_name">Last Name</MenuItem>
              </Select>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                &nbsp; Order by &nbsp; &nbsp;
              </InputLabel>
              <Select
                name="sortValue"
                value={tableParams.sortValue}
                onChange={handleSortValueChange}
                style={{ marginRight: "20px" }}
              >
                <MenuItem value="desc">Descending</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
              </Select>
            </Box>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              // marginBottom: "1.5rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                marginRight: "1.5rem",
                marginBottom: "1.20rem",
              }}
            >
              <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
              <TextField
                name="search"
                value={tableParams.search}
                id="standard-search"
                label="Search"
                type="search"
                variant="standard"
                onChange={handleSearch}
              />
            </Box>
            <Tooltip title="Export as CSV" placement="bottom">
              <Button
                id="demo-positioned-button"
                aria-haspopup="true"
                onClick={handleExportCSV}
              >
                <img src={ExportIcon} height="25px" />
              </Button>
            </Tooltip>
          </div>
          <MaterialTable
            title={null}
            columns={column}
            data={currentUserList}
            isLoading={loader}
            actions={[
              (rowData) => {
                return rowData.status === "Paid"
                  ? {
                      icon: () => (
                        <RemoveRedEyeIcon className="table-icon-color" />
                      ),
                      tooltip: "View Details",
                      onClick: (event, rowData) =>
                        handleShowDetails(event, rowData),
                    }
                  : {
                      icon: () => (
                        <ReceiptLongIcon className="table-icon-color" />
                      ),
                      tooltip: "Generate Bill",
                      onClick: (event) => handleGenerateBill(event, rowData),
                    };
              },
              (rowData) => {
                return rowData.status === "Un-paid"
                  ? {
                      icon: () => (
                        <TextSnippetIcon className="table-icon-color" />
                      ),
                      tooltip: "View Extra Items",
                      onClick: (event, rowData) =>
                        handleExtraItems(event, rowData),
                    }
                  : null;
              },
            ]}
            options={{
              search: false,
              toolbar: false,

              filtering: false,
              emptyRowsWhenPaging: false,
              exportButton: false,

              actionsColumnIndex: -1,
              sorting: false,
              exportAllData: true,
              paging: false,
            }}
          />
          <TablePagination
            component="div"
            count={totalRecords}
            page={tableParams.page}
            onPageChange={handlePagination}
            rowsPerPage={tableParams.limits}
            onRowsPerPageChange={handleLimit}
          />
        </>
      ) : (
        ""
      )}
      <ViewBill
        setViewBillOpenModal={setViewBillOpenModal}
        viewBillOpenModal={viewBillOpenModal}
        billData={billData}
        setGenerateBillOpenModal={setGenerateBillOpenModal}
        generateBillOpenModal={generateBillOpenModal}
        getHotelCurrentUserList={getHotelCurrentUserList}
      />
      <ExtraItemsBill
        extraBillOpenModal={extraBillOpenModal}
        setExtraBillOpenModal={setExtraBillOpenModal}
        billData={billData}
        getHotelCurrentUserList={getHotelCurrentUserList}
      />

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
  );
}

CustomTable.defaultProps = {
  tableHeaderColor: "gray",
};

CustomTable.propTypes = {
  tableHeaderColor: PropTypes.oneOf([
    "warning",
    "primary",
    "danger",
    "success",
    "info",
    "rose",
    "gray",
  ]),
  tableHead: PropTypes.arrayOf(PropTypes.string),
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
};
