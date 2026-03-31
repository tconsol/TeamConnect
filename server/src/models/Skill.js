const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    iconKey: { type: String, default: 'SiReact', trim: true },
    image: { type: String },
    color: { type: String, default: '#8B5CF6', trim: true },
    proficiency: { type: Number, default: 85, min: 0, max: 100 },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
