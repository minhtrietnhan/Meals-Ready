module.exports.loginValidate = (body) => {
  return new Promise((resolve, reject) => {
    var error = {
      emailError: null,
      passwordError: null,
    };
    if (body.email == "") {
      error.emailError = "This field is required!";
    }
    if (body.password == "") {
      error.passwordError = "This field is required!";
    }
    if (error.emailError == null && error.passwordError == null) {
      resolve(error);
    } else {
      reject(error);
    }
  });
};

module.exports.registerValidate = (body) => {
  return new Promise((resolve, reject) => {
    var error = {
      firstNameError: null,
      lastNameError: null,
      emailError: null,
      passswordError: null,
    };
    if (body.first_name == "") {
      error.firstNameError = "This field is required!";
    }
    if (body.last_name == "") {
      error.lastNameError = "This field is required!";
    }
    if (body.password == "") {
      error.passwordError = "This field is required!";
    } else if (body.password.length < 6) {
      error.passwordError = "Password must contain at least 6 characters!";
    } else {
      const matches = body.password.match(/[0-9]/g) || [];
      if (matches.length == 0) {
        error.passwordError = "Password must contain at least a number!";
      }
    }
    if (body.email == "") {
      error.emailError = "This field is required!";
    }

    var valid =
      error.firstNameError != null &&
      error.lastNameError != null &&
      error.emailError != null &&
      error.passswordError != null;
    if (valid) {
      resolve(error);
    } else {
      reject(error);
    }
  });
};
