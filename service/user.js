const { User } = require("./schemas/user");
const { Pets } = require("./schemas/pets");
const gravatar = require("gravatar");

const findUser = async (email) => {
  const user = await User.findOne({ email }, { password: 0 })
    .populate("pets")
  return user;
};

const getUserInfo = async (id) => {
  const user = await User.findOne(
    { _id: id },
    { password: 0, __v: 0, verify: 0, verificationToken: 0, token: 0 }
  ).populate("pets");
  return { user };
};

const addNewPet = async (owner, body) => {
  const { name, dateOfBirth, breed, comments } = body;
  const photoURL = gravatar.url(name);
  const newPet = new Pets({
    name,
    dateOfBirth,
    breed,
    comments,
    owner,
    photoURL,
  });
  const {_id} = await newPet.save();
  const result = await User.findByIdAndUpdate({_id:owner},{$push: { pets: _id }});
  return result;
};

const deleteNewPet = async (owner, petId) => {
  await Pets.deleteOne({ _id: petId, owner });
  return petId;
};

module.exports = { findUser, getUserInfo, addNewPet, deleteNewPet };
