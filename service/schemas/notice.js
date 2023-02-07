const { Schema, SchemaTypes, model } = require("mongoose");
const Joi = require("joi");
const gravatar = require("gravatar");
const handleSaveErrors = require("../../helpers/handleSaveErr");

const birthdayRegexp =
  /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/;
const categories = ["sell", "lost-found", "in-good-hands"];
const gender = ["male", "female"];

const noticeSchema = new Schema(
  {
    category: {
      type: String,
      enum: categories,
      required: [true, "Please, set name of category!"],
    },
    title: {
      type: String,
      required: [true, "Please, set a title!"],
    },
    breed: {
      type: String,
      required: [true, "Please, set a breed!"],
    },
    name: {
      type: String,
      required: [true, "Please, set a name!"],
    },
    location: {
      type: String,
      default: "",
    },
    sex: {
      type: String,
      enum: gender,
      required: [true, "Please, select a gender!"],
    },
    price: {
      type: Number,
      required: [
        function () {
          if (this.category === "sell") return this.category;
        },
        "Price required",
      ],
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "users",
    },
    avatarUrl: {
      type: String,
    },
    comments: {
      type: String,
      minlength: 5,
      maxlength: 120,
      default: "no comment",
    },
    birthday: {
      type: String,
      maxlength: 10,
      default: "01.01.2000",
      required: [true, "Please, set a birthday date"],
    },
  },
  { versionKey: false, timestamps: true }
);

const noticesSchema = Joi.object({
  category: Joi.string()
    .valid(...categories)
    .required(),
  title: Joi.string().required(),
  breed: Joi.string().required(),
  name: Joi.string().required(),
  location: Joi.string(),
  sex: Joi.string()
    .valid(...gender)
    .required(),
  price: Joi.number().when("category", {
    is: "sell",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  avatarUrl: Joi.string(),
  comments: Joi.string().min(5).max(120),
  birthday: Joi.string().required(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean(),
});

noticeSchema.methods.setAvatar = function (email) {
  this.avatarUrl = gravatar.url(email);
};

const Notice = model("notice", noticeSchema);

noticeSchema.post("save", handleSaveErrors);

const schemas = { noticesSchema, updateFavoriteSchema };
module.exports = { schemas, Notice };
