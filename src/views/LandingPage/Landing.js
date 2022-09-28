// import React, { Fragment, useRef } from "react";
import React, { useState, useEffect ,Fragment,useRef} from "react";
import Banner from "./Banner";
import Experience from "./Experience";
import Feature from "./Feature";
import Footer from "./Footer";
import GetInTouch from "./GetInTouch";

import Navbar from "./Navbar";
import PricePlans from "./PricePlans";
import ProjectSlider from "./ProjectSlider";
import SetUpHotel from "./SetUpHotel";
import WhoWeServe from "./WhoWeServe";
import HowItWorks from "./HowItWorks";
import AboutUs from "./AboutUs";
import "./landing.css";
import "./animate.css";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

// import {AnimatedOnScroll} from "react-animated-css-onscroll";
import ScrollAnimation from 'react-animate-on-scroll';
const Landing = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const aboutUsRef = useRef();
  const pricingRef = useRef();
  const productRef = useRef();
  const getInTouchRef = useRef();
  const howItWorksRef = useRef(); 

  const handleNavbar = (item) => {
    switch (item) {
      case "About":
        aboutUsRef.current.scrollIntoView({ behavior: "smooth" });
        break;

      case "Pricing":
        pricingRef.current.scrollIntoView({ behavior: "smooth" });
        break;
      case "Features":
        productRef.current.scrollIntoView({ behavior: "smooth" });
        break;

      case "How it Works":
        howItWorksRef.current.scrollIntoView({ behavior: "smooth" });
        break;

      case "Get in Touch":
        getInTouchRef.current.scrollIntoView({ behavior: "smooth" });
        break;

      default:
        break;
    }
  };

  return (

    <Fragment className="landing-wrapper">
      {/* <Toolbar id="back-to-top-anchor" /> */}
      <Navbar handleNavbar={handleNavbar} />
      <Banner />
      <div className="top-to-btm">
      {" "}
      {showTopBtn && (
        <ExpandLessIcon   className="icon-position icon-style" style ={{height : "50px", width : "50px"}}onClick={goToTop} />
      )}{" "}
    </div>
      <AboutUs ref={aboutUsRef} />
      <WhoWeServe />
      <HowItWorks ref={howItWorksRef} />
      <Feature ref={productRef} />
      <Experience />
      <ProjectSlider />
      <SetUpHotel />
      <ScrollAnimation
            animateIn="bounceInRight"
            animateOut="fadeOut"
            duration={1.5}
            delay={0}
          >

      <PricePlans ref={pricingRef}  handleNavbar={handleNavbar}/>
      </ScrollAnimation>
      <GetInTouch ref={getInTouchRef} />
      <Footer handleNavbar={handleNavbar} />
      </Fragment>

  );
};

export default Landing;
