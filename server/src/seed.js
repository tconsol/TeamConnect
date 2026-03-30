require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const CMS = require('./models/CMS');
const config = require('./config');

const seed = async () => {
  await mongoose.connect(config.mongoUri);
  console.log('Connected to MongoDB');

  // Seed admin user
  const existing = await User.findOne({ email: 'admin@tconsolutions.com' });
  if (!existing) {
    await User.create({
      name: 'Admin',
      email: 'admin@tconsolutions.com',
      password: 'Admin@123456',
      role: 'admin',
    });
    console.log('Admin user created');
  }

  // Seed CMS content
  const pages = [
    {
      page: 'home',
      content: {
        hero: {
          title: 'We Build Digital Experiences That Matter',
          subtitle: 'TCON Solutions crafts premium software, web applications, and digital products for forward-thinking businesses.',
          ctaPrimary: 'View Our Work',
          ctaSecondary: 'Get In Touch',
        },
        stats: [
          { value: '150+', label: 'Projects Delivered' },
          { value: '50+', label: 'Happy Clients' },
          { value: '5+', label: 'Years Experience' },
          { value: '99%', label: 'Client Satisfaction' },
        ],
        about: {
          title: 'Crafting Digital Excellence',
          description: 'We are a team of passionate developers, designers, and strategists who believe in the power of technology to transform businesses.',
        },
      },
    },
    {
      page: 'about',
      content: {
        hero: {
          title: 'About TCON Solutions',
          subtitle: 'A team of innovators building the future of software.',
        },
        mission: {
          title: 'Our Mission',
          description: 'To deliver cutting-edge digital solutions that drive growth, efficiency, and innovation for businesses worldwide.',
        },
        vision: {
          title: 'Our Vision',
          description: 'To be the most trusted technology partner for businesses seeking digital transformation.',
        },
        values: [
          { title: 'Innovation', description: 'We push boundaries and embrace new technologies.' },
          { title: 'Quality', description: 'We deliver nothing less than excellence.' },
          { title: 'Integrity', description: 'We build trust through transparency and honesty.' },
          { title: 'Collaboration', description: 'We believe great things happen when we work together.' },
        ],
        team: [
          { name: 'Alex Johnson', role: 'CEO & Founder', image: '' },
          { name: 'Sarah Chen', role: 'CTO', image: '' },
          { name: 'Mike Williams', role: 'Lead Designer', image: '' },
          { name: 'Emily Davis', role: 'Project Manager', image: '' },
        ],
      },
    },
    {
      page: 'services',
      content: {
        hero: {
          title: 'Our Services',
          subtitle: 'End-to-end digital solutions tailored to your business needs.',
        },
        process: [
          { step: '01', title: 'Discovery', description: 'We dive deep to understand your goals.' },
          { step: '02', title: 'Strategy', description: 'We create a roadmap for success.' },
          { step: '03', title: 'Design', description: 'We craft stunning visual experiences.' },
          { step: '04', title: 'Development', description: 'We build with precision and care.' },
          { step: '05', title: 'Launch', description: 'We deploy and ensure everything works flawlessly.' },
          { step: '06', title: 'Support', description: 'We provide ongoing maintenance and optimization.' },
        ],
      },
    },
    {
      page: 'contact',
      content: {
        hero: {
          title: 'Get In Touch',
          subtitle: 'Let\'s discuss your next project.',
        },
        info: {
          email: 'hello@tconsolutions.com',
          phone: '+1 (555) 123-4567',
          address: '123 Innovation Drive, Tech City, TC 12345',
        },
      },
    },
  ];

  for (const p of pages) {
    await CMS.findOneAndUpdate(
      { page: p.page },
      { content: p.content },
      { upsert: true }
    );
  }
  console.log('CMS content seeded');

  await mongoose.disconnect();
  console.log('Done!');
};

seed().catch(console.error);
