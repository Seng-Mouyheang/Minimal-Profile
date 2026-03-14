/* eslint-disable no-undef */
const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const expressSession = require("express-session");
const FileStore = require("session-file-store")(expressSession);
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || "my_super_secretest_key";

// LEARNT A VERY VALUABLE LESSON FROM THE PREVIOUS EXERCISE
app.disable("x-powered-by");

app.engine(
  "hbs",
  engine({
    defaultLayout: "main",
    extname: "hbs",
    partialsDir: path.join(__dirname, "views", "partials"),
  }),
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser(SECRET));
app.use(
  expressSession({
    store: new FileStore({
      path: path.join(__dirname, "sessions"),
      retries: 0,
      ttl: 24 * 60 * 60,
    }),
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      signed: true,
    },
  }),
);

app.use((req, res, next) => {
  const theme = req.signedCookies.theme || "light";

  res.locals.theme = theme;
  res.locals.currentUser = req.session.user || null;
  next();
});

function authenticate(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

const users = {
  admin: {
    username: "admin",
    password: "password123",
    fullName: "System Administrator",
    email: "admin@university.edu",
    bio: "Managing the campus network infrastructure.",
  },
  student_dev: {
    username: "student_dev",
    password: "dev_password",
    fullName: "Jane Developer",
    email: "jane.d@student.edu",
    bio: "Full-stack enthusiast and coffee drinker.",
  },
};

app.get("/", (req, res) => {
  res.render("index", { pageTitle: "Home Page" });
});

app.get("/toggle-theme", (req, res) => {
  const currentTheme = req.signedCookies.theme || "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  res.cookie("theme", nextTheme, {
    httpOnly: true,
    signed: true,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  // Redirect back to the referring page or home (tried using req.path without realizing, end up horribly in an infinite loop...)
  res.redirect(req.get("referer") || "/");
});

app.get("/login", (req, res) => {
  res.render("login", { pageTitle: "Login Page" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (user && user.password === password) {
    req.session.user = {
      username: user.username,
      fullName: user.fullName,
    };
    res.redirect("/profile");
  } else {
    res.status(401).json({
      error: "Invalid username or password. Please try again.",
    });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

app.get("/profile", authenticate, (req, res) => {
  const user = users[req.session.user.username];
  res.render("profile", {
    pageTitle: "Profile Page",
    user: {
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
    },
  });
});

app.use((req, res) => {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.use((err, req, res) => {
  console.error("Internal Server Error:", err);
  res.status(500).render("500", { pageTitle: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
