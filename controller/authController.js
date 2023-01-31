const {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  getCurrentUser,
  verifyUser,
  repeatEmail,
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
    token,
    user: { name, cityRegion, phone, favorite, avatarURL },
  } = result;
  res.status(200).json({
    token,
    user: { email, name, cityRegion, phone, favorite, avatarURL },
  });
};

const logout = async (req, res, next) => {
  const { user } = req;
  await logoutUser(user._id);
  res.status(204).json({ message: "Logged out" });
};

const update = async (req, res, next) => {
  const { name, email, phone, cityRegion, birthday } = req.body;
  const { path: tempDir } = req.file;
  const newAvatar = await upload(tempDir);
  const avatar = newAvatar.secure_url;

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

module.exports = {
  register,
  login,
  logout,
  update,
  getCurrent,
  verifyEmailController,
  repeatEmailController,
};
