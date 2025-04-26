const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors');

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/my_auth_app')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// schema
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  streak: { type: Number, default: 0 },
  classroom: { type: String, required: true }    // new: classroom field
});

UserSchema.methods.isValidPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model('User', UserSchema);

// register route
app.post('/register', async (req, res) => {
  const { username, password, classroom } = req.body;

  if (!username || !password || !classroom) {
    return res.status(400).send('Missing required fields');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, passwordHash, classroom });
    await user.save();
    res.send('User registered');
  } catch (e) {
    res.status(400).send('Username already exists');
  }
});

// login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await user.isValidPassword(password)) {
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid credentials');
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));