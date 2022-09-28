import React from "react";
import { Container, Grid, Typography } from "@mui/material";
import { MainTitle, ServeTitle, useStylesMain } from "./Css_Main";
import Slider from "react-slick";
import Mobile from "../../assets/img/slider.png";
import Slider1 from "../../assets/img/slider/1.png";
import Slider2 from "../../assets/img/slider/2.png";
import Slider3 from "../../assets/img/slider/3.png";
import Slider4 from "../../assets/img/slider/4.png";
import Slider5 from "../../assets/img/slider/5.png";
import Slider6 from "../../assets/img/slider/6.png";
import Slider7 from "../../assets/img/slider/7.png";
import Slider8 from "../../assets/img/slider/8.png";
import Slider9 from "../../assets/img/slider/9.png";
import Slider10 from "../../assets/img/slider/10.png";
//import Slider11 from "../../assets/img/slider/11.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProjectSlider = () => {
  const classes = useStylesMain();
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    // nextArrow: (
    //   <svg
    //     width="22"
    //     height="14"
    //     viewBox="0 0 22 14"
    //     fill="none"
    //     xmlns="http://www.w3.org/2000/svg"
    //   >
    //     <path
    //       d="M14.2931 1.70712C13.9026 1.3166 13.9026 0.683433 14.2931 0.292908C14.6837 -0.0976158 15.3168 -0.0976158 15.7074 0.292908L21.7073 6.29291C22.0979 6.68343 22.0979 7.3166 21.7073 7.70712L15.7074 13.7071C15.3168 14.0976 14.6837 14.0976 14.2931 13.7071C13.9026 13.3166 13.9026 12.6834 14.2931 12.2929L18.586 8H1.01103C0.452653 8 0 7.55228 0 7C0 6.44772 0.452653 6 1.01103 6H18.586L14.2931 1.70712Z"
    //       fill="#18191F"
    //     />
    //   </svg>
    // ),
    // prevArrow: (
    //   <svg
    //     width="22"
    //     height="14"
    //     viewBox="0 0 22 14"
    //     fill="none"
    //     xmlns="http://www.w3.org/2000/svg"
    //   >
    //     <path
    //       d="M7.70711 1.70712C8.09763 1.3166 8.09763 0.683433 7.70711 0.292908C7.31658 -0.0976158 6.68342 -0.0976158 6.29289 0.292908L0.292893 6.29291C-0.097631 6.68343 -0.097631 7.3166 0.292893 7.70712L6.29289 13.7071C6.68342 14.0976 7.31658 14.0976 7.70711 13.7071C8.09763 13.3166 8.09763 12.6834 7.70711 12.2929L3.4142 8H20.9892C21.5476 8 22.0002 7.55228 22.0002 7C22.0002 6.44772 21.5476 6 20.9892 6H3.41423L7.70711 1.70712Z"
    //       fill="#18191F"
    //     />
    //   </svg>
    // ),
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <Grid
        pt={{ xs: "20px", lg: "0px", md: "54px", sm: "10px" }}
        pb={{ xs: "65px", lg: "100px", md: "54px", sm: "54px" }}
      >
        <Container fixed >
          <Grid container alignItems="center" justifyContent="center" >
            <Typography
              component="div"
              style={{
                textAlign: "center",
                width: "100%",
                fontFamily: "Manrope !important",
                fontStyle: "normal",
              }}
            >
              <ServeTitle variant="h2" className="animate-charcter">Our Platform at a Glance</ServeTitle>
            </Typography>
          </Grid>
        </Container>

        <Container
          className={classes.root}
          style={{
            marginTop: "10px",
          }}
        >
          <Grid container>
            <Grid item xs={2} />
            <Grid item xs={8}>
              <Typography component="div">
                <Slider {...settings}>
                  <img src={Slider1} alt="" />

                <img src={Slider2} alt="" /> 

                  <img src={Slider3} alt="" />

                  <img src={Slider4} alt="" />

                  <img src={Slider5} alt="" />

                  <img src={Slider6} alt="" />

                  <img src={Slider7} alt="" />

                  <img src={Slider8} alt="" />

                  <img src={Slider9} alt="" />

                  <img src={Slider10} alt="" />

                  {/* <img src={Slider11} alt="" /> */}
                </Slider>
              </Typography>
              {/* <div
                style={{
                  height: "700px",
                }}
              >
              </div> */}
            </Grid>
            <Grid item xs={2} />
          </Grid>
        </Container>
      </Grid>
    </>
  );
};

export default ProjectSlider;
