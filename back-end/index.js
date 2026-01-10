const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const domain = `${process.env.DOMAIN}:${port}` || `http://localhost:${port}`;

// ================= Middleware =================
app.use(cors());
app.use(express.json());

// ================= MongoDB Connection =================
const client = new MongoClient(process.env.MONGO_URI);

let db, urls, users;

async function connectDB() {
  await client.connect();
  db = client.db('urlshort');
  urls = db.collection('urls');
  users = db.collection('users');

  // Index
  await urls.createIndex({ ssid: 1 }, { unique: true });
  await users.createIndex({ email: 1 }, { unique: true });

  console.log('MongoDB connected');
}

connectDB().catch(console.error);

// ================= Create Short URL =================
app.post('/api/shorturl', async (req, res) => {
  const { original_url, user_id } = req.body;

  if (!original_url) {
    return res.status(400).json({ error: 'original_url is required' });
  }

  try {
    new URL(original_url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    const ssid = nanoid(7);

    await urls.insertOne({
      original_url,
      ssid,
      user_id: user_id || null,
      clicks: 0,
      createdAt: new Date()
    });

    const short_url = `${domain}/${ssid}`;
    res.json({ short_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ================= Redirect =================
app.get('/:ssid', async (req, res) => {
  const { ssid } = req.params;

  try {
    const url = await urls.findOne({ ssid });

    if (!url) {
      return res.status(404).json({ error: 'No URL found for this SSID' });
    }

    await urls.updateOne(
      { ssid },
      { $inc: { clicks: 1 } }
    );

    res.redirect(url.original_url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ================= Signup =================
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = nanoid(7);

    await users.insertOne({
      _id: id,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    const token = jwt.sign(
      { id, email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id, email },
      token
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during sign up' });
  }
});

// ================= Login =================
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000
    });

    res.json({
      message: 'Login successful',
      user: { id: user._id, email: user.email },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ================= Saved URLs =================
app.get('/api/savedurls', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const savedUrls = await urls
      .find({ user_id: userId })
      .project({ original_url: 1, ssid: 1, _id: 0 })
      .toArray();

    res.json({ savedUrls });
  } catch (err) {
    console.error('Error fetching saved URLs:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

app.delete('/api/savedurls/:ssid', async (req, res) => {
  const authHeader = req.headers.authorization;
  const { ssid } = req.params;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const result = await urls.deleteOne({ ssid, user_id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'URL not found or not owned by user' });
    }

    res.json({ message: 'URL deleted successfully' });
  } catch (err) {
    console.error('Error deleting saved URL:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// ================= Start Server =================
app.listen(port, () => {
  console.log(`URL Shortener service running at http://localhost:${port}`);
});
