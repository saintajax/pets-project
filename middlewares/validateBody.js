// const validateBody = (schema) => {
//   const fn = (req, res, next) => {
//     const { error } = schema.validate(req.body);
//     if (error) {
//       error.status = 400;
//       next(error);
//     }
//     next();
//   };

//   return fn;
// };
// module.exports = { validateBody };
const Joi = require("joi");
const { ValidationError } = require("../helpers/authErrors");

const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.validateAsync(req.body, {
        abortEarly: false,
      });
      req.body = validated;
      next();
    } catch (err) {
      next(
        new ValidationError(
          err.message,
          err.details.reduce(
            (acc, { message, path: [path] }) => ({ ...acc, [path]: message }),
            {}
          )
        )
      );
    }
  };
};
module.exports = { validateBody };
