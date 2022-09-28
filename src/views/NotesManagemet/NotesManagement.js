/*eslint-disable*/
import React from "react";
import { useState, useEffect } from "react";
// @material-ui/core components
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

const styles = {
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

export default function NotesManagement() {
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));

  const [loader, setLoader] = useState(true);
  const [aboutUs, setAboutUs] = useState({});
  const [aboutConstant, setAboutConstant] = useState({});
  const [help, setHelp] = useState({});
  const [helpConstant, setHelpConstant] = useState({});
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [br, setBR] = useState(false);
  const handleCloseMsg = () => {
    setBR(false);
  };
  const classes = useStyles();

  useEffect(() => {
    getContent();
  }, []);

  const getContent = () => {
    setLoader(true);

    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };

    Api.getNoteContent(payload)
      .then((res) => {
        setLoader(false);

        if (res && res.data && res.data.data) {
          console.log("res of content listing", res.data.data);

          res.data.data.rows.map((i) => {
            console.log("i--->", i);
            setAboutUs(i);
            setAboutConstant(i);
          });

          // res.data.data.map((i) => {
          //   i.type == "contactAs" ? setAboutUs(i) : " ";
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

  const onAboutUsEditorChange = (event) => {
    console.log("on editor change---", event.editor.getData());
    // console.log("on editor change---", event.editor);
    let obj = JSON.parse(JSON.stringify(aboutUs));

    obj["notes"] = event.editor.getData();
    console.log("object 56", obj);
    // let obj1 = Object.assign({}, obj);
    // setAboutUs((aboutUs = Object.assign({}, aboutUs, obj)));
    setAboutUs(obj);
    // console.log("setstate", aboutUs);
  };

  //  on cancel
  const handleCancel = (event) => {
    // setAboutUs(...aboutUs);
    let obj;

    obj = JSON.parse(JSON.stringify(aboutUs));
    obj["notes"] = aboutConstant["notes"];
    setAboutUs(obj);

    // else {
    //   obj = JSON.parse(JSON.stringify(help));
    //   obj["content"] = helpConstant["content"];
    //   setHelp(obj);
    // }
    console.log("About us--", aboutConstant);
    console.log("object Cancel--", obj);
  };

  //on edit submit
  const editAboutUs = () => {
    // console.log("on edit submit---", event);
    // console.log("on edit submit---", aboutUs);
    let payload = {};

    payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      notes: aboutUs.notes,
    };

    //  else {
    //   payload = {
    //     type: help.type,
    //     cms_for: help.cms_for,
    //     content: help.content,
    //   };
    // }
    console.log("payload--", payload);
    Api.updateNoteContent(payload)
      .then((res) => {
        // setLoader(false);
        console.log(res);
        if (res.data.status == 1) {
          if (res.data.data) {
            setAboutUs(res.data.data);
            setAboutConstant(res.data.data);

            // getContent();
            setBR(true);
            setNotification({
              type: "success",
              message: res.data.msg,
            });
          }
          //   else {
          //     setHelp(res.data.data);
          //     setHelpConstant(res.data.data);
          //   }
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.msg,
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

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>Note</h4>
            </CardHeader>
            <CardBody>
              {!loader ? (
                <GridItem xs={12} sm={12} md={12}>
                  <CKEditor
                    data={aboutUs.notes}
                    onChange={onAboutUsEditorChange}
                  />
                  <br />

                  <Button
                    color="primary"
                    align="centre"
                    onClick={handleCancel}
                    className="add-cancel-button"
                    style={{ marginRight: "1rem" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    align="centre"
                    onClick={editAboutUs}
                    className="add-cancel-button"
                  >
                    Save
                  </Button>
                </GridItem>
              ) : (
                <center>
                  <CircularProgress align="centre" color="primary" />
                </center>
              )}
            </CardBody>
          </Card>
        </GridItem>
        {/*}    <GridItem xs={12} sm={12} md={12}>
          <Card plain>
            <CardHeader plain color="primary">
              <h4 className={classes.cardTitleWhite}>Help</h4>
            </CardHeader>
            <CardBody>
              {!loader ? (
                <GridItem xs={12} sm={12} md={12}>
                  <CKEditor data={help.content} onChange={onHelpEditorChange} />
                  <br />

                  <Button
                    align="right"
                    color="primary"
                    onClick={handleCancel("help")}
                  >
                    Cancel
                  </Button>
                  <Button color="primary" onClick={editAboutUs("help")}>
                    Save
                  </Button>
                </GridItem>
              ) : (
                <center>
                  <CircularProgress align="centre" color="primary" />
                </center>
              )}
            </CardBody>
          </Card>
              </GridItem>*/}
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
