const Friend = require("./schemas/friend");

const getAllFriends = async () => {
  const data = await Friend.find({});
  return data;
};

module.exports = getAllFriends;
