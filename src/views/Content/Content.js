import React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CKEditor from "ckeditor4-react";
import Api from "Api/ApiUtils";
import Snackbar from "../../components/Snackbar/Snackbar";

import { EditRounded } from "@material-ui/icons";
import Button from "../../components/CustomButtons/Button.js";
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "400",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

export default function Content() {
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));

  const classes = useStyles();

  const [loader, setLoader] = useState(true);
  const [staffContent, setStaffContent] = useState(null);
  const [staffConstant, setStaffConstant] = useState(null);
  const [customerContent, setCustomerContent] = useState(null);
  const [customerConstant, setCustomerConstant] = useState(null);
  const [aboutUs, setAboutUs] = useState({});
  const [aboutConstant, setAboutConstant] = useState({});
  const [ownerMsg, setOwnerMsg] = useState({});
  const [ownerMsgConstant, setOwnerMsgConstant] = useState({});
  const [staffRadioValue, setStaffRadioValue] = useState("aboutAs");
  const [customerRadioValue, setCustomerRadioValue] = useState("aboutAs");

  const handleStaffChange = (event) => {
    setStaffRadioValue(event.target.value);
  };

  const handleCustomerChange = (event) => {
    setCustomerRadioValue(event.target.value);
  };

  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [br, setBR] = useState(false);
  const handleCloseMsg = () => {
    setBR(false);
  };

  useEffect(() => {
    getStaffContent();
    getCustomerContent();
    getOwnerMsg();
  }, []);

  useEffect(() => {
    getStaffContent();
  }, [staffRadioValue]);

  useEffect(() => {
    getCustomerContent();
  }, [customerRadioValue]);

  const getStaffContent = () => {
    setLoader(true);

    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };

    Api.getStaticStaffContent(payload)
      .then((res) => {
        setLoader(false);

        if (res && res.data && res.data.data && res.data.status == 1) {
          console.log("res of content listing", res.data.data);

          let x = res.data.data.filter(
            (result) => result.type === staffRadioValue
          );
          if (x.length) {
            setStaffContent(x[0]);
            setStaffConstant(x[0]);
          } else {
            setStaffContent([]);
            setStaffConstant();
          }
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
          console.log("in else");
          console.log(res.msg);
        }
      })
      .catch((err) => {
        setLoader(false);
        if (err) {
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          console.log(err, "error----content listing");
        }
      });
  };

  const getCustomerContent = () => {
    setLoader(true);

    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };

    Api.getStaticCustomerContent(payload)
      .then((res) => {
        setLoader(false);

        if (res && res.data && res.data.data && res.data.status == 1) {
          // console.log("res of content listing", res.data.data);

          let y = res.data.data.filter(
            (result) => result.type === customerRadioValue
          );
          if (y.length) {
            setCustomerContent(y[0]);
            setCustomerConstant(y[0]);
          } else {
            setCustomerContent([]);
            setCustomerConstant([]);
          }
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
          console.log("in else");
          console.log(res.msg);
        }
      })
      .catch((err) => {
        setLoader(false);
        if (err) {
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          console.log(err, "error----content listing");
        }
      });
  };

  const onStaffEditorChange = (event) => {
    console.log("on staff editor change---", event.editor.getData());
    let obj = JSON.parse(JSON.stringify(staffContent));

    obj["content"] = event.editor.getData();

    setStaffContent(obj);
  };

  const onCustomerHandleChange = (event) => {
    console.log("on staff editor change---", event.editor.getData());
    let obj = JSON.parse(JSON.stringify(customerContent));

    obj["content"] = event.editor.getData();

    setCustomerContent(obj);
  };

  //  on cancel
  const handleStaffEditorCancel = (event) => {
    let obj;
    // console.log("staffConstant", staffConstant);
    obj = JSON.parse(JSON.stringify(staffContent));
    obj["content"] = staffConstant["content"];
    setStaffContent(obj);
  };

  const handleCustomerEditorCancel = (event) => {
    let obj;
    // console.log("staffConstant", staffConstant);
    obj = JSON.parse(JSON.stringify(customerContent));
    obj["content"] = customerConstant["content"];
    setCustomerContent(obj);
  };

  // --------edit  content---------
  const editStaffContent = () => {
    // setLoader(true);

    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      content: staffContent.content,
      type: staffRadioValue,
    };

    console.log("payload--", payload);
    Api.updateStaffContent(payload)
      .then((res) => {
        // setLoader(false);
        // console.log(res);
        if (res.data.status == 1) {
          if (res.data.data) {
            setStaffContent(res.data.data);
            setStaffConstant(res.data.data);

            // getAboutUs();
            setBR(true);
            setNotification({
              type: "success",
              message: res.data.msg,
            });
          }
        } else {
          // setLoader(false);
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })
      .catch((err) => {
        setLoader(false);
        const error = err?.message || err?.res?.message || err;
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
        console.log("inside catch", err?.message || err?.res?.message || err);
      });
  };

  const editCustomerContent = () => {
    // setLoader(true);

    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      content: customerContent.content,
      type: customerRadioValue,
    };

    // console.log("payload--", payload);
    Api.updateCustomerContent(payload)
      .then((res) => {
        // setLoader(false);
        console.log(res);
        if (res.data.status == 1) {
          if (res.data.data) {
            setCustomerContent(res.data.data);
            setCustomerConstant(res.data.data);

            // getAboutUs();
            setBR(true);
            setNotification({
              type: "success",
              message: res.data.msg,
            });
          }
        } else {
          // setLoader(false);
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })
      .catch((err) => {
        setLoader(false);
        const error = err?.message || err?.res?.message || err;
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
        console.log("inside catch", err?.message || err?.res?.message || err);
      });
  };

  // --------for msg from owner------

  const getOwnerMsg = () => {
    setLoader(true);

    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };

    Api.getOwnerMsgContent(payload)
      .then((res) => {
        setLoader(false);

        if (res && res.data && res.data.status == 1) {
          console.log("res of content listing", res.data.data);

          // res.data.data.map((i) => {
          // console.log("i--->", i);

          if (res.data.data) {
            setOwnerMsg(res.data.data);
            setOwnerMsgConstant(res.data.data);
          }

          // });
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
          console.log("in else");
          console.log(res.msg);
        }
      })
      .catch((err) => {
        setLoader(false);
        if (err) {
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          console.log(err, "error----content listing");
        }
      });
  };

  // on change
  const onOwnerMsgEditorChange = (event) => {
    console.log("on editor change---", event.editor.getData());
    // console.log("on editor change---", event.editor);
    let obj = JSON.parse(JSON.stringify(ownerMsg));

    obj["description"] = event.editor.getData();
    console.log("object", obj);
    // let obj1 = Object.assign({}, obj);
    // setAboutUs((aboutUs = Object.assign({}, aboutUs, obj)));
    setOwnerMsg(obj);
    // console.log("setstate", aboutUs);
  };

  //  on cancel
  const handleOwnerMsgCancel = (event) => {
    let obj;

    obj = JSON.parse(JSON.stringify(ownerMsg));
    obj["description"] = ownerMsgConstant["description"];
    setOwnerMsg(obj);
  };

  //on edit submit
  const editOwnerMsg = () => {
    // setLoader(true);

    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      description: ownerMsg.description,
    };

    console.log("payload--", payload);
    Api.updateOwnerMsgContent(payload)
      .then((res) => {
        // setLoader(false);
        console.log(res);
        if (res.data.status == 1) {
          if (res.data.data) {
            setOwnerMsg(res.data.data);
            setOwnerMsgConstant(res.data.data);

            // getAboutUs();
            setBR(true);
            setNotification({
              type: "success",
              message: res.data.msg,
            });
          }
        } else {
          // setLoader(false);
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })
      .catch((err) => {
        // setLoader(false);
        const error = err?.message || err?.res?.message || err;
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
        console.log("inside catch", err?.message || err?.res?.message || err);
      });
  };
  console.log("staffContent", staffContent);
  return (
    <>
      <GridContainer style={{ background: "white", paddingTop: "15px" }}>
        <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <Accordion>
              <CardHeader plain color="primary">
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      style={{ color: "#FFFFFF", fontSize: "30px" }}
                    />
                  }
                  aria-controls="panel1a-content"
                >
                  <h4 className={classes.cardTitleWhite}>Staff</h4>
                </AccordionSummary>
              </CardHeader>
              <AccordionDetails>
                <CardBody>
                  <div>
                    <RadioGroup
                      row
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={staffRadioValue}
                      onChange={handleStaffChange}
                    >
                      <FormControlLabel
                        value="aboutAs"
                        control={<Radio />}
                        label="About Us"
                      />
                      <FormControlLabel
                        value="terms"
                        control={<Radio />}
                        label="Terms"
                      />
                      <FormControlLabel
                        value="privacy"
                        control={<Radio />}
                        label="Privacy Policy"
                      />
                      <FormControlLabel
                        value="help"
                        control={<Radio />}
                        label="Help"
                      />
                    </RadioGroup>
                  </div>
                  <GridItem xs={12} sm={12} md={12}>
                    {!loader ? (
                      <CKEditor
                        data={staffContent ? staffContent.content : null}
                        onChange={onStaffEditorChange}
                      />
                    ) : (
                      <CircularProgress
                        align="centre"
                        color="primary"
                        style={{ marginBottom: "1.25rem" }}
                      />
                    )}

                    <br />

                    <Button
                      color="primary"
                      align="centre"
                      onClick={handleStaffEditorCancel}
                      className="add-cancel-button"
                      style={{ marginRight: "1rem" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      align="centre"
                      onClick={editStaffContent}
                      className="add-cancel-button"
                    >
                      Save
                    </Button>
                  </GridItem>
                </CardBody>
              </AccordionDetails>
            </Accordion>
          </Card>

          <Card plain>
            <Accordion style={{ marginTop: "30px" }}>
              <CardHeader plain color="primary">
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      style={{ color: "#FFFFFF", fontSize: "30px" }}
                    />
                  }
                  aria-controls="panel1a-content"
                >
                  <h4 className={classes.cardTitleWhite}>Customer</h4>
                </AccordionSummary>
              </CardHeader>
              <AccordionDetails>
                <CardBody>
                  <div>
                    <RadioGroup
                      row
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={customerRadioValue}
                      onChange={handleCustomerChange}
                    >
                      <FormControlLabel
                        value="aboutAs"
                        control={<Radio />}
                        label="About Us"
                      />
                      <FormControlLabel
                        value="terms"
                        control={<Radio />}
                        label="Terms"
                      />
                      <FormControlLabel
                        value="privacy"
                        control={<Radio />}
                        label="Privacy Policy"
                      />
                      <FormControlLabel
                        value="help"
                        control={<Radio />}
                        label="Help"
                      />
                    </RadioGroup>
                  </div>
                  <GridItem xs={12} sm={12} md={12}>
                    <CKEditor
                      data={customerContent ? customerContent.content : null}
                      onChange={onCustomerHandleChange}
                    />
                    <br />

                    <Button
                      color="primary"
                      align="centre"
                      onClick={handleCustomerEditorCancel}
                      className="add-cancel-button"
                      style={{ marginRight: "1rem" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      align="centre"
                      onClick={editCustomerContent}
                      className="add-cancel-button"
                    >
                      Save
                    </Button>
                  </GridItem>
                </CardBody>
              </AccordionDetails>
            </Accordion>
          </Card>

          <Card plain>
            <Accordion style={{ marginTop: "30px" }}>
              <CardHeader plain color="primary">
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      style={{ color: "#FFFFFF", fontSize: "30px" }}
                    />
                  }
                  aria-controls="panel1a-content"
                >
                  <h4 className={classes.cardTitleWhite}>Message</h4>
                </AccordionSummary>
              </CardHeader>
              <AccordionDetails>
                <CardBody>
                  <GridItem xs={12} sm={12} md={12}>
                    <CKEditor
                      data={ownerMsg.description}
                      onChange={onOwnerMsgEditorChange}
                    />
                    <br />

                    <Button
                      color="primary"
                      align="centre"
                      onClick={handleOwnerMsgCancel}
                      className="add-cancel-button"
                      style={{ marginRight: "1rem" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      align="centre"
                      onClick={editOwnerMsg}
                      className="add-cancel-button"
                    >
                      Save
                    </Button>
                  </GridItem>
                </CardBody>
              </AccordionDetails>
            </Accordion>
          </Card>
        </GridItem>
      </GridContainer>

      <Snackbar
        place="tr"
        setBR={setBR}
        color={notification.type}
        message={notification.message}
        open={br}
        closeNotification={handleCloseMsg}
        close
      />
    </>
  );
}
