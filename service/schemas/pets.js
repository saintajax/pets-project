const mongoose = require("mongoose");
const Joi = require("joi");

const petsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for your pet"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Set date of birth of your pet"],
  },
  breed: {
    type: String,
    required: [true, "Set breed for your pet"],
  },
  comments: {
    type: String,
    required: [true, "Add comment about your pet"],
  },
  photoURL: String,
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "users",
  },
});

const Pets = mongoose.model("pets", petsSchema);

const petSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(16)
    .pattern(/^[a-zA-Zа-яА-яіїєґЇІЄҐ]{2,16}$/)
    .required(),
  breed: Joi.string()
    .min(2)
    .max(16)
    .pattern(/^[a-zA-Zа-яА-яіїєґЇІЄҐ]{2,16}$/)
    .required(),
  dateOfBirth: Joi.date().required(),
  comments: Joi.string().min(8).max(120).required(),
});

module.exports = {
  Pets,
  petSchema,
};
