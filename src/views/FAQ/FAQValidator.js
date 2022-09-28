export const validator = (values, fieldName) => {
  console.log("values", values);
  console.log("fieldName", fieldName);

  let errors = {};
  let isValid = true;
  switch (fieldName) {
    case "question":
      isValid = validateQuestion(values.question, errors);
      break;

    case "answer":
      isValid = validateAnswer(values.answer, errors);
      break;
    default:
  }
  return { errors, isValid };
};
function validateQuestion(pass, errors) {
  let result = true;
  errors.question = "";
  if (!pass) {
    errors.question = "Question is Required";
    result = false;
  }
  return result;
}
function validateAnswer(pass, errors) {
  let result = true;
  errors.answer = "";
  if (!pass) {
    errors.answer = "Answer is Required";
    result = false;
  }
  return result;
}

export const validateFaqData = (data) => {
  let isValid = true,
    errors = {};

  const { question, answer } = data;

  if (!requiredValidator(question)) {
    isValid = false;
    errors.question = "Question is required";
  } else if (!limitValidator(question)) {
    isValid = false;
    errors.question = "Enter Question between 1 to 500 characters";
  }

  if (!requiredValidator(answer)) {
    isValid = false;
    errors.answer = "Answer is required";
  } else if (!limitValidator(answer)) {
    isValid = false;
    errors.answer = "Enter Answer between 1 to 500 characters";
  }

  return { isValid, errors };
};

const requiredValidator = (value) => (value ? true : false);

const limitValidator = (value) => {
  const regex = new RegExp(/^.{1,500}$/);
  if (!regex.test(value)) {
    return false;
  }
  return true;
};
