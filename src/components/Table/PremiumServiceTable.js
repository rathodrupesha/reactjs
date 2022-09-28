import React, { useMemo } from "react";
import ModalImage from "react-modal-image";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
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
import TextField from "@mui/material/TextField";
import ViewPremiumService from "../../views/PremiumServiceList/ViewPremiumService.js";
import OpenForAllTimings from "../../views/PremiumServiceList/OpenForAllTimings";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { isModuleAccesible } from "generalUtils.js";
import CardGiftcardTwoToneIcon from "@mui/icons-material/CardGiftcardTwoTone";
import packageIcon from "../../assets/img/package.png";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const styles = {
  settingimage: {
    width: "80px",
    borderRadius: "50%",
    height: "80px",
    objectFit: "cover",
  },
};

const useStyles = makeStyles(styles);
const access_criteria = "premium_service_activities_management";
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

  const isEditAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "update"),
    []
  );
  const isViewAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "view"),
    []
  );
  const isDeleteAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "delete"),
    []
  );

  function onRowClick(event, rowData) {
    // console.log("on click event row click", event);
    // handleClickOpen(rowData);
    setViewPremiumData(rowData);
    setOpenModal(true);
    // console.log("onrow click-------", rowData);
  }
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const [loader, setLoader] = React.useState(true);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [premium_serviceId, setPremium_serviceId] = useState({
    hotelId: "",
    premium_id: "",
  });

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [viewPremiumData, setViewPremiumData] = useState({});
  const [openForAllTimingsModal, setOpenForAllTimingsModal] = useState({
    open: false,
    timings: [],
  });
  const [openModal, setOpenModal] = useState(false);
  const [tableParams, settableParams] = useState(listing);
  const [premiumList, setPremiumList] = useState([]);
  const [totalRecords, settotalRecords] = useState(0);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  let premium_list = [];
  const column = [
    {
      title: "Image",
      field: "main_image",
      render: (rowData) => (
        <ModalImage
          large={rowData.main_image ? rowData.main_image : Frame}
          small={rowData.main_image ? rowData.main_image : Frame}
          className={classes.settingimage}
        />
      ),
    },

    { title: "Name", field: "name" },

    { title: "Created At", field: "createdAt" },
  ];

  useEffect(() => {
    if (props.getPremiumDataCall) {
      getHotelPremiumList();
    }
  }, [props.getPremiumDataCall]);

  useEffect(() => {
    getHotelPremiumList();
  }, [tableParams]);

  const handleEditData = (event, rowData) => {
    console.log(">>edit data", event, rowData);
    setViewPremiumData(rowData);
    setOpenModal(true);
  };

  const handleShowDetails = (event, rowData) => {
    setViewPremiumData(rowData);
    setOpenDetailModal(true);
  };

  //view packages details
  const packageData = (event, rowData) => {
    //console.log("RowData", rowData)
    // const subsParams = new URLSearchParams();
    // subsParams.set("psId", rowData.premium_id);
    history.push(`/superadmin/premium-services/${rowData.premium_id}/packages`);
    // history.push(`/superadmin/packages?${subsParams.toString()}`);
  };

  const showAllTimings = (event, rowData) => {
    // api call here
    // also check if 00:00:00 received, replace it with "" - empty string

    //
    const availableTime = [];
    const payload = {
      hotel_id: rowData.hotel_id,
      ps_id: rowData.premium_id,
    };
    Api.showOpenForAllTimings(payload)
      .then((res) => {
        if (res.data.status === 1) {
          setOpenForAllTimingsModal({
            open: true,
            timings: res.data.data.rows.sort((a, b) => {
              console.log("a.id", a.id);
              return a.id - b.id;
            }),
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

  const handleDeleteDialog = (event, rowData) => {
    setOpenDeleteDialog(true);
    setPremium_serviceId({
      hotelId: rowData.hotel_id,
      premium_id: rowData.premium_id,
    });
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setPremium_serviceId({ hotelId: "", premium_id: "" });
  };
  //delete api
  const handleDelete = () => {
    const payload = {
      hotel_id: premium_serviceId.hotelId,
      premiumSerId: premium_serviceId.premium_id,
    };
    // Api.deleteHotelCustomer(payload);
    Api.deleteHotelPremiumService(payload)
      .then((res) => {
        if (res.data.status == 1) {
          handleCloseDelete();
          getHotelPremiumList();
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

  const getHotelPremiumList = () => {
    setLoader(true);
    //  console.log("inside func");
    const payload = {
      // hotel_id: 2,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    // console.log("payload hotel id--", payload);
    Api.premiumListing(tableParams, payload)
      .then((res) => {
        setLoader(false);
        // console.log(res);
        if (res && res.data && res.data.data) {
          // console.log("list", res.data.data.rows);
          premium_list = [];
          res.data.data.rows.map((premiums, i) => {
            premium_list.push({
              main_image: premiums.main_image,
              hotel_id: premiums.hotel_id,
              createdAt: moment(premiums.createdAt).format("LL"),
              name: premiums.name,
              premium_id: premiums.id,
              openForAll: premiums.openForAll,
            });
          });
          setPremiumList(premium_list);
          settotalRecords(res.data.data.count);
          props.setGetPremiumDataCall(false);
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
          // console.log(err, "error----premiumList");
        }
      });
  };

  return (
    <div className={classes.tableResponsive}>
      {premiumList ? (
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
                marginBottom: " 1.20rem",
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
              <MenuItem value="name">Name</MenuItem>
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
            data={premiumList}
            isLoading={loader}
            // onRowClick={onRowClick}
            actions={[
              {
                icon: () => <RemoveRedEyeIcon className="table-icon-color" />,
                tooltip: "View Details",
                hidden: !isViewAccessible,
                // onClick: (event, rowData) => alert("You saved " + rowData.name),
                onClick: (event, rowData) => handleShowDetails(event, rowData),
              },
              {
                icon: () => <EditIcon className="table-icon-color" />,
                tooltip: "Edit Details",
                hidden: !isEditAccessible,
                // onClick: (event, rowData) => alert("You saved " + rowData.name),
                onClick: (event, rowData) => handleEditData(event, rowData),
              },
              (rowData) => {
                if (!rowData.openForAll) {
                  return {
                    icon: () => <img src={packageIcon} />,
                    tooltip: "Package Details",
                    // onClick: (event, rowData) => alert("You saved " + rowData.name),
                    onClick: (event, rowData) => packageData(event, rowData),
                  };
                } else {
                  return {
                    icon: () => <AccessTimeIcon className="table-icon-color" />,
                    tooltip: "Available Timings Details",

                    onClick: (event, rowData) => showAllTimings(event, rowData),
                  };
                }
              },
              {
                icon: () => <DeleteIcon className="table-icon-color" />,
                tooltip: "Delete Details",
                hidden: !isDeleteAccessible,
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
      <ViewPremiumService
        openModal={openModal}
        setOpenModal={setOpenModal}
        openDetailModal={openDetailModal}
        setOpenDetailModal={setOpenDetailModal}
        viewPremiumData={viewPremiumData}
        setGetPremiumDataCall={props.setGetPremiumDataCall}
      />
      <OpenForAllTimings
        open={openForAllTimingsModal.open}
        setOpen={(val) =>
          setOpenForAllTimingsModal((prev) => ({ ...prev, open: val }))
        }
        timings={openForAllTimingsModal.timings}
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
