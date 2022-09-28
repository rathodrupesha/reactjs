import React, { useState, useEffect, useRef } from "react";
import Box from "@material-ui/core/Box";
import Button from "components/CustomButtons/Button.js";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Switch from "@material-ui/core/Switch";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Api from "Api/ApiUtils.js";
import Snackbar from "../../components/Snackbar/Snackbar";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { validatePremiumServiceData } from "./PremiumValidator";
import { validator } from "./PremiumValidator";
import FormHelperText from "@mui/material/FormHelperText";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { Divider } from "@material-ui/core";
import ModalImage from "react-modal-image";
import AvailableTimings from "./AvailableTimings.js";

// for multiple category select
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const WEEK_DAYS = [
  { days: "Monday", openingStatus: false, openTime: "", closeTime: "" },
  { days: "Tuesday", openingStatus: false, openTime: "", closeTime: "" },
  { days: "Wednesday", openingStatus: false, openTime: "", closeTime: "" },
  { days: "Thursday", openingStatus: false, openTime: "", closeTime: "" },
  { days: "Friday", openingStatus: false, openTime: "", closeTime: "" },
  { days: "Saturday", openingStatus: false, openTime: "", closeTime: "" },
  { days: "Sunday", openingStatus: false, openTime: "", closeTime: "" },
];

