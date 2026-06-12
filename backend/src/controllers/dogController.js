const Dog = require('../models/Dog');

const createDog = async (req, res) => {
  try {
    const { name, breed, size } = req.body;
    const dog = await Dog.create({ name, breed, size, owner: req.user.id });
    res.status(201).json(dog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyDogs = async (req, res) => {
  try {
    const dogs = await Dog.find({ owner: req.user.id });
    res.json(dogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createDog, getMyDogs };