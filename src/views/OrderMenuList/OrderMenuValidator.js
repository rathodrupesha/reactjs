export const validator = (values, fieldName) => {
  console.log("values", values);
  console.log("fieldName", fieldName);

  let errors = {};
  let isValid = true;
  switch (fieldName) {
    case "meal_name":
      isValid = validateMealName(values.meal_name, errors);
      break;
    case "price":
      isValid = validatePrice(values.price, errors);
      break;

    // case "unit":
    //   isValid = validateUnit(values.unit, errors);
    //   break;
    case "preparation_time":
      isValid = validatePreparationTime(values.preparation_time, errors);
      break;
    case "preparation_unit":
      isValid = validatePreparationUnit(values.preparation_unit, errors);
      break;

    case "description":
      isValid = validateDescription(values.description, errors);
      break;
    default:
  }
  return { errors, isValid };
};

function validateMealName(pass, errors) {
  let result = true;
  errors.meal_name = "";
  if (!pass) {
    errors.meal_name = "Meal Name is Required";
    result = false;
  }
  return result;
}
function validatePrice(pass, errors) {
  let result = true;
  errors.price = "";
  if (!pass) {
    errors.price = "Price is Required";
    result = false;
  }
  return result;
}
// function validateUnit(pass, errors) {
//   let result = true;
//   errors.unit = "";
//   if (!pass) {
//     errors.unit = "Price Unit is Required";
//     result = false;
//   }
//   return result;
// }
function validatePreparationTime(pass, errors) {
  let result = true;
  errors.preparation_time = "";
  if (!pass) {
    errors.preparation_time = "Preparation time is Required";
    result = false;
  }
  return result;
}
function validatePreparationUnit(pass, errors) {
  let result = true;
  errors.preparation_unit = "";
  if (!pass) {
    errors.preparation_unit = "Preparation Unit is Required";
    result = false;
  }
  return result;
}
function validateDescription(pass, errors) {
  let result = true;
  errors.description = "";
  if (!pass) {
    errors.description = "Description is Required";
    result = false;
  }
  return result;
}

export const validateMenuData = (data) => {
  let isValid = true,
    errors = {};

  const {
    meal_name,
    price,
    unit,
    preparation_time,
    preparation_unit,
    description,
    category_id,
  } = data;

  if (!requiredValidator(meal_name)) {
    isValid = false;
    errors.meal_name = "Meal Name is required";
  } else if (!mealnameValidator(meal_name)) {
    isValid = false;
    errors.meal_name =
      "Please enter a valid meal name upto maximum 50 characters";
  }

  if (!requiredValidator(price)) {
    isValid = false;
    errors.price = "Price is required";
  } else if (!floatValidator(price)) {
    isValid = false;
    errors.price = "Price must be a number";
  }
  // if (!requiredValidator(unit)) {
  //   isValid = false;
  //   errors.unit = "Price unit is required";
  // }

  if (!requiredValidator(preparation_time)) {
    isValid = false;
    errors.preparation_time = "Preparation Time is required";
  } else if (!floatValidator(preparation_time)) {
    isValid = false;
    errors.preparation_time = "Preparation Time must be a number";
  }
  if (!requiredValidator(preparation_unit)) {
    isValid = false;
    errors.preparation_unit = "Preparation unit is required";
  }
  if (!requiredValidator(description)) {
    isValid = false;
    errors.description = "Description is required";
  } else if (!descriptionValidator(description)) {
    isValid = false;
    errors.description = "Enter Description between 5 to 150 characters";
  }

  if (!requiredValidator(category_id)) {
    console.log("category_id---->", category_id);
    isValid = false;
    errors.category_id = "Category is required";
  }
  // if (category_id.length <= 0) {
  //   console.log("category_id---->", category_id);
  //   isValid = false;
  //   errors.category_id = "Category is required";
  // }

  // if (!requiredValidator(set_user_limit)) {
  //   isValid = false;
  //   errors.set_user_limit = "User Limit is required";
  // } else if (!onlyNumValidator(set_user_limit)) {
  //   isValid = false;
  //   errors.set_user_limit = "User limit must be a number";
  // }
  // if (!requiredValidator(set_staff_limit)) {
  //   isValid = false;
  //   errors.set_staff_limit = "Staff Limit is required";
  // } else if (!onlyNumValidator(set_staff_limit)) {
  //   isValid = false;
  //   errors.set_staff_limit = "Staff limit must be a number";
  // }

  console.log("Errors---->", errors);

  return { isValid, errors };
};

const requiredValidator = (value) => (value ? true : false);

const onlyNumValidator = (value) => {
  const regex = new RegExp(/^[0-9]*$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};

const descriptionValidator = (value) => {
  const regex = new RegExp(/^.{5,150}$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};

const floatValidator = (value) => {
  const regex = new RegExp(/^[0-9]+(\.)?([0-9]+)?$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};

const mealnameValidator = (value) => {
  // /^([^0-9]*)$/ -number allow nahi kare
  // /[^a-zA-Z0-9 ]/
  // USername---> /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
  // first name --> /^[a-zA-Z ]{2,30}$/
  // const regex = new RegExp(/^[a-zA-Z-.]*$/);
  if (value.length > 50) {
    return false;
  }
  return true;
};

// const matchPassword = (e) => {
//   if (e.target.name === "confirm_password") {
//     if (e.target.value !== password) {
//       setaddUser({
//         ...addUser,
//         confirm_password: e.target.value,
//         passnotmatch: true,
//       });
//     } else {
//       setaddUser({
//         ...addUser,
//         confirm_password: e.target.value,
//         passnotmatch: false,
//       });
//     }
//   }
// };
