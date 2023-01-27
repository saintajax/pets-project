const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
    required: [true, "Enter your name"],
  },
  cityRegion: {
    type: String,
    // required: [true, "Location is required example: Brovary, Kyiv"],
  },
  phone: {
    type: String,
    // required: [true, "Enter mobile phone number +380xxxxxxxxx"],
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
  favorite: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: 'notice',
  },
  token: String,
  avatarURL: String,
});
userSchema.pre("save", async function () {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
const User = mongoose.model("users", userSchema);

module.exports = {
  User,
};
