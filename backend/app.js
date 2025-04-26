import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cors from 'cors';
import 'dotenv/config'
import { connectDB } from './db.js'

const app = express();
const apiKey = process.env.GOOGLE_API_KEY;

app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

await connectDB()

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

//gemini
/*
req format
{
  "prompt": "text"
}
*/
app.post('/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();
    const aiText = data.candidates[0].content.parts[0].text;

    console.log(aiText);
    res.json({ text: aiText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});


// Start server
app.listen(5173, () => console.log('Server running on http://localhost:5173'));