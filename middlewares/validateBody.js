const Joi = require("joi");
const { ValidationError } = require("../helpers/authErrors");


const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.validateAsync(req.body);
      req.body = validated;
      next();
    } catch (err) {
      next(new ValidationError(err));
    }
  };
};
module.exports = { validateBody };
