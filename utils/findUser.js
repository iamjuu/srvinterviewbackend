const Signup = require('../model/signup');  // Assuming you have a User model



   const getUserById = async (userId) => {
  try {
    return await Signup.findById(userId);  // Find the user by ID
  } catch (error) {
    throw new Error('Error fetching user data');
  }
};
module.exports = getUserById
