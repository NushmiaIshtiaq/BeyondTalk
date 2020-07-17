import Axios from "axios";
import config from "../util/config.json";

const GenerateReport = () => {
  var result = Axios.get(`${config.PREDICTION_URI}/index_get_data`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return result;
};

export { GenerateReport };
