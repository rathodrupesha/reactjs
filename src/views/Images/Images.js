/*eslint-disable*/
import React, { useMemo, useRef } from "react";
import ModalImage from "react-modal-image";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { useEffect, useState } from "react";
//import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";
import avatar from "assets/img/hotel-logo.png";
import Button from "components/CustomButtons/Button.js";
import Snackbar from "../../components/Snackbar/Snackbar";
import ImageApi from "../../Api/ImagesApi.js";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import "./images.css";
import CircularProgress from "@mui/material/CircularProgress";
import { isModuleAccesible } from "generalUtils";

const styles = {
  settingimage: {
    width: "80px",
    borderRadius: "50%",
    height: "59px",
    objectFit: "contain",
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

function convertReadFileToBlobUrl(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.onload = () => {
      const blob = new Blob([fr.result]);
      const url = URL.createObjectURL(blob, { type: "image/png" });
      resolve(url);
    };
  });
}

const access_criteria = "hotel";
export default function Icons() {
  const classes = useStyles();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [imageId, setImageId] = useState("");
  const [selFile, setselectedFile] = useState({});

  const sliderInpRef = useRef();
  const [selMulFile, setselectedMulFile] = useState({ files: [] });
  const [mainImage, setMainImage] = useState(null);
  const [loader, setLoader] = React.useState(true);
  const [slideloader, setSlideLoader] = React.useState(true);
  const [sliderImage, setSliderImage] = useState([]);
  function handleInputChange(event) {
    setselectedFile({
      selectedFile: event.target.files[0],
    });
    convertReadFileToBlobUrl(event.target.files[0]).then((blobUrl) =>
      setMainImage(blobUrl)
    );
  }
  async function handleInputMulChange(event) {
    setselectedMulFile((prev) => {
      const newFiles = [...prev.files].map((fileObj, idx) => ({
        file: fileObj.file,
        id: `new-${idx}`,
      }));
      let cnt = newFiles.length;
      event.target.files.forEach((file) =>
        newFiles.push({ file, id: `new-${cnt++}` })
      );
      return { files: newFiles };
    });
    // setselectedMulFile({ files: [...selMulFile.files, ...event.target.files] });
    const sliderImagesN = [...sliderImage];
    for (let i = 0; i < event.target.files.length; i++) {
      let file = event.target.files[i];
      let imgBlobUrl = await convertReadFileToBlobUrl(file);
      sliderImagesN.push({ id: `new-${i}`, image: imgBlobUrl });
    }
    setSliderImage(sliderImagesN);
  }
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [br, setBR] = useState(false);
  const handleCloseMsg = () => {
    setBR(false);
  };

  const handleDeleteDialog = (image_id) => {
    setOpenDeleteDialog(true);
    setImageId(image_id);
  };
  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setImageId("");
  };

  const isUpdationOfAnyKindAccessible = useMemo(
    () =>
      isModuleAccesible(access_criteria, "create") ||
      isModuleAccesible(access_criteria, "update") ||
      isModuleAccesible(access_criteria, "delete"),
    []
  );

  //on delete
  const handleRemoveSingleSlider = () => {
    if (typeof imageId === "string" && imageId.startsWith("new")) {
      setSliderImage((prev) => prev.filter((im) => im.id !== imageId));
      setselectedMulFile((prev) => {
        const newFiles = prev.files.filter((im) => im.id !== imageId);
        return { files: newFiles };
      });
      setOpenDeleteDialog(false);
      return;
    }
    setSlideLoader(true);
    // console.log("image_id", image_id);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      image_id: imageId,
    };

    ImageApi.deleteSliderSingleImage(payload)
      .then((res) => {
        setSlideLoader(false);
        if (res.data.status == 1) {
          console.log(res.data);
          handleCloseDelete();
          setMainImage(res.data.data.main_image);
          //   // props.setEditCustomerDataCall(true);
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          showDetails();

          //   props.setGetCustomerDataCall(true);
          //   handleClose();
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })
      .catch((err) => {
        setSlideLoader(false);
        const error = err?.message || err?.res?.message || err;
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
        console.log("inside catch", err?.message || err?.res?.message || err);
      });
  };
  const handleAddMainImage = () => {
    setLoader(true);
    // setFormErrors({});
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      main_image: selFile.selectedFile,
    };
    console.log("payload", payload);
    if (!selFile.selectedFile) {
      setBR(true);
      setNotification({
        type: "danger",
        message: "Please Select Images",
      });
      return;
    }
    ImageApi.editMainImage(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status == 1) {
          console.log(res.data);
          setMainImage(res.data.data.main_image);
          //   // props.setEditCustomerDataCall(true);
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          showDetails();

          //   props.setGetCustomerDataCall(true);
          //   handleClose();
        } else {
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
  const handleAddSliderImage = () => {
    setSlideLoader(true);
    // setFormErrors({});
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      slide_image: selMulFile.files.map((filesObj) => filesObj.file),
    };
    console.log("payload==", payload);
    if (selMulFile.files.length < 1) {
      setBR(true);
      setNotification({
        type: "danger",
        message: "Please Select Images",
      });
      return;
    }
    ImageApi.editSliderImage(payload)
      .then((res) => {
        setSlideLoader(false);
        if (res.data.status == 1) {
          console.log(res.data);
          //setSliderImage(res.data.data.hotel_images);
          //   // props.setEditCustomerDataCall(true);
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          showDetails();

          //   props.setGetCustomerDataCall(true);
          //   handleClose();
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })
      .catch((err) => {
        setSlideLoader(false);
        const error = err?.message || err?.res?.message || err;
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
        console.log("inside catch", err?.message || err?.res?.message || err);
      });
  };
  const handleRemove = () => {
    // setFormErrors({});
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    ImageApi.deleteSliderImage(payload)
      .then((res) => {
        if (res.data.status == 1) {
          console.log(res.data);

          //   // props.setEditCustomerDataCall(true);
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          showDetails();
          sliderInpRef.current.value = null;
          //   props.setGetCustomerDataCall(true);
          //   handleClose();
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })
      .catch((err) => {
        const error = err?.message || err?.res?.message || err;
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
        console.log("inside catch", err?.message || err?.res?.message || err);
      });
  };

  const handleRemoveSlider = (image_id) => {
    // setFormErrors({});
    console.log("image_id", image_id);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    ImageApi.deleteSliderImage(payload)
      .then((res) => {
        if (res.data.status == 1) {
          console.log(res.data);

          //   // props.setEditCustomerDataCall(true);
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          showDetails();
          sliderInpRef.current.value = null;
          //   props.setGetCustomerDataCall(true);
          //   handleClose();
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })
      .catch((err) => {
        const error = err?.message || err?.res?.message || err;
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
        console.log("inside catch", err?.message || err?.res?.message || err);
      });
  };
  const showDetails = () => {
    setLoader(true);
    setSlideLoader(true);
    // console.log("show details api ", props.viewCustomerData);
    // console.log("show details api id ", props.viewCustomerData.user_id);

    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    ImageApi.getAllImages(payload)
      .then((res) => {
        setLoader(false);
        setSlideLoader(false);
        // console.log(res);
        if (res && res.data && res.data.data) {
          let userData = res.data.data;
          //  console.log("amenities parse--->", userData);
          setMainImage(userData.main_image);
          var indents = [];
          // for (var i = 0; i < userData.hotel_images.length; i++) {
          //   console.log("ggggggg",userData.hotel_images[i]);
          //   indents.push(
          //     <GridContainer>
          //     <GridItem xs={6} sm={6} md={6}>
          //       <div className="form-group col-md-6">
          //       <InnerImageZoom width="300"  height="300" src={userData.hotel_images[i]["image"]} zoomSrc={userData.hotel_images[i]["image"]} />
          //       </div>
          //       </GridItem>
          //       <GridItem xs={6} sm={6} md={6}>
          //       <div className="form-group col-md-6">
          //       <Button color="primary" onClick={handleRemoveSlider(userData.hotel_images[i]["id"])}>
          //             Remove
          //           </Button>
          //       </div>
          //       </GridItem>
          //       </GridContainer>

          //     // <img
          //     //   className="preview my20"
          //     //   style={{
          //     //     maxWidth: "200px",
          //     //     maxHeight: "200px",
          //     //     padding: "20px",
          //     //   }}
          //     //   src={userData.hotel_images[i]["image"]}
          //     //   alt=""
          //     // />
          //   );
          // }
          //setSliderImage(indents);
          setSliderImage(res.data.data.hotel_images);
          setselectedMulFile({ files: [] });
          //  console.log("getDetails nisha", getDetails);
        } else {
          //  console.log("in else");
          //  console.log(res.data.msg);
          // console.log("<-----error", res.data.msg);
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
          //   setgetDetails(() => ({
          //     ...getDetails,
          //     loader: false,
          //   }));
        }
      })
      .catch((err) => {
        setLoader(false);
        setSlideLoader(false);
        if (err) {
          //   console.log(err, "error----userprofile");
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
        }
      });
  };
  useEffect(() => {
    showDetails();
  }, []);
  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Hotel Main Image</h4>
            </CardHeader>
            <CardBody>
              <CardBody>
                <GridContainer>
                  <GridItem xs={6} sm={6} md={6}>
                    <div className="form-group col-md-6">
                      {isUpdationOfAnyKindAccessible ? (
                        <>
                          <label className="text-white">Select File :</label>
                          <input
                            type="file"
                            className="form-control"
                            name="upload_file"
                            accept="image/png, image/jpeg,image/jpg"
                            onChange={handleInputChange}
                          />
                        </>
                      ) : null}
                      <br />
                      <br />
                      {mainImage || !loader ? (
                        <ModalImage
                          large={mainImage}
                          small={mainImage}
                          className="main-image"
                          alt="Hotel Main Image"
                        />
                      ) : (
                        // <InnerImageZoom
                        //   width="300"
                        //   height="300"
                        //   src={mainImage}
                        //   zoomSrc={mainImage}
                        // />
                        // <img
                        //   className="preview my20"
                        //   style={{ maxWidth: "200px", maxHeight: "200px" }}
                        //   src={mainImage}
                        //   alt=""
                        // />
                        <center>
                          <CircularProgress />
                        </center>
                      )}
                    </div>
                  </GridItem>

                  <GridItem xs={6} sm={6} md={6}>
                    <div className="form-group col-md-6">
                      {isUpdationOfAnyKindAccessible ? (
                        <Button
                          color="primary"
                          onClick={handleAddMainImage}
                          // style={{ fontSize: "13px", fontWeight: "450" }}
                          className="header-tab-btn"
                        >
                          Upload
                        </Button>
                      ) : null}
                    </div>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Hotel Slider Images</h4>
            </CardHeader>
            <CardBody>
              <CardBody>
                <GridContainer>
                  <GridItem xs={3} sm={3} md={3}>
                    <div className="form-group col-md-3">
                      {isUpdationOfAnyKindAccessible ? (
                        <>
                          <label className="text-white">Select Files :</label>
                          <input
                            type="file"
                            ref={sliderInpRef}
                            className="form-control"
                            name="upload_file"
                            accept="image/png, image/jpeg,image/jpg"
                            onChange={handleInputMulChange}
                            multiple
                          />
                        </>
                      ) : null}
                      <br />
                      <br />
                    </div>
                  </GridItem>

                  <GridItem xs={3} sm={3} md={3}>
                    <div className="form-group col-md-6">
                      {isUpdationOfAnyKindAccessible ? (
                        <Button
                          color="primary"
                          onClick={handleAddSliderImage}
                          className="header-tab-btn"
                          // style={{ fontSize: "13px", fontWeight: "450" }}
                        >
                          Upload
                        </Button>
                      ) : null}
                    </div>
                  </GridItem>
                  <GridItem xs={3} sm={3} md={3}>
                    <div className="form-group col-md-6">
                      {/* <Button color="primary" onClick={handleRemove}>
                      Remove Images
                    </Button> */}
                    </div>
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {!loader || !slideloader ? (
                      sliderImage.map((item, index) => (
                        <div
                          style={{
                            position: "relative",
                            top: 0,
                            right: 0,
                            marginRight: "50px",
                          }}
                        >
                          <ModalImage
                            large={item["image"]}
                            small={item["image"]}
                            className="slider-image"
                            alt="Hotel Slider Images"
                          ></ModalImage>
                          {isUpdationOfAnyKindAccessible ? (
                            <button
                              className="slider-image-delete-btn"
                              onClick={() => handleDeleteDialog(item["id"])}
                            >
                              &#10005;
                            </button>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <center>
                        <CircularProgress />
                      </center>
                    )}
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
              </CardBody>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className="dialog-delete-block">
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="cancel-button" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button className="cancel-button" onClick={handleRemoveSingleSlider}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
