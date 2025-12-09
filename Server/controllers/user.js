const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createUser(username, password, role = 'Client', name) {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    username,
    password: hashedPassword,
    role,
    name
  });

  await newUser.save();
  return newUser;
}


async function checkUser(username, password) {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  return user;
}

module.exports = {
  createUser,
  checkUser
};
