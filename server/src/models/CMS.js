const mongoose = require('mongoose');

const cmsSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      enum: ['home', 'about', 'services', 'solutions', 'portfolio', 'careers', 'contact'],
    },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CMS', cmsSchema);
