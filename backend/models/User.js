import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define the User schema
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  streak: { type: Number, default: 0 },
  classroom: { type: String, required: true }
});

// Add a method to check if the password is valid
UserSchema.methods.isValidPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Create and export the User model
const User = mongoose.model('User', UserSchema);

export default User;
