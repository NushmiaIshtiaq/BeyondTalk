const express = require("express");
const bodyParser = require("body-parser");
const { createServer } = require("http");

import "dotenv/config";
import connectDb from "./config/db.config";
import morgan from "morgan";

const path = require("path");
const cors = require("cors");

// Routes
import UserRouter from "./routes/user.routes";
import CustomerProfileRouter from "./routes/customer.routes";
import EmployeeProfileRouter from "./routes/employee.routes";
import AdminRouter from "./routes/admin.routes";
import ChatLogRouter from "./routes/chat.routes";

// Socket.io
import socket from "./video_calling/socket";

// Application Configuations
const app = express();
const server = createServer(app);

app.use("/public", express.static(path.join(__dirname, "public")));

const formData = require("express-form-data");
const os = require("os");
const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};
app.use(formData.parse(options));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
process.env.NODE_ENV == "development"
  ? app.use(morgan("dev"))
  : app.use(morgan("combined"));

// Configuring Passport
require("./config/passport.config");

/* Registering User Routes  */
app.use("/user", UserRouter);

/* Registering Customer Routes  */
app.use("/customer", CustomerProfileRouter);

/* Registering Empployee Routes  */
app.use("/employee", EmployeeProfileRouter);

/* Registering Admin Routes  */
app.use("/admin", AdminRouter);

/* Registering Chat Log data Routes  */
app.use("/chat", ChatLogRouter);

/* Connecting to database and starting the server  */

connectDb()
  .then(async () => {
    server.listen(process.env.PORT, () => {
      console.log(
        `Api is running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
      );
    });

    socket(server);
  })
  .catch(err => {
    console.log("Couldn't connect to database!", err);
  });
