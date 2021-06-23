const mongoose = require("mongoose");
const { createHmac } = require("crypto");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    profile_photo: {
      data: Buffer,
      contentType: String,
      default : ""
    },
    followers: {
      type: Number,
      default: 0,
    },
    followings: {
      type: Number,
      default: 0,
    },
    salt: {
      type: String,
    },
    encrypted_password: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    // todo: add saved posts collection
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
