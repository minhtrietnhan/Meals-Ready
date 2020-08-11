const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const input = require("./data.js");
const validation = require("./validate.js");
const db = require("./database.js");
const bodyParser = require("body-parser");
const multer = require("multer");
const clientSessions = require("client-sessions");
const cart = require("./cart.js");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const HTTP_PORT = process.env.PORT || 5000;

// setup multer
const storage = multer.diskStorage({
  destination: "./public/img/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    return cb(null, true);
  } else {
    return cb(new Error("Not an image! Please upload an image.", 400), false);
  }
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

// Set up static directory
app.use(express.static(__dirname + "/public"));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login.hbs");
  } else {
    next();
  }
}

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    console.log("already logged in");
    res.redirect("/dashboard");
  } else {
    next();
  }
}

function isClerk(req, res, next) {
  if (req.session.user.clerk == false) {
    res.redirect("/maintenance");
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
  // var packages = input.returnData();
  // res.render("index", {
  //   data: packages,
  // });

  db.getTopPackages()
    .then((topPackages) => {
      res.render("index", { data: topPackages });
    })
    .catch((err) => {
      res.render("index", { error: err });
    });
});

app.get("/packages.hbs", (req, res) => {
  // var packages = input.returnData();
  // res.render("packages", {
  //   data: packages,
  // });

  db.getAllPackages()
    .then((packages) => {
      res.render("packages", { data: packages });
    })
    .catch((err) => {
      res.render("packages", { error: err });
    });
});

app.get("/signup.hbs", (req, res) => {
  res.render("signup");
});

app.get("/login.hbs", isLoggedIn, (req, res) => {
  res.render("login.hbs");
});

app.get("/logout", (req, res) => {
  req.session.reset();
  res.redirect("/login.hbs");
});

app.get("/dashboard", ensureLogin, (req, res) => {
  res.render("dashboard", { data: req.session.user });
});

app.get("/addpackages.hbs", ensureLogin, isClerk, (req, res) => {
  res.render("addpackages");
});

app.get("/maintenance", (req, res) => {
  res.render("maintenance");
});

app.get("/package/:name", (req, res) => {
  db.getPackageByName(req.params.name)
    .then((package) => {
      res.render("packagedetail", {
        data: {
          image: package.image,
          name: package.name,
          description: package.description,
          price: package.price,
        },
        layout: false,
      });
    })
    .catch((err) => {
      res.render("maintenance");
    });
});

//AJAX route to add a product. Replies back with number of items in cart
app.post("/addPackage", ensureLogin, (req, res) => {
  console.log(`Adding package ${req.body.name}`);
  db.getPackageByName(req.body.name)
    .then((package) => {
      cart
        .addItem(package)
        .then((numItems) => {
          res.json({ data: numItems });
        })
        .catch(() => {
          res.json({ message: "error adding" });
        });
    })
    .catch(() => {
      res.json({ message: "No Items found" });
    });
});

//Route to see cart and items
app.get("/cart", ensureLogin, (req, res) => {
  var cartData = {
    cart: [],
    total: 0,
  };
  cart
    .getCart()
    .then((items) => {
      cartData.cart = items;
      cart
        .checkout()
        .then((total) => {
          cartData.total = total;
          res.render("checkout", { data: cartData, layout: false });
        })
        .catch((err) => {
          res.send("There was an error getting total: " + err);
        });
    })
    .catch((err) => {
      res.send("There was an error: " + err);
    });
});

//AJAX route to remove item by name. Replies back with total and list of items.
app.post("/removeItem", (req, res) => {
  //return the cart to re-render the page
  var cartData = {
    cart: [],
    total: 0,
  };
  cart
    .removeItem(req.body.name)
    .then(cart.checkout)
    .then((inTotal) => {
      cartData.total = inTotal;
      cart
        .getCart()
        .then((items) => {
          cartData.cart = items;
          res.json({ data: cartData });
        })
        .catch((err) => {
          res.json({ error: err });
        });
    })
    .catch((err) => {
      res.json({ error: err });
    });
});

app.post("/login-form", (req, res) => {
  validation
    .loginValidate(req.body)
    .then((status) => {
      if (status == null) {
        db.validatePassword(req.body)
          .then((user) => {
            req.session.user = {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              clerk: user.clerk,
            };
            res.redirect("/dashboard");
          })
          .catch((err) => {
            var formData = {
              email: req.body.email,
            };
            res.render("login", { error: err, form: formData });
          });
      }
    })
    .catch((message) => {
      res.render("login", { error: message });
    });
});

app.post("/register", (req, res) => {
  var formData = {
    firstName: req.body.first_name,
    lastName: req.body.last_name,
    email: req.body.email,
  };
  validation
    .registerValidate(req.body)
    .then((status) => {
      console.log(status);
      if (status == null) {
        db.addCustomer(req.body)
          .then((user) => {
            var temp = {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            };

            res.render("successfulRegister", { data: temp });
          })
          .catch((message) => {
            console.log(error);
            res.render("signup", { error: message, form: formData });
          });
      }
    })
    .catch((message) => {
      console.log(`Error registering! Error: ${message.emailError}`);
      res.render("signup", { error: message, form: formData });
    });
});

app.post("/add-package-form", upload.single("package_img"), (req, res) => {
  req.body.image = req.file.filename;
  db.addPackage(req.body)
    .then((package) => {
      res.render("newpackage", {
        data: {
          image: package.image,
          name: package.name,
          description: package.description,
          price: package.price,
        },
      });
      //res.render("packages");
    })
    .catch((message) => {
      res.render("addpackages", { error: message });
    });
});

// app.use((err, req, res, next) => {
//   if (err) {
//     console.log(err.message);
//     res.status(500).render("addpackages", {
//       message: "Cannot upload non-image file! Try again!",
//     });
//   }
// });

app.use((req, res) => {
  res.render("maintenance");
});

db.initializeDb().catch((err) => {
  console.log(`Something went wrong with the database. The error is: ${err}.`);
});

app.listen(HTTP_PORT, () => console.log(`Listening on ${HTTP_PORT}`));
