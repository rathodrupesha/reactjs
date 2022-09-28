import React from "react";
import { Container, Grid, Typography } from "@mui/material";
// import WhoWeServeHeader from "./WhoWeServeHeader";
import { Box, styled } from "@mui/material";
import ServeIcon from "../../assets/img/serve.png";
import { BoxTitle, MainTitle, ServeTitle, ServeContainer } from "./Css_Main";
import FullServicePropeties from "../../assets/img/full-service-properties.png";
import BreadBreakfastProperties from "../../assets/img/bread-breakfast.png";
import LimitedServiceProperties from "../../assets/img/limited-service.png";

const WhoWeServe = () => {
  const ServeImg = styled("div")(({ theme }) => ({
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
      <ServeContainer className='WhoWeServe'
        component="div"
        style={{
          backgroundColor: "#F6F5FA",
          paddingBottom: "60px",
        }}
        
      >
        <Container fixed  >
          <Grid container alignItems="center" justifyContent="center">
            <MainTitle className="animate-charcter">
              <ServeTitle variant="h2">Who We Serve</ServeTitle>
              <Typography
                maxWidth="540px"
                sx={{
                  margin: `0 auto`,
                  fontFamily: "Manrope",
                  fontStyle: "normal",
                  maxWidth: { md: "90%", sm: "80%", lg: "60%", xs: "70%" },
                  fontSize: {
                    lg: "18px",
                    md: "16px",
                    sm: "16px",
                    xs: "14px",
                  },
                  lineHeight: {
                    lg: "32px",
                    md: "30px",
                    sm: "20px",
                    xs: "20px",
                  },
                }}
              >
                {/* Lorem ipsum is common placeholder text used to demonstrate the
                graphic elements of a document or visual presentation. */}
              </Typography>
            </MainTitle>
            <Grid
              container
              rowSpacing={{ xs: 5, md: 2 }}
              columnSpacing={{ xs: 2, sm: 3, md: 5 }}
            >
              <Grid item md={4} justifyContent="center" display="flex">
                <Box sx={{ textAlign: "center" }}>
                  <ServeImg>
                    <img src={FullServicePropeties} alt="" />
                  </ServeImg>

                  <BoxTitle variant="h3">Full Service Properties</BoxTitle>
                  <Typography
                    sx={{
                      margin: `0 auto`,
                      fontFamily: "Manrope",
                      fontStyle: "normal",
                      maxWidth: {
                        md: "100%",
                        sm: "80%",
                        lg: "100%",
                        xs: "70%",
                      },
                      fontSize: {
                        lg: "18px",
                        md: "16px",
                        sm: "14px",
                        xs: "12px",
                      },
                      lineHeight: {
                        lg: "32px",
                        md: "26px",
                        sm: "20px",
                        xs: "16px",
                      },
                    }}
                  >
                    Mid-price, upscale, or luxury accomodation with a
                    restaurant, lounge facilities, and meeting space as well as
                    minimum service levels.{" "}
                  </Typography>
                </Box>
              </Grid>
              <Grid item md={4} justifyContent="center" display="flex">
                <Box sx={{ textAlign: "center" }}>
                  <ServeImg>
                    <img src={LimitedServiceProperties} alt="" />
                  </ServeImg>
                  <BoxTitle variant="h3">Limited Service Properties</BoxTitle>
                  <Typography
                    sx={{
                      margin: `0 auto`,
                      fontFamily: "Manrope",
                      fontStyle: "normal",
                      maxWidth: {
                        md: "100%",
                        sm: "80%",
                        lg: "100%",
                        xs: "70%",
                      },
                      fontSize: {
                        lg: "18px",
                        md: "16px",
                        sm: "14px",
                        xs: "12px",
                      },
                      lineHeight: {
                        lg: "32px",
                        md: "26px",
                        sm: "20px",
                        xs: "16px",
                      },
                    }}
                  >
                    Budget-friendly accommodations that don't have a food and
                    beverage component like an onsite restaurant.{" "}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                md={4}
                justifyContent="center"
                display="flex"
                width={"100%"}
              >
                <Box sx={{ textAlign: "center" }}>
                  <ServeImg>
                    <img src={BreadBreakfastProperties} alt="" />
                  </ServeImg>
                  <BoxTitle variant="h3">
                    Bread and Breakfast Properties
                  </BoxTitle>
                  <Typography
                    sx={{
                      margin: `0 auto`,
                      fontFamily: "Manrope",
                      fontStyle: "normal",
                      maxWidth: {
                        lg: "100%",
                        md: "100%",
                        sm: "80%",
                        xs: "70%",
                      },
                      fontSize: {
                        lg: "18px",
                        md: "16px",
                        sm: "14px",
                        xs: "12px",
                      },
                      lineHeight: {
                        lg: "32px",
                        md: "26px",
                        sm: "20px",
                        xs: "16px",
                      },
                    }}
                  >
                    Small lodging or self catered establishment that offers
                    overnight or weekly accommodation.{" "}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </ServeContainer>
    </>
  );
};

export default WhoWeServe;
