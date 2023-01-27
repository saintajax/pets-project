const getAllFriends = require("../service/friends");

const getFriends = async (_, res, next) => {
  try {
    const result = await getAllFriends();
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        result,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = getFriends;
