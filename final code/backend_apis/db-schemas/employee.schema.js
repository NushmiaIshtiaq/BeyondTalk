const mongoose = require("mongoose");
//Define a schema
const Schema = mongoose.Schema;

const schemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
};

const EmployeeSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    contactNo: String,
    mailingAddress: String,
    permenantAddress: String,
    age: Number,
    cnic: String,
    designation: String,
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male"
    },
    about: String,
    imageUrl: String,
    joiningDate: Date,
    updateProfile: Boolean,
    testReport: {
      extrovert: Number,
      introvert: Number,
      sensing: Number,
      intuition: Number,
      thinking: Number,
      feeling: Number,
      judging: Number,
      perceiving: Number,
      personType: { title: String, percentage: String, description: String },
      testGiven: Boolean
    },

    employeeContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    customerContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  schemaOptions
);

const Employee = mongoose.model("Employee", EmployeeSchema);

export default Employee;
