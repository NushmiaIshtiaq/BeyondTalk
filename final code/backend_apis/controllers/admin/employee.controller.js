//Imports
import Employee from "../../db-schemas/employee.schema";

//View All Employee Information start
const ViewAllEmployees = (req, res) => {
  const { userid } = req.params;

  Employee.find({ updateProfile: true })
    .then(allemployees => {
      if (allemployees) {
        return res.status(200).json({
          error: null,
          employees: allemployees
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
//View All Employee Information End

//Exports
export { ViewAllEmployees };
