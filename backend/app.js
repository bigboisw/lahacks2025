import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import cors from 'cors';
import 'dotenv/config'
import { connectDB } from './db.js'
import { readFile } from 'fs/promises';

const app = express();
const apiKey = process.env.GOOGLE_API_KEY;
const prompt = "You are a quiz generator.\Given a news article title and the full article text, your task is to generate one quiz question based on the article.\For the quiz question:\Provide exactly 4 multiple choice options in a list.\Indicate the correct answer by specifying the index of the correct choice (0-based indexing: 0, 1, 2, or 3).\Output the result as a pure JSON object, using the following structure:\json\Copy\Edit\{\  'question': 'Your question text here',\  'options': ['Option 1', 'Option 2', 'Option 3', 'Option 4'],\  'correctAnswer': 2\}\Rules:\Base the question strictly on the article content.\Ensure only one correct option, and place it randomly among the four options.\Avoid ambiguous or opinion-based questions.\Use clear and simple language appropriate for a general audience.\Output only the JSON object — do not add any other explanation or text.";

const jsonData = JSON.parse(
  await readFile(
    new URL('./articles.json', import.meta.url)
  )
);

app.use(cors());
app.use(express.json());

await connectDB()

// schema
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  points: { type: Number, default: 0 },
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
      .sort({ points: -1 })
      .select('username points')
      .limit(10);
    res.json(users);
  } catch (err) {
    res.status(500).send('Error retrieving leaderboard');
  }
});

app.get('/article', async (req, res) => {
  console.log("hi?");
  const { index } = req.query;
  const i = parseInt(index); // Make sure it's a number
  if (isNaN(i) || i < 0 || i >= jsonData.length) {
    return res.status(400).json({ error: "Invalid article index" });
  }

  try {
    const article = jsonData[index]; // use index here!
    console.log('Sending article:', article);
    res.json({ title: article.title, url: article.url });
  } catch (error) {
    console.error("Error sending article:", error);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

app.get('/quiz', async (req, res) => {
  const { index } = req.query;
  const i = parseInt(index); // Make sure it's a number
  if (isNaN(i) || i < 0 || i >= jsonData.length) {
    return res.status(400).json({ error: "Invalid article index" });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt+jsonData[i].paragraphs }]
          }
        ]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch quiz question" });
  }
});

//gemini
/*
req format
{
  "prompt": "text"
}
*/
// app.post('/gemini', async (req, res) => {
//   try {
//     const { prompt } = req.body;
//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }

//     const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [{ text: prompt }]
//           }
//         ]
//       })
//     });

//     const data = await response.json();
//     const aiText = data.candidates[0].content.parts[0].text;

//     console.log(aiText);
//     res.json({ text: aiText });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Something went wrong." });
//   }
// });


// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));