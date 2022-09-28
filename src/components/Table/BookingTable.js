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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Frame from "../../assets/img/hotel-logo.png";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import Rating from "@mui/material/Rating";
import { convertStringToCamelCase } from "generalUtils";
import ExportIcon from "../../assets/img/exportIcon.jpg";
import Tooltip from "@mui/material/Tooltip";

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

  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor } = props;
  const listing = {
    search: "",
    page: 0,
    limits: 10,
    sortValue: "desc",
    sortField: "createdAt",
  };

  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const [loader, setLoader] = React.useState(true);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  // const [viewBookingData, setViewBookingData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [tableParams, settableParams] = useState(listing);
  const [bookingList, setBookingList] = useState([]);
  const [totalRecords, settotalRecords] = useState(0);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  let booking_list = [];
  const column = [
    // {
    //   title: "Image",
    //   field: "main_image",
    //   render: (rowData) => (
    //     <ModalImage
    //       large={rowData.main_image ? rowData.main_image : Frame}
    //       small={rowData.main_image ? rowData.main_image : Frame}
    //       className={classes.settingimage}
    //     />
    //   ),
    // },

    // { title: "Name", field: "name" },
    { title: "Order Id", field: "order_id" },
    { title: "Room No", field: "room_no" },
    { title: "Premium Service/Package Name", field: "premium_package_name" },
    { title: "Date", field: "date" },
    // { title: "Package Name", field: "packageServices_name" },
    { title: "Start Time", field: "start_time" },
    { title: "End Time", field: "end_time" },
    // { title: "Slot", field: "slot" },
    { title: "Duration", field: "duration" },
    { title: "Status", field: "status" },

    {
      title: "Rating",
      field: "rating",
      render: (rowData) => (
        <Rating
          name="half-rating-read"
          precision={0.5}
          value={rowData.rating ? rowData.rating : 0}
          readOnly
        />
      ),
    },
    { title: "Created At", field: "createdAt" },
  ];

  //   useEffect(() => {
  //     if (props.getPremiumDataCall) {
  //       getHotelBookingList();
  //     }
  //   }, [props.getPremiumDataCall]);

  useEffect(() => {
    getHotelBookingList();
  }, [tableParams]);

  const handleShowDetails = (event, rowData) => {
    props.setViewBookingData(rowData);
    props.setOpenModal(true);
  };

  const handleSearch = (e) => {
    console.log("search------->", e.target.value);
    // const { name, value } = e.target;
    // console.log("handle edit change-----", e);
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

  const getHotelBookingList = () => {
    setLoader(true);
    //  console.log("inside func");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    // console.log("payload hotel id--", payload);
    Api.bookingListing(tableParams, payload)
      .then((res) => {
        setLoader(false);
        // console.log(res);
        if (res && res.data && res.data.data) {
          // console.log("list", res.data.data.rows);
          booking_list = [];
          //   console.log("data---", res.data.data.rows);
          res.data.data.rows.map((bookings) => {
            booking_list.push({
              id: bookings.id,
              order_id: bookings.order_id,
              room_no: bookings.room_no,
              status: convertStringToCamelCase(bookings.status),
              packageServices_name: bookings.premiumPackageServices.name,
              premiumService_name: bookings.premiumServices.name,
              rating: bookings.bookingReviewId
                ? bookings.bookingReviewId.num_of_stars
                : null,
              start_time: moment(bookings.start_time, "HH:mm:ss").format("LTS"),
              end_time: moment(bookings.end_time, "HH:mm:ss").format("LTS"),
              slot:
                moment(bookings.start_time, "HH:mm:ss").format("LTS") +
                " - " +
                moment(bookings.end_time, "HH:mm:ss").format("LTS"),
              duration: bookings.duration + " " + bookings.duration_unit,
              premium_package_name:
                bookings.premiumServices.name +
                " / " +
                bookings.premiumPackageServices.name,
              createdAt: moment(bookings.createdAt).format("LL"),
              date: moment(bookings.date).format("LL"),
            });
          });

          setBookingList(booking_list);
          settotalRecords(res.data.data.count);
          //   props.setGetPremiumDataCall(false);
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
          // console.log(err, "error----bookingList");
        }
      });
  };

  //export csv
  const handleExportCSV = () => {
    setLoader(true);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.exportBookingCSV(payload)
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
          // console.log(err, "error----userprofile");
        }
      });
  };

  return (
    <div className={classes.tableResponsive}>
      {bookingList ? (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: "1rem",
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
              <MenuItem value="order_id">Order Id</MenuItem>
              <MenuItem value="start_time">Start Time</MenuItem>
              <MenuItem value="end_time">End Time</MenuItem>
              <MenuItem value="duration">Duration</MenuItem>
            </Select>
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
            <Tooltip title="Export as CSV" placement="bottom">
              <Button
                id="demo-positioned-button"
                // aria-controls={exportOpen ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                // aria-expanded={exportOpen ? "true" : undefined}
                onClick={handleExportCSV}
              >
                <img src={ExportIcon} height="25px" />
              </Button>
            </Tooltip>
          </div>
          <MaterialTable
            title={null}
            columns={column}
            // onSearchChange={(e) => handleSearch(e)}
            // onChangePage={(e) => handlePagination(e)}
            // onChangeRowsPerPage={(e) => handleLimit(e)}
            // pageSize="5"
            data={bookingList}
            isLoading={loader}
            // onRowClick={onRowClick}
            actions={[
              {
                icon: () => <RemoveRedEyeIcon className="table-icon-color" />,
                tooltip: "View Details",
                // onClick: (event, rowData) => alert("You saved " + rowData.name),
                onClick: (event, rowData) => handleShowDetails(event, rowData),
              },
            ]}
            options={{
              search: false,
              toolbar: false,

              filtering: false,
              emptyRowsWhenPaging: false,
              exportButton: false,
              // exportCsv: () => handleExportCSV(),
              // exportPdf: () => handleExportExcel(),
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
      {/*}  <Viewrequestservice
        openModal={openModal}
        setOpenModal={setOpenModal}
        openDetailModal={openDetailModal}
        setOpenDetailModal={setOpenDetailModal}
        viewBookingData={viewBookingData}
        setGetPremiumDataCall={props.setGetPremiumDataCall}
      />*/}

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
