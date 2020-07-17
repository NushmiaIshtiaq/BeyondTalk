const express = require("express");
const router = express.Router();

// Controller of Customer
import { ViewAllCustomers } from "../controllers/admin/customer.controller";

// Customer of Employee
import { ViewAllEmployees } from "../controllers/admin/employee.controller";

import { isAdmin, isLoggedIn } from "../middleware/auth/index";

// All Routes Related to Customer
router.get("/viewallcustomers/:userid", ViewAllCustomers);

// All Routes Related to Employee
router.get("/viewallemployees/:userid", ViewAllEmployees);

const AdminRouter = router;
export default AdminRouter;
