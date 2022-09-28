export const validator = (values, fieldName) => {
  //console.log("values", values);
  //console.log("fieldName", fieldName);

  let errors = {};
  let isValid = true;
  switch (fieldName) {
    case "name":
      isValid = validateName(values.name, errors);
      break;
    case "description":
      isValid = validateDescription(values.description, errors);
      break;
    case "important_notes":
      isValid = validateImportantNote(values.important_notes, errors);
    default:
  }
  return { errors, isValid };
};
function validateName(pass, errors) {
  let result = true;
  errors.name = "";
  if (!pass) {
    errors.name = "Premium Service Name is Required";
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
function validateImportantNote(pass, errors) {
  let result = true;
  errors.important_notes = "";
  if (!pass) {
    errors.important_notes = "Important Note is Required";
    result = false;
  }
  return result;
}

export const validatePremiumServiceData = (data) => {
  let isValid = true,
    errors = {};

  const {
    name,
    description,
    important_notes,
    premium_image,
    openForAll,
  } = data;
  const openHours =
    data.openHours && openForAll ? JSON.parse(data.openHours) : null;
  console.log(openHours);

  if (!requiredValidator(name)) {
    isValid = false;
    errors.name = "Premium Service Name is required";
  } else if (!p_servicenameValidator(name)) {
    isValid = false;
    errors.name =
      "Please enter a valid Premium Service name upto maximum 30 characters";
  } else if (!p_serviceDigitValidator(name)) {
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

  if (!requiredValidator(important_notes)) {
    isValid = false;
    errors.important_notes = "Important Notes is required";
  } else if (!impValidator(important_notes)) {
    isValid = false;
    errors.important_notes = "Enter Important Notes upto maximum 50 characters";
  }

  if (!requiredValidator(premium_image)) {
    isValid = false;
    errors.premium_image = "Please Select Premium Service Main Image";
  }

  if (openForAll) {
    let isAnyOpeningStatus = false;
    for (let i = 0; i < openHours.length; i++) {
      let oh = openHours[i];
      isAnyOpeningStatus |= oh.openingStatus;
      if (oh.openingStatus) {
        if (oh.openTime === "" || oh.closeTime === "") {
          isValid = false;
          errors.timings =
            "Please fill in the start and end time for the selected timings";
        }
      }
    }
    if (!isAnyOpeningStatus) {
      isValid = false;
      errors.timings = "Please select atleast one timing";
    }
  }

  //  console.log("Errors---->", errors);

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

const impValidator = (value) => {
  const regex = new RegExp(/^.{1,50}$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};

const p_servicenameValidator = (value) => {
  // /^([^0-9]*)$/ -number allow nahi kare
  // /[^a-zA-Z0-9 ]/
  // USername---> /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
  // first name --> /^[a-zA-Z ]{2,30}$/
  if (value.length > 30) {
    return false;
  }
  return true;
};
const p_serviceDigitValidator = (value) => {
  // /^([^0-9]*)$/ -number allow nahi kare
  // /[^a-zA-Z0-9 ]/
  // USername---> /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
  // first name --> /^[a-zA-Z ]{2,30}$/
  const regex = new RegExp(/^([^0-9]*)$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};
