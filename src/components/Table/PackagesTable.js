import React, { useMemo } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import "assets/css/material-dashboard-react.css";
// core components
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { useState, useEffect } from "react";
import TablePagination from "@mui/material/TablePagination";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import MaterialTable, { MTableToolbar } from "material-table";
import Api from "Api/ApiUtils";
import ViewServiceDetails from "views/ServiceList/ViewServiceDetails";
import { Select, MenuItem, Button } from "@material-ui/core";
import Snackbar from "../Snackbar/Snackbar.js";
import InputLabel from "@mui/material/InputLabel";
import moment from "moment";
// import "assets/css/material-dashboard-react.css";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import { useHistory, useLocation, useParams } from "react-router-dom";
import ViewPackageDetails from "../../views/PackagesList/ViewPackageDetails.js";
import { isModuleAccesible } from "generalUtils.js";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const styles2 = {
  settingimage: {
    top: "300",
  },
};

const useStyles = makeStyles(styles2);
const access_criteria = "premium_service_activities_management";
export default function CustomTable(props) {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor } = props;
  const listing = {
    search: "",
    page: 0,
    limits: 10,
    sortValue: "desc",
    sortField: "createdAt",
  };

  const isEditPackageAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "update"),
    []
  );
  const isViewPackageAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "view"),
    []
  );
  const isDeletePackageAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "delete"),
    []
  );

  function onServiceRowClick(event, rowData) {
    // console.log("on click event row click", event);
    // handleClickOpen(rowData);
    setViewPackageData(rowData);
    setPackageOpenModal(true);
    //  console.log("onrow click-------", rowData);
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
  const [packageState, setPackageState] = useState({
    hotelId: "",
    packageId: "",
  });
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const [viewPackageData, setViewPackageData] = useState({});
  const [packageOpenModal, setPackageOpenModal] = useState(false);
  const [tableParams, settableParams] = useState(listing);
  const [packageList, setPackageList] = useState([]);
  const [totalRecords, settotalRecords] = useState(0);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };
  let package_list = [];
  const column = [
    { title: "Name", field: "name" },
    { title: "Amount", field: "total_amountUnit" },
    { title: "Duration", field: "total_durationUnit" },
    { title: "Created At", field: "createdAt" },
  ];

  useEffect(() => {
    if (props.getPackageDataCall) {
      getHotelPackageList();
    }
  }, [props.getPackageDataCall]);

  useEffect(() => {
    getHotelPackageList();
  }, [tableParams]);

  //slot details
  const handleSlotDetailsData = (event, rowData) => {
    console.log("---->rowData", rowData.duration);
    const psId = parseInt(params.psId);
    console.log("on click slot details---", psId);
    history.push({
      pathname: `/superadmin/premium-services/${psId}/packages/${rowData.id}/slots`,
      state: {
        duration: rowData.duration,
        duration_unit: rowData.duration_unit,
      },
    });
  };

  // edit modal
  const handleEditData = (event, rowData) => {
    // console.log(">>edit data", event, rowData);
    setViewPackageData(rowData);
    setPackageOpenModal(true);
  };
  const handleShowDetails = (event, rowData) => {
    console.log("--->", rowData);
    setViewPackageData(rowData);
    setOpenDetailModal(true);
  };

  const handleDeleteDialog = (event, rowData) => {
    // console.log(rowData);
    setOpenDeleteDialog(true);
    setPackageState({ hotelId: rowData.hotel_id, packageId: rowData.id });
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setPackageState({ hotelId: "", packageId: "" });
  };
  //delete api
  const handleDelete = () => {
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      packagesId: packageState.packageId,
    };
    Api.deletePackages(payload)
      .then((res) => {
        if (res.data.status == 1) {
          // console.log(res.data);
          // props.setGetSuperAdminDataCall(true);
          handleCloseDelete();
          getHotelPackageList();
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
    // console.log("e----", e.target.value);
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
    // console.log("page----", page);
    settableParams((prev) => ({
      ...prev,
      page: page,
    }));
  };

  const getHotelPackageList = () => {
    setLoader(true);
    // console.log("inside func");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      premiumSerId: parseInt(params.psId),
    };
    // console.log("service list payload", payload);
    Api.packageListing(tableParams, payload)

      .then((res) => {
        setLoader(false);
        // console.log(res);
        if (res && res.data) {
          console.log(res.data.data);
          package_list = [];
          //  console.log("res data--", res.data.data.rows);
          res.data.data.rows.map((packages, i) => {
            package_list.push({
              id: packages.id,
              name: packages.name,
              amount: packages.amount,
              amount_unit: packages.amount_unit,
              total_amountUnit: packages.amount_unit + " " + packages.amount,
              duration: packages.duration,
              duration_unit: packages.duration_unit,
              total_durationUnit:
                packages.duration + " " + packages.duration_unit,
              createdAt: moment(packages.createdAt).format("LL"),
            });
          });
          setPackageList(package_list);
          settotalRecords(res.data.data.count);
          props.setGetPackageDataCall(false);
        } else {
          // console.log("in else");
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

  //export excel

  return (
    <div className={classes.tableResponsive}>
      {packageList ? (
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
            {/*}  <Box
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
            </Box>*/}
            <InputLabel id="demo-simple-select-standard-label">
              Sort by &nbsp; &nbsp;
            </InputLabel>

            <Select
              name="sortField"
              className="sort-filter-degsn-staff"
              value={tableParams.sortField}
              onChange={handleSortFieldChange}
              style={{ marginRight: "30px" }}
            >
              <MenuItem value="createdAt">Created At</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="amount">Amount</MenuItem>
              <MenuItem value="duration">Duration</MenuItem>
            </Select>
            <InputLabel id="demo-simple-select-standard-label">
              &nbsp; Order by &nbsp; &nbsp;
            </InputLabel>
            <Select
              name="sortValue"
              value={tableParams.sortValue}
              onChange={handleSortValueChange}
              style={{ marginRight: "30px" }}
            >
              <MenuItem value="desc">Descending</MenuItem>
              <MenuItem value="asc">Ascending</MenuItem>
            </Select>
          </div>
          <MaterialTable
            title={null}
            columns={column}
            // onRowClick={onServiceRowClick}
            // onSearchChange={(e) => handleSearch(e)}
            data={packageList}
            isLoading={loader}
            options={{
              search: false,
              toolbar: false,

              actionsColumnIndex: -1,
              filtering: false,
              emptyRowsWhenPaging: false,
              exportButton: false,
              exportAllData: false,
              paging: false,
              sorting: false,
            }}
            actions={[
              {
                icon: () => <RemoveRedEyeIcon className="table-icon-color" />,
                tooltip: "View Slots",
                hidden: !isViewPackageAccessible,
                // onClick: (event, rowData) => alert("You saved " + rowData.name),
                onClick: (event, rowData) => handleShowDetails(event, rowData),
              },
              {
                icon: () => <EditIcon className="table-icon-color" />,
                tooltip: "Edit Package",
                hidden: !isEditPackageAccessible,
                // onClick: (event, rowData) => alert("You saved " + rowData.name),
                onClick: (event, rowData) => handleEditData(event, rowData),
              },
              {
                icon: () => <AccessTimeIcon className="table-icon-color" />,
                tooltip: "Slot Details",
                // onClick: (event, rowData) => alert("You saved " + rowData.name),
                onClick: (event, rowData) =>
                  handleSlotDetailsData(event, rowData),
              },
              {
                icon: () => <DeleteIcon className="table-icon-color" />,
                tooltip: "Delete Package",
                hidden: !isDeletePackageAccessible,
                onClick: (event, rowData) => handleDeleteDialog(event, rowData),
              },
            ]}
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
                Are you sure want to delete?
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
      <ViewPackageDetails
        packageOpenModal={packageOpenModal}
        setPackageOpenModal={setPackageOpenModal}
        openDetailModal={openDetailModal}
        setOpenDetailModal={setOpenDetailModal}
        viewPackageData={viewPackageData}
        setGetPackageDataCall={props.setGetPackageDataCall}
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
