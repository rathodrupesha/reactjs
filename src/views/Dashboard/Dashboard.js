import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import Badge from "@material-ui/core/Badge";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import StatTable from "components/Table/StatTable.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Api from "../../Api/ApiUtils";
import { useEffect, useState } from "react";
import DateRangeIcon from "@mui/icons-material/DateRange";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FeedIcon from "@mui/icons-material/Feed";
import RevenueIcon from "../../assets/img/cash-multiple.png";
import ArticleIcon from "@mui/icons-material/Article";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { bugs, website, server } from "variables/general.js";
import FastfoodIcon from "@mui/icons-material/Fastfood";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { Link } from "react-router-dom";
import { grayColor } from "assets/jss/material-dashboard-react";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  let newDate = new Date();
  let date = newDate.getDate();

  const [dashboardData, setDashboardData] = useState({});
  useEffect(() => {
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.showDashBoardDetails(payload)
      .then((res) => {
        console.log(res);
        if (res && res.data && res.data.data) {
          console.log("response dashoboard-->", res.data.data);
          setDashboardData(res.data.data);
        } else {
          console.log("in else");
          console.log(res.msg);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(err, "error----");
        }
      });
  }, []);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={4}>
          <Card style={{ fontSize: "1.25rem", height: "80%" }}>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <img
                  src={RevenueIcon}
                  style={{ height: "100%", width: "100%" }}
                />
              </CardIcon>

              <p
                style={{
                  color: grayColor[8],
                  textAlign: "center",
                  fontSize: "25px",
                  marginRight: "3rem",
                  fontWeight: "400",
                }}
              >
                Revenue
              </p>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div>
                  <p className={classes.cardCategory}>Amount</p>
                  <h3
                    // className={classes.cardTitle}
                    style={{ color: "black" }}
                  >
                    {dashboardData?.total_amount?.amount}
                  </h3>
                </div>
                <div>
                  <p className={classes.cardCategory}>Unit</p>
                  <h3
                    // className={classes.cardTitle}
                    style={{ color: "black" }}
                  >
                    {user[0]?.currency_symbol}
                  </h3>
                </div>
              </div>
            </CardHeader>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <Card style={{ fontSize: "1.25rem", height: "80%" }}>
            <CardHeader color="primary" stats icon>
              <CardIcon color="primary">
                <Accessibility />
              </CardIcon>

              <p
                style={{
                  color: grayColor[8],
                  textAlign: "center",
                  fontSize: "25px",
                  marginRight: "3rem",
                  fontWeight: "400",
                }}
              >
                Users
              </p>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div>
                  <Link to="/superadmin/staffs">
                    <p className={classes.cardCategory}>Staff</p>
                    <h3
                      // className={classes.cardTitle}
                      style={{ color: "black" }}
                    >
                      {dashboardData?.hotel_staff}
                    </h3>
                  </Link>
                </div>
                <div>
                  <Link to="/superadmin/users">
                    <p className={classes.cardCategory}>Customers</p>
                    <h3
                      // className={classes.cardTitle}
                      style={{ color: "black" }}
                    >
                      {dashboardData?.users}
                    </h3>
                  </Link>
                </div>
              </div>
            </CardHeader>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <Link to="/superadmin/requests">
            <Card style={{ fontSize: "1.25rem", height: "80%" }}>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <FeedIcon />
                </CardIcon>

                <p
                  style={{
                    color: grayColor[8],
                    textAlign: "center",
                    fontSize: "25px",
                    marginRight: "3rem",
                    fontWeight: "400",
                  }}
                >
                  Requests
                </p>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <p className={classes.cardCategory}>Completed</p>
                    <h3
                      // className={classes.cardTitle}
                      style={{ color: "black" }}
                    >
                      {dashboardData?.complatedRequest}
                    </h3>
                  </div>
                  <div>
                    <p className={classes.cardCategory}>Pending</p>
                    <h3
                      // className={classes.cardTitle}
                      style={{ color: "black" }}
                    >
                      {dashboardData?.pendingRequest}
                    </h3>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Link to="/superadmin/bookings">
            <Card style={{ fontSize: "1.25rem", height: "80%" }}>
              <CardHeader color="info" stats icon>
                {/*} <CardIcon color="info" style={{ width: "100px" }}>
                  <img
                    src={BookingIcon}
                    alt="Booking icon"
                    style={{ height: "50px", width: "50px", color: "white" }}
                  />
                </CardIcon>*/}
                <CardIcon color="info">
                  <DateRangeIcon />
                </CardIcon>

                <p
                  style={{
                    color: grayColor[8],
                    textAlign: "center",
                    fontSize: "25px",
                    marginRight: "3rem",
                    fontWeight: "400",
                  }}
                >
                  Bookings
                </p>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <p className={classes.cardCategory}>Completed</p>
                    <h3
                      // className={classes.cardTitle}
                      style={{ color: "black" }}
                    >
                      {dashboardData?.complatedbookings}
                    </h3>
                  </div>
                  <div>
                    <p className={classes.cardCategory}>Pending</p>
                    <h3
                      // className={classes.cardTitle}
                      style={{ color: "black" }}
                    >
                      {dashboardData?.pendingbookings}
                    </h3>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Link to="/superadmin/orders">
            <Card style={{ fontSize: "1.25rem", height: "80%" }}>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <RestaurantIcon />
                </CardIcon>

                <p
                  style={{
                    color: grayColor[8],
                    textAlign: "center",
                    fontSize: "25px",
                    marginRight: "3rem",
                    fontWeight: "400",
                  }}
                >
                  Orders
                </p>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <p className={classes.cardCategory}>Completed</p>
                    <h3
                      // className={classes.cardTitle}
                      style={{ color: "black" }}
                    >
                      {dashboardData?.complatedOrders}
                    </h3>
                  </div>
                  <div>
                    <p className={classes.cardCategory}>Pending</p>
                    <h3
                      // className={classes.cardTitle}
                      style={{ color: "black" }}
                    >
                      {dashboardData?.pendingOrders}
                    </h3>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Link to="/superadmin/request-complains">
            <Card style={{ fontSize: "1.25rem", height: "80%" }}>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <ArticleIcon />
                </CardIcon>

                <p
                  style={{
                    color: grayColor[8],
                    textAlign: "center",
                    fontSize: "25px",
                    marginRight: "3rem",
                    fontWeight: "400",
                  }}
                >
                  Request Complaints
                </p>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <p className={classes.cardCategory}>Resolved</p>
                    <h3
                      // className={classes.cardTitle}
                      style={{ color: "black" }}
                    >
                      {dashboardData?.resolvedComplainRequest}
                    </h3>
                  </div>
                  <div>
                    <p className={classes.cardCategory}>Pending</p>
                    <h3
                      // className={classes.cardTitle}
                      style={{ color: "black" }}
                    >
                      {dashboardData?.pendingComplainRequest}
                    </h3>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Link to="/superadmin/booking-complains">
            <Card style={{ fontSize: "1.25rem", height: "80%" }}>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <LibraryBooksIcon />
                </CardIcon>

                <p
                  style={{
                    color: grayColor[8],
                    textAlign: "center",
                    fontSize: "25px",
                    marginRight: "3rem",
                    fontWeight: "400",
                  }}
                >
                  Booking Complaints
                </p>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <p className={classes.cardCategory}>Resolved</p>
                    <h3
                      // className={classes.cardTitle}
                      style={{ color: "black" }}
                    >
                      {dashboardData?.resolveBookingComplain}
                    </h3>
                  </div>
                  <div>
                    <p className={classes.cardCategory}>Pending</p>
                    <h3
                      // className={classes.cardTitle}
                      style={{ color: "black" }}
                    >
                      {dashboardData?.pendingBookingComplain}
                    </h3>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Link to="/superadmin/orders-complains">
            <Card style={{ fontSize: "1.25rem", height: "80%" }}>
              <CardHeader color="danger" stats icon>
                <CardIcon color="danger">
                  <FastfoodIcon />
                </CardIcon>

                <p
                  style={{
                    color: grayColor[8],
                    textAlign: "center",
                    fontSize: "25px",
                    marginRight: "3rem",
                    fontWeight: "400",
                  }}
                >
                  Order Complaints
                </p>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <p className={classes.cardCategory}>Resolved</p>
                    <h3
                      // className={classes.cardTitle}
                      style={{ color: "black" }}
                    >
                      {dashboardData?.resolvedComplainRequest}
                    </h3>
                  </div>
                  <div>
                    <p className={classes.cardCategory}>Pending</p>
                    <h3
                      // className={classes.cardTitle}
                      style={{ color: "black" }}
                    >
                      {dashboardData?.pendingOrderComplain}
                    </h3>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </GridItem>
      </GridContainer>
    </div>
  );
}
