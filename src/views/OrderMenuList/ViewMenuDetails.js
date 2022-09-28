import * as React from "react";
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
import { useEffect, useState } from "react";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Api from "Api/ApiUtils.js";
import Snackbar from "../../components/Snackbar/Snackbar";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { validateMenuData } from "./OrderMenuValidator.js";
import { validator } from "./OrderMenuValidator.js";
import FormHelperText from "@mui/material/FormHelperText";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { Divider, Tooltip } from "@material-ui/core";

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
export default function ViewMenuDetails(props) {
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));
  const details = {
    meal_name: "",
    price: "",
    unit: "",
    preparation_time: "",
    preparation_unit: "",
    loader: false,
    description: "",
  };
  let category_choosed = [];
  const [defaultCategoriesSelected, setDefaultCategoriesSelected] = useState(
    []
  );
  const [defaultCategories, setDefaultCategories] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [loader, setLoader] = React.useState(false);
  const [viewloader, setViewLoader] = React.useState(false);
  const [categories, setCategories] = useState([]);
  const [category_selected, setCategory_Selected] = useState([]);

  const [getMenuDetails, setGetMenuDetails] = useState({});
  const [formErrors, setFormErrors] = useState({
    meal_name: "",
    price: "",
    unit: "",
    preparation_time: "",
    preparation_unit: "",
    description: "",
    category_id: "",
  });
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleMenuDetails = (e) => {
    const { name, value } = e.target;
    setGetMenuDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      meal_name: getMenuDetails.meal_name,
      price: getMenuDetails.price,
      unit: getMenuDetails.unit,
      preparation_time: getMenuDetails.preparation_time,
      preparation_unit: getMenuDetails.preparation_unit,
      description: getMenuDetails.description,
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

  // useEffect(() => {
  //   console.log("props------->", props.menuOpenModal);
  //   //showDetails();
  //   if (props.menuOpenModal) {
  //     console.log("useEffect if");

  //     handleClickOpen();
  //   } else {
  //     console.log("useEffect else");
  //     handleClose();
  //   }
  // }, [props.menuOpenModal]);

  //for edit data
  useEffect(() => {
    console.log("props------->", props.menuOpenModal);
    //showDetails();
    if (props.menuOpenModal) {
      console.log("useEffect if");

      handleClickOpen();
    } else {
      console.log("useEffect else");
      handleClose();
    }
  }, [props.menuOpenModal]);

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

  useEffect(() => {
    let default_choosed = [];
    category_selected.forEach((cs) => {
      if (defaultCategories.indexOf(cs) > -1) default_choosed.push(cs);
    });
    setDefaultCategoriesSelected(default_choosed);
  }, [category_selected, defaultCategories]);

  const handleClickOpen = () => {
    console.log("view super admin--->", props.menuOpenModal);
    setOpen(true);
    showDetails();
  };

  //for edit details
  const handleClose = () => {
    // console.log("view super admin hndle close--->", props.setMenuOpenModal);
    props.setMenuOpenModal(false);
    setOpen(false);
    setFormErrors({});
  };
  //for view details
  const handleViewClose = () => {
    props.setOpenDetailModal(false);
    setOpen(false);
  };

  useEffect(() => {
    console.log("props.viewMenu--->", props.viewMenuData);
  }, [props.viewMenuData]);
  useEffect(() => {
    defaultCategoryList();
  }, []);

  useEffect(() => {
    createdCategoryList();
  }, []);

  //default category list for checkbox

  const defaultCategoryList = () => {
    console.log("category list--");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    const default_key = 1;
    Api.mealCategoryList(payload, default_key)
      .then((res) => {
        console.log(" list of category", res);
        console.log("res", res.status);

        if (res.data.status == 1) {
          setDefaultCategories(res.data.data.rows);
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })

      .catch((err) => {
        if (err && err.msg) {
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          console.log("in catch");
          console.log(err.msg);
          setCategories(() => ({
            ...categories,
          }));
        }
      });
  };

  //created category list for drpdown
  const createdCategoryList = () => {
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    const default_key = 0;
    Api.mealCategoryList(payload, default_key)
      .then((res) => {
        console.log(" list of category", res);
        console.log("res", res.status);

        if (res.data.status == 1) {
          setCategories(res.data.data.rows);
        } else {
          setBR(true);
          setNotification({
            type: "danger",
            message: res.data.msg,
          });
        }
      })

      .catch((err) => {
        if (err && err.msg) {
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          console.log("in catch");
          console.log(err.msg);
          setCategories(() => ({
            ...categories,
          }));
        }
      });
  };

  const handleCategory = (e) => {
    const { name, value } = e.target;
    console.log("e.target--->", name, value);
    setCategory_Selected(value);
  };
  const handleDefaultCheckbox = (event) => {
    setDefaultCategoriesSelected((prev) => {
      let cats = [...prev];
      const categoryId = parseInt(event.target.name.split("-")[1]);
      console.log(">>>i", categoryId);
      if (!event.target.checked)
        cats = cats.filter((cat) => cat !== categoryId);
      else cats.push(categoryId);
      cats = [...new Set(cats)];

      return cats;
    });
  };
  const handleCheckbox = (event) => {
    console.log("checkbox-->", event.target.checked);
    setCategory_Selected((prev) => {
      let cats = [...prev];
      const categoryId = parseInt(event.target.name.split("-")[1]);
      console.log(">>>i", categoryId);
      if (!event.target.checked)
        cats = cats.filter((cat) => cat !== categoryId);
      else cats.push(categoryId);
      cats = [...new Set(cats)];
      return cats;
    });
  };

  // category lists

  const showDetails = () => {
    setViewLoader(true);
    console.log("menu details", props.viewMenuData);
    console.log("menu details meal id ", props.viewMenuData.id);
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      meal_id: props.viewMenuData.id,
    };
    Api.showMenuDetails(payload)
      .then((res) => {
        setViewLoader(false);
        console.log(res);
        if (res && res.data && res.data.data) {
          console.log("response menu details--->", res.data.data);
          let mealData = res.data.data;
          let mealCategory = mealData.hotel_meal_category;
          category_choosed = [];
          mealCategory.map((category) => {
            category_choosed.push(category.category_id);
          });
          // mealCategory.map((category) => {
          //   category_choosed.push({
          //     category_id: category.category_id,
          //     category_name: category.meal_category.name,
          //   });
          // });
          console.log("category choosed--->", category_choosed);
          setCategory_Selected(category_choosed);
          setGetMenuDetails({
            meal_id: mealData.id,
            meal_name: mealData.name,
            price: mealData.price,
            unit: user[0].currency_symbol,
            preparation_time: mealData.preparation_time,
            preparation_unit: mealData.preparation_unit,
            description: mealData.description,
            image: mealData.image,
          });
          // console.log("getMenuDetails", getMenuDetails);
        } else {
          console.log("in else");
          console.log(res.msg);

          setGetMenuDetails((prev) => ({
            ...prev,
            loader: false,
          }));
        }
      })
      .catch((err) => {
        setViewLoader(false);
        if (err) {
          console.log(err, "error----getMenuDetails");
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
        }
      });
  };

  const editMenuDetails = () => {
    setLoader(true);
    setFormErrors({});
    const payload = {
      ...getMenuDetails,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      category_id: [
        ...new Set([...category_selected, ...defaultCategoriesSelected]),
      ].join(","),
      // category_id: category_selected,
    };

    console.log("payload", payload);
    let { isValid, errors } = validateMenuData(payload);
    console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
      return;
    }
    Api.editHotelMealDetails(payload)
      .then((res) => {
        setLoader(false);
        if (res.data.status == 1) {
          setLoader(false);
          console.log(res.data);
          props.setGetMealDataCall(true);
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          handleClose();
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
      {props.menuOpenModal ? (
        <Dialog
          open={open}
          fullWidth={true}
          maxWidth="md"
          onClose={handleClose}
          className="viewdetailsDialog"
        >
          <DialogTitle id="scroll-dialog-title">Menu Details</DialogTitle>
          {!viewloader ? (
            <DialogContent className="viewdetails">
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "meal_name",
                      value: getMenuDetails.meal_name,
                      onChange: (e) => handleMenuDetails(e),
                      onBlur: (e) => handleMenuDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.meal_name ? true : false}
                    helperText={formErrors.meal_name}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Price"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "price",
                      value: getMenuDetails.price,
                      //onChange: { handleMenuDetails },
                      onChange: (e) => handleMenuDetails(e),
                      onBlur: (e) => handleMenuDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.price ? true : false}
                    helperText={formErrors.price}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Unit"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      disabled: true,
                      name: "unit",
                      value: getMenuDetails.unit,
                      // onChange: (e) => handleMenuDetails(e),
                      // onBlur: (e) => handleMenuDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    // error={formErrors.unit ? true : false}
                    // helperText={formErrors.unit}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Preparation Time"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "preparation_time",
                      value: getMenuDetails.preparation_time,
                      //onChange: { handleMenuDetails },
                      onChange: (e) => handleMenuDetails(e),
                      onBlur: (e) => handleMenuDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.preparation_time ? true : false}
                    helperText={formErrors.preparation_time}
                  ></CustomInput>
                </GridItem>

                {/*}  <GridItem xs={12} sm={12} md={6}>
              <CustomInput
                labelText="Preparation Unit"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: "preparation_unit",
                  value: getMenuDetails.preparation_unit,

                  //onChange: { handleMenuDetails },
                  onChange: (e) => handleMenuDetails(e),
                  onBlur: (e) => handleMenuDetails(e),
                }}
                labelProps={{ shrink: true }}
                error={formErrors.preparation_unit ? true : false}
                helperText={formErrors.preparation_unit}
              ></CustomInput>
              </GridItem>*/}
                {getMenuDetails.preparation_unit ? (
                  <GridItem
                    xs={12}
                    sm={12}
                    md={6}
                    style={{ marginTop: "18px" }}
                  >
                    <label>Preparation Unit</label>
                    <Select
                      label="Preparation Unit"
                      variant="standard"
                      value={getMenuDetails.preparation_unit}
                      onChange={handleMenuDetails}
                      name="preparation_unit"
                      style={{ width: "100%" }}
                    >
                      {/*} {services.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name}
                </MenuItem>
             ))}*/}
                      <MenuItem key={1} value="hours">
                        Hours
                      </MenuItem>
                      <MenuItem key={2} value="minutes">
                        Minutes
                      </MenuItem>
                      <MenuItem key={3} value="seconds">
                        Seconds
                      </MenuItem>
                    </Select>
                    {formErrors.preparation_unit ? (
                      <FormHelperText>
                        {formErrors.preparation_unit}
                      </FormHelperText>
                    ) : null}
                  </GridItem>
                ) : null}
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ margin: "1.5rem 0rem" }}
                >
                  <label>Category</label>
                  <FormGroup
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {defaultCategories.map((defaultCat) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              category_selected.indexOf(defaultCat.id) > -1
                            }
                            onChange={handleCheckbox}
                            name={`defaultCat-${defaultCat.id}`}
                          />
                        }
                        label={defaultCat.name}
                      />
                    ))}
                  </FormGroup>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <label>Custom Category</label>
                  <Select
                    label="Category"
                    multiple
                    value={category_selected}
                    onChange={handleCategory}
                    name="category_selected"
                    style={{ width: "100%" }}
                    renderValue={(selected) =>
                      categories
                        .filter((category) => selected.includes(category.id))
                        .map((record) => record.name)
                        .join(", ")
                    }
                    MenuProps={MenuProps}
                  >
                    {categories && categories.length > 0 ? (
                      categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          <Checkbox
                            checked={
                              category_selected.indexOf(category.id) > -1
                            }
                          />

                          <ListItemText primary={category.name} />
                        </MenuItem>
                      ))
                    ) : (
                      <p style={{ textAlign: "center" }}>
                        No Custom Category Found
                      </p>
                    )}
                  </Select>
                  {formErrors.category_id ? (
                    <FormHelperText>{formErrors.category_id}</FormHelperText>
                  ) : null}
                </GridItem>

                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="Description"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "description",
                      value: getMenuDetails.description,
                      //onChange: { handleMenuDetails },
                      onChange: (e) => handleMenuDetails(e),
                      onBlur: (e) => handleMenuDetails(e),
                    }}
                    labelProps={{ shrink: true }}
                    error={formErrors.description ? true : false}
                    helperText={formErrors.description}
                  />
                </GridItem>
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  style={{ marginTop: "1.5rem" }}
                >
                  <label for="mealImage">Meal Image:</label>
                  <input
                    type="file"
                    name="mealImage"
                    accept="image/png, image/jpeg,image/jpg"
                    onChange={(e) => {
                      const fileType = e.target.files[0].name.split(".").pop();
                      if (
                        fileType == "jpeg" ||
                        fileType === "png" ||
                        fileType === "jpg"
                      ) {
                        const imageUrl = URL.createObjectURL(e.target.files[0]);
                        setGetMenuDetails((prev) => ({
                          ...prev,
                          meal_image: e.target.files[0],
                          image: imageUrl,
                        }));
                      } else {
                        setBR(true);
                        setNotification({
                          type: "danger",
                          message:
                            "Only images as jpg , png or jpeg are allowed.",
                        });
                      }
                    }}
                  />
                </GridItem>
                {getMenuDetails.image ? (
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    style={{ marginTop: "1rem" }}
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
                        src={getMenuDetails.image}
                        alt="Meal Image"
                        width="50%"
                      />
                    </div>
                  </GridItem>
                ) : null}
                {/*} <GridItem xs={12} sm={12} md={12}>
              <InputLabel id="demo-simple-select-standard-label">
                Service
              </InputLabel>

              <Select
                label="Service"
                value={getMenuDetails.service_selected}
                onChange={handleMenuDetails}
                name="service_selected"
                style={{ width: "100%" }}
              >
                {services.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name}
                  </MenuItem>
                ))}
              </Select>
            </GridItem>
              <GridItem xs={12} sm={12} md={6}>
              <CustomInput
                labelText="Password"
                formControlProps={{
                  fullWidth: true,
                }}
                inputProps={{
                  name: "password",
                  value: getMenuDetails.password,
                  //onChange: { handleMenuDetails },
                  onChange: (e) => handleMenuDetails(e),
                }}
                labelProps={{ shrink: true }}
                error={formErrors.password ? true : false}
                helperText={formErrors.password}
              />
              </GridItem>*/}
              </GridContainer>
              <br />
              <br />

              {loader ? (
                <center>
                  <CircularProgress align="centre" color="primary" />
                </center>
              ) : (
                ""
              )}

              <DialogActions style={{ justifyContent: "center" }}>
                <center>
                  <Button
                    color="primary"
                    //align="centre"
                    onClick={handleClose}
                    className="add-cancel-button"
                    style={{ marginRight: "1rem" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    //align="center"
                    onClick={editMenuDetails}
                    disabled={loader}
                    className="add-cancel-button"
                  >
                    Save
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
          <DialogTitle id="scroll-dialog-title">Menu Details</DialogTitle>
          <Divider style={{ margin: "0rem 1rem" }} />
          {!viewloader ? (
            <DialogContent className="viewdetails">
              <GridContainer>
                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">Name</InputLabel>
                  {getMenuDetails.meal_name}
                </GridItem>

                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">Price</InputLabel>
                  {getMenuDetails.unit + " " + getMenuDetails.price}
                </GridItem>

                <GridItem xs={12} sm={12} md={6} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Preparation Time
                  </InputLabel>
                  {getMenuDetails.preparation_time +
                    " " +
                    getMenuDetails.preparation_unit}
                </GridItem>

                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Category
                  </InputLabel>
                  {props.viewMenuData.category}
                </GridItem>

                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Description
                  </InputLabel>
                  {getMenuDetails.description}
                </GridItem>
                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "25px" }}>
                  <InputLabel className="View-details-page">
                    Meal Image:
                  </InputLabel>
                </GridItem>
                {getMenuDetails.image ? (
                  <GridItem
                    xs={12}
                    sm={12}
                    md={12}
                    style={{ marginTop: "12px" }}
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
                        src={getMenuDetails.image}
                        alt="Meal Image"
                        width="50%"
                      />
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
