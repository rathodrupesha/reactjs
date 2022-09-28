import React, { forwardRef } from "react";
import { Container, Grid } from "@mui/material";

import { Box, styled } from "@mui/material";
import Works_Image from "../../assets/img/how-it-works.png";
import { MainTitle, ServeTitle } from "./Css_Main";

const HowItWorks = forwardRef(({}, ref) => {
  const ServeImg = styled("div")(({ theme }) => ({
    "& img": {
      height: "100%",
      width: "100%",
    },
  }));
  return (
    <div className="how-it-work-section" ref={ref}>
      <Container fixed>
        <Grid container alignItems="center" justifyContent="center">
          <MainTitle className="animate-charcter">
            <ServeTitle variant="h2">How it Works</ServeTitle>
          </MainTitle>
          <Grid
            container
            rowSpacing={{ xs: 5, md: 2 }}
            columnSpacing={{ xs: 2, sm: 3, md: 5 }}
          >
            <Grid item md={12} justifyContent="center" display="flex">
              <Box sx={{ textAlign: "center" }}>
                <ServeImg>
                  <img src={Works_Image} alt="" />
                </ServeImg>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
});

export default HowItWorks;
