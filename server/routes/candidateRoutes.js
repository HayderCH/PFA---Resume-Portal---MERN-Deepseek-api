import express from 'express';
import multer from 'multer';
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from 'jsonwebtoken'; // For generating tokens
import Candidate from '../models/Candidate.js'; // Import the Candidate model

const router = express.Router();

// Multer setup for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Candidate registration route
router.post('/register', upload.single('image'), async (req, res) => {
  try {
    // Debugging: Log the request body and file
    console.log('Request Body:', req.body);
    console.log('Request File:', req.file);

    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.error('Validation Error: Missing required fields.');
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Check if the candidate already exists
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      console.error('Validation Error: Candidate already exists with email:', email);
      return res.status(400).json({ success: false, message: 'Candidate already exists.' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new candidate
    const newCandidate = new Candidate({
      name,
      email,
      password: hashedPassword, // Save the hashed password
      image: req.file ? req.file.path : null, // Save the image path if uploaded
    });

    await newCandidate.save();

    res.status(201).json({
      success: true,
      message: 'Candidate registered successfully.',
      candidate: newCandidate,
    });
  } catch (error) {
    console.error('Error in /api/candidate/register:', error.message);
    console.error('Error Stack:', error.stack);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Candidate login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.error('Validation Error: Missing email or password.');
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Find the candidate by email
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      console.error('Validation Error: Candidate not found with email:', email);
      return res.status(404).json({ success: false, message: 'Candidate not found.' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, candidate.password);
    if (!isMatch) {
      console.error('Validation Error: Invalid credentials.');
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error('Server Error: JWT_SECRET is not defined in the environment variables.');
      return res.status(500).json({ success: false, message: 'Server configuration error.' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: candidate._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      candidate: {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        image: candidate.image,
      },
    });
  } catch (error) {
    console.error('Error in /api/candidate/login:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

export default router;