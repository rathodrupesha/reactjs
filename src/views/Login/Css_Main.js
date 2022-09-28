import React from "react";
import { makeStyles, withStyles, fade } from "@material-ui/core/styles";
import { Checkbox, TextField, Button, LinearProgress } from "@material-ui/core";
import { amber, green } from "@material-ui/core/colors";

const themeColor = "#8fbf4f";
const imp = "!important";
export const useStylesMain = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.default
    },
    grid: {
        minHeight: "100vh"
    },
    quoteContainer: {
        [theme.breakpoints.down("md")]: {
            display: "none !important"
        }
    },
    quote: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${"https://orderhive-shipbroker.s3-ap-southeast-1.amazonaws.com/img/business.png"})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center"
    },
    quoteRight: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    quoteInner: {
        textAlign: "center",
        flexBasis: "600px"
    },
    quoteInnerRight: {
        flexBasis: "600px"
    },
    quoteText: {
        color: theme.palette.white,
        fontWeight: 300
    },
    /*name: {
        marginTop: theme.spacing(3),
        color: theme.palette.white
    },*/
    contentContainer: {},
    content: {
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    contentHeader: {
        display: "flex",
        alignItems: "center",
        paddingTop: theme.spacing(5),
        paddingBototm: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
    },
    logoImage: {
        marginLeft: theme.spacing(4)
    },
    contentBody: {
        flexGrow: 1,
        display: "flex",
        alignItems: "center",
        [theme.breakpoints.down("md")]: {
            justifyContent: "center"
        }
    },
    form: {
        paddingLeft: 100,
        paddingRight: 100,
        paddingBottom: 125,
        flexBasis: 700,
        [theme.breakpoints.down("sm")]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },
    signUpform: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10,
        flexBasis: 700,
        [theme.breakpoints.down("sm")]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },
    title: {
        marginTop: theme.spacing(2)
    },
    textField: {
        marginTop: theme.spacing(2)
    },
    label: {
        "&$focused": {
            color: "#717171"
        }
    },
    focused: {},
    outlinedInput: {
        "&$focused $notchedOutline": {
            border: "1.5px solid " + themeColor
        }
    },
    notchedOutline: {},
    colorPrimary: {
        backgroundColor: "#efdaf1"
    },
    barColorPrimary: {
        backgroundColor: themeColor
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    message: {
        display: "flex",
        justifyContent: "center",
        color: "red",
        fontWeight: 500
    },
    link: {
        color: themeColor,
        textDecoration: "none",
        "&:hover": {
            textDecoration: "underline"
        }
    },
    root_table: {
        width: "100%",
        overflowX: "auto",
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 800
    },
    logoDiv: {
        padding: "5%"
    },
    option: {
        fontSize: 15,
        "& > span": {
            marginRight: 10,
            marginTop: 6,
            fontSize: 18
        }
    },
    user_image: {
        width: "40%"
    },
    iconWithText: {
        position: "relative",
        top: "5px",
        width: "26px",
        height: "25px"
    }
}));