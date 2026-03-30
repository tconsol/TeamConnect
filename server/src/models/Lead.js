const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    company: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    service: { type: String },
    budget: { type: String },
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal', 'closed', 'lost'],
      default: 'new',
    },
    notes: { type: String },
    source: { type: String, default: 'website' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
