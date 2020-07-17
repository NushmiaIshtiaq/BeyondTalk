const express = require("express");
const router = express.Router();

//Controller Of Chat Conversation Log
import {
  AddConversationLog,
  FetchAllConversationLog,
  FetchAllUsers,
  FetchAllUsersGender,
} from "../controllers/chat/index.controller";

import { isCustomer, isLoggedIn } from "../middleware/auth/index";

//All Routes Related Conversation
router.post("/addconversationlog", AddConversationLog);
router.get("/fetchallconversations", FetchAllConversationLog);
router.get("/fetchalluser", FetchAllUsers);
router.get("/fetchallusergender", FetchAllUsersGender);

const ChatLogRouter = router;
export default ChatLogRouter;
