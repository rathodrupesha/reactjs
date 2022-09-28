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

const access_criteria = "bill";
export default function CustomTable(props) {
  const classes = useStyles();
  const { tableHead, tableData, tableHeaderColor } = props;

  const [loader, setLoader] = React.useState(true);
  const [extraItems, setExtraItems] = useState([]);

  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  const handleCloseMsg = () => {
    setBR(false);
  };

  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  let extra_items_list = [];

  const [columns, setColumns] = useState([
    { title: "Order Id", field: "order_id", editable: "never" },
    { title: "Item", field: "item_name" },
    { title: "Price", field: "price" },
  ]);

  useEffect(() => {
    getExtraItemsList();
  }, [props.getExtraItemsDataCall]);

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
            if (
              newData.item_name &&
              newData.price &&
              newData.item_name.trim() != ""
            ) {
              if (newData.item_name.length < 25) {
                props.addExtraItems(newData);
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
                message: "Item name and price are required",
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
            if (
              newData.item_name &&
              newData.price &&
              newData.item_name.trim() != ""
            ) {
              if (newData.item_name.length < 25) {
                props.editExtraItems(newData);
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
                message: "Item Name and price are required",
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
            props.deleteExtraItems(oldData);
            resolve();
          }, 1000);
        });
    }
    return actions;
  }, [isAddAccessible, isUpdateAccessible, isDeleteAccessible]);

  const getExtraItemsList = () => {
    const payload = {
      user_id: props.billData.id,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.extraItemsBillListing(payload)

      .then((res) => {
        setLoader(false);

        if (res && res.data && res.data.data) {
          res.data.data.map((offline) => {
            extra_items_list.push({
              item_name: convertStringToCamelCase(offline.item_name),
              id: offline.id,
              hotel_id: offline.hotel_id,
              order_id: offline.offline_ord_id,
              price: offline.price,
            });
          });
          setExtraItems(extra_items_list);

          props.setGetExtraItemsDataCall(false);
        } else {
          console.log("error---", res.msg);
          setBR(true);
          setNotification({
            type: "danger",
            message: res.msg,
          });
        }
      })
      .catch((err) => {
        setLoader(false);
        if (err) {
          console.log("error---", err);
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
      {extraItems ? (
        <div>
          <MaterialTable
            title="Extra Items"
            columns={columns}
            data={extraItems}
            isLoading={loader}
            icons={{
              Edit: () => <EditIcon className="table-icon-color" />,
              Delete: () => <DeleteIcon className="table-icon-color" />,
              Add: () => <AddBoxIcon className="table-icon-color" />,
            }}
            options={{
              filtering: false,
              searchAutoFocus: false,
              emptyRowsWhenPaging: false,
              exportButton: false,
              exportAllData: false,
              paging: false,
              actionsColumnIndex: -1,
              search: false,
              headerStyle: {
                position: "sticky",
                top: "0",
              },
              maxBodyHeight: 400,
            }}
            editable={tableActions}
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
