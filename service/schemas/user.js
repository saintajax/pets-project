const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  name: {
    type: String,
  },
  cityRegion: {
    type: String,
  },
  phone: {
    type: String,
  },
  birthday: {
    type: Date,
    default: 0,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
  pets: [{ type: mongoose.SchemaTypes.ObjectId, ref: "pets" }],
  favorite: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "notice",
  },
  // token: String,

  avatarURL: String,
});
userSchema.pre("save", async function () {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
const User = mongoose.model("users", userSchema);

const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(10)
    .max(63)
    .pattern(
      /^([a-zA-Z0-9]{1}[\w-\.]{0,}[a-zA-Z0-9]{1})+@([\w-]+\.)+[\w-]{2,4}$/
    )
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{7,32}$")).required(),
  name: Joi.string().alphanum().min(3).max(30).message("Enter your name min:3, max:30"),
  cityRegion: Joi.string().pattern(
    /^([a-zA-Zа-яА-яіїєґЇІЄҐ]{1}[a-zA-Zа-яА-яіїєґЇІЄҐ\w-\s]{1,}[a-zа-яіїєґЇІЄҐ]{1})+\,\s([a-zA-Zа-яА-яіїєґЇІЄҐ]{1}[a-zA-Zа-яА-яіїєґЇІЄҐ\w-\s]{1,}[a-zа-яіїєґЇІЄҐ]{1})$/
  ).message("Enter city, region format: Brovary, Kyiv"),
  phone: Joi.string().pattern(/^\+380[0-9]{9}$/).message("Enter phone number format: +380xxxxxxxxx"),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(10)
    .max(63)
    .pattern(
      /^([a-zA-Z0-9]{1}[\w-\.]{0,}[a-zA-Z0-9]{1})+@([\w-]+\.)+[\w-]{2,4}$/
    )
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{7,32}$")).required(),
});

const updateSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .min(10)
    .max(63)
    .pattern(
      /^([a-zA-Z0-9]{1}[\w-\.]{0,}[a-zA-Z0-9]{1})+@([\w-]+\.)+[\w-]{2,4}$/
    ),
  name: Joi.string().alphanum().min(3).max(30).message("Enter your name min:3, max:30"),
  cityRegion: Joi.string().pattern(
    /^([a-zA-Zа-яА-яіїєґЇІЄҐ]{1}[a-zA-Zа-яА-яіїєґЇІЄҐ\w-\s]{1,}[a-zа-яіїєґЇІЄҐ]{1})+\,\s([a-zA-Zа-яА-яіїєґЇІЄҐ]{1}[a-zA-Zа-яА-яіїєґЇІЄҐ\w-\s]{1,}[a-zа-яіїєґЇІЄҐ]{1})$/
  ).message("Enter city, region format: Brovary, Kyiv"),
  phone: Joi.string().pattern(/^\+380[0-9]{9}$/).message("Enter phone number format: +380xxxxxxxxx"),
  birthday: Joi.date(),

});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
}).required();

module.exports = {
  User,
  registerSchema,
  loginSchema,
  updateSchema,
  refreshTokenSchema,
};
