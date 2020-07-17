const express = require("express");
const router = express.Router();

//Controller Of Profile
import {
  ViewProfile,
  UpdateProfile
} from "../controllers/employee/index.controller";

// Controller of Customer
import {
  ViewAllCustomers,
  AddToContactCustomer
} from "../controllers/employee/customer.controller";

// Customer of Employee
import {
  AddToContactEmployee,
  ViewAllEmployees
} from "../controllers/employee/employee.controller";

// Test Controllers
import { AddTestReport } from "../controllers/employee/test.controller";

import { isEmployee, isLoggedIn } from "../middleware/auth/index";

//All Routes Related Profile Basic
router.get("/:userid", ViewProfile);
router.put("/:userid", UpdateProfile);

// All Routes Related to Customer
router.get("/viewallcustomers/:userid", ViewAllCustomers);

// All Routes Related to Employee
router.get("/viewallemployees/:userid", ViewAllEmployees);

// All Routes Related To Chat
router.post("/addtocontact/customer", AddToContactCustomer);
router.post("/addtocontact/employee", AddToContactEmployee);

// All Routes Related To Test
router.post("/testreport", AddTestReport);

const EmployeeProfileRouter = router;
export default EmployeeProfileRouter;
