const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  caption: {
    type: String,
  },
  photo: {
    type: String,
  },
  tags: {
    type: String,
  },
  likes: {
    type: String,
  },
  comments: [
    {
      type: String, //todo: link to users
    },
  ],
});

module.exports = model("Post", postSchema);
