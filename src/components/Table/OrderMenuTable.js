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
// // core components
// import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import MaterialTable, { MTableToolbar } from "material-table";
import Api from "Api/ApiUtils";
import ViewMenuDetails from "views/OrderMenuList/ViewMenuDetails";
import { Select, MenuItem, Button } from "@material-ui/core";
import Snackbar from "../Snackbar/Snackbar.js";
import InputLabel from "@mui/material/InputLabel";
import moment from "moment";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import ListItemText from "@mui/material/ListItemText";
import Frame from "../../assets/img/hotel-logo.png";
import Checkbox from "@mui/material/Checkbox";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import Menu from "@mui/material/Menu";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { isModuleAccesible } from "generalUtils.js";

const styles = {
  settingimage: {
    width: "80px",
    borderRadius: "50%",
    height: "80px",
    objectFit: "cover",
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
        tooltip: "View Menu",
        // onClick: (event, rowData) => alert("You saved " + rowData.name),
        onClick: (event, rowData) => handleShowDetails(event, rowData),
      });
    }
    if (isUpdateAccessible) {
      tableActions.push({
        icon: () => <EditIcon className="table-icon-color" />,
        tooltip: "Edit Menu",
        // onClick: (event, rowData) => alert("You saved " + rowData.name),
        onClick: (event, rowData) => handleEditData(event, rowData),
      });
    }
    if (isDeleteAccessible) {
      tableActions.push({
        icon: () => <DeleteIcon className="table-icon-color" />,
        tooltip: "Delete Menu",
        onClick: (event, rowData) => handleDeleteDialog(event, rowData),
      });
    }
    return tableActions;
  }, [isViewAccessible, isUpdateAccessible, isDeleteAccessible]);

  function onMenuRowClick(event, rowData) {
    //console.log("on click event row click", event);
    // handleClickOpen(rowData);
    setViewMenuData(rowData);
    setMenuOpenModal(true);
    //console.log("onrow click-------", rowData);
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

  const [categories, setCategories] = useState([]);
  const [category_selected, setCategory_Selected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userId, setUserId] = useState({ hotelId: "", user_id: "" });
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [viewMenuData, setViewMenuData] = useState({});
  const [menuOpenModal, setMenuOpenModal] = useState(false);
  const [tableParams, settableParams] = useState(listing);
  const [menuList, setMenuList] = useState([]);
  const [category_list, setCategory_list] = useState([]);
  const [totalRecords, settotalRecords] = useState(0);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  let menu_list = [];

  const column = [
    {
      title: "Image",
      field: "image",
      render: (rowData) => (
        <ModalImage
          large={rowData.image ? rowData.image : Frame}
          small={rowData.image ? rowData.image : Frame}
          className={classes.settingimage}
        />
      ),
    },
    { title: "Name", field: "name" },
    { title: "Price", field: "price_unit" },
    { title: "Preparation Time", field: "time" },

    // { title: "Description", field: "description" },
    { title: "Category", field: "category" },
    { title: "Created At", field: "createdAt" },
  ];

  useEffect(() => {
    if (props.getMealDataCall) {
      getHotelMenuList();
    }
  }, [props.getMealDataCall]);

  useEffect(() => {
    getHotelMenuList();
  }, [tableParams]);

  // useEffect(() => {
  //   getHotelMenuList();
  // }, [tableParams]);

  // edit modal
  const handleEditData = (event, rowData) => {
    // console.log(">>edit data", event, rowData);
    setViewMenuData(rowData);
    setMenuOpenModal(true);
  };
  const handleShowDetails = (event, rowData) => {
    setViewMenuData(rowData);
    setOpenDetailModal(true);
  };

  const handleDeleteDialog = (event, rowData) => {
    setOpenDeleteDialog(true);
    setUserId({ hotelId: rowData.hotel_id, user_id: rowData.id });
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setUserId({ hotelId: "", user_id: "" });
  };
  //delete api
  const handleDelete = () => {
    const payload = {
      hotel_id: userId.hotelId,
      meal_id: userId.user_id,
    };
    Api.deleteHotelMenu(payload)
      .then((res) => {
        if (res.data.status === 1) {
          handleCloseDelete();
          getHotelMenuList();
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

  // useEffect(() => {
  //   defaultCategoryList();
  // }, []);

  useEffect(() => {
    createdCategoryList();
  }, []);

  // //default category list for checkbox

  // const defaultCategoryList = () => {
  //   console.log("category list--");
  //   const payload = {
  //     hotel_id: user[0].super_admin_users[0].hotel_id,
  //   };
  //   const default_key = 1;
  //   Api.mealCategoryList(payload, default_key)
  //     .then((res) => {
  //       console.log(" list of category", res);
  //       console.log("res", res.status);

  //       if (res.data.status == 1) {
  //         setCategories(res.data.data.rows);
  //       }
  //     })

  //     .catch((err) => {
  //       if (err && err.msg) {
  //         console.log("in catch");
  //         console.log(err.msg);
  //         setCategories(() => ({
  //           ...categories,
  //         }));
  //       }
  //     });
  // };

  //created category list for drpdown
  const createdCategoryList = () => {
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    // const default_key = 0;
    Api.mealCategoryList(payload)
      .then((res) => {
        // console.log(" list of category", res);
        //  console.log("res", res.status);

        if (res.data.status == 1) {
          setCategories(res.data.data.rows);
        }
      })

      .catch((err) => {
        if (err && err.msg) {
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          //  console.log("in catch");
          //  console.log(err.msg);
          setCategories(() => ({
            ...categories,
          }));
        }
      });
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // console.log(">>--value selected", value);
    setCategory_Selected(typeof value === "string" ? value.split(",") : value);
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
    // console.log("page----", page);
    settableParams(() => ({
      ...tableParams,
      page: page,
    }));
  };

  const getHotelMenuList = () => {
    setLoader(true);
    // console.log("inside func");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    const category_id = category_selected.join(",");
    Api.menuListing(tableParams, payload, category_id)

      .then((res) => {
        setLoader(false);
        //  console.log(res);
        if (res && res.data && res.data.data) {
          menu_list = [];
          // console.log("res data--", res.data.data.rows);
          res.data.data.rows.map((menu) => {
            // let mealCategory = menu.hotel_meal_category;

            // mealCategory.map((c) => {
            //   category_array.push(c.meal_category.name);
            // });
            // setCategory_list(category_array);
            // console.log("categories table---->", category_array);
            menu_list.push({
              id: menu.id,
              name: menu.name,
              price: menu.price,
              unit: menu.unit,
              price_unit: menu.unit + " " + menu.price,
              preparation_time: menu.preparation_time,
              preparation_unit: menu.preparation_unit,
              time: menu.preparation_time + " " + menu.preparation_unit,
              description: menu.description,
              createdAt: moment(menu.createdAt).format("LL"),
              hotel_id: menu.hotel_id,
              category: menu.hotel_meal_category
                .map((hmc) => hmc.meal_category.name)
                .join(", "),
              image: menu.image,
              // category: mealCategory.map((c) => {
              //   category_array.push(c.meal_category.name);
              // }),
            });
          });

          setMenuList(menu_list);
          settotalRecords(res.data.data.count);
          props.setGetMealDataCall(false);
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
          //  console.log(err, "error----userprofile");
        }
      });
  };

  return (
    <div className={classes.tableResponsive}>
      {menuList ? (
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
              label="Category"
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
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              {/*}   <MenuItem value="unit">Price Unit</MenuItem>*/}
              <MenuItem value="preparation_time">Preparation Time</MenuItem>
              {/*}  <MenuItem value="preparation_unit">Preparation Unit</MenuItem>*/}
              {/*} <MenuItem value="description">Description</MenuItem>*/}
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
            // onSearchChange={(e) => handleSearch(e)}
            data={menuList}
            isLoading={loader}
            // onRowClick={onMenuRowClick}
            options={{
              search: false,
              toolbar: false,
              // searchAutoFocus: true,
              actionsColumnIndex: -1,
              filtering: false,
              emptyRowsWhenPaging: false,
              exportButton: false,
              exportAllData: false,
              paging: false,
              sorting: false,
            }}
            actions={TableActions}
            // components={{
            //   Toolbar: (props) => {
            //     //  console.log(props);
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
            //           label="Category"
            //           multiple
            //           value={category_selected}
            //           onChange={handleFilterChange}
            //           name="category_selected"
            //           style={{ marginRight: "30px", width: "139px" }}
            //           variant="standard"
            //           renderValue={(selected) =>
            //             categories
            //               .filter((category) => selected.includes(category.id))
            //               .map((record) => record.name)
            //               .join(", ")
            //           }
            //           MenuProps={MenuProps}
            //         >
            //           {categories.map((category) => (
            //             <MenuItem key={category.id} value={category.id}>
            //               <Checkbox
            //                 checked={
            //                   category_selected.indexOf(category.id) > -1
            //                 }
            //               />

            //               <ListItemText primary={category.name} />
            //             </MenuItem>
            //           ))}
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
            //           <MenuItem value="name">Name</MenuItem>
            //           <MenuItem value="price">Price</MenuItem>
            //           <MenuItem value="unit">Price Unit</MenuItem>
            //           <MenuItem value="preparation_time">
            //             Preparation Time
            //           </MenuItem>
            //           <MenuItem value="preparation_unit">
            //             Preparation Unit
            //           </MenuItem>
            //           <MenuItem value="description">Description</MenuItem>
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
      <ViewMenuDetails
        menuOpenModal={menuOpenModal}
        openDetailModal={openDetailModal}
        setOpenDetailModal={setOpenDetailModal}
        setMenuOpenModal={setMenuOpenModal}
        viewMenuData={viewMenuData}
        setGetMealDataCall={props.setGetMealDataCall}
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
