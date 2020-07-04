const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const input = require("./data.js");
const validation = require("./validate.js");
const bodyParser = require("body-parser");

const HTTP_PORT = process.env.PORT || 5000;

// Set up static directory
app.use(express.static(__dirname + "/public"));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set up handlebars
app.set("views", "./views");
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

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

app.post("/login-form", (req, res) => {
  var inputData = req.body;
  validation
    .loginValidate(inputData)
    .then(() => {
      res.render("index");
    })
    .catch((message) => {
      res.render("login", { error: message });
    });
});

app.post("/register", (req, res) => {
  var inputData = req.body;
  validation
    .registerValidate(inputData)
    .then(() => {
      res.render("maintenance");
    })
    .catch((message) => {
      res.render("signup", { error: message });
    });
});

app.use((req, res) => {
  res.render("maintenance");
});

app.listen(HTTP_PORT, () => console.log(`Listening on ${HTTP_PORT}`));
