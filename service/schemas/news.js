const { Schema, model } = require("mongoose");
const handleSaveErr = require("../../helpers/handleSaveErr");

const newsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    url: {
      type: String,
      required: [true, "Url is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },

  { versionKey: false, timestamps: true }
);

newsSchema.post("save", handleSaveErr);

const News = model("news", newsSchema);

module.exports = News;
