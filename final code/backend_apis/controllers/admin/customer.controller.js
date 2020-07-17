//Imports
import Customer from "../../db-schemas/customer.schema";

//View All Customer Information start
const ViewAllCustomers = (req, res) => {
  const { userid } = req.params;

  Customer.find({ updateProfile: true })
    .then(customer => {
      if (customer) {
        return res.status(200).json({
          error: null,
          customers: customer
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

//Exports
export { ViewAllCustomers };
