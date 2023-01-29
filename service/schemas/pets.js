const mongoose = require("mongoose");

const petsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Set name for your pet'],
      },
      dateOfBirth: {
        type: Date,
        required: [true, 'Set date of birth of your pet'],
      },
      breed: {
        type: String,
        required: [true, 'Set breed for your pet'],
      },
      comments: {
        type: String,
      },
      photoURL: String,
      owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users',
      }
  });

  const Pets = mongoose.model('contacts', petsSchema);

  module.exports = {
    Pets
  }