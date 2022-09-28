import React, { useMemo } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";

import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Modal from "@material-ui/core/Modal";
import { Dialog } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { TextField, Typography } from "@material-ui/core";
import Api from "Api/ApiUtils";
import { useState, useEffect } from "react";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import "../../../src/assets/css/material-dashboard-react.css";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// import ViewStaffDetails from "./ViewStaffDetails.js";
import OrderMenuTable from "components/Table/OrderMenuTable.js";
import ListItemText from "@mui/material/ListItemText";
import Snackbar from "../../components/Snackbar/Snackbar";
import Checkbox from "@mui/material/Checkbox";
import { Input } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { validateMenuData } from "./OrderMenuValidator.js";
import { validator } from "./OrderMenuValidator.js";
import FormHelperText from "@mui/material/FormHelperText";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import { isModuleAccesible } from "generalUtils.js";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

// import DatePicker from "@mui/lab/DatePicker";
// import DateAdapter from "@mui/lab/AdapterMoment";

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
const access_criteria = "order_menu_management";

export default function OrderMenuList(props) {
  const user = JSON.parse(localStorage.getItem("HamroSuperAdminInfo"));

  const addMeal = {
    meal_name: "",
    price: "",
    unit: user[0].currency_symbol,
    preparation_time: "",
    preparation_unit: "",
    loader: false,
    description: "",
    meal_image: null,
    // category_selected: "",
  };

  const classes = useStyles();

  const [defaultCategoriesSelected, setDefaultCategoriesSelected] = useState(
    []
  );

  const [defaultCategories, setDefaultCategories] = useState([]);
  const [loader, setLoader] = React.useState(false);
  const [getMealDataCall, setGetMealDataCall] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [addMenu, setAddMenu] = useState(addMeal);
  const [categories, setCategories] = useState([]);
  const [category_selected, setCategory_Selected] = useState([]);
  const [formErrors, setFormErrors] = useState({
    meal_name: "",
    price: "",
    unit: "",
    preparation_time: "",
    preparation_unit: "",
    description: "",
    category_id: "",
  });
  const [br, setBR] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const handleCloseMsg = () => {
    setBR(false);
  };

  const isAddAccessible = useMemo(
    () => isModuleAccesible(access_criteria, "create"),
    []
  );

  // onchange function for add user
  const handleAddMenu = (e) => {
    const { name, value } = e.target;
    setAddMenu((prev) => ({
      ...prev,
      [name]: value,
    }));
    const validation_object = {
      meal_name: addMenu.meal_name,
      price: addMenu.price,
      unit: addMenu.unit,
      preparation_time: addMenu.preparation_time,
      preparation_unit: addMenu.preparation_unit,
      description: addMenu.description,
      [name]: value,
    };
    let { isValid, errors } = validator(validation_object, name);
    // console.log(isValid, errors);

    setFormErrors(() => ({
      ...formErrors,
      ...errors,
    }));
    //setFormErrors(errors);
    // setFormErrors(() => ({
    //   ...formErrors,
    //   name: errors.name
    // }));
    // console.log("formErrors", formErrors);
    return;
  };
  const handleCategory = (e) => {
    const { name, value } = e.target;

    setCategory_Selected(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleCheckbox = (event) => {
    // console.log("checkbox-->", event.target.checked);
    setDefaultCategoriesSelected((prev) => {
      let cats = [...prev];
      const categoryId = parseInt(event.target.name.split("-")[1]);
      // console.log(">>>i", categoryId);
      if (!event.target.checked)
        cats = cats.filter((cat) => cat !== categoryId);
      else cats.push(categoryId);
      cats = [...new Set(cats)];

      // if (cats.includes(categoryId)) {
      //   cats = cats.filter((cat) => cat !== categoryId);
      // } else cats.push(categoryId);
      return cats;
    });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAddMenu(addMeal);
    setCategory_Selected([]);
    setDefaultCategoriesSelected([]);
    setFormErrors({});
  };

  const inputStyle = { width: "320px" };

  useEffect(() => {
    defaultCategoryList();
  }, []);

  useEffect(() => {
    createdCategoryList();
  }, []);

  //default category list for checkbox

  const defaultCategoryList = () => {
    // console.log("category list--");
    const payload = {
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
    };
    const default_key = 1;
    Api.mealCategoryList(payload, default_key)
      .then((res) => {
        // console.log(" list of category", res);
        // console.log("res", res.status);

        if (res.data.status == 1) {
          setDefaultCategories(res.data.data.rows);
        }
      })

      .catch((err) => {
        if (err && err.msg) {
          //   console.log("in catch");
          //  console.log(err.msg);
          setDefaultCategories((prev) => ({
            ...prev,
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
        //  console.log(" list of category", res);
        //  console.log("res", res.status);

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
          //  console.log("in catch");
          // console.log(err.msg);
          setCategories(() => ({
            ...categories,
          }));
        }
      });
  };

  // api call for add hotel staff
  const handleAddMeal = () => {
    setLoader(true);
    let totalCategories = [...defaultCategoriesSelected, ...category_selected];
    setFormErrors({});
    const payload = {
      meal_name: addMenu.meal_name,
      price: addMenu.price,
      unit: addMenu.unit,
      preparation_time: addMenu.preparation_time,
      preparation_unit: addMenu.preparation_unit,
      description: addMenu.description,
      hotel_id: user[0]?.super_admin_users[0]?.hotel_id ?? user[0]?.hotel_id,
      category_id: totalCategories.join(","),
      meal_image: addMenu.meal_image,
    };

    // console.log(payload, "payload");
    let { isValid, errors } = validateMenuData(payload);
    // console.log(isValid, errors);
    if (!isValid) {
      setLoader(false);
      setFormErrors(errors);
      return;
    }

    Api.addHotelMeal(payload)
      .then((res) => {
        setLoader(false);
        //  console.log(" in then for add hotel meal");
        //  console.log("rew", res.status);

        if (res.data.status === 1) {
          setLoader(false);
          setAddMenu(() => ({
            ...addMenu,
            loader: false,
          }));
          setGetMealDataCall(true);
          setBR(true);
          setNotification({
            type: "success",
            message: res.data.msg,
          });
          handleClose();
          // window.location.reload();
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
          //  console.log("in catch");
          // console.log(err.msg);
          setBR(true);
          setNotification({
            type: "danger",
            message: err.msg,
          });
          setAddMenu(() => ({
            ...addMenu,
            loader: false,
          }));
        }
      });
  };

  return (
    <GridContainer style={{ padding: "0px 15px !important" }}>
      <GridItem xs={12} sm={12} md={12}>
        <Dialog
          disableEnforceFocus
          fullWidth={true}
          maxWidth="md"
          open={open}
          onClose={handleClose}
          // aria-labelledby="modal-modal-title"
          // aria-describedby="modal-modal-description"
          // className="createCustomer"
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">Add Menu</DialogTitle>
          <DialogContent>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <CustomInput
                  labelText="Name"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    name: "meal_name",
                    value: addMenu.meal_name,
                    onChange: (e) => handleAddMenu(e),
                    onBlur: (e) => handleAddMenu(e),
                  }}
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
                    value: addMenu.price,
                    //onChange: { handleAddMenu },
                    onChange: (e) => handleAddMenu(e),
                    onBlur: (e) => handleAddMenu(e),
                  }}
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
                    value: addMenu.unit,
                    //onChange: (e) => handleAddMenu(e),
                    //onBlur: (e) => handleAddMenu(e),
                  }}
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
                    value: addMenu.preparation_time,
                    //onChange: { handleAddMenu },
                    onChange: (e) => handleAddMenu(e),
                    onBlur: (e) => handleAddMenu(e),
                  }}
                  error={formErrors.preparation_time ? true : false}
                  helperText={formErrors.preparation_time}
                ></CustomInput>
              </GridItem>

              <GridItem xs={12} sm={12} md={6} style={{ marginTop: "18px" }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Preparation Unit
                </InputLabel>
                <Select
                  label="Preparation Unit"
                  variant="standard"
                  value={addMenu.preparation_unit}
                  onChange={handleAddMenu}
                  name="preparation_unit"
                  style={{ width: "100%" }}
                >
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
                  <FormHelperText>{formErrors.preparation_unit}</FormHelperText>
                ) : null}
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={12}
                style={{ margin: "1.5rem 0rem" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Category
                </InputLabel>
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
                            defaultCategoriesSelected.indexOf(defaultCat.id) >
                            -1
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
                <InputLabel id="demo-simple-select-standard-label">
                  Choose Custom Category
                </InputLabel>
                <Select
                  label="Category"
                  multiple
                  value={category_selected}
                  onChange={handleCategory}
                  name="category_selected"
                  style={{ width: "100%" }}
                  variant="standard"
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
                          checked={category_selected.indexOf(category.id) > -1}
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
                    value: addMenu.description,
                    //onChange: { handleAddMenu },
                    onChange: (e) => handleAddMenu(e),
                    onBlur: (e) => handleAddMenu(e),
                  }}
                  error={formErrors.description ? true : false}
                  helperText={formErrors.description}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={12} style={{ marginTop: "24px" }}>
                <label for="mealImage">Meal Image : </label>
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
                      setAddMenu((prev) => ({
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
              {addMenu.image ? (
                <GridItem xs={12} sm={12} md={12} style={{ marginTop: "12px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <img
                      src={addMenu.image}
                      alt="Meal Image"
                      style={{ width: "50%", height: "40%" }}
                    />
                  </div>
                </GridItem>
              ) : null}
            </GridContainer>
          </DialogContent>

          {loader ? (
            <center>
              <CircularProgress align="centre" color="primary" />
            </center>
          ) : (
            ""
          )}

          <DialogActions style={{ justifyContent: "center" }}>
            <Button
              onClick={handleClose}
              color="primary"
              align="centre"
              className="add-cancel-button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMeal}
              color="primary"
              align="centre"
              disabled={loader}
              className="add-cancel-button"
            >
              Add Meal
            </Button>
          </DialogActions>
        </Dialog>

        <Card>
          <CardHeader color="primary">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4 className={classes.cardTitleWhite}>Menu List</h4>
              {isAddAccessible ? (
                <Button onClick={handleOpen} className="header-tab-btn">
                  Add Meal
                </Button>
              ) : null}
            </div>
          </CardHeader>
          <CardBody>
            <OrderMenuTable
              getMealDataCall={getMealDataCall}
              setGetMealDataCall={setGetMealDataCall}
              accessCriteria={access_criteria}
            />
          </CardBody>
        </Card>
      </GridItem>

      <Snackbar
        place="tr"
        setBR={setBR}
        color={notification.type}
        message={notification.message}
        open={br}
        closeNotification={handleCloseMsg}
        close
      />
    </GridContainer>
  );
}
