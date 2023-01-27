const express = require("express");
const getNews = require("../controller/news");

const router = express.Router();

router.get("/", getNews);

module.exports = router;
