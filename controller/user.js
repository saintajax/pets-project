const { User } = require("../service/schemas/user");
const { findUser } = require("../service/user");

const currentUser = async (req, res) => {
  const { email } = req.user;
  const result = await findUser(email);
  res.json({
    status: "success",
    code: 200,
    data: {
      result,
    },
  });
};

module.exports = { currentUser };
