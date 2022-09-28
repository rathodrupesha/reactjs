import * as React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import {
  TableCell,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  TableRow,
  Paper,
} from "@material-ui/core";
import Checkbox from "@mui/material/Checkbox";
import Button from "components/CustomButtons/Button.js";
import "../../../src/assets/css/material-dashboard-react.css";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "../../components/Snackbar/Snackbar";
import { useEffect, useState } from "react";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Api from "Api/ApiUtils.js";
import { Dialog } from "@material-ui/core";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@material-ui/core";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import { moduleOperationKeys } from "../../generalUtils";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

const viewKey = "view";

export default function ModuleAccess({
  setModuleAccess,
  moduleAccess,
  editModuleSelect,
  viewOnly = false,
}) {
  // moduleAccess Structure
  // structure : [{view: true, update: false, delete: false, create:false, module_id}]

  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const classes = useStyles();
  const [moduleList, setModuleList] = useState([]);
  const [editModuleList, setEditModuleList] = useState([]);
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  const changeModuleAccess = (moduleId, key, value) => {
    setModuleAccess((prev) => {
      return prev.map((m) => {
        if (m.module_id === moduleId) {
          if (key !== viewKey && value === true) {
            return { ...m, [key]: value, view: true };
          } else if (key === viewKey && value === false) {
            return {
              ...m,
              ...moduleOperationKeys.reduce(
                (tillNow, curr) => ({ ...tillNow, [curr]: false }),
                {}
              ),
            };
          } else return { ...m, [key]: value };
        } else return { ...m };
      });
    });
  };

  useEffect(() => {
    if (editModuleSelect) {
      fetchOldModuleListing();
    } else {
      moduleListing();
    }
  }, [editModuleSelect]);

  // module listing api call for new sub admin
  const moduleListing = () => {
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.hotelModuleListing(payload)

      .then((res) => {
        // setLoader(false);
        //console.log(res);
        if (res && res.data && res.data.data) {
          setModuleList(res.data.data.rows);
          let initialModuleAccess = res.data.data.rows.map((m) => {
            let ac = { module_id: m.id };
            moduleOperationKeys.forEach((mok) => (ac[mok] = false));
            return ac;
          });
          setModuleAccess(initialModuleAccess);
        } else {
          //  console.log("in else");
          //  console.log(res.msg);
        }
      })
      .catch((err) => {
        // setLoader(false);
        if (err) {
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          console.log(err, "error----module list");
        }
      });
  };

  const fetchOldModuleListing = () => {
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    Api.hotelModuleListing(payload)

      .then((res) => {
        // setLoader(false);
        //console.log(res);
        if (res && res.data && res.data.data) {
          setModuleList(res.data.data.rows);
          let initialModuleAccess = res.data.data.rows.map((m) => {
            let ac = { module_id: m.id };
            moduleOperationKeys.forEach((mok) => (ac[mok] = false));
            return ac;
          });
          // setModuleAccess(initialModuleAccess);
        } else {
          //  console.log("in else");
          //  console.log(res.msg);
        }
      })
      .catch((err) => {
        // setLoader(false);
        if (err) {
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          console.log(err, "error----module list");
        }
      });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Module Name</TableCell>
              {moduleOperationKeys.map((mok) => {
                let text = mok.substring(0, 1).toUpperCase() + mok.substring(1);
                return <TableCell>{text}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {moduleList &&
              (moduleAccess || moduleAccess) &&
              moduleList.map((ml, index) => (
                <TableRow>
                  <TableCell>{ml.module}</TableCell>
                  {moduleOperationKeys.map((mok) => {
                    return (
                      <TableCell>
                        {viewOnly ? (
                          moduleAccess[index] ? (
                            moduleAccess[index][mok] ? (
                              <DoneIcon />
                            ) : (
                              <CloseIcon />
                            )
                          ) : (
                            <CloseIcon />
                          )
                        ) : (
                          <Checkbox
                            checked={
                              moduleAccess[index]
                                ? moduleAccess[index][mok]
                                : false
                            }
                            // checked={true}
                            onChange={(e) =>
                              changeModuleAccess(ml.id, mok, e.target.checked)
                            }
                          />
                        )}
                        {/*} <Checkbox
                          checked={
                            moduleAccess[index]
                              ? moduleAccess[index][mok]
                              : moduleAccess[index][mok]
                          }
                          onChange={(e) =>
                            changeModuleAccess(ml.id, mok, e.target.checked)
                          }
                        />*/}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        place="tr"
        setBR={setBR}
        color={notification.type}
        message={notification.message}
        open={br}
        closeNotification={handleCloseMsg}
        close
      />
    </>
  );
}
