import {
  Alert,
  Button,
  Container,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Api from "Api/ApiUtils.js";
import { Formik } from "formik";
import React, { forwardRef, useState } from "react";

const GetInTouch = forwardRef(({}, ref) => {
  const [isShow, setIsShow] = useState(false);
  const [showContent, setShowContent] = useState({
    type: "",
    message: "",
  });
  return (
    <Container fixed maxWidth="lg" sx={{ marginTop: "80px" }} ref={ref} className="GetInTouch">
      <Typography
        component={"div"}
        sx={{
          maxWidth: "100%",
          left: "165px",
          top: "5237.88px",
          background: "#FFFFFF",
          boxShadow: "0px 0px 60px rgba(143, 143, 143, 0.22)",
          borderRadius: "10px",
          alignItems: "center",
          opacity: 1,
          padding: {
            lg: "58px 58px 60px",
            md: "58px 58px 60px",
            sm: "40px 26px 60px",
            xs: "40px 22px 50px",
          },
          position: "sticky",
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="left"
          color="text.primary" className="animate-charcter"
          gutterBottom
          sx={{
            fontFamily: "Manrope",
            fontStyle: "normal",
            fontWeight: { lg: 800, md: 700, sm: 700, xs: 600 },
            fontSize: { lg: "36px", md: "34px", sm: "32px", xs: "30px" },
            lineHeight: { lg: "64px", md: "62px", sm: "50px", xs: "58px" },
            fontFeatureSettings: "'liga' off",
            color: "#333252",
            padding: "0 0 0 2px",
            marginBottom: 0,
          }}
        >
          Get in touch
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          component="p"
          align="left"
          sx={{
            fontFamily: "Manrope",
            fontStyle: "normal",
            fontWeight: { lg: 400, md: 350, sm: 300, xs: 250 },
            fontSize: { lg: "18px", md: "16px", sm: "14px", xs: "12px" },
            lineHeight: { lg: "32px", md: "30px", sm: "28px", xs: "26px " },
            fontFeatureSettings: "'liga' off",
            color: "#18191F",
            padding: "0 0 0 6px",
            marginBottom: { lg: "46px", md: "36px", sm: "16px", xs: "8px" },
          }}
        >
          Have some more questions, please don’t hesitate to get in touch with
          us.
        </Typography>

        {/* <Alert severity={showContent.type}>{showContent.message}</Alert> */}
        <Snackbar
          open={isShow}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={3000}
          onClose={() => {
            setIsShow(false);
            setShowContent({ type: "", message: "" });
          }}
        >
          <Alert
            onClose={() => {
              setIsShow(false);
              setShowContent({ type: "", message: "" });
            }}
            severity={showContent.type}
            sx={{ width: "100%" }}
          >
            {showContent.message}
          </Alert>
        </Snackbar>

        <Formik
          initialValues={{
            fullName: "",
            businessName: "",
            email: "",
            phone: "",
            message: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.email) {
              errors.email = "Please enter value";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            if (!values.fullName) {
              errors.fullName = "Please enter value";
            }
            if (!values.businessName) {
              errors.businessName = "Please enter value";
            }
            if (!values.phone) {
              errors.phone = "Please enter value";
            }
            if (values.phone) {
              const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
              if (!regex.test(values.phone)) {
                errors.phone = "Please enter valid number";
              }
            }
            if (!values.message) {
              errors.message = "Please enter value";
            }
            if (values.message && values.message.length > 200) {
              errors.message = "You can enter maximum 200 characters.";
            }
            return errors;
          }}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            await Api.getInTouch(values)
              .then((res) => {
                setShowContent({
                  type: "success",
                  message: res.data.msg,
                });
                setIsShow(true);
                resetForm();
              })
              .catch((error) => {
                if (error) {
                 // console.log("error", error);
                  setShowContent({
                    type: "error",
                    message: error.data.msg,
                  });
                  setIsShow(true);
                }
              });
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <Paper
                sx={{
                  padding: {
                    lg: "0 0 0 38px",
                    md: "0 0 0 38px",
                    sm: "0 0 0 10px",
                    xs: "0 0 0 6px",
                  },
                  boxShadow: "none",
                }}
              >
                <Grid
                  container
                  alignItems="flex-start"
                  spacing={2}
                  className="contact-form"
                >
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Full Name"
                      variant="standard"
                      value={values.fullName}
                      onChange={(e) =>
                        setFieldValue("fullName", e.target.value)
                      }
                      inputProps={{ maxLength: 50 }}
                      InputLabelProps={{
                        sx: {
                          fontSize: {
                            lg: "18px",
                            md: "16px",
                            sm: "14px",
                            xs: "12px",
                          },
                          fontWeight: {
                            lg: "400",
                            md: "350",
                            sm: "300",
                            xs: "300",
                          },
                          lineHeight: {
                            lg: "28px",
                            md: "26px",
                            sm: "24px",
                            xs: "22px",
                          },
                          fontFamily: "Manrope",
                          fontStyle: "normal",
                          color: "#332E3A",
                        },
                      }}
                      sx={{
                        width: "90%",
                      }}
                      error={errors.fullName && touched.fullName}
                      helperText={
                        errors.fullName && touched.fullName
                          ? errors.fullName
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Email Address"
                      variant="standard"
                      value={values.email}
                      onChange={(e) => setFieldValue("email", e.target.value)}
                      InputLabelProps={{
                        sx: {
                          fontSize: {
                            lg: "18px",
                            md: "16px",
                            sm: "14px",
                            xs: "12px",
                          },
                          fontWeight: {
                            lg: "400",
                            md: "350",
                            sm: "300",
                            xs: "300",
                          },
                          lineHeight: {
                            lg: "28px",
                            md: "26px",
                            sm: "24px",
                            xs: "22px",
                          },
                          fontFamily: "Manrope",
                          fontStyle: "normal",
                          color: "#332E3A",
                        },
                      }}
                      sx={{
                        width: "90%",
                      }}
                      error={errors.email && touched.email}
                      helperText={
                        errors.email && touched.email ? errors.email : ""
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Business Name"
                      variant="standard"
                      inputProps={{ maxLength: 50 }}
                      value={values.businessName}
                      onChange={(e) =>
                        setFieldValue("businessName", e.target.value)
                      }
                      InputLabelProps={{
                        sx: {
                          fontSize: {
                            lg: "18px",
                            md: "16px",
                            sm: "14px",
                            xs: "12px",
                          },
                          fontWeight: {
                            lg: "400",
                            md: "350",
                            sm: "300",
                            xs: "300",
                          },
                          lineHeight: {
                            lg: "28px",
                            md: "26px",
                            sm: "24px",
                            xs: "22px",
                          },
                          fontFamily: "Manrope",
                          fontStyle: "normal",
                          color: "#332E3A",
                        },
                      }}
                      sx={{
                        width: "90%",
                      }}
                      error={errors.businessName && touched.businessName}
                      helperText={
                        errors.businessName && touched.businessName
                          ? errors.businessName
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Phone Number"
                      variant="standard"
                      value={values.phone}
                      onChange={(e) => setFieldValue("phone", e.target.value)}
                      InputLabelProps={{
                        sx: {
                          fontSize: {
                            lg: "18px",
                            md: "16px",
                            sm: "14px",
                            xs: "12px",
                          },
                          fontWeight: {
                            lg: "400",
                            md: "350",
                            sm: "300",
                            xs: "300",
                          },
                          lineHeight: {
                            lg: "28px",
                            md: "26px",
                            sm: "24px",
                            xs: "22px",
                          },
                          fontFamily: "Manrope",
                          fontStyle: "normal",
                          color: "#332E3A",
                        },
                      }}
                      sx={{
                        width: "90%",
                      }}
                      error={errors.phone && touched.phone}
                      helperText={
                        errors.phone && touched.phone ? errors.phone : ""
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Message"
                      variant="standard"
                      value={values.message}
                      onChange={(e) => setFieldValue("message", e.target.value)}
                      inputProps={{ maxLength: 200 }}
                      InputLabelProps={{
                        sx: {
                          fontFamily: "Manrope",
                          fontStyle: "normal",
                          fontSize: {
                            lg: "18px",
                            md: "16px",
                            sm: "14px",
                            xs: "12px",
                          },
                          fontWeight: {
                            lg: "400",
                            md: "350",
                            sm: "300",
                            xs: "300",
                          },
                          lineHeight: {
                            lg: "28px",
                            md: "26px",
                            sm: "24px",
                            xs: "22px",
                          },
                          color: "#332E3A",
                        },
                      }}
                      sx={{
                        width: { sm: "90%", xs: "90%", md: "95%", lg: "95%" },
                      }}
                      error={errors.message && touched.message}
                      helperText={
                        errors.message && touched.message ? errors.message : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12} align="center" style={{ marginTop: 16 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      sx={{
                        background: "#FF652D",
                        borderRadius: "24px",
                        marginTop: "22px",
                        color: "#FCFEFF",
                        fontFamily: "Manrope",
                        fontStyle: "normal",
                        padding: "14px 65px",
                        boxShadow: "none",
                        fontWeight: { lg: 600, md: 500, sm: 400, xs: 400 },
                        fontSize: {
                          lg: "18px",
                          md: "16px",
                          sm: "14px",
                          xs: "12px",
                        },
                        lineHeight: {
                          lg: "28px",
                          md: "26px",
                          sm: "24px",
                          xs: "22px",
                        },
                        textTransform: "none",
                      }}
                      disabled={isSubmitting}
                    >
                      Submit Now
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </form>
          )}
        </Formik>

        {/* <form noValidate></form> */}
      </Typography>
    </Container>
  );
});

export default GetInTouch;
