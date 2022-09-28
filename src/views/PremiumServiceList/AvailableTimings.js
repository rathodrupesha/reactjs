import React, { useState } from "react";
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
import CustomInput from "../../components/CustomInput/CustomInput.js";
import Snackbar from "../../components/Snackbar/Snackbar";

const WEEK_DAYS = [
  { id: 0, days: "Monday", openingStatus: false, openTime: "", closeTime: "" },
  {
    id: 1,
    days: "Tuesday",
    openingStatus: false,
    openTime: "",
    closeTime: "",
  },
  {
    id: 2,
    days: "Wednesday",
    openingStatus: false,
    openTime: "",
    closeTime: "",
  },
  {
    id: 3,
    days: "Thursday",
    openingStatus: false,
    openTime: "",
    closeTime: "",
  },
  { id: 4, days: "Friday", openingStatus: false, openTime: "", closeTime: "" },
  {
    id: 5,
    days: "Saturday",
    openingStatus: false,
    openTime: "",
    closeTime: "",
  },
  { id: 6, days: "Sunday", openingStatus: false, openTime: "", closeTime: "" },
];
// timings state structure

const AvailableTimings = ({ timings, setTimings, viewOnly = false }) => {
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  const handleTimingsChange = (days, key, value) => {
    setTimings((prev) => {
      return prev.map((wd) => {
        if (wd.days === days) {
          if (key === "openingStatus" && value === false) {
            return { ...wd, [key]: value, openTime: "", closeTime: "" };
          } else return { ...wd, [key]: value };
        } else return wd;
      });
    });
  };

  const columnHeaders = ["", "Week Day", "Start", "End"];
  if (viewOnly) columnHeaders.shift(); // remove first element

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columnHeaders.map((ch) => (
                <TableCell>{ch}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {timings.map((wd) => (
              <TableRow>
                {viewOnly ? null : (
                  <TableCell>
                    <Checkbox
                      checked={wd.openingStatus}
                      onChange={(e) =>
                        handleTimingsChange(
                          wd.days,
                          "openingStatus",
                          e.target.checked
                        )
                      }
                    />
                  </TableCell>
                )}
                <TableCell>{wd.days}</TableCell>
                <TableCell>
                  {viewOnly ? (
                    wd.openTime === "00:00:00" ? (
                      "-"
                    ) : (
                      wd.openTime
                    )
                  ) : (
                    <CustomInput
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        step: "2",
                        name: "openTime",
                        value: wd.openTime,
                        type: "time",
                        disabled: !wd.openingStatus,
                        onBlur: (e) =>
                          handleTimingsChange(
                            wd.days,
                            e.target.name,
                            e.target.value
                          ),
                        onChange: (e) =>
                          handleTimingsChange(
                            wd.days,
                            e.target.name,
                            e.target.value
                          ),
                      }}
                      labelProps={{ shrink: true }}
                      // error={formErrors.openTime ? true : false}
                      // helperText={formErrors.openTime}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {viewOnly ? (
                    wd.closeTime === "00:00:00" ? (
                      "-"
                    ) : (
                      wd.closeTime
                    )
                  ) : (
                    <CustomInput
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        step: "2",
                        name: "closeTime",
                        value: wd.closeTime,
                        type: "time",
                        disabled: !wd.openingStatus,
                        onBlur: (e) =>
                          handleTimingsChange(
                            wd.days,
                            e.target.name,
                            e.target.value
                          ),
                        onChange: (e) =>
                          handleTimingsChange(
                            wd.days,
                            e.target.name,
                            e.target.value
                          ),
                      }}
                      labelProps={{ shrink: true }}
                      // error={formErrors.openTime ? true : false}
                      // helperText={formErrors.openTime}
                    />
                  )}
                </TableCell>
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
};

export default AvailableTimings;
