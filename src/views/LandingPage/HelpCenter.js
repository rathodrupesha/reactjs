import React, { useRef } from "react";
import { Container, Divider, Grid, Typography } from "@mui/material";
import { useState ,useEffect } from "react";
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
import Logo from "../../assets/img/logo.png";
import IosLogo from "../../assets/img/App_Store_Badge.svg";
import AndroidLogo from "../../assets/img/Google_Play_Badge.svg";
import moment from "moment";
import { useHistory } from "react-router-dom";

const HelpCenter = (handleNavbar) => {
  const history = useHistory();
  const aboutUsRef = useRef();
  const pricingRef = useRef();
  const productRef = useRef();
  const getInTouchRef = useRef();
  const howItWorksRef = useRef();
  const [iscontent , setHelpContent] = useState("");

const onHelp = (e) => {
    history.push("/helpcenter");
  }
  const onTerms = (e) => {
    history.push("/termofservice");
  }
  const onPrivacy = (e) => {
    history.push("/privacy");
  }
  useEffect(() => {
   
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'help',hotel_id :null })
    };
    fetch('https://hemrostay-api.apps.openxcell.dev/api/v1/master-admin/contentTypeCms', requestOptions)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
           const data = isJson && await response.json();
            console.log('response====',data.data.content);
            // check for error response
            // if (!response.ok) {
            //     // get error message from body or default to response status
            //     const error = (data && data.message) || response.status;
            //     return Promise.reject(error);
            // }
            setHelpContent(data.data.content);
           
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
  });

  return (
    <>
    <Grid style={{height:"auto"}}>
      <Navbar />
      <Container
      fixed
      style={{ maxWidth: "100%", padding: 0, margin: 0,minHeight : "600px",scroll :'auto' }}
      component="main"
      className="banner-section"
      sx={{
       //backgroundImage: `url(${HeroBannerBg})`,
        backgroundSize: "cover",
        //height: { lg: "766px", md: "700px" },
      }}
    >
   
      <Grid
        container
        alignItems="center"
        flexDirection={{ xs: "column", sm: "row" }}
        textAlign={{ xs: "center", sm: "center" }}
        style={{paddingBottom:"12px"}}
       // paddingLeft={{ lg: "165px", md: "110px" }}
        //marginTop={{ xs: "0px", md: "0", lg: "0", sm: "0px" }}
      >
        <Grid
          item
         md={12}
          lg={12}
          xs={12}
          xl={12}
          justifyContent="center"
          display={{}}
         // paddingTop={"36px"}
        >
          <div className="post__content" dangerouslySetInnerHTML={{__html: iscontent}} style={{paddingLeft:"10px",paddingRight:"10px"}}></div>
      
        </Grid>
      </Grid>
    </Container>
    <div
        className="footer-wrap"
        style={{
          background:
            "linear-gradient(90deg, #C72970 0%, #D0395F 7.08%, #DA4A4E 28.44%, #E55D3E 100%)",
          marginTop:"10px"
        }}
      >
        <Container
          style={{
           //marginTop: "-407px",
            color: "#FFFFFF",
            // maxWidth: "1100px", 
          }}
          fixed
          component="main" className="footerMenu"
        >
          <div
            style={{
              //display: "flex",
             // minHeight: "330px",
            }}
          >
            <Grid
              container
              spacing={3}
              //style={{ marginTop: "269px", paddingTop: "80px" }}
            >
              <Grid item xs={12} lg={5} md={6}>
                <div style={{ textAlign: "-webkit-center" }} className="footerLogo">
                  <img src={Logo} alt="" style = {{paddingTop : "70px"}} />
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                lg={7}
                md={6}
                className="footer-menu"
                justifyContent="center"
                alignItems="center"
                alignContent="center"
              >
                <Grid
                  container
                  spacing={1}
                  justifyContent="center"
                  alignContent="center" className="footerSubtitle"
                >
                  <Grid item xs={3} sm={4} md={4}>
                    <Typography
                      // variant="h6"
                      component="p"
                      color="text.primary"
                      gutterBottom
                      sx={{
                        fontSize: {
                          sm: "16px",
                          md: "18px",
                          lg: "20px",
                        },
                        fontFamily: "Manrope",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "30px",
                        fontFeatureSettings: "'liga' off",
                        color: "#FFFFFF",
                        textTransform: "none",
                        marginBottom: "0",
                        paddingBottom: "10px",
                      }}
                    >
                      Company
                    </Typography>
                    <Divider
                      variant="inset"
                      component="li"
                      className="divider"
                    />
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        lineHeight: "26px",
                        fontFamily: "Manrope",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "16px",
                      }}
                      className="aboutUsList"
                    >
                      <li
                        style={{ color: "#F2F2F2" }}
                        onClick={() => handleNavbar("About")}
                      >
                        About us
                      </li>
                      {/* <li>Blog</li> */}
                      <li onClick={() => handleNavbar("Contact Us")}>
                        Contact us
                      </li>
                      <li onClick={() => handleNavbar("Pricing")}>Pricing</li>
                      {/* <li>Testimonials</li> */}
                    </ul>
                  </Grid>
                  <Grid item xs={3} sm={4} md={4}>
                    <Typography
                      component="p"
                      color="text.primary"
                      gutterBottom
                      sx={{
                        fontSize: {
                          sm: "16px",
                          md: "18px",
                          lg: "20px",
                        },
                        fontFamily: "Manrope",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "30px",
                        fontFeatureSettings: "'liga' off",
                        color: "#FFFFFF",
                        textTransform: "none",
                        marginBottom: "0",
                        paddingBottom: "10px",
                      }}
                    >
                      Support
                    </Typography>
                    <Divider
                      variant="inset"
                      component="li"
                      className="divider"
                    />
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        lineHeight: "26px",
                        fontFamily: "Manrope",
                        fontStyle: "normal",
                        fontWeight: 400,
                        fontSize: "16px",
                      }}
                      className="aboutUsList"
                    >
                      <li onClick={(e) => onHelp(e)}>Help center</li>
                      <li  onClick={(e) => onTerms(e)}>Terms of service</li>
                      {/* <li>Legal</li> */}
                      <li onClick={(e) => onPrivacy(e)}>Privacy Policy</li>
                      {/* <li>Status</li> */}
                    </ul>
                  </Grid>
                  <Grid item xs={3} sm={4} md={4}>
                    <Typography
                      component="p"
                      color="text.primary" 
                      gutterBottom
                      sx={{
                        fontSize: {
                          sm: "16px",
                          md: "18px",
                          lg: "20px",
                        },
                        fontFamily: "Manrope",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "30px",
                        fontFeatureSettings: "'liga' off",
                        color: "#FFFFFF",
                        textTransform: "none",
                        marginBottom: "0",
                        paddingBottom: "10px",
                      }}
                    >
                      Stay up to date
                    </Typography>
                    <Divider
                      variant="inset"
                      component="li"
                      className="divider"
                    />
                    <Typography
                      component="div" 
                      sx={{
                        "& svg": {
                          padding: {
                            lg: "16px 3px 3px 3px",
                            md: "12px 2px 2px 2px",
                            sm: "12px 2px 2px 2px",
                            xs: "8px 2px 2px 2px",
                          },
                          width: {
                            lg: "auto",
                            md: "26px",
                            sm: "auto",
                            xs: "auto",
                          },
                        },
                      }}
                    >
                      <svg
                        width="32"
                        height="33"
                        viewBox="0 0 32 33"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.1"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0 16.8809C0 8.0443 7.16344 0.880859 16 0.880859C24.8366 0.880859 32 8.0443 32 16.8809C32 25.7174 24.8366 32.8809 16 32.8809C7.16344 32.8809 0 25.7174 0 16.8809Z"
                          fill="#F2F2F2"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M16.0008 8.34741C13.6833 8.34741 13.3924 8.35755 12.4822 8.39897C11.5737 8.44057 10.9536 8.58439 10.4111 8.79542C9.84981 9.01337 9.37372 9.30493 8.8994 9.77943C8.42473 10.2537 8.13317 10.7298 7.9145 11.2909C7.70294 11.8337 7.55894 12.4539 7.51805 13.362C7.47734 14.2723 7.46667 14.5633 7.46667 16.8808C7.46667 19.1984 7.47699 19.4883 7.51823 20.3986C7.56001 21.307 7.70383 21.9271 7.91468 22.4697C8.13282 23.0309 8.42437 23.507 8.89887 23.9814C9.37301 24.456 9.8491 24.7483 10.41 24.9663C10.9529 25.1773 11.5732 25.3211 12.4815 25.3627C13.3917 25.4041 13.6824 25.4143 15.9997 25.4143C18.3175 25.4143 18.6074 25.4041 19.5176 25.3627C20.4261 25.3211 21.0469 25.1773 21.5898 24.9663C22.1509 24.7483 22.6263 24.456 23.1004 23.9814C23.5751 23.507 23.8667 23.0309 24.0853 22.4699C24.2951 21.9271 24.4391 21.3068 24.4818 20.3987C24.5227 19.4885 24.5333 19.1984 24.5333 16.8808C24.5333 14.5633 24.5227 14.2725 24.4818 13.3622C24.4391 12.4538 24.2951 11.8337 24.0853 11.2911C23.8667 10.7298 23.5751 10.2537 23.1004 9.77943C22.6258 9.30476 22.1511 9.0132 21.5893 8.79542C21.0453 8.58439 20.4249 8.44057 19.5164 8.39897C18.6062 8.35755 18.3164 8.34741 15.9981 8.34741H16.0008ZM15.2353 9.88518C15.4625 9.88483 15.716 9.88518 16.0008 9.88518C18.2792 9.88518 18.5492 9.89336 19.449 9.93425C20.281 9.97229 20.7326 10.1113 21.0334 10.2281C21.4316 10.3828 21.7155 10.5677 22.014 10.8663C22.3127 11.165 22.4975 11.4495 22.6526 11.8477C22.7694 12.1481 22.9086 12.5997 22.9464 13.4317C22.9873 14.3313 22.9962 14.6015 22.9962 16.8789C22.9962 19.1562 22.9873 19.4264 22.9464 20.326C22.9084 21.158 22.7694 21.6096 22.6526 21.91C22.4979 22.3082 22.3127 22.5918 22.014 22.8903C21.7153 23.189 21.4318 23.3739 21.0334 23.5285C20.7329 23.6459 20.281 23.7845 19.449 23.8226C18.5494 23.8635 18.2792 23.8724 16.0008 23.8724C13.7222 23.8724 13.4521 23.8635 12.5526 23.8226C11.7205 23.7842 11.269 23.6451 10.968 23.5283C10.5698 23.3737 10.2853 23.1888 9.98666 22.8901C9.68799 22.5914 9.5031 22.3077 9.34808 21.9093C9.23128 21.6089 9.09208 21.1573 9.05421 20.3253C9.01332 19.4257 9.00514 19.1555 9.00514 16.8767C9.00514 14.5979 9.01332 14.3291 9.05421 13.4296C9.09226 12.5976 9.23128 12.146 9.34808 11.8452C9.50275 11.447 9.68799 11.1625 9.98666 10.8639C10.2853 10.5652 10.5698 10.3803 10.968 10.2253C11.2688 10.1079 11.7205 9.96927 12.5526 9.93105C13.3398 9.89549 13.6448 9.88483 15.2353 9.88305V9.88518ZM20.5558 11.3021C19.9905 11.3021 19.5318 11.7602 19.5318 12.3257C19.5318 12.8911 19.9905 13.3498 20.5558 13.3498C21.1212 13.3498 21.5799 12.8911 21.5799 12.3257C21.5799 11.7604 21.1212 11.3021 20.5558 11.3021ZM16.0008 12.4985C13.5807 12.4985 11.6186 14.4607 11.6186 16.8808C11.6186 19.3009 13.5807 21.2622 16.0008 21.2622C18.4209 21.2622 20.3824 19.3009 20.3824 16.8808C20.3824 14.4607 18.4209 12.4985 16.0008 12.4985ZM16.0008 14.0363C17.5717 14.0363 18.8453 15.3098 18.8453 16.8808C18.8453 18.4517 17.5717 19.7253 16.0008 19.7253C14.4298 19.7253 13.1563 18.4517 13.1563 16.8808C13.1563 15.3098 14.4298 14.0363 16.0008 14.0363Z"
                          fill="#F2F2F2"
                        />
                      </svg>
                      <svg
                        width="32"
                        height="33"
                        viewBox="0 0 32 33"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.1"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0 16.8809C0 8.0443 7.16344 0.880859 16 0.880859C24.8366 0.880859 32 8.0443 32 16.8809C32 25.7174 24.8366 32.8809 16 32.8809C7.16344 32.8809 0 25.7174 0 16.8809Z"
                          fill="#F2F2F2"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M24.5333 16.8689C24.5333 17.446 24.4746 18.0223 24.3592 18.584C24.2467 19.1325 24.08 19.6709 23.8617 20.1856C23.6483 20.6911 23.3837 21.1783 23.0745 21.6327C22.77 22.0842 22.4191 22.5078 22.0337 22.8939C21.6474 23.2783 21.2224 23.6282 20.7711 23.9341C20.3152 24.2411 19.8273 24.5054 19.3215 24.7197C18.806 24.9369 18.2664 25.1033 17.7184 25.2156C17.1559 25.3313 16.5776 25.3904 15.9996 25.3904C15.4213 25.3904 14.8429 25.3313 14.2812 25.2156C13.7324 25.1033 13.1928 24.9369 12.6778 24.7197C12.1719 24.5054 11.6836 24.2411 11.2277 23.9341C10.7764 23.6283 10.3514 23.2783 9.96599 22.8939C9.58015 22.5078 9.22928 22.0842 8.92427 21.6327C8.61675 21.1783 8.35172 20.6911 8.13755 20.1856C7.91918 19.6709 7.75211 19.1324 7.63919 18.584C7.52503 18.0223 7.46667 17.446 7.46667 16.8689C7.46667 16.2914 7.52499 15.7139 7.63922 15.1533C7.75215 14.6049 7.91922 14.0657 8.13759 13.5518C8.35175 13.0459 8.61678 12.5583 8.9243 12.1039C9.22931 11.652 9.58018 11.2292 9.96602 10.8427C10.3515 10.4582 10.7765 10.1091 11.2278 9.80373C11.6836 9.49539 12.172 9.23121 12.6778 9.01649C13.1929 8.79883 13.7324 8.63201 14.2812 8.52051C14.8429 8.40568 15.4213 8.34741 15.9997 8.34741C16.5776 8.34741 17.1559 8.40568 17.7185 8.52051C18.2664 8.63204 18.806 8.79887 19.3215 9.01649C19.8273 9.23118 20.3153 9.49539 20.7711 9.80373C21.2224 10.1091 21.6475 10.4582 22.0337 10.8427C22.4191 11.2292 22.77 11.652 23.0746 12.1039C23.3837 12.5583 23.6483 13.0459 23.8617 13.5518C24.08 14.0657 24.2467 14.6049 24.3592 15.1533C24.4746 15.7139 24.5333 16.2914 24.5333 16.8689ZM12.8903 10.2868C10.8581 11.2451 9.34131 13.115 8.86836 15.3685C9.06048 15.3702 12.0973 15.4084 15.5962 14.4801C14.3349 12.2424 12.9874 10.4162 12.8903 10.2868ZM16.2 15.6007C12.4477 16.7224 8.84711 16.6417 8.71795 16.6367C8.71585 16.715 8.71211 16.7907 8.71211 16.8689C8.71211 18.7384 9.41839 20.4427 10.5793 21.7313C10.5768 21.7275 12.5711 18.1946 16.5038 16.9247C16.5988 16.8931 16.6955 16.8647 16.7913 16.8373C16.6084 16.4237 16.4087 16.0093 16.2 15.6007ZM20.8124 11.4073C19.5293 10.2776 17.8447 9.59237 15.9996 9.59237C15.4075 9.59237 14.8329 9.66395 14.2824 9.79626C14.3916 9.94274 15.7604 11.756 17.0067 14.0411C19.7565 13.0118 20.7944 11.4339 20.8124 11.4073ZM17.288 18.0431C17.2718 18.0485 17.2556 18.0531 17.2397 18.0589C12.94 19.5557 11.5358 22.5722 11.5206 22.6051C12.7578 23.5658 14.3096 24.1454 15.9996 24.1454C17.0088 24.1454 17.9701 23.9403 18.8448 23.5688C18.7368 22.933 18.3135 20.7044 17.288 18.0431ZM20.0719 22.9038C21.7082 21.8012 22.8703 20.0503 23.1945 18.0223C23.0445 17.974 21.0057 17.3295 18.6535 17.7061C19.6093 20.3291 19.9977 22.4653 20.0719 22.9038ZM17.5676 15.1255C17.7368 15.4725 17.9006 15.8257 18.0518 16.1807C18.1056 16.308 18.1581 16.4329 18.2093 16.5577C20.7128 16.2431 23.1792 16.7724 23.2846 16.794C23.2679 15.0689 22.65 13.4857 21.6275 12.2462C21.6137 12.2657 20.4449 13.9521 17.5676 15.1255Z"
                          fill="#F2F2F2"
                        />
                      </svg>
                      <svg
                        width="32"
                        height="33"
                        viewBox="0 0 32 33"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.1"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0 16.8809C0 8.0443 7.16344 0.880859 16 0.880859C24.8366 0.880859 32 8.0443 32 16.8809C32 25.7174 24.8366 32.8809 16 32.8809C7.16344 32.8809 0 25.7174 0 16.8809Z"
                          fill="#F2F2F2"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M15.5208 13.886L15.5544 14.4396L14.9948 14.3718C12.9579 14.1119 11.1784 13.2306 9.66756 11.7505L8.92891 11.0161L8.73865 11.5584C8.33575 12.7674 8.59316 14.0441 9.43253 14.9028C9.8802 15.3774 9.77948 15.4452 9.00725 15.1627C8.73865 15.0723 8.50363 15.0045 8.48124 15.0384C8.4029 15.1175 8.6715 16.1457 8.88414 16.5524C9.17513 17.1174 9.76828 17.671 10.4174 17.9987L10.9658 18.2586L10.3167 18.2699C9.68994 18.2699 9.66756 18.2812 9.73471 18.5184C9.95854 19.2528 10.8427 20.0324 11.8276 20.3714L12.5214 20.6087L11.9171 20.9702C11.0218 21.49 9.96973 21.7837 8.91772 21.8063C8.41409 21.8176 8 21.8628 8 21.8967C8 22.0097 9.36538 22.6424 10.16 22.891C12.5438 23.6254 15.3753 23.3091 17.5017 22.0549C19.0126 21.1623 20.5235 19.3884 21.2286 17.671C21.6091 16.7558 21.9896 15.0836 21.9896 14.2814C21.9896 13.7617 22.0232 13.6939 22.6499 13.0725C23.0192 12.7109 23.3662 12.3154 23.4333 12.2025C23.5452 11.9878 23.534 11.9878 22.9633 12.1799C22.012 12.5188 21.8777 12.4736 22.3477 11.9652C22.6947 11.6036 23.1088 10.9483 23.1088 10.7562C23.1088 10.7223 22.9409 10.7788 22.7506 10.8805C22.5492 10.9935 22.1015 11.163 21.7658 11.2647L21.1614 11.4567L20.613 11.0839C20.3108 10.8805 19.8856 10.6545 19.6617 10.5867C19.0909 10.4286 18.218 10.4512 17.7032 10.6319C16.3042 11.1404 15.4201 12.451 15.5208 13.886Z"
                          fill="#F2F2F2"
                        />
                      </svg>
                      <svg
                        width="32"
                        height="33"
                        viewBox="0 0 32 33"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.1"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0 16.8809C0 8.0443 7.16344 0.880859 16 0.880859C24.8366 0.880859 32 8.0443 32 16.8809C32 25.7174 24.8366 32.8809 16 32.8809C7.16344 32.8809 0 25.7174 0 16.8809Z"
                          fill="#F2F2F2"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M22.6677 11.3804C23.4021 11.5819 23.9804 12.1756 24.1767 12.9296C24.5333 14.2962 24.5333 17.1475 24.5333 17.1475C24.5333 17.1475 24.5333 19.9987 24.1767 21.3653C23.9804 22.1194 23.4021 22.7131 22.6677 22.9147C21.3369 23.2808 16 23.2808 16 23.2808C16 23.2808 10.6631 23.2808 9.33218 22.9147C8.59783 22.7131 8.0195 22.1194 7.82323 21.3653C7.46667 19.9987 7.46667 17.1475 7.46667 17.1475C7.46667 17.1475 7.46667 14.2962 7.82323 12.9296C8.0195 12.1756 8.59783 11.5819 9.33218 11.3804C10.6631 11.0142 16 11.0142 16 11.0142C16 11.0142 21.3369 11.0142 22.6677 11.3804ZM14.4 14.7474V20.0808L18.6667 17.4142L14.4 14.7474Z"
                          fill="#F2F2F2"
                        />
                      </svg>
                    </Typography>
                    <Typography
                      component="div" className="SocialIcons"
                      sx={{
                        maxWidth: {
                          xs: "0",
                          md: "100px",
                          lg: "150px",
                          sm: "150px",
                        },
                        paddingTop: { sm: "10px" },
                        "& img": {
                          width: {
                            lg: "150px",
                            md: "120px",
                            sm: "150px",
                            xs: "95px",
                          },
                          height: "100%",
                          padding: 0,
                        },
                      }}
                    >
                      <img src={AndroidLogo} alt="" />
                      <img src={IosLogo} alt=""  />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Container>
        <Typography
          variant="body2"
          align="center"
          sx={{
            background: "#333252",
            color: "#ffffff",
            padding: "5px",
            fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "14px" },
          }}
        >
          Copyright ?? {moment().format("Y")} Hamrostay.
          <span>All rights reserved</span>
        </Typography>
      </div>
      </Grid>
    </>
  );
};

export default HelpCenter;
