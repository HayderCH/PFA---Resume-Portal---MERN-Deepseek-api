import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hash this in production
  image: { type: String }, // Path to the uploaded image
}, { timestamps: true });

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;