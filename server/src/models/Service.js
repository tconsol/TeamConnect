const mongoose = require('mongoose');
const slugify = require('slugify');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String },
    image: { type: String },
    features: [{ title: String, description: String }],
    technologies: [String],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

serviceSchema.pre('save', function (next) {
  if (!this.slug || this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

serviceSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() || {};
  const title = update.title || (update.$set && update.$set.title);
  const slug = slugify(title || '', { lower: true, strict: true });

  if (title) {
    if (update.$set) {
      update.$set.slug = slug;
    } else {
      update.slug = slug;
    }
    this.setUpdate(update);
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
