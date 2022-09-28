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
import Rating from "@mui/material/Rating";
import { Tooltip } from "@mui/material";

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
  const [viewRequestComplainData, setViewRequestComplainData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [tableParams, settableParams] = useState(listing);
  const [reviewList, setReviewList] = useState([]);
  const [totalRecords, settotalRecords] = useState(0);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };
  const filter_rating = ["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"];

  let review_list = [];
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

    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    // { title: "User Name", field: "user_name" },
    {
      title: "Rating",
      field: "rating",
      render: (rowData) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Rating
            name="half-rating-read"
            precision={0.5}
            value={rowData.rating ? rowData.rating : 0}
            readOnly
          />
        </div>
      ),
    },
    { title: "Comment", field: "comment" },
    { title: "Created At", field: "createdAt" },
  ];

  //   useEffect(() => {
  //     if (props.getPremiumDataCall) {
  //       getHotelReviewList();
  //     }
  //   }, [props.getPremiumDataCall]);

  useEffect(() => {
    getHotelReviewList();
  }, [tableParams]);

  const handleShowDetails = (event, rowData) => {
    setViewRequestComplainData(rowData);
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

  const getHotelReviewList = () => {
    setLoader(true);
    //  console.log("inside func");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    // console.log("payload hotel id--", payload);
    Api.hotelReviewListing(tableParams, payload)
      .then((res) => {
        setLoader(false);
        // console.log(res);
        if (res && res.data && res.data.data) {
          // console.log("list", res.data.data.rows);
          review_list = [];
          //   console.log("data---", res.data.data.rows);
          res.data.data.rows.map((reviews) => {
            review_list.push({
              rating: reviews.ratting ? reviews.ratting : null,
              comment: reviews.comment,
              user_name: reviews.user.user_name,
              email: reviews.user.email,
              name: reviews.user.first_name + " " + reviews.user.last_name,
              address: reviews.user.address,
              mobile_num: reviews.user.mobile_num,
              createdAt: moment(reviews.createdAt).format("LL"),
            });
          });

          setReviewList(review_list);
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
          // console.log(err, "error----reviewList");
        }
      });
  };

  return (
    <div className={classes.tableResponsive}>
      {reviewList ? (
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
            {/*}   <InputLabel>Filter &nbsp; &nbsp;</InputLabel>

            <Select
              multiple
              value={category_selected}
              onChange={handleFilterChange}
              name="category_selected"
              style={{ marginRight: "30px", width: "139px" }}
              variant="standard"
              renderValue={(selected) =>
                categories
                  .filter((category) => selected.includes(category.id))
                  .map((record) => record.name)
                  .join(", ")
              }
              MenuProps={MenuProps}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Checkbox
                    checked={category_selected.indexOf(category.id) > -1}
                  />

                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
              </Select>*/}
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
              {/* <MenuItem value="first_name">First Name</MenuItem>
            <MenuItem value="last_name">Last Name</MenuItem>*/}
              <MenuItem value="ratting">Rating</MenuItem>
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
            data={reviewList}
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
      {/*}  <Viewreviewservice
        openModal={openModal}
        setOpenModal={setOpenModal}
        openDetailModal={openDetailModal}
        setOpenDetailModal={setOpenDetailModal}
        viewRequestComplainData={viewRequestComplainData}
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
