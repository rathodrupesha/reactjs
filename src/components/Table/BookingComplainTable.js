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
import { convertStringToCamelCase } from "generalUtils.js";
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
  const [viewBookingComplainData, setViewBookingComplainData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [tableParams, settableParams] = useState(listing);
  const [bookingComplainList, setBookingComplainList] = useState([]);
  const [totalRecords, settotalRecords] = useState(0);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  let bookingComplain_list = [];
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

    // { title: "Order Id", field: "order_id" },
    { title: "Complain", field: "complain" },
    { title: "Booked By", field: "booking_owner_name" },
    // { title: "Premium Service Name", field: "premiumService_name" },
    // { title: "Package Name", field: "package_name" },
    { title: "Premium Service/Package", field: "premium_package_name" },
    { title: "Status", field: "status" },

    { title: "Created At", field: "createdAt" },
  ];

  //   useEffect(() => {
  //     if (props.getPremiumDataCall) {
  //       getHotelBookingComplainList();
  //     }
  //   }, [props.getPremiumDataCall]);

  useEffect(() => {
    getHotelBookingComplainList();
  }, [tableParams]);

  const handleShowDetails = (event, rowData) => {
    setViewBookingComplainData(rowData);
    setOpenDetailModal(true);
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

  const getHotelBookingComplainList = () => {
    setLoader(true);
    //  console.log("inside func");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    // console.log("payload hotel id--", payload);
    Api.bookingComplainListing(tableParams, payload)
      .then((res) => {
        setLoader(false);
        // console.log(res);
        if (res && res.data && res.data.data) {
          // console.log("list", res.data.data.rows);
          bookingComplain_list = [];
          //   console.log("data---", res.data.data.rows);
          res.data.data.rows.map((bookings) => {
            bookingComplain_list.push({
              complain: bookings.comment,
              status: convertStringToCamelCase(bookings.status),
              booking_owner_name:
                bookings.complain_booking.booking_owner.first_name +
                " " +
                bookings.complain_booking.booking_owner.last_name,
              order_id: bookings.complain_booking.order_id,
              premiumService_name:
                bookings.complain_booking.premiumServices.name,
              package_name:
                bookings.complain_booking.premiumPackageServices.name,
              premium_package_name:
                bookings.complain_booking.premiumServices.name +
                " / " +
                bookings.complain_booking.premiumPackageServices.name,
              createdAt: moment(bookings.createdAt).format("LL"),
            });
          });

          setBookingComplainList(bookingComplain_list);
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
          // console.log(err, "error----bookingComplainList");
        }
      });
  };

  //export csv
  const handleExportCSV = () => {
    setLoader(true);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.exportBookingComplainCSV(payload)
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
      {bookingComplainList ? (
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
            {/*}  <InputLabel id="demo-simple-select-standard-label">
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
            </Select>*/}
          </div>
          <MaterialTable
            title={null}
            columns={column}
            // onSearchChange={(e) => handleSearch(e)}
            // onChangePage={(e) => handlePagination(e)}
            // onChangeRowsPerPage={(e) => handleLimit(e)}
            // pageSize="5"
            data={bookingComplainList}
            isLoading={loader}
            // onRowClick={onRowClick}

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
        viewBookingComplainData={viewBookingComplainData}
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
