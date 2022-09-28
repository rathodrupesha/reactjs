export const validator = (values, fieldName) => {
  // console.log("values", values);
  // console.log("fieldName", fieldName);

  let form_errors = {};
  let isValid = true;
  switch (fieldName) {
    case "first_name":
      isValid = validateFirstName(values.first_name, form_errors);
      break;
    case "last_name":
      isValid = validateLastName(values.last_name, form_errors);
      break;

    case "user_name":
      isValid = validateUsername(values.user_name, form_errors);
      break;

    case "mobile_num":
      isValid = validateMobileNum(values.mobile_num, form_errors);
      break;
    case "address":
      isValid = validateAddress(values.address, form_errors);
      break;
    case "old_password":
      isValid = validateOldPassword(values.old_password, form_errors);
      break;
    case "new_password":
      isValid = validateNewPassword(values.new_password, form_errors);
      break;
    case "confirm_password":
      isValid = validatePasswordConfirmation(
        values.confirm_password,
        form_errors
      );
      break;

    default:
  }
  return { form_errors, isValid };
};

function validateFirstName(pass, form_errors) {
  let result = true;
  form_errors.first_name = "";
  if (!pass) {
    form_errors.first_name = "First Name is Required";
    result = false;
  }
  return result;
}
function validateUsername(pass, form_errors) {
  let result = true;
  form_errors.user_name = "";
  if (!pass) {
    form_errors.user_name = "User Name is Required";
    result = false;
  }
  return result;
}
function validateMobileNum(pass, form_errors) {
  let result = true;
  form_errors.mobile_num = "";

  if (!pass) {
    form_errors.mobile_num = "Mobile Number is Required";
    result = false;
  }
  const regex = new RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/);
  if (!regex.test(pass)) {
    result = false;
  }

  return result;
}

function validateAddress(pass, form_errors) {
  let result = true;
  form_errors.address = "";
  if (!pass) {
    form_errors.address = "Address is Required";
    result = false;
  }
  return result;
}
function validateLastName(pass, form_errors) {
  let result = true;
  form_errors.last_name = "";
  if (!pass) {
    form_errors.last_name = "Last name is Required";
    result = false;
  }
  return result;
}
function validateNewPassword(pass, form_errors) {
  let result = true;
  form_errors.new_password = "";
  if (!pass) {
    form_errors.new_password = "Password is Required";
    result = false;
  }
  return result;
}
function validatePasswordConfirmation(pass, form_errors) {
  let result = true;
  form_errors.confirm_password = "";
  if (!pass) {
    form_errors.confirm_password = "Password Confirmation is Required";
    result = false;
  }
  return result;
}

function validateOldPassword(pass, form_errors) {
  let result = true;
  form_errors.old_password = "";
  if (!pass) {
    form_errors.old_password = "Current Password is Required";
    result = false;
  }
  return result;
}

export const validateUserProfileDetails = (data) => {
  const { first_name, last_name, user_name, mobile_num, address } = data;
  let isValid = true,
    form_errors = {};
  if (!requiredValidator(first_name)) {
    isValid = false;
    form_errors.first_name = "First name is required";
  } else if (!firstnameValidator(first_name)) {
    isValid = false;
    form_errors.first_name =
      "Please enter a valid first name between 2 to 30 characters";
  }
  if (!requiredValidator(last_name)) {
    isValid = false;
    form_errors.last_name = "Last name is required";
  } else if (!lastnameValidator(last_name)) {
    isValid = false;
    form_errors.last_name =
      "Please enter a valid last name between 2 to 30 characters";
  }
  if (!requiredValidator(user_name)) {
    isValid = false;
    form_errors.user_name = "Username is required";
  } else if (!usernameValidator(user_name)) {
    isValid = false;
    form_errors.user_name =
      "Please enter a valid username between 6 to 20 characters";
  }
  if (!requiredValidator(mobile_num)) {
    isValid = false;
    form_errors.mobile_num = "Mobile number is required";
  } else if (!mobileValidator(mobile_num)) {
    isValid = false;
    form_errors.mobile_num = "Enter a valid Mobile number";
  }
  if (!requiredValidator(address)) {
    isValid = false;
    form_errors.address = "Address is required";
  } else if (!addressValidator(address)) {
    isValid = false;
    form_errors.address = "Enter valid address upto 70 characters";
  }
  return { isValid, form_errors };
};

export const validatePassword = (data) => {
  const { old_password, new_password, confirm_password } = data;
  let isValid = true,
    form_errors = {};
  if (!requiredValidator(old_password)) {
    isValid = false;
    form_errors.old_password = "Current password is required";
  }

  if (!requiredValidator(new_password)) {
    isValid = false;
    form_errors.new_password = "New password is required";
  } else if (new_password === old_password) {
    isValid = false;
    form_errors.new_password = "Old Password and New Password must not be same";
  }
  // if (!requiredValidator(confirm_password)) {
  //   isValid = false;
  //   form_errors.confirm_password = "Confirm password is required";
  // }

  if (!requiredValidator(confirm_password)) {
    isValid = false;
    form_errors.confirm_password = "Confirm Password is required";
  } else if (new_password != confirm_password) {
    isValid = false;
    form_errors.confirm_password = "Password and Confirm Password must be same";
  }
  // if (confirm_pass !== new_pass) {
  //   isValid = false;
  //   form_errors.confirm_pass = "Password and Confirm password must be same.";
  // }
  return { isValid, form_errors };
};

const requiredValidator = (value) => (value ? true : false);

const numberValidator = (value) => {
  const regex = new RegExp(/^[0-9]+(\.)?([0-9]+)?$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};
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

const addressValidator = (value) => {
  const regex = new RegExp(/^.{5,70}$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};

const firstnameValidator = (value) => {
  // /^([^0-9]*)$/ -number allow nahi kare
  // /[^a-zA-Z0-9 ]/
  // USername---> /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
  // first name --> /^[a-zA-Z ]{2,30}$/
  const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};

const lastnameValidator = (value) => {
  // /^([^0-9]*)$/ -number allow nahi kare
  // /[^a-zA-Z0-9 ]/
  // USername---> /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
  // first name --> /^[a-zA-Z ]{2,30}$/
  const regex = new RegExp(/^[a-zA-Z ]{2,30}$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};

const usernameValidator = (value) => {
  // /^([^0-9]*)$/ -number allow nahi kare
  // /[^a-zA-Z0-9 ]/
  // USername---> /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
  // first name --> /^[a-zA-Z ]{2,30}$/
  const regex = new RegExp(
    /^(?=[a-zA-Z0-9._]{6,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
  );
  if (!regex.test(value)) {
    return false;
  }
  return true;
};
