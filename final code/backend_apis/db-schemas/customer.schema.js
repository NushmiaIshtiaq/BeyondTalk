const mongoose = require("mongoose");
//Define a schema
const Schema = mongoose.Schema;

const schemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
};

const CustomerSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    contactNo: String,
    mailingAddress: String,
    about: String,
    imageUrl: String,
    updateProfile: Boolean,
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    employeeContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  schemaOptions
);

const Customer = mongoose.model("Customer", CustomerSchema);

export default Customer;
