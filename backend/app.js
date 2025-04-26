const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));  // vite default port
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/my_auth_app')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User Schema + Model
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  streak: { type: Number, default: 0 }
});

UserSchema.methods.isValidPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', UserSchema);

// Serve login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Register Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, passwordHash });
    await user.save();
    res.send('User registered');
  } catch (e) {
    res.status(400).send('Username already exists');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await user.isValidPassword(password)) {
    res.send(`Login successful. Current streak: ${user.streak}`);
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Start server
app.listen(3000, () => console.log('Server running at http://localhost:3000'));
