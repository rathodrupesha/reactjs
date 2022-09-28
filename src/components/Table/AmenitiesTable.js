import React, { useMemo } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
import TablePagination from "@mui/material/TablePagination";
// core components
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import MaterialTable, { MTableToolbar } from "material-table";
import Api from "Api/ApiUtils";
import Snackbar from "../../components/Snackbar/Snackbar";
import moment from "moment";
import { Select, MenuItem } from "@material-ui/core";
import InputLabel from "@mui/material/InputLabel";
import { isModuleAccesible, convertStringToCamelCase } from "generalUtils";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";

const useStyles = makeStyles(styles);

const access_criteria = "amenities";
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

  const [tableParams, settableParams] = useState(listing);
  const [loader, setLoader] = React.useState(true);
  const [amenityList, setAmenityList] = useState([]);
  const [totalRecords, settotalRecords] = useState(0);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  const handleCloseMsg = () => {
    setBR(false);
  };

  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  let amenity_list = [];

  const [columns, setColumns] = useState([
    { title: "Amenities", field: "amenity_name" },
    { title: "Created At", field: "createdAt", editable: "never" },
  ]);

  useEffect(() => {
    getHotelAmenityList();
  }, [tableParams, props.getAmenityDataCall]);

  const isAddAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "create"),
    []
  );

  const isUpdateAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "update"),
    []
  );
  const isDeleteAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "delete"),
    []
  );

  const tableActions = useMemo(() => {
    let actions = {};
    if (isAddAccessible) {
      actions.onRowAdd = (newData) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (newData.amenity_name && newData.amenity_name.trim() != "") {
              if (newData.amenity_name.length < 25) {
                props.addHotelAmenity(newData);
                resolve();
              } else {
                setBR(true);
                setNotification({
                  type: "danger",
                  message: "You can enter maximum 25 characters",
                });
                reject();
              }
            } else {
              setBR(true);
              setNotification({
                type: "danger",
                message: "Amenity Name is required",
              });
              reject();
            }
          }, 1000);
        });
    }
    if (isUpdateAccessible) {
      actions.onRowUpdate = (newData) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (newData.amenity_name && newData.amenity_name.trim() != "") {
              if (newData.amenity_name.length < 25) {
                props.editHotelAmenity(newData);
                resolve();
              } else {
                setBR(true);
                setNotification({
                  type: "danger",
                  message: "You can enter maximum 25 characters",
                });
                reject();
              }
            } else {
              setBR(true);
              setNotification({
                type: "danger",
                message: "Amenity Name is required",
              });
              reject();
            }
          }, 1000);
        });
    }
    if (isDeleteAccessible) {
      actions.onRowDelete = (oldData) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            props.deleteAmenity(oldData);
            resolve();
          }, 1000);
        });
    }
    return actions;
  }, [isAddAccessible, isUpdateAccessible, isDeleteAccessible]);

  const handleSearch = (e) => {
    //console.log("search------->", e);

    settableParams(() => ({
      ...tableParams,
      search: e,
      page: 0,
    }));
  };

  const handleLimit = (e) => {
    //  console.log("e----", e.target.value);
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
    //  console.log("page----", page);
    settableParams(() => ({
      ...tableParams,
      page: page,
    }));
  };

  const getHotelAmenityList = () => {
    // setLoader(true);
    //   console.log("inside func get hotel amenity");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.amenityListing(tableParams, payload)

      .then((res) => {
        setLoader(false);
        //  console.log(res);
        if (res && res.data && res.data.data) {
          //  console.log("res data--", res.data.data.rows);
          res.data.data.rows.map((amenity) => {
            amenity_list.push({
              amenity_name: convertStringToCamelCase(amenity.amenities),
              id: amenity.id,
              hotel_id: amenity.hotel_id,
              createdAt: moment(amenity.createdAt).format("LL"),
            });
          });
          setAmenityList(amenity_list);
          //   console.log("in api amenity--->", amenity_list);
          settotalRecords(res.data.data.count);
          props.setGetAmenityDataCall(false);
        } else {
          // console.log("in else");
          // console.log(res.msg);
        }
      })
      .catch((err) => {
        setLoader(false);
        if (err) {
          // console.log(err, "error----amenity list");
        }
      });
  };
  return (
    <div className={classes.tableResponsive}>
      {amenityList ? (
        <div>
          <MaterialTable
            title=""
            columns={columns}
            onSearchChange={(e) => handleSearch(e)}
            data={amenityList}
            isLoading={loader}
            icons={{
              Edit: () => <EditIcon className="table-icon-color" />,
              Delete: () => <DeleteIcon className="table-icon-color" />,
              Add: () => <AddBoxIcon className="table-icon-color" />,
            }}
            options={{
              filtering: false,
              searchAutoFocus: true,
              emptyRowsWhenPaging: false,
              exportButton: false,
              exportAllData: false,
              paging: false,
              actionsColumnIndex: -1,
            }}
            components={{
              Toolbar: (props) => {
                //  console.log(props);
                return (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
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
                      <MenuItem value="amenities">Name</MenuItem>
                    </Select>
                    <InputLabel id="demo-simple-select-standard-label">
                      &nbsp; Order by &nbsp; &nbsp;
                    </InputLabel>
                    <Select
                      name="sortValue"
                      value={tableParams.sortValue}
                      onChange={handleSortValueChange}
                      style={{ marginRight: "-40px" }}
                    >
                      <MenuItem value="desc">Descending</MenuItem>
                      <MenuItem value="asc">Ascending</MenuItem>
                    </Select>
                    <MTableToolbar {...props} />
                  </div>
                );
              },
            }}
            editable={tableActions}
          />
          <TablePagination
            component="div"
            count={totalRecords}
            page={tableParams.page}
            onPageChange={handlePagination}
            rowsPerPage={tableParams.limits}
            onRowsPerPageChange={handleLimit}
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
      ) : (
        " "
      )}

      {/*}  <amenityList getHotelAmenityList={getHotelAmenityList} />*/}
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
