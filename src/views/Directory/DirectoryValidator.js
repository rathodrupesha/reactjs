export const validator = (values, fieldName) => {
  //console.log("values", values);
  //console.log("fieldName", fieldName);

  let errors = {};
  let isValid = true;
  switch (fieldName) {
    case "name":
      isValid = validateName(values.name, errors);
      break;

    case "email":
      isValid = validateEmail(values.email, errors);
      break;

    case "number":
      isValid = validateMobileNum(values.number, errors);
      break;

    default:
  }
  return { errors, isValid };
};
function validateName(pass, errors) {
  let result = true;
  errors.name = "";
  if (!pass) {
    errors.name = "Name is Required";
    result = false;
  }
  return result;
}

function validateMobileNum(pass, errors) {
  let result = true;
  errors.number = "";

  if (!pass) {
    errors.number = "Mobile Number is Required";
    result = false;
  }
  const regex = new RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/);
  if (!regex.test(pass)) {
    result = false;
  }

  return result;
}

function validateEmail(email, errors) {
  let result = true;

  if (!email) {
    errors.email = "Email is required";
    result = false;
  } else {
    const re = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    // console.log("validator --->", email);
    result = re.test(String(email).toLowerCase());
    if (!result) errors.email = "Invalid Email address";
    else errors.email = "";
  }
  return result;
}

export const validateDirectoryData = (data) => {
  let isValid = true,
    errors = {};

  const { name, email, number } = data;

  if (!requiredValidator(name)) {
    isValid = false;
    errors.name = "Name is required";
  } else if (!nameValidator(name)) {
    isValid = false;
    errors.name = "Please enter a valid name upto maximum 25 characters";
  }

  if (!requiredValidator(email)) {
    isValid = false;
    errors.email = "Email is required";
  } else if (!emailValidator(email)) {
    isValid = false;
    errors.email = "Enter a valid email";
  }
  if (!requiredValidator(number)) {
    isValid = false;
    errors.number = "Mobile number is required";
  } else if (!mobileValidator(number)) {
    isValid = false;
    errors.number = "Enter a valid Mobile number";
  }

  return { isValid, errors };
};

const requiredValidator = (value) => (value ? true : false);

const emailValidator = (value) => {
  const regex = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (!regex.test(value)) {
    return false;
  }
  return true;
};

const mobileValidator = (value) => {
  const regex = new RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};
const nameValidator = (value) => {
  // /^([^0-9]*)$/ -number allow nahi kare
  // /[^a-zA-Z0-9 ]/
  // USername---> /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
  // first name --> /^[a-zA-Z ]{2,30}$/
  const regex = new RegExp(/^[a-zA-Z ]{1,25}$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};
