const { Schema, model, Mongoose } = require("mongoose");

const postSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  caption: {
    type: String,
    default : ""
  },
  photo: {
    type: String,
    default : ""

  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = model("Post", postSchema);
