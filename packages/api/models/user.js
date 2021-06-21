const mongoose = require("mongoose");
const { createHmac } = require("crypto");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    followers: {
      type: Number,
    },
    followings: {
      type: Number,
    },
    salt: {
      type: String,
    },
    encrypted_password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    // todo: add saved posts
  },
  { timestamps: true }
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.encrypted_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  securePassword: function (plainPassword) {
    if (!plainPassword) {
      return "";
    }
    try {
      const secret = this.salt;
      return createHmac("sha256", secret).update(plainPassword).digest("hex");
    } catch (error) {
      return "";
    }
  },
  authenticate: function (plainPassword) {
    return this.encrypted_password === this.securePassword(plainPassword);
  },
};

module.exports = mongoose.model("User", userSchema);
