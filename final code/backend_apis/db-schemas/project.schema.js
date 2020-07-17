const mongoose = require("mongoose");
//Define a schema
const Schema = mongoose.Schema;

const schemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
};

const ProjectSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    startDate: Date,
    endDate: Date,
    description: String,
    budget: String,
    duration: Number
  },
  schemaOptions
);

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
