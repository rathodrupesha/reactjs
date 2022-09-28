export const validator = (values, fieldName) => {
  console.log("values", values);
  console.log("fieldName", fieldName);

  let errors = {};
  let isValid = true;
  switch (fieldName) {
    case "date":
      isValid = validateSlotDate(values.date, errors);
      break;
    case "start_time":
      isValid = validateStartTime(values.start_time, errors);
      break;

    case "end_time":
      isValid = validateEndTime(values.end_time, errors);
      break;

    default:
  }
  return { errors, isValid };
};

function validateSlotDate(pass, errors) {
  let result = true;
  errors.date = "";
  if (!pass) {
    errors.date = "Slot Date is Required";
    result = false;
  }
  return result;
}
function validateStartTime(pass, errors) {
  let result = true;
  errors.start_time = "";
  if (!pass) {
    errors.start_time = "Start time is Required";
    result = false;
  }
  return result;
}

function validateEndTime(pass, errors) {
  let result = true;
  errors.end_time = "";
  if (!pass) {
    errors.end_time = "End time is Required";
    result = false;
  }
  return result;
}

export const validateSlotData = (data) => {
  let isValid = true,
    errors = {};

  const { date, start_time, end_time } = data;

  if (!requiredValidator(date)) {
    isValid = false;
    errors.date = "Slot Date is required";
  }

  if (!requiredValidator(start_time)) {
    isValid = false;
    errors.start_time = "Start time is required";
  }

  if (!requiredValidator(end_time)) {
    isValid = false;
    errors.end_time = "End time is required";
  }

  console.log("Errors---->", errors);

  return { isValid, errors };
};

const requiredValidator = (value) => (value ? true : false);
