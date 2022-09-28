export const validator = (values, fieldName) => {
  //console.log("values", values);
  //console.log("fieldName", fieldName);

  let errors = {};
  let isValid = true;
  switch (fieldName) {
    case "first_name":
      isValid = validateFirstName(values.first_name, errors);
      break;
    case "last_name":
      isValid = validateLastName(values.last_name, errors);
      break;
    case "email":
      isValid = validateEmail(values.email, errors);
      break;
    case "user_name":
      isValid = validateUsername(values.user_name, errors);
      break;
    // case " master_service_id,":
    //   isValid = validateServiceId(values.master_service_id, errors);
    //   break;

    case "mobile_num":
      isValid = validateMobileNum(values.mobile_num, errors);
      break;
    case "password":
      isValid = validatePassword(values.password, errors);
      break;
    case "password_confirmation":
      isValid = validatePasswordConfirmation(values, errors);
      break;
    case "address":
      isValid = validateAddress(values.address, errors);
      break;

    default:
  }
  return { errors, isValid };
};
function validateFirstName(pass, errors) {
  let result = true;
  errors.first_name = "";
  if (!pass) {
    errors.first_name = "First Name is Required";
    result = false;
  }
  return result;
}

function validateUsername(pass, errors) {
  let result = true;
  errors.user_name = "";
  if (!pass) {
    errors.user_name = "User Name is Required";
    result = false;
  }
  return result;
}
function validateMobileNum(pass, errors) {
  let result = true;
  errors.mobile_num = "";

  if (!pass) {
    errors.mobile_num = "Mobile Number is Required";
    result = false;
  }
  const regex = new RegExp(/^(\+\d{1,3}[- ]?)?\d{10}$/);
  if (!regex.test(pass)) {
    result = false;
  }
  // /^[0-9]+$/
  return result;
}
function validatePasswordConfirmation(pass, errors) {
  let result = true;
  errors.password_confirmation = "";
  if (!pass.password_confirmation) {
    errors.password_confirmation = "Password Confirmation is Required";
    result = false;
  } else if (pass.password != pass.password_confirmation) {
    result = false;
    errors.password_confirmation = "Password and confirm Password must be same";
  }
  // console.log("pass", pass);
  return result;
}
function validateAddress(pass, errors) {
  let result = true;
  errors.address = "";
  if (!pass) {
    errors.address = "Address is Required";
    result = false;
  }
  return result;
}

function validateLastName(pass, errors) {
  let result = true;
  errors.last_name = "";
  if (!pass) {
    errors.last_name = "Last name is Required";
    result = false;
  }
  return result;
}
function validateServiceId(pass, errors) {
  let result = true;
  errors.master_service_id = "";
  if (!pass) {
    errors.master_service_id = "Service is Required";
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
    //  console.log("validator --->", email);
    result = re.test(String(email).toLowerCase());
    if (!result) errors.email = "Invalid Email address";
    else errors.email = "";
  }
  return result;
}
function validatePassword(pass, errors) {
  let result = true;
  errors.password = "";
  if (!pass) {
    errors.password = "Password is Required";
    result = false;
  }

  return result;
}

export const validateStaffData = (data) => {
  let isValid = true,
    errors = {};

  const {
    first_name,
    last_name,
    email,
    user_name,
    master_service_id,
    mobile_num,
    password,
    password_confirmation,
    address,
    pincode,
    country_id,
    state_id,
    city_id,
  } = data;

  if (!requiredValidator(first_name)) {
    isValid = false;
    errors.first_name = "First Name is required";
  } else if (!firstnameValidator(first_name)) {
    isValid = false;
    errors.first_name =
      "Please enter a valid first name between 2 to 30 characters";
  }

  if (!requiredValidator(last_name)) {
    isValid = false;
    errors.last_name = "Last Name is required";
  } else if (!lastnameValidator(last_name)) {
    isValid = false;
    errors.last_name =
      "Please enter a valid last name between 2 to 30 characters";
  }
  if (!requiredValidator(user_name)) {
    isValid = false;
    errors.user_name = "Username is required";
  } else if (!usernameValidator(user_name)) {
    isValid = false;
    errors.user_name =
      "Please enter a valid username between 6 to 20 characters";
  }
  if (!requiredValidator(email)) {
    isValid = false;
    errors.email = "Email is required";
  } else if (!emailValidator(email)) {
    isValid = false;
    errors.email = "Enter a valid email";
  }
  if (!requiredValidator(mobile_num)) {
    isValid = false;
    errors.mobile_num = "Mobile number is required";
  } else if (!mobileValidator(mobile_num)) {
    isValid = false;
    errors.mobile_num = "Enter a valid Mobile number";
  }
  if (!requiredValidator(address)) {
    isValid = false;
    errors.address = "Address is required ";
  } else if (!addressValidator(address)) {
    isValid = false;
    errors.address = "Enter valid address between 5 to 70 characters";
  }

  // if (!requiredValidator(hotel_name)) {
  //   isValid = false;
  //   errors.hotel_name = "Hotel Name is required";
  // }
  if (!requiredValidator(master_service_id)) {
    isValid = false;
    errors.master_service_id = "Service is required";
  }
  // if (!requiredValidator(payment_date)) {
  //   isValid = false;
  //   errors.payment_date = "Payment Date is required";
  // }

  // if (!requiredValidator(sub_start_date)) {
  //   isValid = false;
  //   errors.sub_start_date = "Subscription Start Date is required";
  // }

  // if (!requiredValidator(sub_end_date)) {
  //   isValid = false;
  //   errors.sub_end_date = "Subscription End Date is required";
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
  if (!requiredValidator(password)) {
    isValid = false;
    errors.password = "Password is required";
  }
  if (!requiredValidator(password_confirmation)) {
    isValid = false;
    errors.password_confirmation = "Confirm Password";
  } else if (password != password_confirmation) {
    isValid = false;
    errors.password_confirmation = "Password and Confirm Password must be same";
  }
  if (!requiredValidator(country_id)) {
    isValid = false;
    errors.country_id = "Country is required";
  }
  // if (!requiredValidator(state_id)) {
  //   isValid = false;
  //   errors.state_id = "State is required";
  // }
  // if (!requiredValidator(city_id)) {
  //   isValid = false;
  //   errors.city_id = "City is required";
  // }
  if (!pincodeValidator(pincode)) {
    isValid = false;
    errors.pincode = "Enter valid pincode between 1 to 10 digit";
  }

  // console.log("Errors---->", errors);

  return { isValid, errors };
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

const pincodeValidator = (value) => {
  if (value) {
    const regex = new RegExp(/^\d{1,10}$/);
    if (!regex.test(value)) {
      return false;
    }
    return true;
  } else {
    return true;
  }
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

const onlyNumValidator = (value) => {
  const regex = new RegExp(/^[0-9]*$/);
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
