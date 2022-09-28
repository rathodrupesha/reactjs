import React, { useCallback, useMemo, useRef } from "react";
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

import { isModuleAccesible } from "generalUtils.js";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomInput from "../../components/CustomInput/CustomInput.js";

const styles2 = {
  settingimage: {
    top: "300",
  },
};

const useStyles = makeStyles(styles2);
const access_criteria = "premium_service_activities_management";

const WEEK_DAYS = [
  { days: "Monday", openTime: "", closeTime: "" },
  { days: "Tuesday", openTime: "", closeTime: "" },
  { days: "Wednesday", openTime: "", closeTime: "" },
  { days: "Thursday", openTime: "", closeTime: "" },
  { days: "Friday", openTime: "", closeTime: "" },
  { days: "Saturday", openTime: "", closeTime: "" },
  { days: "Sunday", openTime: "", closeTime: "" },
];
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

  const isEditSlotAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "update"),
    []
  );
  const isViewSlotAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "view"),
    []
  );
  const isDeleteSlotAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "delete"),
    []
  );

  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const endTimeOnChange = useRef();
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
  const [slotId, setSlotId] = useState("");
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const [viewSlotData, setViewSlotData] = useState({});
  const [slotOpenModal, setSlotOpenModal] = useState(false);
  const [tableParams, settableParams] = useState(listing);
  const [slotList, setSlotList] = useState([]);
  const [totalRecords, settotalRecords] = useState(0);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };
  let slot_list = [];
  const [startTime, setStartTime] = useState("");

  const handleTimingsChange = (index, data) => {
    setSlotList((prev) => {
      return prev.map((wd, idx) => {
        if (index === idx) {
          return data;
        } else return wd;
      });
    });
  };

  const [columns, setColumns] = useState([
    { title: "Day", field: "days", editable: "never " },
    {
      title: "Start Time",
      field: "start_time",
      editComponent: (props) => {
        return (
          <CustomInput
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              step: "1",
              name: "start_time",
              value: props.value,
              type: "time",
              onChange: (e) => {
                let duration = location.state.duration;
                let duration_unit = location.state.duration_unit;
                let endTimeFromStartWithDuration = moment(
                  e.target.value,
                  "HH:mm:ss"
                )
                  .add(duration, duration_unit)
                  .format("HH:mm:ss");

                props.onChange(e.target.value);
                if (endTimeOnChange.current) {
                  setTimeout(() => {
                    endTimeOnChange.current(endTimeFromStartWithDuration);
                  }, 500);
                }
              },
            }}
          />
        );
        // return <StartTimeInput props={props} />;
      },
    },
    {
      title: "End Time",
      field: "end_time",
      editComponent: (props) => {
        endTimeOnChange.current = props.onChange;
        return (
          <CustomInput
            formControlProps={{
              fullWidth: true,
            }}
            inputProps={{
              disabled: true,
              step: "2",
              name: "end_time",
              value: props.value,
              type: "time",
              onChange: (e) => props.onChange(e.target.value),
            }}
          />
        );
      },
    },
  ]);

  const tableActions = useMemo(() => {
    let actions = {};

    if (isEditSlotAccessible) {
      actions.onRowUpdate = (newData, oldData) =>
        new Promise((resolve, reject) => {
          console.log("newData---->", newData);
          props.editHotelSlot(newData);
          // handleTimingsChange(oldData.tableData.id, newData);
          resolve();
        });
    }

    return actions;
  }, [isEditSlotAccessible]);

  useEffect(() => {
    getHotelSlotList();
  }, [props.getSlotDataCall, tableParams]);

  const getHotelSlotList = () => {
    slot_list = [];
    //console.log("inside func get hotel category");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      packagesId: props.package_id,
    };
    Api.slotListing(tableParams, payload)

      .then((res) => {
        setLoader(false);
        //console.log(res);
        if (res && res.data && res.data.data) {
          console.log("res data--", res.data.data.rows);
          res.data.data.rows.map((slots) => {
            slot_list.push({
              start_time: slots.start_time,
              end_time: slots.end_time,
              days: slots.days,
              id: slots.id,
              createdAt: moment(slots.createdAt).format("LL"),
            });
          });
          setSlotList(slot_list);

          settotalRecords(res.data.data.count);

          props.setGetSlotDataCall(false);
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
        console.log(err, "error----category list");
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
      {slotList ? (
        <>
          <MaterialTable
            title={null}
            columns={columns}
            // onRowClick={onServiceRowClick}
            // onSearchChange={(e) => handleSearch(e)}
            data={slotList}
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
            editable={tableActions}
          />
        </>
      ) : null}

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
