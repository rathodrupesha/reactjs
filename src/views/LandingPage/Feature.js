import { Box, Container, Grid, styled, Typography } from "@mui/material";
import React, { forwardRef, useState } from "react";
import Mobile from "../../assets/img/mobile.png";
import FeatureSvg from "../../assets/img/feature.svg";
import FeaturePng from "../../assets/img/feature.png";
import FrontDesk from "../../assets/img/front-desk.png";
import DiningOption from "../../assets/img/dining-option.png";
import Services from "../../assets/img/services.png";
import HouseKeeping from "../../assets/img/house-keeping.png";
import HouseKeepingFeature from "../../assets/img/house-keeping-feature.png";
import Directory from "../../assets/img/directory.png";
import HandleRequestDetails from "../../assets/img/request.png";
import Notes from "../../assets/img/notes.png";
import FacilityEngagementClick from "../../assets/img/facility_engejment.png";
import CustomiseMenu from "../../assets/img/customize-menu.png";
import FacilityEngagement from "../../assets/img/facility-engagement.png";
import DuringStay from "../../assets/img/during-stay.png";
import RoomService from "../../assets/img/room-service.png";
import HandleRequest from "../../assets/img/handle-request.png";
import { BoxTitle, MainTitle, ServeTitle } from "./Css_Main";

const FeatureContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#F6F5FA",
  paddingTop: "0px",
  paddingBottom: "60px",
  [theme.breakpoints.down("md")]: {
    paddingTop: "32px",
    paddingBottom: "0px",
  },
  [theme.breakpoints.down("md")]: {
    paddingTop: "0px",
    paddingBottom: "0px",
  },
  [theme.breakpoints.down("sm")]: {
    paddingTop: "20px",
    paddingBottom: "35px",
  },
  [theme.breakpoints.down("xs")]: {
    paddingTop: "44px",
    paddingBottom: "0px",
  },
}));

const BoxDescriptionLeft = styled(Typography)(({ theme }) => ({
  fontFamily: "Manrope !important",
  fontStyle: "normal",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "26px",
  color: theme.palette.otherColor.lightBlack,
  paddingLeft: "10%",
  [theme.breakpoints.down("lg")]: {
    paddingLeft: "0%",
  },
  [theme.breakpoints.down("md")]: {
    paddingLeft: "0%",
    fontSize: "14px",
    fontWeight: 350,
    lineHeight: "22px",
  },
  [theme.breakpoints.down("sm")]: {
    paddingLeft: "0%",
    fontSize: "12px",
    fontWeight: 300,
    lineHeight: "20px",
  },
}));
const BoxDescriptionRight = styled(Typography)(({ theme }) => ({
  fontFamily: "Manrope !important",
  fontStyle: "normal",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "26px",
  color: theme.palette.otherColor.lightBlack,
  [theme.breakpoints.down("md")]: {
    paddingRight: "0%",
    fontSize: "14px",
    fontWeight: 350,
    lineHeight: "22px",
  },
  [theme.breakpoints.down("sm")]: {
    paddingRight: "0%",
    fontSize: "12px",
    fontWeight: 300,
    lineHeight: "20px",
  },
}));



