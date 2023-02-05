const { User } = require("../service/schemas/user");
const { NotAutorizedError } = require("../helpers/authErrors");
const gravatar = require("gravatar");


const { updateUser } = require("../service/auth");
const {
  findUser,
  getUserInfo,
  addNewPet,
  deleteNewPet,
} = require("../service/user");
const upload = require("../helpers/cloudinary");

const getCurrent = async (req, res) => {
  const { email } = req.user;
  const result = await findUser(email);
  res.json({
    status: "success",
    code: 200,
    data: {
      result,
    },
  });
};

const getInfo = async (req, res) => {
  if (!req.user) throw new NotAutorizedError("Not Autorized");
  const { _id } = req.user;
  const { user } = await getUserInfo(_id);
  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      user,
    },
  });
};

const addPet = async (req, res) => {
  let avatar = "";
  if (req.files) {
    const { path: tempDir } = req.files[0];
    const newAvatar = await upload(tempDir);
    avatar = newAvatar.secure_url;
  } else {
    avatar = gravatar.url(req.body.name);
  }
  const pet = await addNewPet(req.user._id, req.body, avatar);
  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      pet,
    },
  });
};

const deletePet = async (req, res) => {
  const deletedPet = await deleteNewPet(req.user._id, req.params.petId);
  if (deletedPet)
    res.status(200).json({
      status: "success",
      code: 200,
      data: deletedPet,
      message: "Pet deteted",
    });
  else
    res
      .status(404)
      .json({ status: "fail", code: 404, message: "Pet not found" });
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

module.exports = { getCurrent, getInfo, addPet, deletePet, update };
