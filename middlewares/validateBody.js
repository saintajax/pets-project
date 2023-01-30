const Joi = require("joi");

const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.validateAsync(req.body);
      req.body = validated;
      next();
    } catch (err) {
      err.status(400);
      next(err);
    }
  };
};
module.exports = { validateBody };
