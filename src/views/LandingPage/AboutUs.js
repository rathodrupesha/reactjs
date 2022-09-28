import React, { forwardRef } from "react";
import { Container, Grid, Typography } from "@mui/material";
// import WhoWeServeHeader from "./WhoWeServeHeader";
import { Box, styled } from "@mui/material";
import AboutUsPng from "../../assets/img/about-us.png";
import { BoxTitle, MainTitle, ServeTitle, ServeContainer } from "./Css_Main";

const AboutUs = forwardRef(({}, ref) => {
  const ServeImg = styled("div")(({ theme }) => ({
    textAlign: "center",
    "& img": {
      height: "100%",
    },

    [theme.breakpoints.down("md")]: {
      "& img": {
        height: "70px",
      },
    },
    [theme.breakpoints.down("sm")]: {
      "& img": {
        height: "50px",
      },
    },
  }));
  return (
    <>
      {/* <ServeContainer
        component="div"
        style={{
          backgroundColor: "#fff",
        }}
      > */}
      <div className="about-us-wrap" ref={ref}>
        <Container fixed>
          <Grid container alignItems="center" justifyContent="center">
            <MainTitle className="animate-charcter">
              <ServeTitle variant="h2">About Us</ServeTitle>
            </MainTitle>
            <Grid
              container
              rowSpacing={{ xs: 5, md: 2 }}
              columnSpacing={{ xs: 2, sm: 3, md: 5 }}
            >
              <Grid item md={4} justifyContent="center">
                <Box sx={{ textAlign: "center" }}>
                  <BoxTitle variant="h3">
                    <Typography
                      maxWidth="540px"
                      sx={{
                        margin: `0 auto`,
                        fontFamily: "Manrope",
                        fontStyle: "normal",
                        textAlign: "left",

                        fontSize: {
                          lg: "24px",
                          md: "20px",
                          sm: "18px",
                          xs: "14px",
                        },
                        lineHeight: {
                          lg: "32px",
                          md: "30px",
                          sm: "20px",
                          xs: "20px",
                        },
                        textAlign :"center"
                      }}
                    >
                      Hamro stay's mission is to enhance the facility engagement
                      experience through technology
                    </Typography>
                  </BoxTitle>
                </Box>
              </Grid>
              <Grid
                item
                md={4}
                justifyContent="center"
                alignItems="center"
                sx={{ width: "100%" }}
              >
                <ServeImg>
                  <img src={AboutUsPng} alt="" />
                </ServeImg>
              </Grid>
              <Grid item md={4} justifyContent="center">
                <Box sx={{ textAlign: "center" }}>
                  <BoxTitle variant="h3">
                    <Typography
                      maxWidth="540px"
                      sx={{
                        margin: `0 auto`,
                        fontFamily: "Manrope",
                        fontStyle: "normal",
                        textAlign: "left",
                        fontSize: {
                          lg: "24px",
                          md: "20px",
                          sm: "18px",
                          xs: "14px",
                        },
                        lineHeight: {
                          lg: "32px",
                          md: "30px",
                          sm: "20px",
                          xs: "20px",
                        },
                        textAlign : "center"
                      }}
                    >
                    We make staff processes and daily tasks more agile , and increases guest satisfaction.
                    </Typography>
                  </BoxTitle>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </div>
      {/* </ServeContainer> */}
    </>
  );
});

export default AboutUs;
