const { User } = require("../service/schemas/user");
const { Notice } = require("../service/schemas/notice");
const HttpError = require("../helpers/httpErrors");
const upload = require("../middlewares/upload");

const getAllNotices = async (req, res) => {
  try {
    const { category = "sell", q = "", page = 1, limit = 8 } = req.query;
    const filter = { title: { $regex: q, $options: "i" }, category: category };
    const notices = await Notice.find(filter)
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalCount = await Notice.find(filter).count();
    res
      .json({ status: "success", code: 200, data: { notices, totalCount } })
      .end();
  } catch (error) {
    res.status(500).json({ message: "Something wrong in db" + error });
  }
};

const getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;
    const notices = await Notice.find({ _id: id });
    res.json({ status: "success", code: 200, data: notices }).end();
  } catch (error) {
    res.status(500).json({ message: "Something wrong in db" + error });
  }
};

const addNotice = async (req, res) => {
  try {
    const user = req.user;
    const {
      title,
      name,
      birthday,
      breed,
      sex,
      location,
      price,
      comments,
      category,
    } = req.body;

    if (req.file) {
      const { path: tempDir } = req.file;
      const newPhoto = await upload(tempDir);
      avatar = newPhoto.secure_url;
    } else {
      avatar = req.user.avatarURL;
    }

    const notice = new Notice({
      title,
      name,
      birthday,
      breed,
      sex,
      location,
      price,
      comments,
      category,
      avatarUrl: avatar,
      owner: user._id,
    });
    await notice.save();
    res.json({ status: "created", code: 201, data: { notice } }).end();
  } catch (error) {
    res.status(500).json({ message: "Something wrong in db: " + error });
  }
};

const updateFavorites = async (req, res, next) => {
  let { user } = req;
  const { id } = req.user;
  const { id: noticeId } = req.params;

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
  let { user } = req;
  const { id } = req.user;
  const { id: noticeId } = req.params;

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

const getOwnNotice = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 8, q } = req.query;
  const skip = (page - 1) * limit;

  const isUndefined = Boolean(q);

  let totalPage = 1;
  let counter = 1;

  if (!isUndefined) {
    counter = await Notice.find({ owner }).count();
  } else {
    counter = await Notice.find({
      $and: [
        { owner },
        {
          $or: [
            { title: { $regex: `${q}`, $options: "i" } },
            { location: { $regex: `${q}`, $options: "i" } },
          ],
        },
      ],
    }).count();
  }

  if (counter !== 0) {
    totalPage =
      counter % limit !== 0 ? Math.floor(counter / limit) + 1 : counter / limit;
  }
  let data = [];

  if (page > totalPage) {
    next(HttpError(400, `Not Found, ${page} is last page`));
  }

  if (isUndefined) {
    data = await Notice.find(
      {
        $and: [
          { owner },
          {
            $or: [
              { title: { $regex: `${q}`, $options: "i" } },
              { location: { $regex: `${q}`, $options: "i" } },
            ],
          },
        ],
      },
      "",
      { skip: Number(skip), limit: Number(limit) }
    );
  } else {
    data = await Notice.find({ owner }, "", {
      skip: Number(skip),
      limit: Number(limit),
    });
  }

  res.status(200).json({
    code: 200,
    status: "success",
    data,
    page: Number(page),
    totalPage,
    counter,
  });
};

const deleteOwnNoticeById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;

  const notice = await Notice.findById(id);

  if (notice.owner.toString() === owner.toString()) {
    const result = await Notice.findByIdAndRemove(id);
    res.status(200).json({ code: 200, status: "Notice deleted", data: result });
  }
  throw HttpError(404);
};

module.exports = {
  updateFavorites,
  deleteFavorites,
  getOwnFavoriteNotices,
  getAllNotices,
  getNoticeById,
  addNotice,
  getOwnNotice,
  deleteOwnNoticeById,
};