const Feature = forwardRef(({}, ref) => {
  const [isActiveC , setIsActiveC] = useState(true);
const [isActiveH , setIsActiveH] = useState(false);
const [isActiveF , setIsActiveF] = useState(false);
const [isActiveD , setIsActiveD] = useState(false);
const [isActiveR , setIsActiveR] = useState(false);
const [isActiveHr , setIsActiveHr] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(FeaturePng);
  const onFeatureC = (e) => {
    setSelectedFeature(DiningOption)
    setIsActiveH(false);
    setIsActiveF(false);
    setIsActiveD(false);
    setIsActiveR(false);
    setIsActiveHr(false);
    setIsActiveC(true);
   
  }
  const onFeatureH = (e) => {
    setSelectedFeature(HouseKeepingFeature)
    setIsActiveH(true);
    setIsActiveF(false);
    setIsActiveD(false);
    setIsActiveR(false);
    setIsActiveHr(false);
    setIsActiveC(false);
    
  }
  const onFeatureF= (e) => {
    setSelectedFeature(FacilityEngagementClick)
    setIsActiveH(false);
    setIsActiveF(true);
    setIsActiveD(false);
    setIsActiveR(false);
    setIsActiveHr(false);
    setIsActiveC(false);
  
  }
  const onFeatureD = (e) => {
    setSelectedFeature(Services)
    setIsActiveH(false);
    setIsActiveF(false);
    setIsActiveD(true);
    setIsActiveR(false);
    setIsActiveHr(false);
    setIsActiveC(false);
  
  }
  const onFeatureR = (e) => {
    setSelectedFeature(FrontDesk)
    setIsActiveH(false);
    setIsActiveF(false);
    setIsActiveD(false);
    setIsActiveR(true);
    setIsActiveHr(false);
    setIsActiveC(false);
   
  }
  const onFeatureHr = (e) => {
    setSelectedFeature(HandleRequestDetails)
    setIsActiveH(false);
    setIsActiveF(false);
    setIsActiveD(false);
    setIsActiveR(false);
    setIsActiveHr(true);
    setIsActiveC(false);
    
  }

  const FeatureImg = styled("div")(({ theme }) => ({
    "& img": {
      height: "100%",
    },
    [theme.breakpoints.down("md")]: {
      "& img": {
        height: "60px",
      },
    },
    [theme.breakpoints.down("sm")]: {
      "& img": {
        height: "34px",
      },
    },
  }));
  return (
    <>
      <FeatureContainer ref={ref}>
        <Container fixed   className="features-main">
          <Grid container alignItems="center" justifyContent="center">
            <MainTitle className="animate-charcter">
              <ServeTitle variant="h2">App Features</ServeTitle>
            </MainTitle>
            <Grid
              item
              xs={12}
              md={3}
              justifyContent="center"
              className="features-left"
            >
              <center>
              <Box
                sx={{ textAlign: "right", cursor: "pointer" }}
                className="features "
                mb={{ lg: 5, md: 4, sm: 3, xs: 2 }}
                // style={{
                // backgroundColor: isActiveC ? 'salmon' : '',
                //color: isActiveC ? 'white' : '',
                // }}
                onClick={(e) => onFeatureC(e)}
              >
                <FeatureImg>
                  <img
                    src={CustomiseMenu}
                    alt=""
                    style={{ maxWidth: "320px" }}
                  />
                </FeatureImg>
                <BoxTitle variant="h3" color={"#333252"} style={{
                  //backgroundColor: isActiveF ? 'salmon' : '',
                  color: isActiveC ? 'orange' : '',
                }}>
                  Customized Menu
                </BoxTitle>
                <BoxDescriptionLeft variant="p" component="p" >
                  Tailor your business’ food menu just the way you like it.
                </BoxDescriptionLeft>
              </Box>
              </center>
                <center>
              <Box
                sx={{ textAlign: "right", cursor: "pointer" }}
                className="features "
                mb={{ lg: 5, md: 4, sm: 3, xs: 2 }}
                // style={{
                //   backgroundColor: isActiveH ? 'salmon' : '',
                //   color: isActiveH ? 'white' : '',
                // }}
                onClick={(e) => onFeatureH(e)}
              >
                <FeatureImg>
                  <img
                    src={HouseKeeping}
                    alt=""
                    style={{ maxWidth: "320px" }}
                  />
                </FeatureImg>
                <BoxTitle variant="h3" color={"#333252"}  style={{
                  //backgroundColor: isActiveF ? 'salmon' : '',
                  color: isActiveH ? 'orange' : '',
                }} >
                  Housekeeping
                </BoxTitle>
                <BoxDescriptionLeft variant="p" component="p">
                Request Housekeeping service at your fingur tips.
                </BoxDescriptionLeft>
              </Box>
              </center>
              <center>
              <Box
                sx={{ textAlign: "right", cursor: "pointer" }}
                className="features "
                mb={{ lg: 5, md: 4, sm: 3, xs: 2 }}
                // style={{
                //  backgroundColor: isActiveF ? 'salmon' : '',
                //   color: isActiveF ? '' : '',
                // }}
                onClick={(e) => onFeatureF(e)}
              >
                <FeatureImg>
                  <img
                    src={FacilityEngagement}
                    alt=""
                    style={{ maxWidth: "320px" }}
                  />
                </FeatureImg>
                <BoxTitle variant="h3" color={"#333252"}  style={{
                  //backgroundColor: isActiveF ? 'salmon' : '',
                  color: isActiveF ? 'orange' : '',
                }}>
                  Facility Engagement
                </BoxTitle>
                <BoxDescriptionLeft variant="p" component="p">
                  Engage with promotion,offers and events
                </BoxDescriptionLeft>
              </Box>
              </center>
            </Grid>
            <Grid
              item
              xs={{ md: 12, lg: 12 }}
              md={6}
              mb={{ xs: 5, sm: 3, md: 2 }}
              justifyContent="center"
              display={{ xs: "none", lg: "flex", md: "flex" }}
            >
              <center>
              <Box sx={{ textAlign: "center" }}>
                <img
                  src={selectedFeature}
                  alt=""
                  style={{ maxWidth: "360px", width: "100%" }}
                />
              </Box>
              </center>
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              justifyContent="center"
              className="features-right"
            ><center>
              <Box
                sx={{ textAlign: "left", cursor: "pointer" }}
                className="features "
                mb={{ lg: 5, md: 4, sm: 3, xs: 2 }}
                // style={{
                //   backgroundColor: isActiveD ? 'salmon' : '',
                //   color: isActiveD ? 'white' : '',
                // }}
                onClick={(e) => onFeatureD(e)}
              >
                <FeatureImg>
                  <img src={DuringStay} alt="" style={{ maxWidth: "320px" }} />
                </FeatureImg>
                <BoxTitle variant="h3" color={"#333252"} style={{
                  //backgroundColor: isActiveF ? 'salmon' : '',
                  color: isActiveD ? 'orange' : '',
                }}>
                  During Stay
                </BoxTitle>
                <BoxDescriptionRight variant="p" component="p" style={{paddingRight : "10px" ,paddingLeft : "10px"}}>
                  Receive sightseeing tips, arrange spa treatments, or book room
                  service.
                </BoxDescriptionRight>
              </Box>
              </center>
              <center>
              <Box
                sx={{ textAlign: "left", cursor: "pointer" }}
                className="features"
                mb={{ lg: 5, md: 4, sm: 3, xs: 2 }}
                // style={{
                //   backgroundColor: isActiveR ? 'salmon' : '',
                //   color: isActiveR ? 'white' : '',
                // }}
                onClick={() => onFeatureR(FrontDesk)}
              >
                <FeatureImg>
                  <img src={RoomService} alt="" style={{ maxWidth: "320px" }} />
                </FeatureImg>
                <BoxTitle variant="h3" color={"#333252"} style={{
                  //backgroundColor: isActiveR ? 'salmon' : '',
                  color: isActiveR ? 'orange' : '',
                }} >
                  Room Service
                </BoxTitle>
                <BoxDescriptionRight variant="p" component="p" style={{paddingRight : "10px" ,paddingLeft : "10px"}}>
                  Allow guest to toggle and request room service on their device
                </BoxDescriptionRight>
              </Box>
              </center>
              <center>
              <Box
                sx={{ textAlign: "left", cursor: "pointer" }}
                className="features"
                mb={{ lg: 5, md: 4, sm: 3, xs: 2 }}
                // style={{
                //backgroundColor: isActiveHr ? 'salmon' : '',
                //color: isActiveHr ? 'white' : '',
                // }}
                onClick={() => onFeatureHr(HandleRequestDetails)}
              >
                <FeatureImg>
                  <img
                    src={HandleRequest}
                    alt=""
                    style={{ maxWidth: "320px" }}
                  />
                </FeatureImg>
                <BoxTitle variant="h3" color={"#333252"}  style={{
                  //backgroundColor: isActiveR ? 'salmon' : '',
                  color: isActiveHr ? 'orange' : '',
                }}>
                  Handle Request
                </BoxTitle>
                <BoxDescriptionRight variant="p" component="p" style={{paddingRight : "10px" ,paddingLeft : "10px"}}>
                  Manage Department and Service Request
                </BoxDescriptionRight>
              </Box>
              </center>
            </Grid>
          </Grid>
        </Container>
      </FeatureContainer>
    </>
  );
});

export default Feature;
