const { User } = require("./schemas/user");

const findUser = async (email) => {
  const user = await User.findOne(email, { password: 0 }).populate("myPets");
  return user;
};

module.exports = { findUser };
