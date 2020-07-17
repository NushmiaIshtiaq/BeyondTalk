const passport = require("passport");

import isAdmin from "./admin.middleware";
import isCustomer from "./customer.middleware";
import isEmployee from "./employee.middleware";

const isLoggedIn = passport.authenticate("jwt", { session: false });

export { isAdmin, isCustomer, isEmployee, isLoggedIn };
