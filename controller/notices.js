const { User } = require("../service/schemas/user");
const { Notice } = require("../service/schemas/notice");
const HttpError = require("../helpers/httpErrors");

const updateFavorites = async (req, res, next) => {
  const { id } = req.user;
  const { id: noticeId } = req.params;

  //   let notice = await Notice.findById(id);
  //   if (notice) {
  //     next(HttpError(404));
  //     return;
  //   }

  let user = await User.findById(id);
  const alreadyAdded = user.favorite.includes(noticeId);

  if (alreadyAdded) {
    next(HttpError(409, `Notice ${noticeId} already in favorites`));
    return;
  }
  user = await User.findByIdAndUpdate(
    id,
    { $push: { favorite: noticeId } },
    { new: true }
  );
  res.status(200).json({
    code: 200,
    status: "success",
    message: "Notice added to favorite",
    data: {
      noticeId,
    },
  });
};

const getOwnFavoriteNotices = async (req, res, next) => {
  const { _id } = req.user;
  const { page = 1, limit = 8 } = req.query;
  //   const skip = (page - 1) * limit;

  const counter = (await User.findById(_id)).favorite.length;

  let totalPage = 1;

  if (counter !== 0) {
    totalPage =
      counter % limit !== 0 ? Math.floor(counter / limit) + 1 : counter / limit;
  }

  if (page > totalPage) {
    next(HttpError(400, `Not Found, ${page} is last page`));
  }

  const user = await User.find({ _id }, { favorite: 1, _id: 0 });
  const favorite = user[0].favorite;

  res.status(200).json({
    code: 200,
    status: "success",
    data: {
      favorite,
      page,
      totalPage,
      counter,
    },
  });
};

const deleteFavorites = async (req, res, next) => {
  const { id } = req.user;
  const { id: noticeId } = req.params;

  let user = await User.findById(id);
  const isExist = user.favorite.includes(noticeId);

  if (!isExist) {
    next(
      HttpError(409, `There are no notice with id ${noticeId} in favorites`)
    );
  }

  user = await User.findByIdAndUpdate(
    id,
    { $pull: { favorite: noticeId } },
    { new: true }
  );
  res.status(200).json({
    status: 200,
    message: "Your notice has been deleted from favorites",
    data: {
      noticeId,
    },
  });
};

module.exports = { updateFavorites, deleteFavorites, getOwnFavoriteNotices };
