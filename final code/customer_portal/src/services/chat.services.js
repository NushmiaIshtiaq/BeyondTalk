import Axios from "axios";

import config from "../util/config.json";
import { getCurrentUser } from "./auth.service";

const AddConversationLog = (conversationdata) => {
  const user = getCurrentUser();
  const token = user.access_token;

  const data = {
    conversationdata,
  };

  return Axios.post(`${config.SERVER_URI}/chat/addconversationlog`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

const FetchAllUserGender = () => {
  const user = getCurrentUser();
  const token = user.access_token;

  return Axios.get(`${config.SERVER_URI}/chat/fetchallusergender`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/form-data",
    },
  });
};

export { AddConversationLog, FetchAllUserGender };
