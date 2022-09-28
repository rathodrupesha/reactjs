import React, { forwardRef ,useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Container,
  Grid,
  Typography,
  ListItem,
  ListItemButton,
  List,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import planBg from "../../assets/img/plan-bg.png";
import "./landing.css";
import ListItemIcon from "@mui/material/ListItemIcon";
import { MainTitle, ServeDescription, ServeTitle } from "./Css_Main";
import { ReactComponent as TickIcon } from "../../assets/img/tick.svg";
import { ReactComponent as CloseIcon } from "../../assets/img/close.svg";

import CheckIcon from "@mui/icons-material/Check";


const PlanType = styled(Typography)(({ theme }) => ({
  fontFamily: "Inter",
  fontStyle: "normal",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "19px",
  color: theme.palette.otherColor.lightBlack,
}));

const PricePlans = forwardRef(({handleNavbar}, ref) => {

  
  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#FF6C23",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      // backgroundColor:
      //   theme.palette.mode === "dark"
      //     ? "rgba(255,255,255,.35)"
      //     : "rgba(0,0,0,.25)",
      boxSizing: "border-box",
    },
  }));
  const tiers = [
    {
      title: "Free",
      monthlyPrice: "Free",
      yearlyPrice: "Free",
      description: [
        {
          icon: "true",
          text: "Digital guest service",
          active: "true",
        },
        {
          icon: "true",
          text: "Guest and staff app",
          active: "true",
        },
        {
          icon: "true",
          text: "Team dash board",
          active: "true",
        },
        {
          icon: "true",
          text: "Property analytics.",
          active: "true",
        },
        {
          icon: "true",
          text: "Booking management",
          active: "true",
        },
        {
          icon: "true",
          text: "1-10 Users",
          active: "true",
        },
        {
          icon: "true",
          text: "Staff 4",
          active: "true",
        },
      ],
      buttonText: "Choose",

      // buttonVariant: "outlined",
    },
    {
      title: "Bronze",
      subheader: "",
      monthlyPrice: "29.99",
      yearlyPrice: "29.99",
      description: [
        {
          icon: "true",
          text: "24/7 Support",
          active: "true",
        },
        {
          icon: "true",
          text: "Digital guest service",
          active: "true",
        },
        {
          icon: "true",
          text: "Guest and staff app",
          active: "true",
        },
        {
          icon: "true",
          text: "Team dashboard",
          active: "true",
        },
        {
          icon: "true",
          text: "Property analytics",
          active: "true",
        },
        {
          icon: "true",
          text: "Booking management",
          active: "true",
        },
        {
          icon: "true",
          text: "10-100 Users",
          active: "true",
        },
        {
          icon: "true",
          text: "staff 10",
          active: "true",
        },
      ],
      buttonText: "Choose",
      // buttonVariant: "contained",
    },
    {
      title: "Silver",
      monthlyPrice: "49.99",
      yearlyPrice: "49.99",
      description: [
        {
          icon: "true",
          text: "24/7 Support",
          active: "true",
        },
        {
          icon: "true",
          text: "Digital guest service",
          active: "true",
        },
        {
          icon: "true",
          text: "Guest and staff app",
          active: "true",
        },
        {
          icon: "true",
          text: "Team dashboard",
          active: "true",
        },
        {
          icon: "true",
          text: "Property analytics",
          active: "true",
        },
        {
          icon: "true",
          text: "Booking management",
          active: "true",
        },
        {
          icon: "true",
          text: "100-200 Users",
          active: "true",
        },
        {
          icon: "true",
          text: "Staff 20",
          active: "true",
        },
      ],
      buttonText: "Choose",
      // buttonVariant: "outlined",
    },
    {
      title: "Gloden",
      monthlyPrice: "Contact Sales",
      yearlyPrice: "Contact Sales",
      description: [
        {
          icon: "true",
          text: "24/7 Support",
          active: "true",
        },
        {
          icon: "true",
          text: "Digital guest service",
          active: "true",
        },
        {
          icon: "true",
          text: "Guest and staff app",
          active: "true",
        },
        {
          icon: "true",
          text: "Team dashboard",
          active: "true",
        },
        {
          icon: "true",
          text: "Property analytics",
          active: "true",
        },
        {
          icon: "true",
          text: "Booking management",
          active: "true",
        },
        {
          icon: "true",
          text: "200-500 Users",
          active: "true",
        },
      ],
      buttonText: "abcccc",
      buttonText: "Choose",
      // buttonVariant: "outlined",
    },
    {
      title: "Platinum",
      monthlyPrice: "Contact Sales",
      yearlyPrice: "Contact Sales",
      description: [
        {
          icon: "true",
          text: "24/7 Support",
          active: "true",
        },
        {
          icon: "true",
          text: "Digital guest service",
          active: "true",
        },
        {
          icon: "true",
          text: "Guest and staff app",
          active: "true",
        },
        {
          icon: "true",
          text: "Team dashboard",
          active: "true",
        },
        {
          icon: "true",
          text: "Property analytics",
          active: "true",
        },
        {
          icon: "true",
          text: "Booking management",
          active: "true",
        },
        {
          icon: "true",
          text: "Unlimited",
          active: "true",
        },
      ],
      buttonText: "Choose",
      // buttonVariant: "outlined",
    },
  ];
  return (
    <>
      <div
        style={{ backgroundImage: `url(${planBg})` }}
        className="plan-section-wrap"
        ref={ref}
      >
        <Container fixed marginBottom="0"  className="planHeading">
          <Grid container mt={5.5} alignItems="center" justifyContent="center" >
            <MainTitle>
              <ServeTitle variant="h2" style={{ marginBottom: "0" }} className="animate-charcter">
                The Right Plan for Your Business
              </ServeTitle>
              <ServeDescription maxWidth="530px" sx={{ margin: `0 auto` }}>
                We have several powerful plans to showcase your business and get
                discovered as a creative entrepreneurs. Everything you need.
              </ServeDescription>
              {/* <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="center"
                pt={4}
              >
                <PlanType>Bill Monthly</PlanType>
                <AntSwitch
                  defaultChecked
                  inputProps={{ "aria-label": "ant design" }}
                />
                <PlanType>Bill Annualy</PlanType>
              </Stack> */}
            </MainTitle>
          </Grid>
        </Container>

        <Container className="billBoxes" fixed component="main">
          <Grid
            container
            spacing={2}
            justifyContent="center"
            className="priceBoxes"
          >
            {tiers.map((tier) => (
              <Grid
                item
                key={tier.title}
                xs={12}
                sm={5}
                md={5}
                lg={2}
                justifyContent="center"
              >
                <div className ='plan-item'>
                  <div className="plan-item__header">
                    <h2  className={tier.title=='Free'?'priceanimate-charcter':''}>{tier.title}</h2>
                  </div>
                  <div className="plan-item__body">
                    <ul>
                      {tier.description.map((line) => (
                        <li
                          className={line.active === "true" ? "active" : ""}
                          key={line.toString()}
                        >
                          <div className="icon">
                            {line.icon === "true" ? (
                              <TickIcon />
                            ) : (
                              <CloseIcon />
                            )}
                          </div>
                          {line.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="plan-item__footer">
                    <div className="plan-item__price ">
                      {tier.monthlyPrice !== "Free" &&
                      tier.monthlyPrice !== "Contact Sales" ? (
                        <>
                          {" "}
                          <span>
                            <sub>$</sub> {tier.monthlyPrice}
                          </span>{" "}
                          /month{" "}
                        </>
                      ) : (
                        <Button  onClick={() => {handleNavbar("Get in Touch")
                      console.log('hello')
                      }
                        }>{tier.monthlyPrice}</Button>
                      )}

                      
                      
                    </div>
                    <Button fullWidth className="plan-button">
                      {tier.buttonText}
                    </Button>
                  </div>
                </div>
                {/* <Card
                className="plan-lists"
                sx={{ boxShadow: "5px 10px 9px 5px #bdb5b5" }}
              >
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{
                    align: "center",
                    fontFamily: "Inter",
                    fontStyle: "normal",
                    fontWeight: 700,
                    fontSize: "24px",
                    lineHeight: "29px",
                    color: "#333252",
                  }}
                  action={<span className="discount"> Save $40</span>}
                  subheaderTypographyProps={{
                    align: "center",
                  }}
                />
                <hr className="no_space" />
                <CardContent>
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                    }}
                    aria-label="contacts"
                    disablePadding={true}
                    className="pricing_list"
                  >
                    {tier.description.map((line) => (
                      <ListItem disablePadding={true} key={line.toString()}>
                        <ListItemButton>
                          <ListItemIcon>
                            <CheckIcon />
                          </ListItemIcon>
                          <ListItemText primary={line} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>

                  <Box className="priceBox"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      mb: 2,
                    }}
                  >
                    {tier.monthlyPrice !== "Free" &&
                      tier.monthlyPrice !== "Contact Sales" && (
                        <Typography variant="h5" className="price">
                          $
                        </Typography>
                      )}
                    <Typography component="h4" variant="h4" className="price">
                      {tier.monthlyPrice}
                    </Typography>
                    {tier.monthlyPrice !== "Free" &&
                      tier.monthlyPrice !== "Contact Sales" && (
                        <Typography variant="h6" className="price">
                          /month
                        </Typography>
                      )}
                  </Box>
                </CardContent>
                <CardActions className="card-actions">
                  <Button fullWidth className="plan-button">
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card> */}
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </>
  );
});

export default PricePlans;
