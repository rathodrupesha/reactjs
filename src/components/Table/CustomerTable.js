import React, { useMemo } from "react";
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
import TablePagination from "@mui/material/TablePagination";
import "assets/css/material-dashboard-react.css";
// core components
//import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import MaterialTable, { MTableToolbar } from "material-table";
import Api from "Api/ApiUtils";
import ViewCustomer from "../../views/TableList/ViewCustomer.js";
import moment from "moment";
import { Select, MenuItem, Button } from "@material-ui/core";
import Snackbar from "../Snackbar/Snackbar.js";
import InputLabel from "@mui/material/InputLabel";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
import ExportIcon from "../../assets/img/exportIcon.jpg";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import { isModuleAccesible } from "generalUtils.js";

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
  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor } = props;
  const listing = {
    search: "",
    page: 0,
    limits: 10,
    sortValue: "desc",
    sortField: "createdAt",
  };

  const isViewAccessible = useMemo(
    () => isModuleAccesible(props.accessCriteria, "view"),
    [props.accessCriteria]
  );
  const isUpdateAccessible = useMemo(
    () => isModuleAccesible(props.accessCriteria, "update"),
    [props.accessCriteria]
  );
  const isDeleteAccessible = useMemo(
    () => isModuleAccesible(props.accessCriteria, "delete"),
    [props.accessCriteria]
  );
  const TableActions = useMemo(() => {
    const tableActions = [];
    if (isViewAccessible) {
      tableActions.push({
        icon: () => <RemoveRedEyeIcon className="table-icon-color" />,
        tooltip: "View User Details",
        // onClick: (event, rowData) => alert("You saved " + rowData.name),
        onClick: (event, rowData) => handleShowDetails(event, rowData),
      });
    }
    if (isUpdateAccessible) {
      tableActions.push({
        icon: () => <EditIcon className="table-icon-color" />,
        tooltip: "Edit User Details",
        // onClick: (event, rowData) => alert("You saved " + rowData.name),
        onClick: (event, rowData) => handleEditData(event, rowData),
      });
    }
    if (isDeleteAccessible) {
      tableActions.push({
        icon: () => <DeleteIcon className="table-icon-color" />,
        tooltip: "Delete User",
        onClick: (event, rowData) => handleDeleteDialog(event, rowData),
      });
    }
    return tableActions;
  }, [isViewAccessible, isUpdateAccessible, isDeleteAccessible]);

  function onRowClick(event, rowData) {
    // console.log("on click event row click", event);
    // handleClickOpen(rowData);
    setViewCustomerData(rowData);
    setOpenModal(true);
    // console.log("onrow click-------", rowData);
  }
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const [loader, setLoader] = React.useState(true);
  const [openExport, setOpenExport] = useState(null);
  const exportOpen = Boolean(openExport);
  const handleClick = (event) => {
    setOpenExport(event.currentTarget);
  };
  const handleCloseExport = () => {
    setOpenExport(null);
  };
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userId, setUserId] = useState({ hotelId: "", user_id: "" });

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [viewCustomerData, setViewCustomerData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [tableParams, settableParams] = useState(listing);
  const [customerList, setCustomerList] = useState([]);
  const [totalRecords, settotalRecords] = useState(0);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  let customer_list = [];
  const column = [
    {
      title: "Image",
      field: "image",
      render: (rowData) => (
        <ModalImage
          large={rowData.image ? rowData.image : Frame}
          small={rowData.image ? rowData.image : Frame}
          className={classes.settingimage}
        />
        // <img
        //   src={ ? rowData.image : Frame}
        //
        // />
      ),
    },

    { title: "Name", field: "name" },
    { title: "User Name", field: "user_name" },
    { title: "Email", field: "email", type: "email" },
    // { title: "Address", field: "address" },
    { title: "Contact Number", field: "m_no", type: "number" },
    { title: "Room Number", field: "room_no", type: "number" },
    { title: "Check-In", field: "check_in_datetime" },
    { title: "Check-Out", field: "check_out_datetime" },
    { title: "Created At", field: "createdAt" },
  ];

  useEffect(() => {
    if (props.getCustomerDataCall) {
      getHotelCustomerList();
    }
  }, [props.getCustomerDataCall]);

  useEffect(() => {
    getHotelCustomerList();
  }, [tableParams]);
  // useEffect(() => {
  //   getHotelCustomerList();
  // }, [tableParams]);

  const handleEditData = (event, rowData) => {
    // console.log(">>edit data", event, rowData);
    setViewCustomerData(rowData);
    setOpenModal(true);
  };
  const handleShowDetails = (event, rowData) => {
    setViewCustomerData(rowData);
    setOpenDetailModal(true);
  };

  const handleDeleteDialog = (event, rowData) => {
    setOpenDeleteDialog(true);
    setUserId({ hotelId: rowData.hotel_id, user_id: rowData.user_id });
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setUserId({ hotelId: "", user_id: "" });
  };
  //delete api
  const handleDelete = () => {
    const payload = {
      hotel_id: userId.hotelId,
    };
    Api.deleteHotelCustomer(userId.user_id, payload)
      .then((res) => {
        if (res.data.status == 1) {
          // console.log(res.data);
          // props.setGetSuperAdminDataCall(true);
          handleCloseDelete();
          getHotelCustomerList();
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

  const handleSearch = (e) => {
    console.log("search------->", e.target.value);
    // const { name, value } = e.target;
    // console.log("handle edit change-----", e);
    settableParams(
      (prev) => ({
        ...prev,
        search: e.target.value,
        page: 0,
      })

      // console.log("e------", tableParams.search)
      // () => getHotelOwnerList()
    );
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

  const getHotelCustomerList = () => {
    setLoader(true);
    //  console.log("inside func");
    const payload = {
      // hotel_id: 2,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    // console.log("payload hotel id--", payload);
    Api.customerListing(tableParams, payload)
      .then((res) => {
        setLoader(false);
        // console.log(res);
        if (res && res.data && res.data.data) {
          // console.log("list", res.data.data.rows);
          customer_list = [];
          res.data.data.rows.map((customers, i) => {
            customer_list.push({
              image: customers["user.image"],
              hotel_id: customers.hotel_id,
              user_id: customers.user_id,
              first_name: customers["user.first_name"],
              last_name: customers["user.last_name"],
              name:
                customers["user.first_name"] +
                " " +
                customers["user.last_name"],
              user_name: customers["user.user_name"],
              email: customers["user.email"],
              m_no: customers["user.mobile_num"],
              address: customers["user.address"],
              room_no: customers.room_no,
              createdAt: moment(customers["user.createdAt"]).format("LL"),
              check_in_datetime: customers.check_in_datetime
                ? moment(customers.check_in_datetime).format("LL")
                : "",

              check_out_datetime: customers.check_out_datetime
                ? moment(customers.check_out_datetime).format("LL")
                : "",
            });
          });
          setCustomerList(customer_list);
          settotalRecords(res.data.data.count);
          props.setGetCustomerDataCall(false);
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
          // console.log(err, "error----customerList");
        }
      });
  };
  //export csv
  const handleExportCSV = () => {
    setLoader(true);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.exportCustomerCsv(payload)
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
          handleCloseExport();
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

  //export excel
  const handleExportExcel = () => {
    setLoader(true);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.exportCustomerExcel(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status === 1) {
          const excelLink = res.data.data;
          const fileLink = document.createElement("a");
          fileLink.href = excelLink;
          fileLink.download = "download.xlsx";
          fileLink.style.display = "none";
          document.body.appendChild(fileLink);
          fileLink.click();
          document.body.removeChild(document.body.lastChild);
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          handleCloseExport();
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
          //  console.log(err, "error----userprofile");
        }
      });
  };

  return (
    <div className={classes.tableResponsive}>
      {customerList ? (
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
                marginBottom: " 1.25rem",
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
              <MenuItem value="first_name">First Name</MenuItem>
              <MenuItem value="last_name">Last Name</MenuItem>
              <MenuItem value="user_name">Username</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="mobile_num">Contact No.</MenuItem>
              <MenuItem value="check_in_datetime">Check-In Date</MenuItem>
              {/*} <MenuItem value="amenities">Amenities</MenuItem>*/}
              <MenuItem value="room_no">Room No.</MenuItem>
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
            <Tooltip title="Export" placement="bottom">
              <Button
                id="demo-positioned-button"
                aria-controls={exportOpen ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={exportOpen ? "true" : undefined}
                onClick={handleClick}
              >
                <img src={ExportIcon} height="25px" />
              </Button>
            </Tooltip>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={openExport}
              open={exportOpen}
              onClose={handleCloseExport}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={handleExportCSV}>Export as CSV</MenuItem>
              <MenuItem onClick={handleExportExcel}>Export as Excel</MenuItem>
            </Menu>
          </div>
          <MaterialTable
            title={null}
            columns={column}
            // onSearchChange={(e) => handleSearch(e)}
            // onChangePage={(e) => handlePagination(e)}
            // onChangeRowsPerPage={(e) => handleLimit(e)}
            // pageSize="5"
            data={customerList}
            isLoading={loader}
            // onRowClick={onRowClick}
            actions={TableActions}
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
        </>
      ) : (
        ""
      )}
      <ViewCustomer
        openModal={openModal}
        setOpenModal={setOpenModal}
        openDetailModal={openDetailModal}
        setOpenDetailModal={setOpenDetailModal}
        viewCustomerData={viewCustomerData}
        setGetCustomerDataCall={props.setGetCustomerDataCall}
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
