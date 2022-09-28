import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Divider } from "@material-ui/core";
import AvailableTimings from "./AvailableTimings";

const OpenForAllTimings = ({ open, setOpen, timings }) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle>Timings</DialogTitle>
      <Divider style={{ margin: "0 1rem" }} />
      <DialogContent>
        <AvailableTimings viewOnly={true} timings={timings} />
      </DialogContent>
    </Dialog>
  );
};

export default OpenForAllTimings;
