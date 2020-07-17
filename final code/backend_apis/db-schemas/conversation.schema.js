const mongoose = require("mongoose");
//Define a schema
const Schema = mongoose.Schema;

const schemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
};

const ConversationSchema = new Schema(
  {
    userIdOne: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    anotherUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    conversation: [
      {
        message: String,
        datetime: String,
        sender: {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          name: String,
          gender: String,
        },
      },
    ],
  },
  schemaOptions
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
