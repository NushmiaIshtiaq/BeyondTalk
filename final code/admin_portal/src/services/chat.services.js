import Axios from "axios";

import config from "../util/config.json";
import { getCurrentUser } from "./auth.service";

const FetchAllConversation = () => {
  const user = getCurrentUser();
  const token = user.access_token;

  return Axios.get(`${config.SERVER_URI}/chat/fetchallconversations`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/form-data",
    },
  });
};

const FetchAllUser = () => {
  const user = getCurrentUser();
  const token = user.access_token;

  return Axios.get(`${config.SERVER_URI}/chat/fetchalluser`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/form-data",
    },
  });
};

export { FetchAllConversation, FetchAllUser };
// ant-btn ant-btn-primary ant-btn-round
