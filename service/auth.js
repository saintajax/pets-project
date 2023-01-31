const { User } = require("./schemas/user");
const {
  NotAutorizedError,
  RegistrationConflictError,
  VerificationError,
} = require("../helpers/authErrors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
require("dotenv").config();
const nodemailer = require("nodemailer");
const uuid = require("uuid");

const sendVerification = async (email, verificationToken) => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_EMAIL_PW,
    },
  });
  await transport.sendMail({
    from: process.env.MY_EMAIL,
    to: email,
    subject: "Petly verification",
    text: `Plz confirm your email ${process.env.BASE_URL}/api/auth/verify/${verificationToken}`,
  });
};

const registerUser = async (body) => {
  const { password, email, name, cityRegion, phone } = body;
  const avatarURL = gravatar.url(email);
  const verificationToken = uuid.v4();
  const user = new User({
    password,
    email,
    name,
    cityRegion,
    phone,
    avatarURL,
    verificationToken,
  });
  if (!user) throw new RegistrationConflictError("Email in use");
  const result = await user.save();
  if (!result) throw new RegistrationConflictError("Email in use");
  await sendVerification(email, verificationToken);
  return result;
};

const repeatEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new RegistrationConflictError("User doesn't exist");
  if (user.verify)
    throw new RegistrationConflictError("Verification has already been passed");
  await sendVerification(email, user.verificationToken);
  return;
};

const verifyUser = async (verificationToken) => {
  const verified = await User.findOneAndUpdate(
    { verificationToken },
    { verify: true, verificationToken: null }
  );
  if (!verified) throw new VerificationError("User not found");
  return;
};

const loginUser = async (password, email) => {
  const login = await User.findOne({ email, verify: true });
  if (!login || !(await bcrypt.compare(password, login.password)))
    throw new NotAutorizedError("Email or password is wrong");
  const token = await jwt.sign(
    {
      _id: login._id,
    },
    process.env.SECRET_KEY
  );
  const user = await User.findOneAndUpdate({ _id: login._id }, { token });
  return { token, user };
};

const updateUser = async (userId, body) => {
  const { name, email, phone, cityRegion, birthday } = body;
  const result = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: { name, email, cityRegion, phone, birthday },
    },
    {
      new: true,
      fields: {
        password: 0,
        __v: 0,
        verify: 0,
        verificationToken: 0,
        avatarURL: 0,
      },
    }
  );
  return result;
};

const logoutUser = async (id) => {
  await User.findOneAndUpdate({ _id: id }, { token: null });
  return;
};
const getCurrentUser = async (id) => {
  return await User.findOne({ _id: id });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUser,
  verifyUser,
  repeatEmail,
};
