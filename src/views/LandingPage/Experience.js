import { Box, Container, Grid, styled, Typography } from "@mui/material";
import React from "react";
import { BoxDescription } from "./Css_Main";

import GrowRevenue from "../../assets/img/grow-revenue.png";
import Feedback from "../../assets/img/feedback.png";
import Training from "../../assets/img/training.png";
import GuestCloudOrder from "../../assets/img/guest-cloud-order.png";
import TeamDashboard from "../../assets/img/team-dashboard.png";
import ReduceStaff from "../../assets/img/reduce-staff.png";
import ExperienceGrowProductivity from "../../assets/img/exp-grow-productivity.png";

const BoxTitle = styled(Typography)(({ theme, color }) => ({
  fontFamily: "Manrope !important",
  fontStyle: "normal",
  fontSize: "28px",
  fontWeight: "800",
  lineHeight: "46px",
  marginBottom: "8px",
  marginTop: "24px",
  color: color ?? theme.palette.otherColor.lightBlack,
  [theme.breakpoints.down("md")]: {
    fontSize: "22px",
    fontWeight: 600,
    lineHeight: "36px",
    marginTop: "16px",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "18px",
    fontWeight: 400,
    lineHeight: "26px",
    marginTop: "12px",
  },
}));

const ExperienceTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "Manrope",
  fontStyle: "normal",
  fontSize: "18px",
  fontWeight: "700",
  lineHeight: "32px",
  color: "#FFFFFF",
  [theme.breakpoints.down("lg")]: {
    fontSize: "16px",
    fontWeight: 650,
    lineHeight: "30px",
  },
  [theme.breakpoints.down("md")]: {
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "28px",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "26px",
  },
}));

const ExperienceDescription = styled(Typography)(({ theme }) => ({
  fontFamily: "Manrope",
  fontStyle: "normal",
  fontSize: "16px",
  fontWeight: "400",
  lineHeight: "26px",
  color: "#FFFFFF",
  [theme.breakpoints.down("lg")]: {
    fontSize: "14px",
    fontWeight: "350",
    lineHeight: "22px",
  },
  [theme.breakpoints.down("md")]: {
    fontSize: "12px",
    fontWeight: "300",
    lineHeight: "20px",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "10px",
    fontWeight: "250",
    lineHeight: "18px",
  },
}));

const ExperienceImg = styled("div")(({ theme }) => ({
  "& img": {
    height: "100%",
  },
  [theme.breakpoints.down("lg")]: {
    "& img": {
      height: "30px",
    },
  },
  [theme.breakpoints.down("md")]: {
    "& img": {
      height: "26px",
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& img": {
      height: "20px",
    },
  },
}));

const HotefyExperience = ({ title, description, spacePx, icon }) => (
  <Box
    sx={{ textAlign: "center", padding: "0 0 40px 0" }}
    alignItems="start"
    // ml={{ lg: spacePx, md: spacePx, sm: "50px", xs: "30px" }}
    display="flex"
  >
    <ExperienceImg>
      <img src={icon} alt="" />
    </ExperienceImg>
    <BoxDescription component="div">
      <BoxDescription
        component="div"
        pl={2}
        pr={0}
        sx={{ textAlign: "left" }}
        justifyContent="center"
        alignItems="start"
      >
        <ExperienceTitle>{title}</ExperienceTitle>
        <ExperienceDescription variant="h4">
          {description}
        </ExperienceDescription>
      </BoxDescription>
    </BoxDescription>
  </Box>
);

