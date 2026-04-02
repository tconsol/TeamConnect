const mongoose = require('mongoose');

const GRADIENT_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-violet-600',
  'from-pink-500 to-rose-600',
  'from-cyan-500 to-blue-600',
  'from-orange-500 to-amber-600',
];

const testimonialSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, trim: true, default: '' },
    avatar: { type: String, required: true },
    color: { type: String, default: () => GRADIENT_COLORS[Math.floor(Math.random() * GRADIENT_COLORS.length)] },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

testimonialSchema.pre('save', function (next) {
  if (!this.color) {
    this.color = GRADIENT_COLORS[Math.floor(Math.random() * GRADIENT_COLORS.length)];
  }
  next();
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
