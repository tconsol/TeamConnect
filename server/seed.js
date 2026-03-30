require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./src/config');

// Import models
const User = require('./src/models/User');
const CMS = require('./src/models/CMS');

const ADMIN_EMAIL = 'admin@tconsolutions.com';
const ADMIN_PASSWORD = 'Admin@123456';
const ADMIN_NAME = 'Admin User';

const seedCMSContent = {
  home: {
    hero: {
      title: 'Welcome to TCON Solutions',
      subtitle: 'Build extraordinary digital experiences',
      cta: 'Get Started',
    },
    services: [
      {
        title: 'Web Development',
        description: 'Modern, scalable web applications',
      },
      {
        title: 'Mobile Apps',
        description: 'Native and cross-platform solutions',
      },
      {
        title: 'Cloud Solutions',
        description: 'Secure and reliable infrastructure',
      },
    ],
  },
  about: {
    title: 'About TCON Solutions',
    mission: 'Delivering innovative software solutions that transform businesses',
    vision: 'To be the leading technology partner for digital transformation',
    values: ['Innovation', 'Excellence', 'Integrity', 'Collaboration'],
  },
  services: {
    title: 'Our Services',
    description: 'Comprehensive solutions tailored to your needs',
  },
  solutions: {
    title: 'Industry Solutions',
    description: 'Expertise across multiple industries',
  },
  portfolio: {
    title: 'Our Work',
    description: 'Showcase of successful projects',
  },
  careers: {
    title: 'Join Our Team',
    description: 'Build your career with us',
  },
  contact: {
    title: 'Get In Touch',
    email: 'hello@tconsolutions.com',
    phone: '+1 (555) 000-0000',
    address: 'Your Address Here',
  },
};

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
    } else {
      // Create admin user
      const admin = new User({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        isActive: true,
      });
      await admin.save();
      console.log(`✅ Admin user created: ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
    }

    // Seed CMS content
    for (const [page, content] of Object.entries(seedCMSContent)) {
      const existingPage = await CMS.findOne({ page });
      if (existingPage) {
        console.log(`⚠️  CMS page '${page}' already exists`);
      } else {
        await CMS.create({ page, content });
        console.log(`✅ CMS page '${page}' created`);
      }
    }

    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
