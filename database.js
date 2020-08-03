var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var dbsConnection =
  "mongodb+srv://pauldbs:paul1999@paul-web.8wmit.mongodb.net/MealsReady?retryWrites=true&w=majority";

// Creating Schema for collections
let Schema = mongoose.Schema;

// Local collection templates
let Users;

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
      resolve();
    });
  });
};

module.exports.addCustomer = (data) => {
  return new Promise((resolve, reject) => {
    this.findUser(data.email)
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
    var error = {
      emailError: null,
      passwordError: null,
    };
    this.findUser(data.email).then((user) => {
      if (user) {
        if (data.password == user.password) {
          return resolve(user);
        } else {
          error.passwordError = "Wrong password! Try again.";
          return reject(error);
        }
      } else {
      }
    });
  });
};

module.exports.findUser = (_email) => {
  return new Promise((resolve, reject) => {
    Users.findOne({ email: _email })
      .exec()
      .then((user) => {
        if (user) {
          console.log(user);
          resolve(user.toObject());
        } else {
          console.log("No user found!");
          resolve(null);
        }
      })
      .catch((err) => {
        console.log(`There has been an error receiving user: ${err}!`);
        return reject(err);
      });
  });
};