export default function ViewPremiumService(props) {
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));

  //   let category_choosed = [];
  //   const [defaultCategoriesSelected, setDefaultCategoriesSelected] = useState(
  //     []
  //   );
  //   const [defaultCategories, setDefaultCategories] = useState([]);

  let p_images = [];
  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loader, setLoader] = React.useState(false);
  const [viewloader, setViewLoader] = React.useState(false);
  const mulfilesRef = useRef();
  const [imageId, setImageId] = useState({});
  const [imageIndex, setImageIndex] = useState("");
  const [selMulImage, setSelMulImage] = useState([]);
  const [getPremiumServiceDetails, setGetPremiumServiceDetails] = useState({});

  const [generalService, setGeneralService] = useState(false);
  const [showTimingsSelection, setShowTimingsSelection] = useState(false);
  const [timings, setTimings] = useState([...WEEK_DAYS]);

  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    important_notes: "",
    premium_image: "",
  });
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  // delete image confirm dialog
  const handleDeleteDialog = (image_id, index) => {
    setOpenDeleteDialog(true);
    setImageId(image_id);
    setImageIndex(index);
  };

  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
    setImageId({});
    setImageIndex("");
  };
  const handleGeneralChange = (e) => {
    setGeneralService(e.target.checked);
  };

  const handlePremiumServiceDetails = (e) => {
    const { name, value } = e.target;
    setGetPremiumServiceDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      name: getPremiumServiceDetails.name,
      description: getPremiumServiceDetails.description,
      important_notes: getPremiumServiceDetails.important_notes,
      [name]: value,
    };
    let { isValid, errors } = validator(validation_object, name);
    console.log(isValid, errors);

    setFormErrors(() => ({
      ...formErrors,
      ...errors,
    }));
    //setFormErrors(errors);
    // setFormErrors(() => ({
    //   ...formErrors,
    //   name: errors.name
    // }));
    console.log("formErrors", formErrors);
    return;
  };
  const [br, setBR] = useState(false);
  const handleCloseMsg = () => {
    setBR(false);
  };

  //for edit data
  useEffect(() => {
    console.log("props------->", props.openModal);
    //showDetails();
    if (props.openModal) {
      console.log("useEffect if");

      handleClickOpen();
    } else {
      console.log("useEffect else");
      handleClose();
    }
  }, [props.openModal]);

  //for view details
  useEffect(() => {
    console.log("props------->", props.openDetailModal);
    //showDetails();
    if (props.openDetailModal) {
      handleClickOpen();
    } else {
      handleViewClose();
    }
  }, [props.openDetailModal]);

  const handleClickOpen = () => {
    console.log("view super admin--->", props.openModal);
    setOpen(true);
    showDetails();
  };

  //for edit details
  const handleClose = () => {
    // console.log("view super admin hndle close--->", props.setOpenModal);

    if (mulfilesRef.current) {
      mulfilesRef.current.value = null;
    }
    setSelMulImage([]);
    props.setOpenModal(false);
    setOpen(false);
    setFormErrors({});
    setShowTimingsSelection(false);
  };
  //for view details
  const handleViewClose = () => {
    props.setOpenDetailModal(false);
    setOpen(false);
  };

  const showDetails = () => {
    setViewLoader(true);
    console.log("premium service details", props.viewPremiumData);
    // console.log("menu details meal id ", props.viewPremiumData.id);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      premiumSerId: props.viewPremiumData.premium_id,
    };
    Api.showPremiumServiceDetails(payload)
      .then((res) => {
        setViewLoader(false);
        console.log(res);
        if (res && res.data && res.data.data) {
          console.log("response menu details--->", res.data.data);
          let pServiceData = res.data.data;
          console.log("---", res.data.data.OpeningHours.length < 1);
          if (res.data.data.OpeningHours < 1) {
            setTimings(WEEK_DAYS);
          } else {
            setTimings(
              res.data.data.OpeningHours.map((oh) => {
                if (oh.openingStatus) return oh;
                else return { ...oh, openTime: "", closeTime: "" };
              })
            );
          }

          setGeneralService(res.data.data.openForAll);
          setGetPremiumServiceDetails({
            premium_id: pServiceData.id,
            name: pServiceData.name,
            description: pServiceData.description,
            important_notes: pServiceData.important_notes,
            premium_image: pServiceData.main_image,
            multi_premium_image: pServiceData.images,
            image: pServiceData.main_image,
          });
          // console.log("getPremiumServiceDetails", getPremiumServiceDetails);
        } else {
          console.log("in else");
          console.log(res.msg);

          setGetPremiumServiceDetails((prev) => ({
            ...prev,
            loader: false,
          }));
        }
      })
      .catch((err) => {
        setViewLoader(false);
        if (err) {
          console.log(err, "error----getPremiumServiceDetails");
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
        }
      });
  };

  const removeSavedImageFromServer = () => {
    const index = imageIndex;
    const payload = {
      ps_id: imageId.ps_id,
      ps_imageid: imageId.id,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    console.log(payload);
    Api.removePremiumImages(payload)
      .then((res) => {
        const old_images = [...getPremiumServiceDetails.multi_premium_image];
        const new_images = [
          ...old_images.slice(0, index),
          ...old_images.slice(index + 1),
        ];
        setGetPremiumServiceDetails((prev) => ({
          ...prev,
          multi_premium_image: new_images,
        }));
        handleCloseDelete();
      })

      .catch((err) => {
        console.error(err);
      });
  };

  const removeImageFromState = (index) => {
    setSelMulImage((prev) => [
      ...prev.slice(0, index),
      ...prev.slice(index + 1),
    ]);
  };

  const validateOnNext = () => {
    const payload = {
      ...getPremiumServiceDetails,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      premiumSerId: props.viewPremiumData.premium_id,
    };
    delete payload.multi_premium_image;

    let { isValid, errors } = validatePremiumServiceData(payload);
    if (!isValid) {
      setFormErrors(errors);
    }
    return isValid;
  };

  const editPackagesDetails = () => {
    setLoader(true);
    setFormErrors({});

    const payload = {
      ...getPremiumServiceDetails,
      openForAll: generalService,
      openHours: generalService ? JSON.stringify(timings) : null,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      premiumSerId: props.viewPremiumData.premium_id,
    };

    delete payload.multi_premium_image;

    console.log("payload", payload);
    let { isValid, errors } = validatePremiumServiceData(payload);
    console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      if (errors.timings) {
        setBR(true);
        setNotification({ type: "danger", message: errors.timings });
      }
      setFormErrors(errors);
      return;
    }
    Api.editPremiumServiceDetails(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status == 1) {
          if (selMulImage.length > -1) {
            const image_payload = {
              hotel_id:
                user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
              ps_id: props.viewPremiumData.premium_id,
              multi_premium_image: selMulImage,
            };
            if (selMulImage.length > 0) {
              Api.uploadPremiumImages(image_payload)
                .then((res) => {
                  console.log("res image--", res);
                  setLoader(false);
                  console.log(res.data);
                  props.setGetPremiumDataCall(true);
                  setBR(true);
                  setNotification({
                    type: "success",
                    message: res.data.msg,
                  });
                  handleClose();
                })
                .catch((err) => {
                  setLoader(false);
                  if (err && err.msg) {
                    // console.log("in catch");
                    // console.log(err.msg);
                    setBR(true);
                    setNotification({
                      type: "danger",
                      message: err.msg,
                    });
                  }
                });
            } else {
              setLoader(false);
              props.setGetPremiumDataCall(true);
              setBR(true);
              setNotification({
                type: "success",
                message: res.data.msg,
              });
              handleClose();
            }
          } else {
            setLoader(false);
            console.log(res.data);
            props.setGetPremiumDataCall(true);
            setBR(true);
            setNotification({
              type: "success",
              message: res.data.msg,
            });
            handleClose();
          }
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

        console.log("inside catch", err?.message || err?.res?.message || err);
        setBR(true);
        setNotification({
          type: "danger",
          message: err.msg,
        });
      });
  };

  return (
    <React.Fragment>
      {props.openModal ? (
        <Dialog
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">
            {!showTimingsSelection
              ? "Edit Premium Service Details"
              : "Select Timings"}
          </DialogTitle>
          <Divider style={{ margin: "0 1rem" }} />
          {!viewloader ? (
            <DialogContent className="viewdetails">
              {showTimingsSelection ? (
                <AvailableTimings timings={timings} setTimings={setTimings} />
              ) : (
                <GridContainer>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    style={{ marginTop: "1rem" }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={generalService}
                          onChange={handleGeneralChange}
                        />
                      }
                      label="Open for All"
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Name"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: "name",
                        value: getPremiumServiceDetails.name,
                        onChange: (e) => handlePremiumServiceDetails(e),
                        onBlur: (e) => handlePremiumServiceDetails(e),
                      }}
                      labelProps={{ shrink: true }}
                      error={formErrors.name ? true : false}
                      helperText={formErrors.name}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Description"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: "description",
                        value: getPremiumServiceDetails.description,
                        //onChange: { handlePremiumServiceDetails },
                        onChange: (e) => handlePremiumServiceDetails(e),
                        onBlur: (e) => handlePremiumServiceDetails(e),
                      }}
                      labelProps={{ shrink: true }}
                      error={formErrors.description ? true : false}
                      helperText={formErrors.description}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Important Notes"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        name: "important_notes",
                        value: getPremiumServiceDetails.important_notes,
                        //onChange: { handlePremiumServiceDetails },
                        onChange: (e) => handlePremiumServiceDetails(e),
                        onBlur: (e) => handlePremiumServiceDetails(e),
                      }}
                      labelProps={{ shrink: true }}
                      error={formErrors.important_notes ? true : false}
                      helperText={formErrors.important_notes}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={12}>
                    <label for="MainImage">Main Image : </label>
                    <input
                      type="file"
                      name="MainImage"
                      accept="image/png, image/jpeg,image/jpg"
                      onChange={(e) => {
                        const imageUrl = URL.createObjectURL(e.target.files[0]);
                        setGetPremiumServiceDetails((prev) => ({
                          ...prev,
                          premium_image: e.target.files[0],
                          image: imageUrl,
                        }));
                      }}
                    />
                  </GridItem>
                  {getPremiumServiceDetails.image ? (
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      style={{ marginTop: "12px", marginBottom: "12px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <img
                          src={getPremiumServiceDetails.image}
                          alt="Premium Service Main Image"
                          width="auto"
                          height="300px"
                          style={{
                            display: "flex",
                            marginRight: "auto",
                            marginLeft: "auto",
                          }}
                        />
                      </div>
                    </GridItem>
                  ) : null}

                  <GridItem xs={12} sm={12} md={12}>
                    <label for="PremiumImage">Premium Images : </label>
                    <input
                      type="file"
                      name="PremiumImage"
                      accept="image/png, image/jpeg,image/jpg"
                      onChange={(e) => {
                        if (e.target.files.length <= 5) {
                          setSelMulImage((prev) => [
                            ...prev,
                            ...e.target.files,
                          ]);
                        } else {
                          setBR(true);
                          setNotification({
                            type: "danger",
                            message: "You can upload 5 images at a time.",
                          });
                        }
                      }}
                      multiple
                      ref={mulfilesRef}
                    />
                  </GridItem>

                  {getPremiumServiceDetails.multi_premium_image ? (
                    <GridItem
                      xs={12}
                      sm={12}
                      md={12}
                      style={{ marginTop: "24px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          flexWrap: "wrap",
                        }}
                      >
                        {getPremiumServiceDetails.multi_premium_image &&
                          getPremiumServiceDetails.multi_premium_image.map(
                            (img, idx) => (
                              <div
                                style={{
                                  position: "relative",
                                  // marginRight: "1rem",
                                  margin: "1rem 0.75rem",
                                }}
                              >
                                <img
                                  src={img.image}
                                  alt="Premium service Image"
                                  // width="200px"
                                  style={{
                                    width: "400px",
                                    height: "auto",
                                    // objectFit: "cover",
                                  }}
                                />

                                <button
                                  className="slider-image-delete-btn"
                                  onClick={
                                    () => handleDeleteDialog(img, idx)
                                    // removeSavedImageFromServer(img, idx)
                                  }
                                >
                                  &#10005;
                                </button>
                              </div>
                            )
                          )}
                        {selMulImage &&
                          selMulImage.map((img, idx) => (
                            <div
                              style={{
                                position: "relative",
                                marginRight: "1rem",
                              }}
                            >
                              <img
                                src={URL.createObjectURL(img)}
                                alt="Premium service Image"
                                // width="200px"
                                style={{
                                  width: "400px",
                                  height: "auto",
                                  // objectFit: "cover",
                                }}
                              />
                              <button
                                className="slider-image-delete-btn"
                                onClick={() => removeImageFromState(idx)}
                              >
                                &#10005;
                              </button>
                            </div>
                          ))}
                      </div>
                    </GridItem>
                  ) : null}
                </GridContainer>
              )}
              <br />
              <br />

              {loader ? (
                <center>
                  <CircularProgress align="centre" color="primary" />
                </center>
              ) : null}

              <DialogActions style={{ justifyContent: "center" }}>
                <center>
                  <Button
                    onClick={
                      showTimingsSelection
                        ? () => setShowTimingsSelection(false)
                        : handleClose
                    }
                    color="primary"
                    align="centre"
                    className="add-cancel-button"
                  >
                    {showTimingsSelection ? "Back" : "Cancel"}
                  </Button>

                  <Button
                    color="primary"
                    //align="center"
                    onClick={
                      !generalService ||
                      (generalService && showTimingsSelection)
                        ? editPackagesDetails
                        : () => {
                            if (validateOnNext()) {
                              setShowTimingsSelection(true);
                            }
                          }
                    }
                    disabled={loader}
                    className="add-cancel-button"
                  >
                    {!generalService || (generalService && showTimingsSelection)
                      ? "Save"
                      : "Select Available Timings"}
                  </Button>
                </center>
              </DialogActions>
            </DialogContent>
          ) : (
            <center>
              <CircularProgress align="centre" color="primary" />
            </center>
          )}
        </Dialog>
      ) : null}
      {props.openDetailModal ? (
        <Dialog
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleViewClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">
            Premium Service Details
          </DialogTitle>
          <Divider style={{ margin: "0 1rem" }} />
          {!viewloader ? (
            <DialogContent className="viewdetails">
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Premium Service Name
                  </InputLabel>
                  {getPremiumServiceDetails.name}
                </GridItem>

                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Description
                  </InputLabel>
                  {getPremiumServiceDetails.description}
                </GridItem>
                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Important Notes
                  </InputLabel>
                  {getPremiumServiceDetails.important_notes}
                </GridItem>
                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Premium Service Image:
                  </InputLabel>
                </GridItem>
                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  {/*} <img
                    src={getPremiumServiceDetails.premium_image}
                    alt="Premium service Image"
                    width="auto"
                    height="400px"
                    style={{
                      display: "flex",
                      marginRight: "auto",
                      marginLeft: "auto",
                    }}
                  />*/}

                  <ModalImage
                    large={getPremiumServiceDetails.premium_image}
                    small={getPremiumServiceDetails.premium_image}
                    className="mainpremium-image"
                    alt="Premium Service Main Image"
                  />
                </GridItem>
                {getPremiumServiceDetails.multi_premium_image ? (
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    style={{ marginTop: "24px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        flexWrap: "wrap",
                      }}
                    >
                      {getPremiumServiceDetails.multi_premium_image.map(
                        (img) => (
                          <ModalImage
                            large={img.image}
                            small={img.image}
                            className="mutlipremium-image"
                            alt="Premium service Image"
                          />
                        )
                      )}
                    </div>
                  </GridItem>
                ) : null}
              </GridContainer>
              <br />
              <br />
              <DialogActions style={{ justifyContent: "center" }}>
                <center>
                  <Button
                    color="primary"
                    //align="centre"
                    onClick={handleViewClose}
                  >
                    Close
                  </Button>
                </center>
              </DialogActions>
            </DialogContent>
          ) : (
            <center>
              <CircularProgress align="centre" color="primary" />
            </center>
          )}
        </Dialog>
      ) : null}

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className="dialog-delete-block">
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete this image?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="cancel-button" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button
            className="cancel-button"
            onClick={removeSavedImageFromServer}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        place="tr"
        setBR={setBR}
        color={notification.type}
        message={notification.message}
        open={br}
        closeNotification={handleCloseMsg}
        close
      />
    </React.Fragment>
  );
}
