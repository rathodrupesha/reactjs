import React from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import SetUpHotelBG from "../../assets/img/set-up-hotel-bg.png";

const SetUpHotel = () => {
  return (
    <div className="setup-hotel-wrap" style={{
      background: `url(${SetUpHotelBG})`,
      backgroundSize: "cover",
      paddingTop: "20px",
      paddingBottom: "20px"
    }}>
    <Container
      className="main-container"
      fixed
      component="main"
    >
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        padding={"10px"}
        marginTop={0}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={7}
        >
          <Typography
            component="h1"
            variant="h2"
            align="justify"
            color="text.primary"
            gutterBottom
            sx={{
              fontFamily: "Manrope",
              fontStyle: "normal",
              fontWeight: { lg: 800, md: 800, sm: 800, xs: 800 },
              paddingLeft: { lg: "2px", md: "2px", sm: "2px", xs: "2px" },
              fontSize: {
                lg: "35px",
                md: "34.7351px",
                sm: "28.7351px",
                xs: "18.7351px",
              },
              lineHeight: { md: "40px", sm: "30px", lg: "51px", xs: "24px" },
              fontFeatureSettings: "'liga' off",
              color: "#FFFFFF",
              textTransform: "capitalize",
            }}
          >
            customize your own app with ease to power up revenue in F &
            B,booking
          </Typography>
          <Typography
            variant="h5"
            align="left"
            color="text.secondary"
            component="p"
            gutterBottom
            sx={{
              fontFamily: "Manrope",
              fontStyle: "normal",
              lineHeight: { lg: "26px", md: "22px", sm: "22px", xs: "24px" },
              fontWeight: { lg: 600, md: 500, sm: 400, xs: 300 },
              fontSize: {
                lg: "17px",
                md: "17px",
                sm: "17px",
                xs: "14.7712px",
              },
              fontFeatureSettings: "'liga' off",
              color: "#FFFFFF",
            // textTransform: "capitalize",
            }}
          >
            Improve Your Guest Experience In Real-Time With HAMRO STAY No Credit Card.
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          alignContent="center"
          justifyItems="center"
          justifyContent="end"
        >
          <Button
            align="center"
            justifyContent="center"
            sx={{
              background: "#333252",
              borderRadius: "24px",
              width: {
                sm: "140px",
                md: "311.57px",
                lg: "311.57px",
                xs: "120px",
              },
              height: {
                sm: "60px",
                md: "70px",
                lg: "80.49px",
                xs: "40px",
              },
              fontFamily: "Manrope",
              fontStyle: "normal",
              fontWeight: { lg: 700, md: 600, sm: 500, xs: 400 },
              fontSize: { lg: "20px", md: "20px", sm: "18px", xs: "16px" },
              lineHeight: "30px",
              textTransform: "none",
              color: "#FFFFFF",
              margin: "0 auto !important",
              display: "block !important",
            }}
            variant="contained"
          >
            Try for free
          </Button>
        </Grid>
      </Grid>
    </Container>
    </div>
  );
};

export default SetUpHotel;
