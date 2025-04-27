import express from 'express';
import JSON5  from 'json5';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './db.js';
import { readFile } from 'fs/promises';
import User from './models/User.js';  // Import the User model
import { createUser } from './createUser.js';  // Import the createUser function

const app = express();
const apiKey = process.env.GOOGLE_API_KEY;
const prompt = "You are a quiz generator. Given a news article title and the full article text, generate one multiple-choice quiz question based on the article. Instructions: - Provide exactly 4 multiple choice options in a list. - Indicate the correct answer using 0-based indexing (0, 1, 2, or 3). - Output the result as a pure JSON object using the following strict structure: { \"question\": \"Your question text here\", \"options\": [\"Option 1\", \"Option 2\", \"Option 3\", \"Option 4\"], \"correctAnswer\": 2 } Rules: - Base the question strictly on the article content. - Ensure there is only one correct option. - Place the correct answer randomly among the four options. - Avoid ambiguous or opinion-based questions. - Use clear and simple language appropriate for a general audience. Important: - You must output **only** the JSON object. - No explanations, no comments, no greetings, no markdown, no extra text. - Only valid JSON starting with '{' and ending with '}'.";

const jsonData = JSON.parse(
  await readFile(
    new URL('./articles.json', import.meta.url)
  )
);

app.use(cors());
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

// Get all users with classrooms
app.get('/getAllUsers', async (req, res) => {
  try {
    // Fetch all users with their usernames and classrooms
    const users = await User.find().select('username classroom streak');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving users' });
  }
});

app.get('/article', async (req, res) => {
  const { index } = req.query;
  const i = parseInt(index); // Make sure it's a number
  if (isNaN(i) || i < 0 || i >= jsonData.length) {
    return res.status(400).json({ error: "Invalid article index" });
  }

  try {
    const article = jsonData[index];
    res.json({ title: article.title, url: article.url });
  } catch (error) {
    console.error("Error sending article:", error);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

app.get('/quiz', async (req, res) => {
  const { index } = req.query;
  const i = parseInt(index);
  if (isNaN(i) || i < 0 || i >= jsonData.length) {
    return res.status(400).json({ error: "Invalid article index" });
  }

  try {
    const articleText = jsonData[i].paragraphs.join('\n\n');
    const fullPrompt = prompt + articleText;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON5.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }]
          }
        ]
      })
    });

    const rawData = await response.json();
    let text = rawData.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // CLEANUP to remove bad formatting
    
    text = text.replace(/```json|```/g, '').trim();

    let quizObject;
    try {
      quizObject = safeJsonParse(text);
    } catch (parseError) {
      console.error("Error parsing quiz JSON:", parseError);
      return res.status(500).json({ error: "Failed to parse quiz content" });
    }

    res.json(quizObject);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch quiz question" });
  }
});

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("First parse failed. Trying to clean...");

    // Try to auto-fix small common errors
    // Remove trailing commas before closing brackets
    const fixedText = text
      .replace(/,\s*]/g, ']')   // fix trailing comma in arrays
      .replace(/,\s*}/g, '}')   // fix trailing comma in objects
      .trim();

    try {
      return JSON.parse(fixedText);
    } catch (err2) {
      console.error("Second parse failed too.");
      throw err2; // rethrow the original error
    }
  }
}

// Increment leaderboard streak score
app.post('/increment-score', async (req, res) => {
  const {username, delta} = req.body;

  console.log('body:', req.body);

  if (!username || typeof delta !== 'number') {
    return res  
      .status(400)
      .json({ error: 'Request must include valid username and numeric delta value'})
  }

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { $inc: { streak: delta } },
      { new: true }
    );
    console.log(user.streak)

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ username: user.username, newStreak: user.streak })

    
  } catch (error) {
    console.error('Error incrementing score:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})


// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
