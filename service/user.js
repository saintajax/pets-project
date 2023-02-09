const { User } = require("./schemas/user");
const { Pets } = require("./schemas/pets");

const findUser = async (email) => {
  const user = await User.findOne({ email }, { password: 0 }).populate("pets");
  return user;
};

const getUserInfo = async (userId) => {
  const user = await User.findOne(
    { _id: userId },
    { _id: 0, name: 1, phone: 1, email: 1, pets: 0 }
  ).populate("pets");
  return { user };
};

const addNewPet = async (owner, body, avatar) => {
  const { name, dateOfBirth, breed, comments } = body;

  const newPet = new Pets({
    name,
    dateOfBirth,
    breed,
    comments,
    owner,
    photoURL: avatar,
  });

  const result = await newPet.save();
  const { _id } = result;
  await User.findByIdAndUpdate({ _id: owner }, { $push: { pets: _id } });
  return result;
};

const deleteNewPet = async (owner, petId) => {
  await Pets.deleteOne({ _id: petId, owner });
  await User.findByIdAndUpdate({ _id: owner }, { $pull: { pets: petId } });
  return petId;
};

const updateFavorite = async (userId, favorite) => {
  const result = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: { favorite },
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
  );
  return result;
};

module.exports = {
  findUser,
  getUserInfo,
  addNewPet,
  deleteNewPet,
  updateFavorite,
};
