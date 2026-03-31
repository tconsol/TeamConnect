const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String },
    linkedIn: { type: String },
    portfolio: { type: String },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'rejected', 'hired'],
      default: 'pending',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
