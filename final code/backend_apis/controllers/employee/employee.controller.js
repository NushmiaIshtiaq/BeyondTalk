//Imports
import Employee from "../../db-schemas/employee.schema";

//View All Employee Information start
const ViewAllEmployees = (req, res) => {
  const { userid } = req.params;

  Employee.find({ updateProfile: true })
    .then(allemployees => {
      if (allemployees) {
        let newEmployees = allemployees.filter(emp => {
          return emp.userId != userid;
        });
        Employee.findOne({ userId: userid })
          .then(employee => {
            if (employee) {
              return res.status(200).json({
                error: null,
                employees: newEmployees,
                employeeContacts: employee.employeeContacts
              });
            }
          })
          .catch(err => {
            return res.status(500).json({
              error: "Employee not Found",
              employees: null
            });
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

// Add to Contact Employee API Start
const AddToContactEmployee = (req, res) => {
  const { userid, employeeid } = req.body;

  Employee.findOneAndUpdate(
    { userId: userid },
    { $push: { employeeContacts: employeeid } },
    { new: true }
  )
    .then(Updated => {
      if (Updated) {
        Employee.findOneAndUpdate(
          { userId: employeeid },
          { $push: { employeeContacts: userid } },
          { new: true }
        )
          .then(Updated => {
            if (Updated) {
              return res.status(200).json({
                error: null
              });
            } else {
              return res.status(500).json({
                error: "Employee Id Not Exist"
              });
            }
          })
          .catch(err => {
            return res.status(500).json({
              error: "Employee Id Not Exist"
            });
          });
      } else {
        return res.status(500).json({
          error: "Employee Id Not Exist"
        });
      }
    })
    .catch(err => {
      return res.status(500).json({
        error: "Employee Id Not Exist"
      });
    });
};
// Add to Contact Customer API End

//Exports
export { ViewAllEmployees, AddToContactEmployee };
