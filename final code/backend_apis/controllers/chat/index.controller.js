//Imports
import Employee from "../../db-schemas/employee.schema";
import Customer from "../../db-schemas/customer.schema";
import Conversation from "../../db-schemas/conversation.schema";
import User from "../../db-schemas/user.schema";

//Add Conversation Log Start
const AddConversationLog = (req, res) => {
  const { conversationdata } = req.body;
  let error = false;
  conversationdata.map(async (convo) => {
    const { userIdOne, anotherUserId, conversation } = convo;
    const old_conversation = await Conversation.findOne({
      userIdOne,
      anotherUserId,
    });

    if (old_conversation) {
      old_conversation.conversation = conversation;
      old_conversation.save((err, addedConversation) => {
        if (err) {
          error = true;
        }
      });
    } else {
      const newConversation = new Conversation(convo);
      newConversation.save((err, addedConversation) => {
        if (err) {
          error = true;
        }
      });
    }
  });

  if (error) {
    return res.status(500).json({
      error: "Conversation Not Added ",
    });
  } else {
    return res.status(200).json({
      error: null,
    });
  }
};
//Add Conversation Log End

//All Conversation Log data Fetching API Start

const FetchAllConversationLog = (req, res) => {
  Conversation.find({})
    .then((conversation) => {
      if (conversation) {
        return res.status(200).json({
          error: null,
          conversations: conversation,
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: "Conversation not Found",
        employees: null,
      });
    });
};
//All Conversation Log data Fetching API End

//Fetch All User Gender Information start
const FetchAllUsersGender = (req, res) => {
  Customer.find({}, { userId: 1, gender: 1 })
    .then((customer) => {
      if (customer) {
        Employee.find({}, { userId: 1, gender: 1 })
          .then((employee) => {
            if (employee) {
              let userGender = [];
              for (let index = 0; index < employee.length; index++) {
                const element = {
                  userId: employee[index].userId,
                  gender: employee[index].gender,
                };
                userGender.push(element);
              }

              for (let index = 0; index < customer.length; index++) {
                const element = {
                  userId: customer[index].userId,
                  gender: customer[index].gender,
                };
                userGender.push(element);
              }
              return res.status(200).json({
                error: null,
                userGenderArray: userGender,
              });
            }
          })
          .catch((err) => {
            return res.status(500).json({
              error: "Users not Found",
              employees: null,
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: "Users not Found",
        employees: null,
      });
    });
};
//Fetch All User Gender Information End

//Fetch All User  Information start
const FetchAllUsers = (req, res) => {
  User.find({}, "role")
    .then((users) => {
      if (users) {
        const employee = users.filter((user) => user.role == "employee");
        const customer = users.filter((user) => user.role == "customer");

        return res.status(200).json({
          error: null,
          employees: employee,
          customers: customer,
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: "Users not Found",
        employees: null,
      });
    });
};
//Fetch All User Information End

//Exports
export {
  AddConversationLog,
  FetchAllConversationLog,
  FetchAllUsers,
  FetchAllUsersGender,
};
