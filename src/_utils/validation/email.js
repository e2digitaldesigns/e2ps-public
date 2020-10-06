export default data => {
  return data;
};

export const emailValidationSubmit = data => {
  const regEx = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,14}$/;

  return regEx.test(data.toLowerCase());
};
