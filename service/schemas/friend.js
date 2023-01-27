const { Schema, model } = require("mongoose");
const handleSaveErr = require("../../helpers/handleSaveErr");

const friendsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    addressUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    workDays: {
      type: Array,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },

  { versionKey: false, timestamps: true }
);

friendsSchema.post("save", handleSaveErr);

const Friend = model("friends", friendsSchema);

module.exports = Friend;
