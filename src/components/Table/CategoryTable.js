import React, { useMemo } from "react";
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
// core components
// import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import MaterialTable, { MTableToolbar } from "material-table";
import Api from "Api/ApiUtils";
import CategoryList from "../../views/CategoryList/CategoryList";
import Snackbar from "../../components/Snackbar/Snackbar";
import moment from "moment";
import { Select, MenuItem } from "@material-ui/core";
import InputLabel from "@mui/material/InputLabel";
import { isModuleAccesible, convertStringToCamelCase } from "generalUtils";
import Frame from "../../assets/img/hotel-logo.png";
import ModalImage from "react-modal-image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";

// import ViewStaffDetails from "../../views/StaffTableList/ViewStaffDetails.js";

const styles = {
  settingimage: {
    width: "80px",
    borderRadius: "50%",
    height: "80px",
    objectFit: "cover",
  },
};

const useStyles = makeStyles(styles);
const fixedCategories = [
  "BreakFast Special",
  "Lunch Special",
  "Dinner Special",
];

const access_criteria = "category_management";
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

  //   function onStaffRowClick(event, rowData) {
  //     console.log("on click event row click", event);
  //     // handleClickOpen(rowData);
  //     setViewStaffData(rowData);
  //     setStaffOpenModal(true);
  //     console.log("onrow click-------", rowData);
  //   }
  //   const [viewStaffData, setViewStaffData] = useState({});
  //   const [staffOpenModal, setStaffOpenModal] = useState(false);
  const [tableParams, settableParams] = useState(listing);
  const [loader, setLoader] = React.useState(true);
  const [categoryList, setcategoryList] = useState([]);
  const [cImage, setCImage] = useState({});
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
    console.log("---cImage", cImage);
  }, [cImage]);

  // const onImageChange = (e) => {
  //   setCImage({ selFile: e.target.files[0] });
  //   console.log("--->e.target.files[0]", e.target.files[0]);
  //   console.log("---imqage", cImage);
  // };

  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  let category_list = [];
  // const column = [{ title: "Category Name", field: "name", filtering: true }];

  const [columns, setColumns] = useState([
    {
      title: "Image",
      field: "cImage",
      render: (rowData) => (
        <ModalImage
          large={rowData.cImage ? rowData.cImage : Frame}
          small={rowData.cImage ? rowData.cImage : Frame}
          className={classes.settingimage}
        />
      ),
      editComponent: (props) => {
        console.log("----->props", props);
        return (
          <>
            <input
              type="file"
              className="form-control"
              name="cImage"
              accept="image/png, image/jpeg,image/jpg"
              onChange={(e) => {
                props.rowData.cImage = e.target.files[0];
                setCImage(e.target.files[0]);
              }}
            />
          </>
        );
      },
    },
    {
      title: "Category Name",
      field: "name",
    },
    { title: "Created At", field: "createdAt", editable: "never" },
  ]);

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
    let actions = {
      isEditable: (rowData) =>
        fixedCategories.indexOf(rowData.name) >= 0 ? false : true,
      isDeletable: (rowData) =>
        fixedCategories.indexOf(rowData.name) >= 0 ? false : true,
    };

    if (isAddAccessible) {
      actions.onRowAdd = (newData) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            let isValid = true,
              errMsg = "";
            if (newData.name && newData.name.trim() != "") {
              if (newData.name.length < 20) {
                props.addHotelCategory(newData);
                resolve();
              } else {
                isValid = false;
                errMsg = "You can enter maximum 20 characters";
              }
            } else {
              isValid = false;
              errMsg = "Name is required";
            }
            if (!newData.cImage) {
              isValid = false;
              errMsg = "Image is required";
            }
            if (!isValid) {
              setBR(true);
              setNotification({
                type: "danger",
                message: errMsg,
              });
              reject();
            }
          }, 1000);
        });
    }

    if (isUpdateAccessible) {
      actions.onRowUpdate = (newData) =>
        new Promise((resolve, reject) => {
          console.log("---->cimage", cImage, "---newData", newData);
          setTimeout(() => {
            let isValid = true,
              errMsg = "";
            if (newData.name && newData.name.trim() != "") {
              if (newData.name.length < 20) {
                props.editHotelCategory(newData);
                resolve();
              } else {
                isValid = false;
                errMsg = "You can enter maximum 20 characters";
              }
            } else {
              isValid = false;
              errMsg = "Name is required";
            }
            if (!newData.cImage) {
              isValid = false;
              errMsg = "Image is required";
            }
            if (!isValid) {
              setBR(true);
              setNotification({
                type: "danger",
                message: errMsg,
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
            props.deleteCategory(oldData);
            resolve();
          }, 1000);
        });
    }
    return actions;
  }, [isAddAccessible, isUpdateAccessible, isDeleteAccessible]);

  // useEffect(() => {
  //   console.log("Category table-------");
  //   getHotelcategoryList();

  //   // console.log("category table props--->", props);
  //   // console.log("search page", tableParams.search, tableParams.page);
  // }, [props.getCategoryDataCall]);

  useEffect(() => {
    getHotelcategoryList();
  }, [props.getCategoryDataCall, tableParams]);
  // useEffect(() => {
  //   getHotelcategoryList();
  // }, [tableParams]);

  const handleSearch = (e) => {
    //  console.log("search------->", e);

    settableParams(() => ({
      ...tableParams,
      search: e,
      page: 0,
    }));
  };

  const handleLimit = (e) => {
    // console.log("e----", e.target.value);
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
    settableParams(() => ({
      ...tableParams,
      page: page,
    }));
    //   settableParams(()=>{ page: page - 1 }, () => {
    //     console.log("user list pagination", page);
    //     this.proj_UserList();
    //   });
  };

  const getHotelcategoryList = () => {
    //console.log("inside func get hotel category");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.categoryListing(tableParams, payload)

      .then((res) => {
        setLoader(false);
        //console.log(res);
        if (res && res.data && res.data.data) {
          //  console.log("res data--", res.data.data.rows);
          res.data.data.rows &&
            res.data.data.rows.map((category) => {
              category_list.push({
                cImage: category.image,
                name: convertStringToCamelCase(category.name),
                id: category.id,
                hotel_id: category.hotel_id,
                createdAt: moment(category.createdAt).format("LL"),
              });
            });
          setcategoryList(category_list);
          // console.log("in api category--->", category_list);
          settotalRecords(res.data.data.count);
          props.setGetCategoryDataCall(false);
        } else {
          //  console.log("in else");
          //  console.log(res.msg);
        }
      })
      .catch((err) => {
        setLoader(false);
        // console.log(err, "error----category list");
        if (err) {
          setBR(true);
          setNotification({
            type: "danger",
            message: err?.msg,
          });
          // console.log(err, "error----category list");
        }
      });
  };
  return (
    <div className={classes.tableResponsive}>
      {categoryList ? (
        <div>
          <MaterialTable
            title=""
            columns={columns}
            isLoading={loader}
            onSearchChange={(e) => handleSearch(e)}
            data={categoryList}
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
                // console.log(props);
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
                      <MenuItem value="name">Name</MenuItem>
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

      {/*}  <CategoryList getHotelcategoryList={getHotelcategoryList} />*/}
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
