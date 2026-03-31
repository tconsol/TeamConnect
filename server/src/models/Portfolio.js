const mongoose = require('mongoose');
const slugify = require('slugify');

const portfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    client: { type: String },
    category: { type: String, required: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    images: [String],
    technologies: [String],
    liveUrl: { type: String },
    challenges: [String],
    solution: [String],
    results: [String],
    testimonial: {
      quote: String,
      author: String,
      role: String,
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

portfolioSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

portfolioSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  const title = update?.title || update?.$set?.title;
  if (title) {
    this.setUpdate({ ...update, slug: slugify(title, { lower: true, strict: true }) });
  }
  next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
