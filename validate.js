var emailRegex = new RegExp("^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z]+$");

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
      resolve(null);
    } else {
      reject(error);
    }
  });
};

module.exports.registerValidate = (body) => {
  return new Promise((resolve, reject) => {
    console.log("Insdie validation");
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
    } else if (!emailRegex.test(body.email)) {
      error.emailError = "This is not a valid email!";
    }

    for (var key in error) {
      if (error[key] != null) {
        reject(error);
      }
    }

    resolve();
  });
};
