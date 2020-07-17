const express = require("express");
const router = express.Router();

//Controller Of Profile
import {
  ViewProfile,
  UpdateProfile
} from "../controllers/customer/index.controller";

// Controller of Employee
import {
  ViewAllEmployees,
  AddToContactEmployee
} from "../controllers/customer/employee.controller";

import { isCustomer, isLoggedIn } from "../middleware/auth/index";

//All Routes Related Profile Basic
router.get("/profile/:userid", ViewProfile);
router.put("/profile/:userid", UpdateProfile);

// All Routes Related to Employee
router.get("/viewallemployees/:userid", ViewAllEmployees);

// All Routes Related To Chat
router.post("/addtocontact", AddToContactEmployee);

const CustomerProfileRouter = router;
export default CustomerProfileRouter;
