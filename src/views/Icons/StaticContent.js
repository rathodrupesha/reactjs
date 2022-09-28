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

import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";
import { EditRounded } from "@material-ui/icons";
import Button from "../../components/CustomButtons/Button.js";

const useStyles = makeStyles(styles);

export default function Icons() {
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
   // console.log("about us content");
    Api.getStaticContent()
      .then((res) => {
       // console.log("get static content--", res);
        if (res && res.data && res.data.data) {
        //  console.log("res of content listing", res.data.data);
          // let content_type = res.data.data[0].type;
          // if (content_type === "about") {
          //   setAboutUs(res.data.data[0]);
          // }
          res.data.data.map((i) => {
           // console.log("type--", i.type);
            if (i.type === "about") {
              setAboutUs(i);
              setAboutConstant(i);
            } else if (i.type === "help") {
              setHelp(i);
              setHelpConstant(i);
            }
          });

          // res.data.data.map((i) => {
          //   i.type == "contactAs" ? setAboutUs(i) : " ";
          // });
        } else {
        //  console.log("in else");
         // console.log(res.msg);
        }
      })
      .catch((err) => {
        if (err) {
         // console.log(err, "error----content listing");
        }
      });
  };

  const onAboutUsEditorChange = (event) => {
  //  console.log("on editor change---", event.editor.getData());
    // console.log("on editor change---", event.editor);
    let obj = JSON.parse(JSON.stringify(aboutUs));

    obj["content"] = event.editor.getData();
 //   console.log("object 56", obj);
    // let obj1 = Object.assign({}, obj);
    // setAboutUs((aboutUs = Object.assign({}, aboutUs, obj)));
    setAboutUs(obj);
   // console.log("setstate", aboutUs);
  };
  const onHelpEditorChange = (event) => {
   // console.log("on editor change---", event.editor.getData());
    // console.log("on editor change---", event.editor);
    let obj = JSON.parse(JSON.stringify(help));

    obj["content"] = event.editor.getData();
   // console.log("object 56", obj);
    // let obj1 = Object.assign({}, obj);
    // setAboutUs((aboutUs = Object.assign({}, aboutUs, obj)));
    setHelp(obj);
  //  console.log("setstate", aboutUs);
  };
  //  on cancel
  const handleCancel = (eventType) => (event) => {
  //  console.log("on cancel---", event);
    // setAboutUs(...aboutUs);
    let obj;
    if (eventType === "about") {
      obj = JSON.parse(JSON.stringify(aboutUs));
      obj["content"] = aboutConstant["content"];
      setAboutUs(obj);
    } else {
      obj = JSON.parse(JSON.stringify(help));
      obj["content"] = helpConstant["content"];
      setHelp(obj);
    }
   // console.log("About us--", aboutConstant);
   // console.log("object Cancel--", obj);
  };

  //on edit submit
  const editAboutUs = (eventType) => (event) => {
   // console.log("on edit submit---", event);
   // console.log("on edit submit---", aboutUs);
    let payload = {};
    if (eventType === "about") {
      payload = {
        type: aboutUs.type,
        cms_for: aboutUs.cms_for,
        content: aboutUs.content,
      };
    } else {
      payload = {
        type: help.type,
        cms_for: help.cms_for,
        content: help.content,
      };
    }
    console.log("payload--", payload);
    Api.updateStaticContent(payload)
      .then((res) => {
        console.log(res);
        if (res.data.status == 1) {
          if (res.data.data.type === "about") {
            setAboutUs(res.data.data);
            setAboutConstant(res.data.data);
          } else {
            setHelp(res.data.data);
            setHelpConstant(res.data.data);
          }
          setBR(true);
          setNotification({
            type: "success",
            message: "Success! Content updated Suceesfully.",
          });
        }
      })
      .catch((err) => {
        const error = err?.message || err?.res?.message || err;

        console.log("inside catch", err?.message || err?.res?.message || err);
      });
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>About Us</h4>
          </CardHeader>
          <CardBody>
            <GridItem xs={12} sm={12} md={12}>
              <CKEditor
                data={aboutUs.content}
                onChange={onAboutUsEditorChange}
              />
              <br />

              <Button
                color="primary"
                align="centre"
                onClick={handleCancel("about")}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                align="centre"
                onClick={editAboutUs("about")}
              >
                Save
              </Button>
            </GridItem>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>Help</h4>
          </CardHeader>
          <CardBody>
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
          </CardBody>
        </Card>
        <Snackbar
          place="tr"
          setBR={setBR}
          color={notification.type}
          message={notification.message}
          open={br}
          closeNotification={handleCloseMsg}
          close
        />
      </GridItem>
    </GridContainer>
  );
}
