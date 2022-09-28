import React from "react";

import PropTypes from "prop-types";
import { useHistory, useLocation } from "react-router-dom";
// @material-ui/core components

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
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

import Snackbar from "../Snackbar/Snackbar.js";
import { Button, Select, MenuItem } from "@material-ui/core";
import GridItem from "../../components/Grid/GridItem";
import GridContainer from "../../components/Grid/GridContainer";
import moment from "moment";
import InputLabel from "@mui/material/InputLabel";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

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

  const [viewData, setViewData] = useState({});
  const [loader, setLoader] = React.useState(true);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [tableParams, settableParams] = useState(listing);
  const [currentSubscription, setCurrentSubscription] = useState({});
  const [subscriptionDetails, setSubscriptionList] = useState([]);
  const [totalRecords, settotalRecords] = useState(0);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  let subscription_List = [];

  useEffect(() => {
    getSubscriptionHistory();
  }, [tableParams]);

  useEffect(() => {
    if (!openModal) {
      setViewData({});
    }
  }, [openModal]);

  const column = [
    {
      title: "Amount",
      field: "amount",
      // lookup: { 34: "Taj", 63: "Sterling", 45: "Sapphire" },
    },
    {
      title: "Payment Date",
      field: "payment_date",
      filtering: false,
    },
    // { title: "User Name", field: "user_name" },
    { title: "User Limit", field: "user_limit" },

    {
      title: "Staff Limit",
      field: "staff_limit",
    },
    // {
    //   title: "Hotel Description",
    //   field: "hotel_description",
    // },
    {
      title: "Start Date",
      field: "sub_start_date",
    },
    {
      title: "End Date",
      field: "sub_end_date",
    },
    {
      title: "Created At",
      field: "createdAt",
    },
  ];

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

  const handlePagination = (e, page) => {
    // console.log("page----", page);
    settableParams((prev) => ({
      ...prev,
      page: page,
    }));
    //   // settableParams(()=>{ page: page - 1 }, () => {
    //   //   console.log("user list pagination", page);
    //   //   this.proj_UserList();
    //   // });
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

  const getSubscriptionHistory = () => {
    setLoader(true);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.subscriptionHistoryList(tableParams, payload)
      .then((res) => {
        setLoader(false);
        // console.log(">>>>", res);
        subscription_List = [];
        if (res && res.data && res.data.data) {
          res.data.data.rows.map((subs, i) => {
            // console.log("amt--->", amtFixed);

            // console.log(typeof amt);

            subscription_List.push({
              id: subs.id,
              // amount: amtDec,
              amount: subs.amount,
              // amount: Math.round(7890.90989, 2),
              payment_date: moment(subs.payment_date).format("LL"),
              user_limit: subs.user_limit,
              staff_limit: subs.staff_limit,
              sub_start_date: moment(subs.sub_start_date).format("LL"),
              sub_end_date: moment(subs.sub_end_date).format("LL"),
              createdAt: moment(subs.createdAt).format("LL"),
            });
          });
          // console.log(">>>>", subscription_List);
          setCurrentSubscription(res.data.data.currentDetails);

          setSubscriptionList(subscription_List);
          settotalRecords(res.data.data.count);

          // console.log("data set------>", subscription_List);
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
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

  return (
    <div className={classes.tableResponsive}>
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
          <MenuItem value="amount">Amount</MenuItem>
          <MenuItem value="payment_date">Payment Date</MenuItem>
          <MenuItem value="user_limit">User Limit</MenuItem>
          <MenuItem value="staff_limit">Staff Limit</MenuItem>
          <MenuItem value="sub_start_date">Subscription Start Date</MenuItem>
          <MenuItem value="sub_end_date">Subscription End Date</MenuItem>
        </Select>
        <InputLabel>&nbsp; Order by &nbsp; &nbsp;</InputLabel>
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
      <h5
        style={{
          color: "#000000",
          marginTop: "0px",
          minHeight: "auto",
          fontWeight: "500",
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
          marginBottom: "16px",
          textDecoration: "none",
          marginLeft: "15px",
        }}
      >
        Current Subscription
      </h5>
      {currentSubscription ? (
        <div style={{ marginLeft: "20px" }}>
          <GridContainer
            style={{
              padding: "0px 15px !important",
            }}
          >
            <GridItem xs={6} sm={4} md={4}>
              <span style={{ fontWeight: "600" }}>Amount: </span>
              {currentSubscription.amount}
            </GridItem>
            <GridItem xs={6} sm={4} md={4}>
              <span style={{ fontWeight: "600" }}>Staff list: </span>
              {currentSubscription.set_staff_limit}
            </GridItem>
            <GridItem xs={6} sm={4} md={4}>
              <span style={{ fontWeight: "600" }}>
                Subscription Start Date:{" "}
              </span>
              {moment(currentSubscription.sub_start_date).format("LL")}
            </GridItem>

            <GridItem xs={6} sm={4} md={4}>
              <span style={{ fontWeight: "600" }}>Payment Date: </span>
              {moment(currentSubscription.payment_date).format("LL")}
            </GridItem>
            <GridItem xs={6} sm={4} md={4}>
              <span style={{ fontWeight: "600" }}>User Limit: </span>
              {currentSubscription.set_user_limit}
            </GridItem>

            <GridItem xs={6} sm={4} md={4}>
              <span style={{ fontWeight: "600" }}>Subscription End Date: </span>
              {moment(currentSubscription.sub_end_date).format("LL")}
            </GridItem>
          </GridContainer>
        </div>
      ) : null}

      {subscriptionDetails ? (
        <>
          <MaterialTable
            title={null}
            // title="Hotel Owners List"
            columns={column}
            // onSearchChange={(e) => handleSearch(e)}

            data={subscriptionDetails}
            isLoading={loader}
            options={{
              toolbar: false,
              filtering: false,
              search: false,
              emptyRowsWhenPaging: false,
              // exportButton: {
              //   csv: true,
              //   pdf: false,
              // },
              exportButton: false,

              exportAllData: false,
              paging: false,
              // exportCsv: () => handleExportCSV(),
              // exportPdf: () => handleExportExcel(),
              //   actionsColumnIndex: -1,
              sorting: false,
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
