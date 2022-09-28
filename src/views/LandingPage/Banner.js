import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import HeroBannerBg from "../../assets/img/cover.png";
import Iphone from "../../assets/img/iPhone_X.png";

const HeroBanner = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${HeroBannerBg})`,
  backgroundSize: "cover",
  width: "100%",
  height: "752px",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  position: "relative",
  [theme.breakpoints.down("md")]: {
    height: "700px",
    margin: 0,
    padding: 0,
  },
  [theme.breakpoints.down("sm")]: {
    height: "80%",
  },
}));

const BannerCaption = styled("div")(({ theme }) => ({
  width: "100%",
}));

const BannerTitle = styled(Typography)(({ theme }) => ({
  fontSize: "68px",
  lineHeight: "75px",
  fontWeight: 800,
  color: "white",
  fontFamily: "Manrope !important",
  fontStyle: "normal",

  [theme.breakpoints.down("lg")]: {
    fontSize: "54px",
    lineHeight: "76px",
    paddingRight: "6%",
  },
  [theme.breakpoints.down("md")]: {
    fontSize: "46px",
    lineHeight: "46px",
    paddingRight: "0%",
  },

  [theme.breakpoints.down("sm")]: {
    fontSize: "26px",
    lineHeight: "30px",
    marginTop: "8%",
    paddingRight: 0,
  },
}));

const BannerButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: theme.palette.shape.borderRadius,
  color: "#fff",
  width: "196px",
  height: "62px",
  fontSize: "20px",
  marginTop: "32px",
  fontFamily: "Manrope",
  fontStyle: "normal",
  textTransform: "capitalize",
}));

const IphoneImg = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: "-135px",
  "& img": {
    width: "100%",
  },
  [theme.breakpoints.down("lg")]: {
    marginLeft: "10%",
    position: "absolute",
    bottom: "-30px",
  },
  [theme.breakpoints.down("md")]: {
    maxWidth: "400px",
    bottom: "-40px",
    marginLeft: "15%",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "40px",
    lineHeight: "60px",
    position: "inherit",
    bottom: "0px",
    marginLeft: "0px",
    "& img": {
      height: "400px",
    },
  },
}));

const banner = () => {
  return (
    <Container
      fixed
      style={{ maxWidth: "100%", padding: 0, margin: 0 }}
      component="main"
      className="banner-section"
      sx={{
        backgroundImage: `url(${HeroBannerBg})`,
        backgroundSize: "cover",
        height: { lg: "866px", md: "800px" },
      }}
    >
      {/* <HeroBanner className="main-container"> */}
      <Grid
        container
        alignItems="center"
        flexDirection={{ xs: "column", sm: "row" }}
        textAlign={{ xs: "center", sm: "left" }}
        paddingLeft={{ lg: "165px", md: "110px" }}
        marginTop={{ xs: "0px", md: "0", lg: "0", sm: "0px" }}
      >
        <Grid
          item
          md={6}
          lg={4}
          justifyContent="center"
          display={{ lg: "none", md: "none", sm: "none", xs: "flex" }}
          paddingTop={"36px"}
        >
          {/* <IphoneImg> */}
          <img
            className="shadowWidth"
            src={Iphone}
            alt="Iphone x"
            height={"500px"}
          />
          {/* </IphoneImg> */}
        </Grid>
        <Grid className="bannerText"
          item
          md={6}
          lg={8}
          // marginBottom={{ xs: "0", sm: 0 }}
          paddingBottom={{ xs: "150px", lg: "auto", md: "auto", sm: "auto" }}
          paddingLeft={{ lg: "0", md: "0", sm: "0" }}
        >
          <BannerCaption className="lineUp" >
            <BannerTitle variant="h1" >
            Hospitality is an Art.
              <br /> Hamrostay is your Canvas.
            </BannerTitle>
            <BannerButton
              variant="contained"
              sx={{
                width: { lg: "196px", md: "170px ", sm: "140px", xs: "140px" },
                height: { lg: "62px", md: "50px ", sm: "40px", xs: "38px" },
                fontSize: { sm: "16px", xs: "16px" },
              }}
            >
              Get Started
            </BannerButton>
          </BannerCaption>
        </Grid>
        <Grid
          item
          md={6}
          lg={4}
          justifyContent="center"
          display={{ lg: "flex", md: "flex", sm: "flex", xs: "none" }}
          sx={{ marginTop: { xl :"11%", lg: "6%", md: "8%", sm: "0" } }}
        >
          <Typography
            component="div" className="flipY"
            sx={{
              marginRight: { xl: "0", lg: "0", md: "90px", sm: "5px" },
              marginLeft: { lg: "0", md: "0", sm: "2%" },

              "& img": { height: { lg: "600px", md: "400px", sm: "400px" } },
            }}
          >
            <img className="shadowWidth" src={Iphone} alt="Iphone x" />
          </Typography>
        </Grid>
      </Grid>
      {/* </HeroBanner> */}
    </Container>
  );
};

export default banner;
