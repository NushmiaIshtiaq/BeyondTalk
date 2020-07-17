import Axios from "axios";

import config from "../util/config.json";
import { getCurrentUser } from "./auth.service";

const ViewCustomers = () => {
  const user = getCurrentUser();
  const token = user.access_token;

  return Axios.get(
    `${config.SERVER_URI}/employee/viewallcustomers/${user.user.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/form-data"
      }
    }
  );
};

const AddCustomer = customerid => {
  const user = getCurrentUser();
  const token = user.access_token;

  const employeeid = user.user.id;

  const data = {
    employeeid,
    customerid
  };

  return Axios.post(
    `${config.SERVER_URI}/employee/addtocontact/customer`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
};

export { ViewCustomers, AddCustomer };
