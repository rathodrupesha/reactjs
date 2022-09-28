import React from "react";
import ModalImage from "react-modal-image";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
import TablePagination from "@mui/material/TablePagination";
import "assets/css/material-dashboard-react.css";
// core components
//import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import MaterialTable, { MTableToolbar } from "material-table";
import Api from "Api/ApiUtils";
import { Select, MenuItem, Button } from "@material-ui/core";
import Snackbar from "../Snackbar/Snackbar.js";
import InputLabel from "@mui/material/InputLabel";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import ViewSubAdminDetails from "../../views/SubAdmin/ViewSubAdminDetails";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const [loader, setLoader] = React.useState(true);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [userId, setUserId] = useState("");

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [viewSubAdminData, setViewSubAdminAdminData] = useState({});
  const [subAdminOpenModal, setSubAdminOpenModal] = useState(false);
  const [tableParams, settableParams] = useState(listing);
  const [superAdminList, setSuperAdminList] = useState([]);
  const [totalRecords, settotalRecords] = useState(0);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  let superAdmin_list = [];
  const column = [
    { title: "Name", field: "name" },
    { title: "User Name", field: "user_name" },
    { title: "Email", field: "email" },
    { title: "Contact Number", field: "mobile_num" },
    { title: "Created At", field: "createdAt" },
  ];

  useEffect(() => {
    if (props.getSubAdminDataCall) {
      getHotelSubAdminList();
    }
  }, [props.getSubAdminDataCall]);

  useEffect(() => {
    getHotelSubAdminList();
  }, [tableParams]);

  const handleEditData = (event, rowData) => {
    // console.log(">>edit data", event, rowData);
    setViewSubAdminAdminData(rowData);
    setSubAdminOpenModal(true);
  };
  const handleShowDetails = (event, rowData) => {
    setViewSubAdminAdminData(rowData);
    setOpenDetailModal(true);
  };

  const handleDeleteDialog = (event, rowData) => {
    setOpenDeleteDialog(true);
    setUserId(rowData.user_id);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setUserId("");
  };
  //delete api
  const handleDelete = () => {
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      subAdmin_Id: userId,
    };
    Api.deleteHotelSubAdmin(payload)
      .then((res) => {
        if (res.data.status == 1) {
          handleCloseDelete();
          getHotelSubAdminList();
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

  const getHotelSubAdminList = () => {
    setLoader(true);
    //  console.log("inside func");
    const payload = {
      // hotel_id: 2,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    // console.log("payload hotel id--", payload);
    Api.subAdminListing(tableParams, payload)
      .then((res) => {
        setLoader(false);
        // console.log(res);
        if (res && res.data && res.data.data) {
          // console.log("list", res.data.data.rows);
          superAdmin_list = [];
          res.data.data.rows.map((sa, i) => {
            superAdmin_list.push({
              hotel_id: sa.hotel_id,
              user_id: sa.user_id,
              first_name: sa.sub_admin.first_name,
              last_name: sa.sub_admin.last_name,
              name: sa.sub_admin.first_name + " " + sa.sub_admin.last_name,
              user_name: sa.sub_admin.user_name,
              email: sa.sub_admin.email,
              address: sa.sub_admin.address,
              mobile_num: sa.sub_admin.mobile_num,
              createdAt: moment(sa.sub_admin.createdAt).format("LL"),
            });
          });
          setSuperAdminList(superAdmin_list);
          settotalRecords(res.data.data.count);
          props.setGetSubAdminDataCall(false);
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
          // console.log(err, "error----superAdminList");
        }
      });
  };

  return (
    <div className={classes.tableResponsive}>
      {superAdminList ? (
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
          </div>
          <MaterialTable
            title={null}
            columns={column}
            // onSearchChange={(e) => handleSearch(e)}
            // onChangePage={(e) => handlePagination(e)}
            // onChangeRowsPerPage={(e) => handleLimit(e)}
            // pageSize="5"
            data={superAdminList}
            isLoading={loader}
            // onRowClick={onRowClick}
            actions={[
              {
                icon: () => <RemoveRedEyeIcon className="table-icon-color" />,
                tooltip: "View Details",
                // onClick: (event, rowData) => alert("You saved " + rowData.name),
                onClick: (event, rowData) => handleShowDetails(event, rowData),
              },
              {
                icon: () => <EditIcon className="table-icon-color" />,
                tooltip: "Edit User",
                // onClick: (event, rowData) => alert("You saved " + rowData.name),
                onClick: (event, rowData) => handleEditData(event, rowData),
              },
              {
                icon: () => <DeleteIcon className="table-icon-color" />,
                tooltip: "Delete User",
                onClick: (event, rowData) => handleDeleteDialog(event, rowData),
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
      <ViewSubAdminDetails
        subAdminOpenModal={subAdminOpenModal}
        setSubAdminOpenModal={setSubAdminOpenModal}
        openDetailModal={openDetailModal}
        setOpenDetailModal={setOpenDetailModal}
        viewSubAdminData={viewSubAdminData}
        setGetSubAdminDataCall={props.setGetSubAdminDataCall}
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