const Experience = () => {
  return (
    <>
      <Container
        fixed
        sx={{
          // maxHeight: { lg: "500px", md: "100%", sm: "100%" },
          padding: "0 !important",
          maxWidth: "100% !important",
          background:
            "linear-gradient(180deg, #C72970 0%, #E55D3E 100%) !important",
          marginTop: { lg: "auto", md: "auto", sm: "auto", xs: "0px" },
        }}
      >
        <Grid container>
          <Grid item xs={12} lg={4} md={4} sm={12}>
            <div className="experience-item">
              <Box sx={{ textAlign: "left" }}>
                <BoxTitle variant="h3" color="#FFF">
                  Benefits
                </BoxTitle>
              </Box>
              <HotefyExperience
                title="Grow revenue by 30%"
                description="55% Guest prefer with properties with guestservice apps."
                spacePx={10}
                icon={GrowRevenue}
              />
              <HotefyExperience
                title="Real-time Feedback"
                description="Reviews and ratings increases stability and enhances functionality."
                spacePx={10}
                icon={Feedback}
              />
              <HotefyExperience
                title="Training & customer support"
                description="Offers continuous training for staff  &  24/7 guest support."
                spacePx={10}
                icon={Training}
              />
            </div>
          </Grid>
          <Grid item xs={12} lg={4} md={4} sm={12} className="exp-container">
            <div className="experience-item">
              <Box
                sx={{
                  textAlign: "left",
                }}
              >
                <BoxTitle variant="h3" color="#FFF">
                  How may we assist you?
                </BoxTitle>
              </Box>
              <Box
                sx={{ textAlign: "center" }}
                alignItems="flex-start"
                display="flex"
                pb={{
                  xl: "40px",
                  lg: "40px",
                  md: "20px",
                  sm: "14px",
                  xs: "12px",
                }}
              >
                <ExperienceImg>
                  <img src={GuestCloudOrder} alt="" />
                </ExperienceImg>
                <BoxDescription component="div">
                  <BoxDescription
                    component="div"
                    pl={2}
                    sx={{ textAlign: "left" }}
                    justifyContent="center"
                    alignItems="start"
                  >
                    <ExperienceTitle>Housekeeping request</ExperienceTitle>
                  </BoxDescription>
                </BoxDescription>
              </Box>
              <Box
                sx={{ textAlign: "center" }}
                alignItems="flex-start"
                display="flex"
                pb={{
                  xl: "40px",
                  lg: "40px",
                  md: "20px",
                  sm: "14px",
                  xs: "12px",
                }}
              >
                <ExperienceImg>
                  <img src={GuestCloudOrder} alt="" />
                </ExperienceImg>
                <BoxDescription component="div">
                  <BoxDescription
                    component="div"
                    pl={2}
                    sx={{ textAlign: "left" }}
                    justifyContent="center"
                    alignItems="start"
                  >
                    <ExperienceTitle>Room services order</ExperienceTitle>
                  </BoxDescription>
                </BoxDescription>
              </Box>
              <Box
                sx={{ textAlign: "center" }}
                alignItems="flex-start"
                display="flex"
                pb={{
                  xl: "40px",
                  lg: "40px",
                  md: "20px",
                  sm: "14px",
                  xs: "12px",
                }}
              >
                <ExperienceImg>
                  <img src={GuestCloudOrder} alt="" />
                </ExperienceImg>
                <BoxDescription component="div">
                  <BoxDescription
                    component="div"
                    pl={2}
                    sx={{ textAlign: "left" }}
                    justifyContent="center"
                    alignItems="start"
                  >
                    <ExperienceTitle>Activity and tour booking</ExperienceTitle>
                  </BoxDescription>
                </BoxDescription>
              </Box>
              <Box
                sx={{ textAlign: "center" }}
                alignItems="flex-start"
                display="flex"
                pb={{
                  xl: "40px",
                  lg: "40px",
                  md: "20px",
                  sm: "14px",
                  xs: "12px",
                }}
              >
                <ExperienceImg>
                  <img src={GuestCloudOrder} alt="" />
                </ExperienceImg>
                <BoxDescription component="div">
                  <BoxDescription
                    component="div"
                    pl={2}
                    sx={{ textAlign: "left" }}
                    justifyContent="center"
                    alignItems="start"
                  >
                    <ExperienceTitle>Touchless Dining</ExperienceTitle>
                  </BoxDescription>
                </BoxDescription>
              </Box>
              <Box
                sx={{ textAlign: "center" }}
                alignItems="flex-start"
                display="flex"
                pb={{
                  xl: "40px",
                  lg: "40px",
                  md: "20px",
                  sm: "14px",
                  xs: "12px",
                }}
              >
                <ExperienceImg>
                  <img src={GuestCloudOrder} alt="" />
                </ExperienceImg>
                <BoxDescription component="div">
                  <BoxDescription
                    component="div"
                    pl={2}
                    sx={{ textAlign: "left" }}
                    justifyContent="center"
                    alignItems="start"
                  >
                    <ExperienceTitle>Offers & Promotions</ExperienceTitle>
                  </BoxDescription>
                </BoxDescription>
              </Box>
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            lg={4}
            md={4}
            sm={12}
            // pb={{ xs: 5 }}
            justifyContent="center"
            // pl={7}
          >
            <div className="experience-item">
              <Box sx={{ textAlign: "left" }}>
                <BoxTitle variant="h3" color="#FFF">
                  Grow productivity
                </BoxTitle>
              </Box>
              <HotefyExperience
                title="Hotel Analytics"
                description="Manage consolidate & split  Bill, Request & Complaint in one platform"
                spacePx={10}
                icon={GrowRevenue}
              />
              <HotefyExperience
                title="Team Dashboard"
                description="Consolidate the operation with ease."
                spacePx={10}
                icon={TeamDashboard}
              />
              <HotefyExperience
                title="Reduce staff"
                description="Reduce staff and Mobilze chain of command."
                spacePx={10}
                icon={ReduceStaff}
              />
              <div className="experience-grow-productivity">
                <img
                  src={ExperienceGrowProductivity}
                  alt=""
                  style={{ maxWidth: "344px" }}
                  width={"100%"}
                />
              </div>
            </div> 
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Experience;
