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
import { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import "assets/css/material-dashboard-react.css";
// core components
//import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
import MaterialTable, { MTableToolbar } from "material-table";
import Api from "Api/ApiUtils";
import moment from "moment";

import Button from "../../components/CustomButtons/Button.js";
import Snackbar from "../Snackbar/Snackbar.js";
import { convertStringToCamelCase } from "generalUtils.js";
import { useParams, useLocation } from "react-router-dom";
import { isModuleAccesible } from "generalUtils";

const styles = {
  settingimage: {
    width: "80px",
    borderRadius: "50%",
    height: "59px",
    objectFit: "contain",
  },
};

const useStyles = makeStyles(styles);
const access_criteria = "bill";
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

  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const [loader, setLoader] = React.useState(true);
  const [tableParams, settableParams] = useState(listing);
  const [billDetails, setBillDetails] = useState([]);
  const [generateBillTotalData, setGenerateBillTotalData] = useState({});
  const [generateBillData, setGenerateBillData] = useState([]);

  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  let billdetails_list = [];
  let generateBilldetails_list = [];

  const isUpdationOfAnyKindAccessible = useMemo(
    () =>
      isModuleAccesible(access_criteria, "create") ||
      isModuleAccesible(access_criteria, "update") ||
      isModuleAccesible(access_criteria, "delete"),
    []
  );

  const column = [
    { title: "Order Id", field: "order_id" },
    { title: "Services", field: "bill_services" },
    { title: "Items", field: "name" },
    { title: "Type", field: "type" },
    { title: "Price", field: "total_amount_unit" },
  ];

  useEffect(() => {
    console.log("----->", generateBillData);
  }, [generateBillData]);

  useEffect(() => {
    console.log(
      "-----> isUpdationOfAnyKindAccessible",
      isUpdationOfAnyKindAccessible
    );
  }, [isUpdationOfAnyKindAccessible]);

  useEffect(() => {
    if (props.open) {
      getUserBillDetails();
    }
  }, [props.open]);

  useEffect(() => {
    if (props.openGenerate) {
      generatedBillDetails();
    }
  }, [props.openGenerate]);

  // generate bill for unpaid
  const generatedBillDetails = () => {
    setLoader(true);
    //  console.log("inside func");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      user_id: props.billData.id,
      check_in_datetime: props.billData.check_in_dateTime,
      check_out_datetime: props.billData.check_out_dateTime,
      // user_id: 44,
      // check_in_datetime: "2022-01-27 11:10:01",
      // check_out_datetime: "2022-12-23 13:44:36",

      // user_id: 44,
      // check_in_datetime: "2022-01-27T11:10:01.000Z",

      // check_out_datetime: "2022-12-23T13:44:36.000Z",
    };

    Api.generateBillDetails(payload)
      .then((res) => {
        setLoader(false);
        // console.log(res);
        if (res && res.data && res.data.data) {
          console.log("list", res.data.data);

          generateBilldetails_list = [];
          //   console.log("data---", res.data.data.rows);
          res.data.data.result.map((g_bill) => {
            generateBilldetails_list.push({
              id: g_bill.id,
              order_id: g_bill.order_id,
              bill_services: g_bill.bill_services
                ? convertStringToCamelCase(g_bill.bill_services)
                : "-",
              name: convertStringToCamelCase(g_bill.name),
              type: convertStringToCamelCase(g_bill.type),
              total_amount_unit:
                user[0]?.currency_symbol + " " + g_bill.total_amount
                  ? g_bill.total_amount
                  : 0,
            });
          });
          setGenerateBillTotalData({
            details: res.data.data.details,
            final_total: res.data.data.total_details.total_amount,
            room_number: res.data.data.total_details.room_number,
          });

          generateBilldetails_list.push({
            id: "payable",
            order_id: " ",
            type: "Payable Amount",
            total_amount_unit:
              user[0]?.currency_symbol +
              " " +
              res.data.data.total_details.total_amount,
            name: "",
            bill_services: "",
          });

          setGenerateBillData(generateBilldetails_list);
        } else {
          //   console.log("in else");
          //  console.log(res.msg);
          setBR(true);
          setNotification({
            type: "danger",
            message: "res.data.msg",
          });
        }
      })
      .catch((err) => {
        setLoader(false);
        if (err && err.msg) {
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          // console.log(err, "error----billDetails");
        }
      });
  };

  // show bill details for paid ones
  const getUserBillDetails = () => {
    setLoader(true);
    //  console.log("inside func");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      // bill_id: parseInt(params.billId),
      bill_id: props.billData.bill_id,
    };
    // console.log("payload hotel id--", payload);
    Api.getViewBillDetails(payload)
      .then((res) => {
        setLoader(false);
        // console.log(res);
        if (res && res.data && res.data.data) {
          // console.log("list", res.data.data.rows);
          billdetails_list = [];
          //   console.log("data---", res.data.data.rows);
          res.data.data.result.map((data) => {
            billdetails_list.push({
              id: data.id,
              order_id: data.order_id,
              bill_services: data.bill_services
                ? convertStringToCamelCase(data.bill_services)
                : "-",
              name: convertStringToCamelCase(data.name),
              type: convertStringToCamelCase(data.type),
              total_amount_unit:
                user[0]?.currency_symbol + " " + data.total_amount
                  ? data.total_amount
                  : 0,
            });
          });
          // billdetails_list.push({
          //   id: "",
          //   order_id: "",
          //   type: "",
          //   total_amount: "",
          //   name: "",
          // });
          // billdetails_list.push({
          //   id: "",
          //   order_id: "",
          //   type: "",
          //   total_amount: "",
          //   name: "",
          // });
          billdetails_list.push({
            id: "payable",
            order_id: "",
            type: "Payable Amount",
            total_amount_unit:
              user[0]?.currency_symbol +
              " " +
              res.data.data.total_details.total_bill_amount,
            name: "",
            bill_services: "",
          });

          setBillDetails(billdetails_list);
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
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
          // console.log(err, "error----billDetails");
        }
      });
  };

  // useEffect(() => {
  //   console.log("----props", props.billData);
  // }, [props.billData]);

  const handleSubmitBill = () => {
    let bill_status;
    if (props.billData.status === "Paid") {
      bill_status = "paid";
    } else {
      bill_status = "un-paid";
    }
    // console.log("----->", props.billData.room_number);
    const payload = {
      ...generateBillTotalData,
      user_id: props.billData.id,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      check_in_datetime: props.billData.check_in_dateTime,
      check_out_datetime: props.billData.check_out_dateTime,
      room_number: props.billData.room_number,
      status: bill_status,
      currency_symbol: user[0]?.currency_symbol,
      currency_name: user[0]?.currency_name,
    };
    console.log("----payload", payload);
    Api.submitGeneratedBill(payload)
      .then((res) => {
        setLoader(false);

        if (res.data.status === 1) {
          // setGetDirectoryDataCall(true);

          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          props.setOpenGenerate(false);
          props.getHotelCurrentUserList();
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          // handleClose();
        } else {
          // props.setOpenGenerate(false);
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })

      .catch((err) => {
        setLoader(false);
        if (err && err.msg) {
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
      {billDetails.length > 0 || generateBillData.length > 0 ? (
        <>
          <MaterialTable
            title={null}
            columns={column}
            // onSearchChange={(e) => handleSearch(e)}
            // onChangePage={(e) => handlePagination(e)}
            // onChangeRowsPerPage={(e) => handleLimit(e)}
            // pageSize="5"
            data={billDetails.length > 0 ? billDetails : generateBillData}
            isLoading={loader}
            // onRowClick={onRowClick}

            options={{
              maxBodyHeight: 500,
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
              rowStyle: (row) => {
                const rowStyling = {
                  fontWeight: "600",
                };
                if (row.id === "payable") {
                  return rowStyling;
                }
              },
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              // marginLeft: "18rem",
              margin: "1rem 0",
            }}
          >
            {props.openGenerate ? (
              <Button
                color="primary"
                style={{
                  width: "15rem",
                  fontWeight: "500",
                  fontSize: "15px",
                  backgroundColor: "green",
                }}
                disabled={!isUpdationOfAnyKindAccessible}
                onClick={handleSubmitBill}
              >
                Submit
              </Button>
            ) : (
              <Button
                disabled
                color="primary"
                style={{
                  width: "15rem",
                  fontWeight: "500",
                  fontSize: "15px",
                  backgroundColor: "green",
                }}
              >
                Paid
              </Button>
            )}
          </div>
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
