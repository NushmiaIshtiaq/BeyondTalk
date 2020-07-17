const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//Define a schema
const Schema = mongoose.Schema;

const schemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
};

const UserSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    role: {
      type: String,
      enum: ["employee", "customer", "admin"],
      default: "admin"
    },
    reset_token: String
  },
  schemaOptions
);

UserSchema.pre("save", function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model("User", UserSchema);

export default User;
