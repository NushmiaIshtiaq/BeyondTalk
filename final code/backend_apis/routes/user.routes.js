const express = require("express");
const router = express.Router();
import { isLoggedIn } from "../middleware/auth";

import {
  Login,
  Register,
  ForgotPassword,
  GetResetPassword,
  PostResetPassword
} from "../controllers/user/index.controller";

router.post("/login", Login);
router.post("/register", Register);
router.post("/forgot-password", ForgotPassword);
router.get("/reset-password/:token", GetResetPassword);
router.post("/reset-password/:token", PostResetPassword);

const UserRouter = router;

export default UserRouter;
