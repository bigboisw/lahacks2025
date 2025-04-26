import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/my_auth_app')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// schema
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  streak: { type: Number, default: 0 },
  classroom: { type: String, required: true }
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

// leaderboard
app.get('/leaderboard/:classroom', async (req, res) => {
  const { classroom } = req.params;
  try {
    const users = await User.find({ classroom })
      .sort({ streak: -1 })
      .select('username streak')
      .limit(10);
    res.json(users);
  } catch (err) {
    res.status(500).send('Error retrieving leaderboard');
  }
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));