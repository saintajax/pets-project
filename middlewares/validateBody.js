
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
