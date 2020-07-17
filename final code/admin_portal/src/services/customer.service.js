import Axios from "axios";

import config from "../util/config.json";
import { getCurrentUser } from "./auth.service";

const ViewCustomers = () => {
  const user = getCurrentUser();
  const token = user.access_token;

  return Axios.get(
    `${config.SERVER_URI}/admin/viewallcustomers/${user.user.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/form-data"
      }
    }
  );
};

export { ViewCustomers };
