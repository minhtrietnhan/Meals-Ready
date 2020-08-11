var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var dbsConnection =
  "mongodb+srv://pauldbs:paul1999@paul-web.8wmit.mongodb.net/MealsReady?retryWrites=true&w=majority";

// Creating Schema for collections
let Schema = mongoose.Schema;

// Local collection templates
let Users;
let Packages;

// Creating models to connect to collections
let userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  subscribe: Boolean,
  clerk: Boolean,
});

let packageSchema = new Schema({
  name: String,
  image: String,
  price: Number,
  noOfMeals: Number,
  category: Array,
  description: String,
  isTopPackage: Boolean,
});

module.exports.initializeDb = function () {
  return new Promise((resolve, reject) => {
    // Connect database
    let db = mongoose.createConnection(dbsConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    db.on("error", (err) => {
      reject(err);
    });

    db.once("open", () => {
      Users = db.model("users", userSchema);
      Packages = db.model("packages", packageSchema);
      resolve();
    });
  });
};

module.exports.addCustomer = (data) => {
  return new Promise((resolve, reject) => {
    Users.findOne({ email: data.email })
      .then((user) => {
        var error = {
          firstNameError: null,
          lastNameError: null,
          emailError: null,
          passswordError: null,
        };
        if (user) {
          // Already registered
          error.emailError = "Email already registered. Do you want to log in?";
          return reject(error);
        } else {
          data.subscribe = data.subscribe == "on" ? true : false;
          data.clerk = data.clerk == "on" ? true : false;

          // make sure data is either good or null
          for (var entry in data) {
            if (data[entry] === "" && entry != "subscribe" && entry != "clerk")
              data[entry] = null;
          }

          var newUser;
          // Encrypt password before saving
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(data.password, salt, function (err, hash) {
              newUser = new Users({
                firstName: data.first_name,
                lastName: data.last_name,
                email: data.email,
                password: hash,
                subscribe: data.subscribe,
                clerk: data.clerk,
              });

              // Save user to db
              newUser.save((err) => {
                if (err) {
                  console.log(`There's an error: ${err}!`);
                  error.emailError = "Email already exists!";
                  return reject(error);
                } else {
                  console.log("User saved to db!");
                  return resolve(newUser);
                }
              });
            });
          });
        }
      })
      .catch((err) => {
        console.log(`Something went wrong: ${err}!`);
        return reject(err);
      });
  });
};

module.exports.validatePassword = (data) => {
  return new Promise((resolve, reject) => {
    console.log("inside validatePassword");
    var error = {
      emailError: null,
      passwordError: null,
    };
    this.findUser(data.email)
      .then((user) => {
        if (user) {
          console.log("inside validatepasword exists");
          bcrypt.compare(data.password, user.password).then((result) => {
            if (result) {
              return resolve(user);
            } else {
              error.emailError =
                "Email or password is incorrect! Please try again!";
              return reject(error);
            }
          });
        } else {
          error.emailError =
            "Email or password is incorrect! Please try again!";
          return reject(error);
        }
      })
      .catch((err) => {
        console.log("There has been an error: " + err);
        error.emailError = "Email does not exist. Do you want to sign up?";
        return reject(error);
      });
  });
};

module.exports.findUser = (_email) => {
  return new Promise((resolve, reject) => {
    Users.findOne({ email: _email })
      .exec()
      .then((user) => {
        if (user) {
          console.log("inside findUser");
          console.log(user);
          return resolve(user.toObject());
        } else {
          console.log("No user found!");
          return reject("No user found!");
        }
      })
      .catch((err) => {
        console.log(`There has been an error receiving user: ${err}!`);
        return reject(err);
      });
  });
};

module.exports.getTopPackages = () => {
  return new Promise((resolve, reject) => {
    console.log("inside get top packages");
    Packages.find({ isTopPackage: true })
      .exec()
      .then((topPackages) => {
        if (topPackages.length > 0) {
          return resolve(topPackages.map((item) => item.toObject()));
        } else {
          console.log("No top package found!");
          return reject({ err: "No top package available!" });
        }
      })
      .catch((err) => {
        console.log(`There has been an error: ${err}`);
        return reject(err);
      });
  });
};

module.exports.getAllPackages = () => {
  return new Promise((resolve, reject) => {
    Packages.find({})
      .exec()
      .then((packages) => {
        if (packages.length > 0) {
          return resolve(packages.map((item) => item.toObject()));
        } else {
          console.log("No packages found!");
          return reject({ err: "No package available!" });
        }
      })
      .catch((err) => {
        console.log(`There has been an error: ${err}`);
        return reject(err);
      });
  });
};

module.exports.getPackageByName = (_name) => {
  return new Promise((resolve, reject) => {
    console.log("inside get package by name");
    Packages.findOne({ name: _name })
      .exec()
      .then((returnedPackage) => {
        if (returnedPackage) {
          console.log(`found package ${_name}`);
          return resolve(returnedPackage.toObject());
        } else {
          console.log("No package found!");
          return reject({ err: "No package available!" });
        }
      })
      .catch((err) => {
        console.log(`There has been an error: ${err}`);
        return reject(err);
      });
  });
};

module.exports.addPackage = (data) => {
  return new Promise((resolve, reject) => {
    var error = {
      nameError: null,
      priceError: null,
      categoryError: null,
      noOfMealsError: null,
      descriptionError: null,
    };

    for (var key in data) {
      console.log(data[key]);
    }

    if (data.package_name == "") {
      error.nameError = "Please enter the name of the package!";
    }
    if (data.package_price == "") {
      error.priceError = "Please enter the price of the package!";
    }
    if (data.package_category == "") {
      error.priceError = "Please enter the category of the package!";
    }
    if (data.package_noofmeals == "") {
      error.noOfMealsError = "Please enter the number of meals in the package!";
    }
    if (data.package_description == "") {
      error.descriptionError = "Please enter the description of the package!";
    }

    // Reject if input data is not good
    for (var err in error) {
      if (error[err] != null) {
        return reject(error);
      }
    }

    // Data good

    var package = new Packages({
      name: data.package_name,
      image: `/img/${data.image}`,
      price: data.package_price,
      noOfMeals: data.package_noofmeals,
      category: data.package_category.split(","),
      description: data.package_description,
      isTopPackage: data.top_package == "on" ? true : false,
    });

    package.save((err) => {
      if (err) {
        console.log(`There's an error: ${err}!`);
        return reject(err);
      } else {
        console.log("Package saved to db!");
        return resolve(package);
      }
    });
  });
};
