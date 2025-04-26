import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './db.js';
import User from './models/User.js';  // Import the User model
import { createUser } from './createUser.js';  // Import the createUser function

const app = express();
const apiKey = process.env.GOOGLE_API_KEY;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Connect to the database
await connectDB();

// Register route
app.post('/register', async (req, res) => {
  const { username, password, classroom } = req.body;

  // Validate required fields
  if (!username || !password || !classroom) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Call the createUser function to create a new user
    await createUser(username, password, classroom);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (e) {
    // Catch errors like username already exists
    res.status(400).json({ error: e.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await user.isValidPassword(password)) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
