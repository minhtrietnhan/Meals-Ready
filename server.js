const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const input = require("./data.js");
const validation = require("./validate.js");
const db = require("./database.js");
const bodyParser = require("body-parser");
const clientSessions = require("client-sessions");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const HTTP_PORT = process.env.PORT || 5000;

// Set up static directory
app.use(express.static(__dirname + "/public"));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } else {
    next();
  }
}

// Set up handlebars
app.set("views", "./views");
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Setup client-sessions
app.use(
  clientSessions({
    cookieName: "session",
    secret: "week10example_web322",
    duration: 1 * 60 * 60 * 1000, // 1 hour
    activeDuration: 1000 * 60,
  })
);

// Routes
app.get("/", (req, res) => {
  var packages = input.returnData();
  res.render("index", {
    data: packages,
  });
});

app.get("/index.hbs", (req, res) => {
  var packages = input.returnData();
  res.render("index", {
    data: packages,
  });
});

app.get("/packages.hbs", (req, res) => {
  var packages = input.returnData();
  res.render("packages", {
    data: packages,
  });
});

app.get("/signup.hbs", (req, res) => {
  res.render("signup");
});

app.get("/login.hbs", (req, res) => {
  res.render("login.hbs");
});

app.get("/dashboard.hbs", ensureLogin, (req, res) => {
  res.render("dashboard", { data: req.session.user });
});

app.post("/login-form", (req, res) => {
  validation
    .loginValidate(req.body)
    .then((status) => {
      if (status == null){
        db.validatePassword(req.body).then((user)=>{

          res.redirect("/dashboard");
        })
      }
    })
    .catch((message) => {
      res.render("login", { error: message });
    });
});

app.post("/register", (req, res) => {
  validation
    .registerValidate(req.body)
    .then((status) => {
      console.log(status);
      if (status == null){
        db.addCustomer(req.body)
          .then((user) => {
            var temp = {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            };

            res.render("dashboard", { data: temp });
          })
          .catch((message) => {
            console.log(error);
            res.render("signup", { error: message });
          });
      }
    })
    .catch((message) => {
      console.log(`Error registering! Error: ${message.emailError}`);
      res.render("signup", { error: message });
    });
});

app.use((req, res) => {
  res.render("maintenance");
});

db.initializeDb().catch((err) => {
  console.log(`Something went wrong with the database. The error is: ${err}.`);
});

app.listen(HTTP_PORT, () => console.log(`Listening on ${HTTP_PORT}`));
