const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyUser,
  repeatEmail,
} = require("../service/auth");
const Joi = require("joi");

const postRegister = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .min(10)
      .max(63)
      .pattern(
        /^([a-zA-Z0-9]{1}[\w-\.]{0,}[a-zA-Z0-9]{1})+@([\w-]+\.)+[\w-]{2,4}$/
      )
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{7,32}$"))
      .required(),
    name: Joi.string().alphanum().min(3).max(30).required(),
    cityRegion: Joi.string().pattern(
      /^([A-Z]{1}[\w-]{1,}[a-z]{1})+\,\s([A-Z]{1}[\w-]{1,}[a-z]{1})$/
    ),
    phone: Joi.string().pattern(/^\+380[0-9]{9}$/),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { email, name } = req.body;
  await registerUser( req.body);
  res.status(201).json({ user: { email, name } });
};

const verifyEmailController = async (req, res, next) => {
  const { verificationToken } = req.params;
  await verifyUser(verificationToken);
  res.status(200).json({ message: "Verification successful" });
};

  const repeatEmailController = async (req, res, next) => {
    const { email } = req.body;
    await repeatEmail(email);
    res.status(200).json({ message: "Verification email sent" });
  };

const postLogin = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error });
  }

  const { password, email } = req.body;
  const result = await loginUser(password, email);
  const {
    token,
    user: { name, cityRegion, phone, favorite, avatarURL },
  } = result;
  res.status(200).json({ token, user: { email, name, cityRegion, phone, favorite, avatarURL} });
};

const postLogout = async (req, res, next) => {
  const { user } = req;
  await logoutUser(user._id);
  res.status(204).json({ message: "Logged out" });
};
const getCurrent = async (req, res, next) => {
  const { user } = req;
  const { email, name, cityRegion, phone, favorite, avatarURL } = await getCurrentUser(user._id);
  res.status(200).json({ email, name, cityRegion, phone, favorite, avatarURL });
};

module.exports = {
  postRegister,
  postLogin,
  postLogout,
  getCurrent,
  verifyEmailController,
  repeatEmailController,
};
