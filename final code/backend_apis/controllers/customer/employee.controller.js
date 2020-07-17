//Imports
import Employee from "../../db-schemas/employee.schema";
import Customer from "../../db-schemas/customer.schema";

//View All Employees Information start
const ViewAllEmployees = (req, res) => {
  const { userid } = req.params;

  Employee.find({ updateProfile: true })
    .then(employee => {
      if (employee) {
        Customer.findOne({ userId: userid })
          .then(customer => {
            if (customer) {
              return res.status(200).json({
                error: null,
                employees: employee,
                employeeContacts: customer.employeeContacts
              });
            }
          })
          .catch(err => {
            return res.status(500).json({
              error: "Customer not Found",
              employees: null
            });
          });
      }
    })
    .catch(err => {
      return res.status(500).json({
        error: "Employee not Found",
        employees: null
      });
    });
};
//View All Employees Information End

// Add to Contact Employee API Start
const AddToContactEmployee = (req, res) => {
  const { customerid, employeeid } = req.body;

  Customer.findOneAndUpdate(
    { userId: customerid },
    { $push: { employeeContacts: employeeid } },
    { new: true }
  )
    .then(Updated => {
      if (Updated) {
        Employee.findOneAndUpdate(
          { userId: employeeid },
          { $push: { customerContacts: customerid } },
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
          error: "Customer Id Not Exist"
        });
      }
    })
    .catch(err => {
      return res.status(500).json({
        error: "Customer Id Not Exist"
      });
    });
};
// Add to Contact Employee API End

//Exports
export { ViewAllEmployees, AddToContactEmployee };
