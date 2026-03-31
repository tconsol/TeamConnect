const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      required: true,
    },
    experience: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    responsibilities: [String],
    benefits: [String],
    salaryRange: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'INR' },
      period: { type: String, enum: ['annum'], default: 'annum' },
    },
    isActive: { type: Boolean, default: true },
    applicationCount: { type: Number, default: 0 },
    techStack: {
      frontend: [String],
      backend: [String],
      databases: [String],
      frameworks: [String],
      devTools: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
