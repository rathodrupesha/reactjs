import React, { useMemo } from "react";
import PropTypes from "prop-types";
import ModalImage from "react-modal-image";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import "assets/css/material-dashboard-react.css";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { useState, useEffect } from "react";
import TablePagination from "@mui/material/TablePagination";
// // core components
// import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import MaterialTable, { MTableToolbar } from "material-table";
import Api from "Api/ApiUtils";
import ViewStaffDetails from "../../views/StaffTableList/ViewStaffDetails.js";
import { Select, MenuItem, Button } from "@material-ui/core";
import Snackbar from "../Snackbar/Snackbar.js";
import moment from "moment";
import InputLabel from "@mui/material/InputLabel";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Frame from "../../assets/img/hotel-logo.png";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import ExportIcon from "../../assets/img/exportIcon.jpg";
import Tooltip from "@mui/material/Tooltip";
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
// for multiple category select
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

export default function CustomTable(props) {
  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor } = props;
  const listing = {
    search: "",
    page: 0,
    limits: 10,
    sortValue: "desc",
    sortField: "createdAt",
    // master_service_id: "",
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
        tooltip: "View Details",
        // onClick: (event, rowData) => alert("You saved " + rowData.name),
        onClick: (event, rowData) => handleShowDetails(event, rowData),
      });
    }
    if (isUpdateAccessible) {
      tableActions.push({
        icon: () => <EditIcon className="table-icon-color" />,
        tooltip: "Edit User",
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

  // function onStaffRowClick(event, rowData) {
  //   console.log("on click event row click", event);
  //   // handleClickOpen(rowData);
  //   setViewStaffData(rowData);
  //   setStaffOpenModal(true);
  //   console.log("onrow click-------", rowData);
  // }
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
  const [services, setServices] = useState([]);
  const [service_selected, setService_selected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userId, setUserId] = useState({ hotelId: "", user_id: "" });
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const [viewStaffData, setViewStaffData] = useState({});
  const [staffOpenModal, setStaffOpenModal] = useState(false);
  const [tableParams, settableParams] = useState(listing);
  const [staffList, setStaffList] = useState([]);
  const [totalRecords, settotalRecords] = useState(0);

  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  const handleCloseMsg = () => {
    setBR(false);
  };

  useEffect(() => {
    serviceList();
  }, []);
  // service lists

  const serviceList = () => {
    //console.log("service list--");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.masterServiceList(payload)
      .then((res) => {
        //  console.log(" list of service", res);
        // console.log("res", res.status);

        if (res.data.status == 1) {
          setServices(res.data.data);
        }
      })

      .catch((err) => {
        if (err && err.msg) {
          //  console.log("in catch");
          // console.log(err.msg);
        }
      });
  };

  let staff_list = [];
  const column = [
    {
      title: "Image",
      field: "image",
      render: (rowData) => (
        // <img
        //   src={rowData.image ? rowData.image : Frame}
        //   style={{ width: 70, borderRadius: "50%", height: 70 }}
        // />

        <ModalImage
          large={rowData.image ? rowData.image : Frame}
          small={rowData.image ? rowData.image : Frame}
          className={classes.settingimage}
        />
      ),
    },
    { title: "Name", field: "name", filtering: false },
    { title: "User Name", field: "user_name", filtering: false },
    { title: "Email", field: "email", type: "email", filtering: false },
    {
      title: "Contact number",
      field: "m_no",
      type: "number",
      filtering: false,
    },
    // { title: "Address", field: "address" },
    {
      title: "Service",
      field: "service",
    },
    { title: "Created At", field: "createdAt" },
  ];

  useEffect(() => {
    if (props.getStaffDataCall) {
      getHotelStaffList();
    }
  }, [props.getStaffDataCall]);

  useEffect(() => {
    getHotelStaffList();
  }, [tableParams]);

  // edit modal
  const handleEditData = (event, rowData) => {
    // console.log(">>edit data", event, rowData);
    setViewStaffData(rowData);
    setStaffOpenModal(true);
  };
  const handleShowDetails = (event, rowData) => {
    setViewStaffData(rowData);
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
    Api.deleteHotelStaff(userId.user_id, payload)
      .then((res) => {
        if (res.data.status == 1) {
          // console.log(res.data);
          // props.setGetSuperAdminDataCall(true);
          handleCloseDelete();
          getHotelStaffList();
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
  useEffect(() => {
    // console.log("service selected--->", tableParams.master_service_id);
    // console.log("service selected--->", service_selected);
  }, [service_selected]);

  let serviceId;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // console.log(">>--value selected", value);
    setService_selected(typeof value === "string" ? value.split(",") : value);
    settableParams((prev) => ({
      ...prev,
      page: 0,
    }));
    // settableParams((prev) => ({
    //   ...prev,
    //   master_service_id: service_selected.join(","),
    //   page: 0,
    // }));
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
    settableParams(() => ({
      ...tableParams,
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
    //console.log("page----", page);
    settableParams(
      () => ({
        ...tableParams,
        page: page,
      }),
      () => getHotelStaffList()
    );
    // settableParams(()=>{ page: page - 1 }, () => {
    //   console.log("user list pagination", page);
    //   this.proj_UserList();
    // });
  };

  const getHotelStaffList = () => {
    setLoader(true);
    //  console.log("inside func");
    const payload = {
      // hotel_id: 2,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    const master_service_id = service_selected.join(",");
    Api.staffListing(tableParams, payload, master_service_id)

      .then((res) => {
        setLoader(false);
        // console.log(res);
        if (res && res.data && res.data.data) {
          staff_list = [];
          // console.log("res data--", res.data.data.rows);
          res.data.data.rows.map((staff, i) => {
            staff_list.push({
              hotel_id: staff.hotel_id,
              id: staff.id,
              user_id: staff.user_id,
              first_name: staff.staffHotelId.first_name,
              last_name: staff.staffHotelId.last_name,
              name:
                staff.staffHotelId.first_name +
                " " +
                staff.staffHotelId.last_name,
              user_name: staff.staffHotelId.user_name,
              email: staff.staffHotelId.email,
              m_no: staff.staffHotelId.mobile_num,
              address: staff.staffHotelId.address,
              service: staff.hotel_staff
                .map((hs) => hs.current_master_service.name)
                .join(", "),
              createdAt: moment(staff.staffHotelId.createdAt).format("LL"),
              image: staff.staffHotelId.image,
              // service: staff.hotel_staff.current_master_service.name,
            });
          });
          setStaffList(staff_list);
          settotalRecords(res.data.data.count);
          props.setGetStaffDataCall(false);
          // settotalRecords((totalRecords: res.data.data.count));
        } else {
          ///  console.log("in else");
          // console.log(res.msg);
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
  //export csv
  const handleExportCSV = () => {
    setLoader(true);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.exportStaffCsv(payload)
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
    Api.exportStaffExcel(payload)
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
          // console.log(err, "error----userprofile");
        }
      });
  };

  return (
    <div className={classes.tableResponsive}>
      {staffList ? (
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
                marginBottom: "1rem",
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
              Filter &nbsp; &nbsp;
            </InputLabel>

            <Select
              multiple
              name="service_selected"
              value={service_selected}
              onChange={handleFilterChange}
              style={{ marginRight: "30px", width: "139px" }}
              renderValue={(selected) =>
                services
                  .filter((service) => selected.includes(service.id))
                  .map((record) => record.name)
                  .join(", ")
              }
              MenuProps={MenuProps}
            >
              {services.map((service) =>
                service.name != "Directory" ? (
                  <MenuItem key={service.id} value={service.id}>
                    <Checkbox
                      checked={service_selected.indexOf(service.id) > -1}
                    />

                    <ListItemText primary={service.name} />
                  </MenuItem>
                ) : null
              )}
            </Select>
            <InputLabel id="demo-simple-select-standard-label">
              Sort by &nbsp; &nbsp;
            </InputLabel>

            <Select
              name="sortField"
              value={tableParams.sortField}
              onChange={handleSortFieldChange}
              style={{ marginRight: "30px" }}
            >
              <MenuItem value="createdAt">Created At</MenuItem>
              <MenuItem value="first_name">Name</MenuItem>
              <MenuItem value="user_name">Username</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="mobile_num">Mobile no.</MenuItem>
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
            data={staffList}
            isLoading={loader}
            // onRowClick={onStaffRowClick}
            options={{
              // searchAutoFocus: true,
              toolbar: false,
              filtering: false,
              emptyRowsWhenPaging: false,
              exportButton: false,
              // exportCsv: () => handleExportCSV(),
              // exportPdf: () => handleExportExcel(),
              exportAllData: false,
              sorting: false,
              paging: false,
              actionsColumnIndex: -1,
            }}
            // localization={{
            //   toolbar: {
            //     exportCSVName: "Export as CSV",
            //     exportPDFName: "Export as Excel",
            //   },
            // }}
            actions={TableActions}
            // components={{
            //   Toolbar: (props) => {
            //     // console.log(props);
            //     return (
            //       <div
            //         style={{
            //           width: "100%",
            //           display: "flex",
            //           justifyContent: "flex-end",
            //           alignItems: "center",
            //         }}
            //       >
            //         <InputLabel id="demo-simple-select-standard-label">
            //           Filter &nbsp; &nbsp;
            //         </InputLabel>

            //         <Select
            //           multiple
            //           name="service_selected"
            //           value={service_selected}
            //           onChange={handleFilterChange}
            //           style={{ marginRight: "30px", width: "139px" }}
            //           renderValue={(selected) =>
            //             services
            //               .filter((service) => selected.includes(service.id))
            //               .map((record) => record.name)
            //               .join(", ")
            //           }
            //           MenuProps={MenuProps}
            //         >
            //           {services.map((service) =>
            //             service.name != "Directory" ? (
            //               <MenuItem key={service.id} value={service.id}>
            //                 <Checkbox
            //                   checked={
            //                     service_selected.indexOf(service.id) > -1
            //                   }
            //                 />

            //                 <ListItemText primary={service.name} />
            //               </MenuItem>
            //             ) : null
            //           )}
            //         </Select>
            //         <InputLabel id="demo-simple-select-standard-label">
            //           Sort by &nbsp; &nbsp;
            //         </InputLabel>

            //         <Select
            //           name="sortField"
            //           value={tableParams.sortField}
            //           onChange={handleSortFieldChange}
            //           style={{ marginRight: "30px" }}
            //         >
            //           <MenuItem value="createdAt">Created At</MenuItem>
            //           <MenuItem value="first_name">Name</MenuItem>
            //           <MenuItem value="user_name">Username</MenuItem>
            //           <MenuItem value="email">Email</MenuItem>
            //           <MenuItem value="mobile_num">Mobile no.</MenuItem>
            //         </Select>
            //         <InputLabel id="demo-simple-select-standard-label">
            //           &nbsp; Order by &nbsp; &nbsp;
            //         </InputLabel>
            //         <Select
            //           name="sortValue"
            //           value={tableParams.sortValue}
            //           onChange={handleSortValueChange}
            //           style={{ marginRight: "-40px" }}
            //         >
            //           <MenuItem value="desc">Descending</MenuItem>
            //           <MenuItem value="asc">Ascending</MenuItem>
            //         </Select>
            //         <MTableToolbar {...props} />
            //       </div>
            //     );
            //   },
            // }}
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
                Are you sure to delete?
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
      <ViewStaffDetails
        staffOpenModal={staffOpenModal}
        setStaffOpenModal={setStaffOpenModal}
        openDetailModal={openDetailModal}
        setOpenDetailModal={setOpenDetailModal}
        viewStaffData={viewStaffData}
        setGetStaffDataCall={props.setGetStaffDataCall}
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
