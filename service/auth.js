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
const { RefreshTokens } = require("./schemas/refreshToken");
const HttpError = require("../helpers/httpErrors");

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
    text: `Plz confirm your email https://petly-one.netlify.app/verification/${verificationToken}`,
  });
};

const registerUser = async (body) => {
  const { password, email, name, cityRegion, phone } = body;
  const dbUser = await User.findOne({ email });
  if (dbUser) throw new RegistrationConflictError("Email in use");
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
  const result = await user.save();
  try {
    await sendVerification(email, verificationToken);
  } catch (err) {
    console.log(err);
    return result;
  }
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
  const login = await User.findOne({ email }).populate("pets");

  if (!login || !(await bcrypt.compare(password, login.password)))
    throw new NotAutorizedError("Email or password is wrong");
  const token = await jwt.sign(
    {
      _id: login._id,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: 5 * 24 * 60 * 60,
    }
  );
  if (!login.verify) {
    throw HttpError(401, "Please, confirm your email");
  }
  const refreshToken = new RefreshTokens({
    refreshToken: uuid.v4(),
    expiresIn: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
    userId: login._id,
  });
  const refreshTokens = await refreshToken.save();
  return {
    accessToken: token,
    refreshToken: refreshTokens.refreshToken,
    user: login,
  };
};

const updateUser = async (userId, body, avatarURL) => {
  const { name, email, phone, cityRegion, birthday } = body;

  const result = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: { name, email, cityRegion, phone, birthday, avatarURL },
    },
    {
      new: true,
      fields: {
        password: 0,
        __v: 0,
        verify: 0,
        verificationToken: 0,
      },
    }
  ).populate('pets');
  return result;
};

const logoutUser = async (refreshToken) => {
  await RefreshTokens.findOneAndRemove({ refreshToken });
  return;
};
const getCurrentUser = async (id) => {
  return await User.findOne({ _id: id });
};

const refreshTokenForUser = async (refreshTokenOld) => {
  const token = await RefreshTokens.findOne({ refreshToken: refreshTokenOld });
  if (!token) {
    throw new NotAutorizedError("Not authorized");
  }
  if (token.expiresIn < Date.now()) {
    await RefreshTokens.findOneAndDelete({ _id: token._id });
    throw new NotAutorizedError("Not authorized");
  }
  const newRefreshToken = await RefreshTokens.findOneAndUpdate(
    { _id: token._id },
    {
      refreshToken: uuid.v4(),
      expiresIn: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
    },
    { new: true }
  );
  const accessToken = await jwt.sign(
    {
      _id: token.userId,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: 5 * 24 * 60 * 60,
    }
  );
  return { refreshToken: newRefreshToken.refreshToken, accessToken };
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUser,
  verifyUser,
  repeatEmail,
  refreshTokenForUser,
};
