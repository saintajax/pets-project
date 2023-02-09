const {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  getCurrentUser,
  verifyUser,
  repeatEmail,
  refreshTokenForUser,
} = require("../service/auth");
const upload = require("../helpers/cloudinary");

const register = async (req, res, next) => {
  const { email, name } = req.body;
  await registerUser(req.body);
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

const login = async (req, res, next) => {
  const { password, email } = req.body;
  const result = await loginUser(password, email);

  const {
    accessToken,
    refreshToken,
    user: { _id, name, cityRegion, phone, favorite, pets, avatarURL, birthday },
  } = result;
  res.status(200).json({
    accessToken,
    refreshToken,
    user: {
      _id,
      email,
      name,
      cityRegion,
      phone,
      favorite,
      pets,
      avatarURL,
      birthday,
    },
  });
};

const logout = async (req, res, next) => {
  const { refreshToken } = req.body;
  await logoutUser(refreshToken);
  res.status(204).json({ message: "Logged out" });
};

const update = async (req, res, next) => {
  const { name, email, phone, cityRegion, birthday } = req.body;
  let avatar = "";

  if (req.file) {
    const { path: tempDir } = req.file;
    const newAvatar = await upload(tempDir);
    avatar = newAvatar.secure_url;
  } else {
    avatar = req.user.avatarURL;
  }

  if (name || email || phone || cityRegion || birthday || avatar) {
    const upContact = await updateUser(req.user._id, req.body, avatar);
    if (!upContact) res.status(404).json({ message: "Not found user" });
    res.status(200).json(upContact);
  } else res.status(400).json({ message: "missing fields" });
};

const getCurrent = async (req, res, next) => {
  const { user } = req;
  const { email, name, cityRegion, phone, favorite, avatarURL } =
    await getCurrentUser(user._id);
  res.status(200).json({ email, name, cityRegion, phone, favorite, avatarURL });
};

const refreshTokens = async (req, res, next) => {
  const { refreshToken: refreshTokenOld } = req.body;
  const { accessToken, refreshToken } = await refreshTokenForUser(
    refreshTokenOld
  );

  res.status(200).json({ accessToken, refreshToken }).end();
};

module.exports = {
  register,
  login,
  logout,
  update,
  getCurrent,
  verifyEmailController,
  repeatEmailController,
  refreshTokens,
};
