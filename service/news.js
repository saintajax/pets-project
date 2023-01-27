const News = require("./schemas/news");

const getAllNews = async () => {
  const data = await News.find({});
  return data;
};

module.exports = getAllNews;
