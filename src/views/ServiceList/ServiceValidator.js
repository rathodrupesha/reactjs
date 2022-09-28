export const validator = (values, fieldName) => {
  console.log("values", values);
  console.log("fieldName", fieldName);

  let errors = {};
  let isValid = true;
  switch (fieldName) {
    case "name":
      isValid = validateName(values.name, errors);
      break;

    case "description":
      isValid = validateDescription(values.description, errors);
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
function validateDescription(pass, errors) {
  let result = true;
  errors.description = "";
  if (!pass) {
    errors.description = "Description is Required";
    result = false;
  }
  return result;
}

export const validateServiceData = (data) => {
  let isValid = true,
    errors = {};

  const { name, description, master_ser_id } = data;

  if (!requiredValidator(name)) {
    isValid = false;
    errors.name = "Name is required";
  } else if (!servicenameValidator(name)) {
    isValid = false;
    errors.name =
      "Please enter a valid service name upto maximum 25 characters";
  } else if (!serviceDigitsValidator(name)) {
    isValid = false;
    errors.name = "Numbers are not allowed";
  }

  if (!requiredValidator(description)) {
    isValid = false;
    errors.description = "Description is required";
  } else if (!descriptionValidator(description)) {
    isValid = false;
    errors.description = "Enter Description between 5 to 150 characters";
  }

  if (!requiredValidator(master_ser_id)) {
    isValid = false;
    errors.master_ser_id = "Service is required";
  }

  return { isValid, errors };
};

const requiredValidator = (value) => (value ? true : false);

const descriptionValidator = (value) => {
  const regex = new RegExp(/^.{5,150}$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};

const servicenameValidator = (value) => {
  // /^([^0-9]*)$/ -number allow nahi kare
  // /[^a-zA-Z0-9 ]/
  // USername---> /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
  // first name --> /^[a-zA-Z ]{2,30}$/
  // const regex = new RegExp(/^[a-zA-Z-.]*$/);
  // const regex = new RegExp(/^([^0-9]*)$/);

  if (value.length > 25) {
    return false;
  }
  return true;
};
const serviceDigitsValidator = (value) => {
  // /^([^0-9]*)$/ -number allow nahi kare
  // /[^a-zA-Z0-9 ]/
  // USername---> /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
  // first name --> /^[a-zA-Z ]{2,30}$/
  // const regex = new RegExp(/^[a-zA-Z-.]*$/);
  const regex = new RegExp(/^([^0-9]*)$/);

  if (!regex.test(value)) {
    return false;
  }

  return true;
};
