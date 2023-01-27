const { Schema, model } = require("mongoose");
const { handleSaveErr } = require("../../helpers/handleSaveErr");

const friendsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageSrc: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    workingDays: {
      type: Array,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },

  { versionKey: false, timestamps: true }
);

friendsSchema.post("save", handleSaveErr);

const Friend = model("friend", friendsSchema);

module.exports = Friend;
