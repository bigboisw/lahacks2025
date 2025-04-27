import bcrypt from 'bcrypt';
import User from './models/User.js'; // Assuming your User model is in a 'models' folder

// Function to create a new user
export const createUser = async (username, password, classroom) => {
  // Check if user already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Create and save new user
  const user = new User({ username, passwordHash, classroom });
  await user.save();
  return user;
};
