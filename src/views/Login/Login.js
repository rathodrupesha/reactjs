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

import Background from "../../assets/img/hotel_background.png";

const Login = () => {
  const paperStyle = {
    padding: 20,
    height: "60vh",
    width: 380,
    margin: "90px auto",
    justifyContent: "center",
    alignItems: "center",
  };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
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
  const btnstyle = { margin: "8px 0" };
  const initState = {
    email: "",
    password: "",
  };
  const submit = () => {
    // console.log(" Submited");
  };
  const {
    handleChange,
    handleSubmit,
    handleBlur,
    state,
    errors,
    countryCode,
  } = useForm({
    initState,
    callback: submit,
    validator,
  });
  const [loader, setLoader] = React.useState(false);

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
      <Grid item lg={6}>
        <div style={style}></div>
      </Grid>
      <Grid item lg={6} style={{}}>
        .
        <Paper elevation={10} style={paperStyle}>
          <Grid align="center">
            <Avatar style={avatarStyle}>
              <LockOutlinedIcon />
            </Avatar>
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
            />
            {/*}   <FormControlLabel
                    control={
                    <Checkbox
                        name="checkedB"
                        color="primary"
                    />
                    }
                    label="Remember me"
                  />*/}
            <Button
              type="submit"
              color="primary"
              variant="contained"
              style={btnstyle}
              disabled={!isValidForm}
              fullWidth
            >
              Sign in
            </Button>
          </form>
          {/* <Typography >
                     <Link href="#" >
                        Forgot password ?
                </Link>
                </Typography>
                <Typography > Do you have an account ?
                     <Link href="#" >
                        Sign Up 
                </Link>
                </Typography> */}
        </Paper>
        ..
      </Grid>
    </Grid>
  );
};

export default Login;
