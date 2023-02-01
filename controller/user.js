const { User } = require("../service/schemas/user");
const {
  findUser,
  getUserInfo,
  addNewPet,
  deleteNewPet,
} = require("../service/user");

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

const getInfo = async (req, res, next) => {
  const { user } = await getUserInfo(req.user._id);
  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      user
    },
  });
};

const addPet = async (req, res, next) => {
  const pet = await addNewPet(req.user._id, req.body);
  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      pet,
    },
  });
};

const deletePet = async (req, res, next) => {
  const deletedPet = await deleteNewPet(req.user._id, req.params.petId);
  if (deletedPet)
    res
      .status(200)
      .json({
        status: "fail",
        code: 200,
        data: deletedPet,
        message: "Pet deteted",
      });
  else
    res
      .status(404)
      .json({ status: "fail", code: 404, message: "Pet not found" });
};

module.exports = { getCurrent, getInfo, addPet, deletePet };
