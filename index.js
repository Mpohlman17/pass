require("dotenv").config();

var express = require("express");
var session = require("express-session");
const passport = require("passport");
const config = require("./config");

require("./server/models").connect(config.dbUri);

const app = express();
// tell the app to look for static files in these directories
app.use(express.static("./server/static/"));
app.use(express.static("./client/dist/"));
// tell the app to parse HTTP body messages
// app.use(bodyParser.urlencoded({ extended: false }));
// pass the passport middleware
app.use(passport.initialize());
const localSignupStrategy = require("./server/passport/local-signup");
const localLoginStrategy = require("./server/passport/local-login");
passport.use("local-signup", localSignupStrategy);
passport.use("local-login", localLoginStrategy);

// pass the authenticaion checker middleware
const authCheckMiddleware = require("./server/middleware/auth-check");
app.use("/api", authCheckMiddleware);

// routes
const authRoutes = require("./server/routes/auth");
const apiRoutes = require("./server/routes/api");
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.set("port", process.env.PORT || 3000);

// start the server
app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
