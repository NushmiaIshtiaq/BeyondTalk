//Imports
import Employee from "../../db-schemas/employee.schema";
import Customer from "../../db-schemas/customer.schema";

//View All Customer Information start
const ViewAllCustomers = (req, res) => {
  const { userid } = req.params;

  Customer.find({ updateProfile: true })
    .then(customer => {
      if (customer) {
        Employee.findOne({ userId: userid })
          .then(employee => {
            if (employee) {
              return res.status(200).json({
                error: null,
                customers: customer,
                customerContacts: employee.customerContacts
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
        error: "Customer not Found",
        employees: null
      });
    });
};
//View All Customer Information End

// Add to Contact Customer API Start
const AddToContactCustomer = (req, res) => {
  const { customerid, employeeid } = req.body;

  Employee.findOneAndUpdate(
    { userId: employeeid },
    { $push: { customerContacts: customerid } },
    { new: true }
  )
    .then(Updated => {
      if (Updated) {
        Customer.findOneAndUpdate(
          { userId: customerid },
          { $push: { employeeContacts: employeeid } },
          { new: true }
        )
          .then(Updated => {
            if (Updated) {
              return res.status(200).json({
                error: null
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
export { ViewAllCustomers, AddToContactCustomer };
