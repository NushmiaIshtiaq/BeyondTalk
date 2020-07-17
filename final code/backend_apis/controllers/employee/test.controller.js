//Imports
import Employee from "../../db-schemas/employee.schema";

//Add Test Report of Employee start
const AddTestReport = (req, res) => {
  const { result, userid } = req.body;

  Employee.findOneAndUpdate(
    { userId: userid },
    { $set: { testReport: result } }
  )
    .then(employee => {
      if (employee) {
        return res.status(200).json({
          error: null
        });
      }
    })
    .catch(err => {
      return res.status(500).json({
        error: "Employees not Found",
        employees: null
      });
    });
};
//Add Test Report of Employee End

//Exports
export { AddTestReport };
