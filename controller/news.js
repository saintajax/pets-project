const getAllNews = require("../service/news");

const getNews = async (_, res, next) => {
  try {
    const result = await getAllNews();
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports = getNews;
