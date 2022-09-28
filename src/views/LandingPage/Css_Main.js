import { makeStyles } from "@material-ui/core/styles";
import { styled, Typography } from "@mui/material";

export const useStylesMain = makeStyles((theme) => ({
  root: {
    padding: 0,
    maxWidth: "100%",
  },
  activePlan: {
    background: "#333252",
    borderRadius: "24px",
    color: "#FFF",
  },
  activePlanButton: {
    color: "#FFFFFF",
    background: "#FF6C23",
  },
  planButton: {
    color: "#FF6C23",
    background: "#FFFFFF",
  },
  activePlanHeader: {
    background: "#FFFFFF",
    color: "#8645FF",
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "12px",
    lineHeight: "15px",
    padding: "5px 5px 5px 5px",
  },
  footerTitle: {
    fontFamily: "Manrope",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "20px",
    lineHeight: "30px",
    fontFeatureSettings: "'liga' off",
    color: "#FFFFFF",
    textTransform: "none",
  },
}));
export const ServeContainer = styled(Typography)(({ theme }) => ({
  // paddingTop: "178px",
  // paddingBottom: "64px",
  padding: "10px",
  fontFamily: "Manrope !important",
  fontStyle: "normal",
  [theme.breakpoints.down("lg")]: {
    // paddingTop: "100px",
    paddingBottom: "64px",
  },
  [theme.breakpoints.down("md")]: {
    paddingTop: "50px",
    paddingBottom: "56px",
  },
  [theme.breakpoints.down("sm")]: {
    marginTop: "-50px",
    paddingTop: "0px",
    fontSize: "26px",
    lineHeight: "50px",
    paddingBottom: "44px",
  },
  // [theme.breakpoints.down("xs")]: {
  //   marginTop: "-50px",
  //   paddingTop: "0px",
  //   paddingBottom: "34px",
  // },
}));
export const ServeTitle = styled(Typography)(({ theme }) => ({
  fontSize: "36px",
  fontWeight: 800,
  lineHeight: "64px",
  marginBottom: "8px",
  fontFamily: "Manrope !important",
  fontStyle: "normal",
  paddingTop: "28px",
  color: theme.palette.otherColor.blue,
  [theme.breakpoints.down("md")]: {
    fontSize: "32px",
    fontWeight: 600,
    lineHeight: "56px",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "24px",
    fontWeight: 600,
    lineHeight: "26px",
  },
}));
export const MainTitle = styled("div")(({ theme }) => ({
  textAlign: "center",
  width: "100%",
  marginBottom: "48px",
  fontFamily: "Manrope !important",
  fontStyle: "normal",
  [theme.breakpoints.down("md")]: {
    marginBottom: "22px",
  },
  [theme.breakpoints.down("sm")]: {
    marginBottom: "18px",
  },
}));
export const ServeDescription = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: 400,
  lineHeight: "32px",
  color: theme.palette.otherColor.lightBlack,
  fontFamily: "Manrope",
  fontStyle: "normal",
  [theme.breakpoints.down("md")]: {
    fontSize: "16px",
    fontWeight: 250,
    lineHeight: "22px",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
    fontWeight: 300,
    lineHeight: "24px",
  },
}));

export const BoxTitle = styled(Typography)(({ theme, color }) => ({
  fontFamily: "Manrope !important",
  fontStyle: "normal",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "32px",
  marginBottom: "8px",
  marginTop: "24px",
  color: color ?? theme.palette.otherColor.lightBlack,
  [theme.breakpoints.down("md")]: {
    fontSize: "22px",
    fontWeight: 500,
    lineHeight: "28px",
    marginTop: "16px",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    marginTop: "0px",
  },
}));
export const BoxDescription = styled(Typography)(({ theme }) => ({
  fontFamily: "Manrope !important",
  fontStyle: "normal",
  fontSize: "18px",
  fontWeight: 400,
  lineHeight: "32px",
  color: theme.palette.otherColor.lightBlack,
}));
