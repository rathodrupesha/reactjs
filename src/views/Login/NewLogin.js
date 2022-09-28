import React from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import useForm from "./UseForm.js";
import { validator } from "./Validator.js";
import Background from "../../assets/img/hotel.jpg";
import Card from "@material-ui/core/Card";
import "assets/css/material-dashboard-react.css";
import Logo from "../../assets/img/hotel-logo.png";
// import { CircularProgress } from "@material-ui/core";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";
import CircularProgress from "@mui/material/CircularProgress";
import FrontVideo from "./FrontVideo";

const Login = () => {
  const style = {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${Background})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  const style3 = {
    height: "510px",
    width: "445px",
    left: "1041px",
    top: "113px",
    background: "#FFFFFF",
    position: "fixed",
    //margin:"90px auto",
    padding: 20,
  };
  const avatarStyle = { padding: 20 };
  const btnstyle = { margin: "30px 0" };
  const initState = {
    email: "",
    password: "",
    loader: false,
  };
  const submit = () => {
    //console.log(" Submited");
  };
  //const [br, setBR] = React.useState(true);

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    state,
    errors,
    message,
    br,
    setBR,
    handleCloseMsg,
  } = useForm({
    initState,
    callback: submit,
    validator,
  });

  let isValidForm =
    Object.values(errors).filter((error) => typeof error !== "undefined")
      .length === 0;
  return (
    <Grid
      container
      style={{
        minWidth: "100%",
        height: "100vh",
      }}
    >
      {/* <FrontVideo /> */}
      <Grid item lg={12} sm={12} md={12} style={style}>
        <Card style={style3}>
          <Grid align="center">
            <img src={Logo} style={avatarStyle} alt="fireSpot" />
            <h2>Sign In</h2>
          </Grid>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="email"
              placeholder="Enter username"
              defaultValue={state.email}
              onChange={handleChange}
              error={errors.email ? true : false}
              helperText={errors.email}
              onBlur={handleBlur}
              required
              fullWidth
              style={{
                height: "44",
                padding: "10px 0px",
              }}
            />
            <TextField
              label="Password"
              name="password"
              placeholder="Enter password"
              type="password"
              defaultValue={state.password}
              onChange={handleChange}
              error={errors.password ? true : false}
              helperText={errors.password}
              onBlur={handleBlur}
              required
              fullWidth
              style={{
                height: "44",
                padding: "10px 0px",
              }}
            />
            {/*} <FormControlLabel
                  control={
                  <Checkbox
                      name="checkedB"
                      color="primary"
                  />
                  }
                  label="Remember me"
                  style= {{
                    height:"44",
                    padding: '0px 0px',
                  }}
                />*/}
            <br />

            {/* {loader ? <center><CircularProgress align="centre" color="primary" /></center> : ""} */}
            {/* {console.log("Loader", state)} */}
            <center>
              {state.loader && (
                <CircularProgress align="centre" color="primary" />
              )}
            </center>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              style={btnstyle}
              disabled={!isValidForm}
              fullWidth
            >
              Sign In
            </Button>
          </form>
        </Card>
        {message ? (
          <Snackbar
            place="tr"
            color="danger"
            // icon={AddAlert}
            message={message}
            open={br}
            setBR={setBR}
            closeNotification={handleCloseMsg}
            close
          />
        ) : (
          ""
        )}
      </Grid>
    </Grid>
  );
};

export default Login;
