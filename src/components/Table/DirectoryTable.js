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

import moment from "moment";
import { Select, MenuItem, Button } from "@material-ui/core";
import Snackbar from "../Snackbar/Snackbar.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CircularProgress from "@mui/material/CircularProgress";
import EditDirectory from "../../views/Directory/EditDirectory.js";
import { isModuleAccesible } from "generalUtils.js";
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

    if (isUpdateAccessible) {
      tableActions.push({
        icon: () => <EditIcon className="table-icon-color" />,
        tooltip: "Edit Directory",
        // onClick: (event, rowData) => alert("You saved " + rowData.name),
        onClick: (event, rowData) => handleEditData(event, rowData),
      });
    }
    if (isDeleteAccessible) {
      tableActions.push({
        icon: () => <DeleteIcon className="table-icon-color" />,
        tooltip: "Delete Directory",
        onClick: (event, rowData) => handleDeleteDialog(event, rowData),
      });
    }
    return tableActions;
  }, [isUpdateAccessible, isDeleteAccessible]);

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
  const [directory_id, setDirectory_id] = useState("");

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [viewDirectoryData, setViewDirectoryData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [tableParams, settableParams] = useState(listing);
  const [directoryList, setDirectoryList] = useState([]);
  const [totalRecords, settotalRecords] = useState(0);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  let directory_list = [];
  const column = [
    { title: "Name", field: "name" },
    { title: "Email", field: "email", type: "email" },
    { title: "Contact Number", field: "number" },
  ];

  useEffect(() => {
    if (props.getDirectoryDataCall) {
      getHotelDirectoryList();
    }
  }, [props.getDirectoryDataCall]);

  useEffect(() => {
    getHotelDirectoryList();
  }, [tableParams]);

  const handleEditData = (event, rowData) => {
    // console.log(">>edit data", event, rowData);
    setViewDirectoryData(rowData);
    setOpenModal(true);
  };
  const handleShowDetails = (event, rowData) => {
    setViewDirectoryData(rowData);
    setOpenDetailModal(true);
  };

  const handleDeleteDialog = (event, rowData) => {
    setOpenDeleteDialog(true);
    setDirectory_id(rowData.id);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setDirectory_id("");
  };
  //delete api
  const handleDelete = () => {
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      id: directory_id,
    };
    Api.deleteHotelDirectory(payload)
      .then((res) => {
        if (res.data.status == 1) {
          // console.log(res.data);
          // props.setGetSuperAdminDataCall(true);
          handleCloseDelete();
          getHotelDirectoryList();
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

  const getHotelDirectoryList = () => {
    setLoader(true);

    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };

    Api.directoryListing(payload)
      .then((res) => {
        setLoader(false);

        if (res && res.data && res.data.data) {
          directory_list = [];
          res.data.data.rows.map((directories, i) => {
            directory_list.push({
              id: directories.id,
              hotel_id: directories.hotel_id,
              name: directories.name,
              email: directories.email,
              number: directories.number,
            });
          });
          setDirectoryList(directory_list);
          settotalRecords(res.data.data.count);
          props.setGetDirectoryDataCall(false);
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
          // console.log(err, "error----directoryList");
        }
      });
  };

  return (
    <div className={classes.tableResponsive}>
      {directoryList ? (
        <>
          {/* <div
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
                marginRight: "0.75rem",
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
            </div>*/}
          <MaterialTable
            title={null}
            columns={column}
            // onSearchChange={(e) => handleSearch(e)}
            // onChangePage={(e) => handlePagination(e)}
            // onChangeRowsPerPage={(e) => handleLimit(e)}
            // pageSize="5"
            data={directoryList}
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
      <EditDirectory
        openModal={openModal}
        setOpenModal={setOpenModal}
        viewDirectoryData={viewDirectoryData}
        setGetDirectoryDataCall={props.setGetDirectoryDataCall}
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
