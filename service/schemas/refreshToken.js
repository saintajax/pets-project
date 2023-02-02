const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "users",
  },
});

const RefreshTokens = mongoose.model("refreshTokens", refreshTokenSchema);

module.exports = {
  RefreshTokens,
};
