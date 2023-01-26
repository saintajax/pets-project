const jwt = require("jsonwebtoken");
const { User } = require("../service/schemas/user");
const {
  NotAutorizedError

} = require("../helpers/httpErrors");

const authMiddleware = async (req, res, next) => {
  try {

  const {authorization} = req.headers;
  if (!authorization) {
    next(new NotAutorizedError("Not authorized"));
  }
  const [, token] = authorization.split(' ');
  if (!token) {
    next(new NotAutorizedError("Not authorized"));
  }
    const tokenUser = jwt.decode(token, process.env.JWT_SECRET);
    const dbUser = await User.findById(tokenUser._id);
  
    if (!dbUser) next(new NotAutorizedError("Not authorized"));
    if (dbUser.token !== token) next(new NotAutorizedError("Not authorized"));

    req.token = token;
    req.user = dbUser;
    
    next();
  } catch (err) {
    next(new NotAutorizedError("Not authorized"));
  }
};

module.exports = {
  authMiddleware
};