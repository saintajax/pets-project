const catchWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
};

module.exports = { catchWrapper };
