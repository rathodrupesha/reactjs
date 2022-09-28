export const validator = (values, fieldName) => {
  console.log("values", values);
  console.log("fieldName", fieldName);

  let errors = {};
  let isValid = true;
  switch (fieldName) {
    case "name":
      isValid = validatePackageName(values.name, errors);
      break;
    case "amount":
      isValid = validateAmount(values.amount, errors);
      break;

    // case "unit":
    //   isValid = validateUnit(values.unit, errors);
    //   break;
    case "duration":
      isValid = validateDuration(values.duration, errors);
      break;
    case "duration_unit":
      isValid = validatePreparationUnit(values.duration_unit, errors);
      break;

    case "important_notes":
      isValid = validateDescription(values.important_notes, errors);
      break;
    default:
  }
  return { errors, isValid };
};

function validatePackageName(pass, errors) {
  let result = true;
  errors.name = "";
  if (!pass) {
    errors.name = "Package Name is Required";
    result = false;
  }
  return result;
}
function validateAmount(pass, errors) {
  let result = true;
  errors.amount = "";
  if (!pass) {
    errors.amount = "Amount is Required";
    result = false;
  }
  return result;
}
// function validateUnit(pass, errors) {
//   let result = true;
//   errors.unit = "";
//   if (!pass) {
//     errors.unit = "Amount Unit is Required";
//     result = false;
//   }
//   return result;
// }
function validateDuration(pass, errors) {
  let result = true;
  errors.duration = "";
  if (!pass) {
    errors.duration = "Preparation time is Required";
    result = false;
  }
  return result;
}
function validatePreparationUnit(pass, errors) {
  let result = true;
  errors.duration_unit = "";
  if (!pass) {
    errors.duration_unit = "Duration unit is Required";
    result = false;
  }
  return result;
}
function validateDescription(pass, errors) {
  let result = true;
  errors.important_notes = "";
  if (!pass) {
    errors.important_notes = "Important Notes is Required";
    result = false;
  }
  return result;
}

export const validatePackageData = (data) => {
  let isValid = true,
    errors = {};

  const { name, amount, unit, duration, duration_unit, important_notes } = data;

  if (!requiredValidator(name)) {
    isValid = false;
    errors.name = "Package Name is required";
  } else if (!packagenameValidator(name)) {
    isValid = false;
    errors.name =
      "Please enter a valid Package Name upto maximum 30 characters";
  } else if (!packageDigitValidator(name)) {
    isValid = false;
    errors.name = "Numbers are not allowed";
  }

  if (!requiredValidator(amount)) {
    isValid = false;
    errors.amount = "Amount is required";
  } else if (!floatValidator(amount)) {
    isValid = false;
    errors.amount = "Amount must be a number";
  }
  // if (!requiredValidator(unit)) {
  //   isValid = false;
  //   errors.unit = "Amount unit is required";
  // }

  if (!requiredValidator(duration)) {
    isValid = false;
    errors.duration = "Duration is required";
  } else if (!floatValidator(duration)) {
    isValid = false;
    errors.duration = "Duration must be a number";
  }
  if (!requiredValidator(duration_unit)) {
    isValid = false;
    errors.duration_unit = "Duration unit is required";
  }
  if (!requiredValidator(important_notes)) {
    isValid = false;
    errors.important_notes = "Important Notes is required";
  } else if (!impValidator(important_notes)) {
    isValid = false;
    errors.important_notes = "Enter Important Notes upto maximum 50 characters";
  }

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
const floatValidator = (value) => {
  const regex = new RegExp(/^[0-9]+(\.)?([0-9]+)?$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};

const impValidator = (value) => {
  const regex = new RegExp(/^.{1,50}$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};

const packagenameValidator = (value) => {
  if (value.length > 30) {
    return false;
  }
  return true;
};

const packageDigitValidator = (value) => {
  const regex = new RegExp(/^([^0-9]*)$/);

  if (!regex.test(value)) {
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
