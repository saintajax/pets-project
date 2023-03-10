const { User } = require("../service/schemas/user");
const { Notice } = require("../service/schemas/notice");
const { updateFavorite } = require("../service/user");
const HttpError = require("../helpers/httpErrors");
const upload = require("../helpers/cloudinary");

const getAllNotices = async (req, res) => {
  try {
    const { category, q = "", page = 1, limit = 8 } = req.query;
    const filter = { title: { $regex: q, $options: "i" } };
    if (category) {
      filter.category = category;
    }
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
      owner: user._id,
    });

    if (req.file) {
      const { path: tempDir } = req.file;
      const newPhoto = await upload(tempDir);
      notice.avatarUrl = newPhoto.secure_url;
    } else {
      notice.setAvatar(req.user.email);
    }

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
  let { user, query } = req;
  const { _id } = user;
  let { category, q = "", page = 1, limit = 8 } = query;
  if (category) {
    filter.category = category;
  }

  limit = parseInt(limit) > 8 ? 8 : parseInt(limit);
  page = parseInt(page);
  const skip = (page - 1) * limit;

  const allFavNotice = await User.find(
    { _id },
    { favorite: 1, _id: 0 }
  ).populate("favorite");

  const actualFavId = [];
  allFavNotice[0].favorite.map((item) => {
    if (user.favorite.includes(item._id.toString())) {
      actualFavId.push(item._id);
    }
  });

  let counter = actualFavId.length;

  if (counter !== user.favorite.length) {
    await updateFavorite(_id, actualFavId);
  }

  let totalPage = 1;

  if (page > totalPage) {
    next(HttpError(400, `Not Found, ${page - 1} is last page`));
  }
  const dbUser = await User.find(
    { _id },
    { favorite: { $slice: [skip, limit] } }
  ).populate({ path: "favorite", match: { title: { $regex: q } } });
  const favorite = dbUser[0].favorite;

  counter = favorite.length;
  if (counter !== 0) {
    totalPage =
      counter % limit !== 0 ? Math.floor(counter / limit) + 1 : counter / limit;
  }

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
  const { category, page = 1, limit = 8, q } = req.query;

  const filter = {
    $and: [{ owner }],
  };

  if (category) {
    filter.$and.push({ category: { $eq: category } });
  }

  if (q) {
    filter.$and.push({
      $or: [
        { title: { $regex: `${q}`, $options: "i" } },
        { breed: { $regex: `${q}`, $options: "i" } },
        { location: { $regex: `${q}`, $options: "i" } },
      ],
    });
  }
  const skip = (page - 1) * limit;
  let totalPage = 1;

  let counter = await Notice.find(filter).count();

  if (counter !== 0) {
    totalPage =
      counter % limit !== 0 ? Math.floor(counter / limit) + 1 : counter / limit;
  }
  let data = [];

  if (page > totalPage) {
    next(HttpError(400, `Not Found, ${totalPage} is last page`));
  }

  data = await Notice.find(filter)
    .sort({ _id: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

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
