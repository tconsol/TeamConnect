require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./src/config');

// Import models
const User = require('./src/models/User');
const CMS = require('./src/models/CMS');
const Service = require('./src/models/Service');
const Skill = require('./src/models/Skill');
const Portfolio = require('./src/models/Portfolio');
const Job = require('./src/models/Job');

const crypto = require('crypto');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@tconsolutions.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || crypto.randomBytes(16).toString('hex');
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
const isGeneratedPassword = !process.env.ADMIN_PASSWORD;

const seedCMSContent = {
  home: {
    hero: {
      title: 'We Build Digital Experiences That Matter',
      subtitle: 'From concept to launch, we craft premium software solutions that drive growth, delight users, and transform businesses.',
      cta: 'Start Your Project',
    },
    stats: [
      { value: '150+', label: 'Projects Delivered' },
      { value: '50+', label: 'Happy Clients' },
      { value: '5+', label: 'Years of Excellence' },
      { value: '99%', label: 'Client Satisfaction' },
    ],
    process: [
      { step: '01', title: 'Discovery', description: 'We dive deep into your business goals, target audience, and technical requirements to chart the perfect course.' },
      { step: '02', title: 'Strategy', description: 'Our team crafts a comprehensive roadmap with clear milestones, tech stack decisions, and architecture planning.' },
      { step: '03', title: 'Design', description: 'Pixel-perfect UI/UX design that balances aesthetics with usability, creating interfaces users love.' },
      { step: '04', title: 'Development', description: 'Clean, scalable code built with modern frameworks and best practices for performance and maintainability.' },
      { step: '05', title: 'Testing', description: 'Rigorous QA process including automated testing, performance audits, and cross-platform validation.' },
      { step: '06', title: 'Launch & Support', description: 'Smooth deployment with CI/CD pipelines, monitoring, and ongoing support to ensure long-term success.' },
    ],
    cta: {
      title: 'Ready to Build Something Extraordinary?',
      subtitle: 'Let\'s discuss how we can help transform your vision into a stunning digital reality.',
      buttonText: 'Start a Conversation',
    },
    socialLinks: [
      { platform: 'twitter', href: 'https://twitter.com/tconsolutions' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/tconsolutions' },
      { platform: 'instagram', href: 'https://www.instagram.com/tcon.solutions' },
    ],
  },
  about: {
    title: 'About TCON Solutions',
    story: 'Founded with a vision to bridge the gap between innovative technology and real-world business needs, TCON Solutions has grown from a small team of passionate developers into a full-service digital agency. We believe that great software is more than just code — it\'s about understanding people, solving real problems, and creating experiences that resonate.',
    mission: 'To empower businesses with cutting-edge technology solutions that drive measurable results, foster innovation, and create lasting digital impact.',
    vision: 'To be the most trusted technology partner for businesses worldwide, known for excellence in execution and relentless pursuit of innovation.',
    values: [
      { title: 'Innovation', description: 'We push boundaries and embrace emerging technologies to deliver solutions that set our clients apart.' },
      { title: 'Excellence', description: 'Every line of code, every pixel, and every interaction is crafted to the highest standards of quality.' },
      { title: 'Integrity', description: 'We build trust through transparency, honesty, and delivering on our promises — every single time.' },
      { title: 'Collaboration', description: 'We work as an extension of your team, fostering open communication and shared ownership of success.' },
    ],
    team: [
      { name: 'Alex Morgan', role: 'CEO & Founder', bio: 'Visionary technologist with 15+ years of experience building digital products for Fortune 500 companies.', image: '' },
      { name: 'Sarah Chen', role: 'CTO', bio: 'Former lead architect at Google with deep expertise in cloud-native architecture and AI/ML systems.', image: '' },
      { name: 'James Wilson', role: 'Head of Design', bio: 'Award-winning designer who has shaped user experiences for startups and enterprises alike.', image: '' },
      { name: 'Priya Patel', role: 'VP of Engineering', bio: 'Full-stack engineering leader passionate about clean architecture and scalable distributed systems.', image: '' },
    ],
  },
  services: {
    title: 'Our Services',
    description: 'Comprehensive technology solutions tailored to your unique needs. We combine deep technical expertise with creative thinking to deliver results that exceed expectations.',
    process: [
      { step: '01', title: 'Consultation', description: 'We start by understanding your unique challenges and objectives through in-depth discovery sessions.' },
      { step: '02', title: 'Planning', description: 'We design a detailed project blueprint with clear timelines, deliverables, and success metrics.' },
      { step: '03', title: 'Execution', description: 'Our team brings the plan to life using agile methodologies and cutting-edge technology.' },
      { step: '04', title: 'Delivery', description: 'We ensure smooth deployment, thorough testing, and comprehensive knowledge transfer.' },
    ],
  },
  solutions: {
    title: 'Industry Solutions',
    description: 'Tailored technology solutions designed for the unique challenges and opportunities within your industry.',
    items: [
      { title: 'Healthcare & MedTech', description: 'HIPAA-compliant digital platforms, telemedicine solutions, EHR integrations, and patient engagement tools that transform healthcare delivery.', features: ['Telemedicine Platforms', 'EHR Integration', 'Patient Portals', 'HIPAA Compliance'] },
      { title: 'FinTech & Banking', description: 'Secure, scalable financial technology solutions including payment systems, trading platforms, and regulatory compliance tools.', features: ['Payment Gateways', 'Trading Platforms', 'KYC/AML Compliance', 'Blockchain Solutions'] },
      { title: 'E-Commerce & Retail', description: 'End-to-end commerce solutions from storefront design to inventory management, optimized for conversion and scalability.', features: ['Custom Storefronts', 'Inventory Systems', 'Payment Integration', 'Analytics Dashboards'] },
      { title: 'Education & EdTech', description: 'Interactive learning platforms, LMS solutions, and virtual classroom tools that make education accessible and engaging.', features: ['Learning Management', 'Virtual Classrooms', 'Assessment Tools', 'Content Delivery'] },
      { title: 'Real Estate & PropTech', description: 'Property management platforms, virtual tours, smart building solutions, and tenant engagement tools for modern real estate.', features: ['Property Listings', 'Virtual Tours', 'Smart Building IoT', 'Tenant Portals'] },
      { title: 'Logistics & Supply Chain', description: 'Intelligent supply chain management, fleet tracking, warehouse automation, and demand forecasting solutions.', features: ['Fleet Management', 'Route Optimization', 'Warehouse Automation', 'Demand Forecasting'] },
    ],
  },
  portfolio: {
    title: 'Our Work',
    description: 'A showcase of the digital experiences we\'ve crafted for clients across industries. Each project represents our commitment to excellence and innovation.',
  },
  careers: {
    title: 'Join Our Team',
    description: 'We\'re always looking for talented people who share our passion for building extraordinary digital experiences.',
    perks: [
      { icon: '🌍', title: 'Remote-First', description: 'Work from anywhere in the world' },
      { icon: '📚', title: 'Learning Budget', description: 'Annual budget for courses & conferences' },
      { icon: '🏥', title: 'Health Benefits', description: 'Comprehensive health coverage' },
      { icon: '🎯', title: 'Stock Options', description: 'Equity in a growing company' },
    ],
  },
  contact: {
    title: 'Get In Touch',
    subtitle: 'Have a project in mind? We\'d love to hear about it. Get in touch and let\'s create something amazing together.',
    email: 'hello@tconsolutions.com',
    phone: '+1 (555) 123-4567',
    address: '123 Innovation Drive, Tech City, TC 10001',
    businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM EST',
    weekendHours: 'Weekend: By appointment',
  },
};

const seedServices = [
  {
    title: 'Web Development',
    shortDescription: 'Modern, scalable web applications built with cutting-edge frameworks.',
    description: 'We create stunning, high-performance web applications using React, Next.js, Vue, and other modern frameworks. From SPAs to complex enterprise platforms, our web solutions are built for speed, accessibility, and scalability.',
    icon: 'web',
    features: [
      { title: 'Single Page Applications', description: 'Fast, responsive SPAs with React, Vue, or Angular' },
      { title: 'Progressive Web Apps', description: 'App-like experiences that work offline and load instantly' },
      { title: 'E-Commerce Platforms', description: 'Custom storefronts with payment integration and analytics' },
      { title: 'Enterprise Dashboards', description: 'Data-rich admin panels with real-time updates' },
    ],
    technologies: ['React', 'Next.js', 'Vue.js', 'TypeScript', 'Node.js', 'Tailwind CSS'],
    order: 1,
    isActive: true,
  },
  {
    title: 'Mobile Development',
    shortDescription: 'Native and cross-platform mobile apps that users love.',
    description: 'From iOS to Android and beyond, we build mobile applications that deliver seamless user experiences. Using React Native and Flutter, we create cross-platform apps that feel truly native while maximizing code reuse.',
    icon: 'mobile',
    features: [
      { title: 'Cross-Platform Apps', description: 'One codebase, native performance on iOS and Android' },
      { title: 'Native iOS & Android', description: 'Platform-specific apps for maximum performance' },
      { title: 'App Store Optimization', description: 'Launch strategies that drive downloads and engagement' },
      { title: 'Push Notifications', description: 'Smart notification systems that boost retention' },
    ],
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
    order: 2,
    isActive: true,
  },
  {
    title: 'Cloud & DevOps',
    shortDescription: 'Secure, scalable cloud infrastructure and CI/CD pipelines.',
    description: 'We design, build, and manage cloud infrastructure on AWS, GCP, and Azure. Our DevOps practices ensure rapid, reliable deployments with automated CI/CD pipelines, container orchestration, and infrastructure as code.',
    icon: 'cloud',
    features: [
      { title: 'Cloud Architecture', description: 'Scalable, fault-tolerant architectures on major cloud providers' },
      { title: 'CI/CD Pipelines', description: 'Automated build, test, and deploy workflows' },
      { title: 'Container Orchestration', description: 'Docker and Kubernetes for microservice deployments' },
      { title: 'Infrastructure as Code', description: 'Terraform and CloudFormation for reproducible environments' },
    ],
    technologies: ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
    order: 3,
    isActive: true,
  },
  {
    title: 'UI/UX Design',
    shortDescription: 'Beautiful, intuitive interfaces that delight users.',
    description: 'Our design team creates pixel-perfect interfaces backed by user research and data. From wireframes to interactive prototypes, we ensure every touchpoint is crafted for maximum usability and visual impact.',
    icon: 'design',
    features: [
      { title: 'User Research', description: 'Deep understanding of your users through interviews and analytics' },
      { title: 'Wireframing & Prototyping', description: 'Interactive prototypes for rapid validation' },
      { title: 'Design Systems', description: 'Consistent, scalable component libraries' },
      { title: 'Usability Testing', description: 'Data-driven design improvements based on real user feedback' },
    ],
    technologies: ['Figma', 'Adobe XD', 'Framer', 'Principle', 'Storybook'],
    order: 4,
    isActive: true,
  },
  {
    title: 'AI & Machine Learning',
    shortDescription: 'Intelligent solutions powered by artificial intelligence.',
    description: 'We integrate artificial intelligence and machine learning into your products to unlock new capabilities. From NLP and computer vision to predictive analytics and recommendation engines, we make your software smarter.',
    icon: 'ai',
    features: [
      { title: 'Natural Language Processing', description: 'Chatbots, sentiment analysis, and text classification' },
      { title: 'Computer Vision', description: 'Image recognition, object detection, and visual search' },
      { title: 'Predictive Analytics', description: 'Forecast trends and make data-driven decisions' },
      { title: 'Recommendation Engines', description: 'Personalized content and product recommendations' },
    ],
    technologies: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI', 'Scikit-learn'],
    order: 5,
    isActive: true,
  },
  {
    title: 'Backend & API Development',
    shortDescription: 'Robust backend systems and RESTful/GraphQL APIs.',
    description: 'We architect and build high-performance backend systems and APIs that power your applications. Whether you need RESTful APIs, GraphQL endpoints, or event-driven microservices, we ensure reliability and speed.',
    icon: 'backend',
    features: [
      { title: 'RESTful APIs', description: 'Clean, well-documented REST APIs with versioning' },
      { title: 'GraphQL', description: 'Flexible data querying with Apollo and Hasura' },
      { title: 'Microservices', description: 'Modular architecture for independent scaling and deployment' },
      { title: 'Real-time Systems', description: 'WebSocket and SSE for live data streaming' },
    ],
    technologies: ['Node.js', 'Python', 'Go', 'PostgreSQL', 'MongoDB', 'Redis'],
    order: 6,
    isActive: true,
  },
];

const seedSkills = [
  { name: 'React', iconKey: 'SiReact', color: '#61DAFB', proficiency: 95, order: 1, isActive: true },
  { name: 'Next.js', iconKey: 'SiNextdotjs', color: '#F8FAFC', proficiency: 90, order: 2, isActive: true },
  { name: 'TypeScript', iconKey: 'SiTypescript', color: '#3178C6', proficiency: 92, order: 3, isActive: true },
  { name: 'Tailwind CSS', iconKey: 'SiTailwindcss', color: '#38BDF8', proficiency: 95, order: 4, isActive: true },
  { name: 'Vue.js', iconKey: 'SiVuedotjs', color: '#42B883', proficiency: 88, order: 5, isActive: true },
  { name: 'Angular', iconKey: 'SiAngular', color: '#DD0031', proficiency: 85, order: 6, isActive: true },
  { name: 'Node.js', iconKey: 'SiNodedotjs', color: '#6ABB3E', proficiency: 93, order: 7, isActive: true },
  { name: 'JavaScript', iconKey: 'SiJavascript', color: '#F7DF1E', proficiency: 94, order: 8, isActive: true },
  { name: 'Java', iconKey: 'FaJava', color: '#EA580C', proficiency: 87, order: 9, isActive: true },
  { name: 'Python', iconKey: 'SiPython', color: '#FACC15', proficiency: 90, order: 10, isActive: true },
  { name: 'Go', iconKey: 'SiGo', color: '#60A5FA', proficiency: 82, order: 11, isActive: true },
  { name: 'PHP', iconKey: 'SiPhp', color: '#818CF8', proficiency: 85, order: 12, isActive: true },
  { name: 'Ruby', iconKey: 'SiRuby', color: '#E11D48', proficiency: 80, order: 13, isActive: true },
  { name: 'Flutter', iconKey: 'SiFlutter', color: '#60A5FA', proficiency: 86, order: 14, isActive: true },
  { name: 'Swift', iconKey: 'SiSwift', color: '#FB923C', proficiency: 84, order: 15, isActive: true },
  { name: 'Kotlin', iconKey: 'SiKotlin', color: '#C084FC', proficiency: 83, order: 16, isActive: true },
  { name: 'MongoDB', iconKey: 'SiMongodb', color: '#4ADE80', proficiency: 90, order: 17, isActive: true },
  { name: 'PostgreSQL', iconKey: 'SiPostgresql', color: '#60A5FA', proficiency: 88, order: 18, isActive: true },
];

const seedPortfolios = [
  {
    title: 'HealthBridge Platform',
    client: 'MedCare Inc.',
    category: 'Healthcare',
    shortDescription: 'A comprehensive telemedicine platform connecting patients with healthcare providers.',
    description: 'Built a full-featured telemedicine platform including video consultations, prescription management, appointment scheduling, and EHR integration. The platform serves 50,000+ patients across 200 healthcare providers.',
    technologies: ['React', 'Node.js', 'WebRTC', 'PostgreSQL', 'AWS'],
    liveUrl: 'https://healthbridge.example.com',
    challenges: 'The biggest challenge was ensuring HIPAA compliance while maintaining a seamless user experience. We also needed to handle high-concurrency video streams with minimal latency.',
    solution: 'We implemented end-to-end encryption for all data, used WebRTC for peer-to-peer video with fallback to SFU for group calls, and deployed on HIPAA-compliant AWS infrastructure.',
    results: '50,000+ active patients, 200+ healthcare providers onboarded, 40% reduction in no-show appointments, 4.8/5 user satisfaction rating.',
    testimonial: { quote: 'TCON Solutions delivered a platform that transformed how we deliver healthcare. The quality and attention to detail exceeded all expectations.', author: 'Dr. Sarah Mitchell', role: 'CEO, MedCare Inc.' },
    isFeatured: true,
    isActive: true,
    order: 1,
  },
  {
    title: 'FinTrack Dashboard',
    client: 'Global Finance Corp',
    category: 'FinTech',
    shortDescription: 'Real-time financial analytics dashboard with AI-powered insights.',
    description: 'Designed and developed a real-time financial analytics dashboard processing millions of transactions daily. Features include AI-powered anomaly detection, customizable reporting, and regulatory compliance tools.',
    technologies: ['Next.js', 'Python', 'TensorFlow', 'Redis', 'Kubernetes'],
    liveUrl: 'https://fintrack.example.com',
    challenges: 'Processing and visualizing millions of real-time financial transactions while maintaining sub-second response times was the primary technical challenge.',
    solution: 'We built a streaming data pipeline with Kafka and Redis for real-time processing, combined with a React-based dashboard using WebSocket for live updates.',
    results: '10M+ transactions processed daily, 99.99% uptime, 60% reduction in fraud detection time, adopted by 15 financial institutions.',
    testimonial: { quote: 'The dashboard has become the nerve center of our operations. TCON\'s engineering team is world-class.', author: 'Michael Chen', role: 'CTO, Global Finance Corp' },
    isFeatured: true,
    isActive: true,
    order: 2,
  },
  {
    title: 'ShopSphere E-Commerce',
    client: 'Retail Dynamics',
    category: 'E-Commerce',
    shortDescription: 'A headless e-commerce platform with personalized shopping experiences.',
    description: 'Created a headless e-commerce platform with AI-driven product recommendations, one-click checkout, and omnichannel inventory management. The platform handles peak loads of 100K+ concurrent users.',
    technologies: ['Vue.js', 'GraphQL', 'Go', 'Elasticsearch', 'GCP'],
    liveUrl: 'https://shopsphere.example.com',
    challenges: 'Handling Black Friday scale traffic (100K+ concurrent users) while maintaining fast page loads and real-time inventory accuracy across 500+ stores.',
    solution: 'Implemented a headless architecture with aggressive CDN caching, edge computing for personalization, and event-sourced inventory management.',
    results: '300% increase in conversion rate, 100K+ peak concurrent users handled seamlessly, $2M+ in first-month revenue, 1.2s average page load time.',
    testimonial: { quote: 'Our online sales tripled within the first quarter of launch. The platform is blazing fast and our customers love it.', author: 'Jessica Park', role: 'VP Digital, Retail Dynamics' },
    isFeatured: true,
    isActive: true,
    order: 3,
  },
  {
    title: 'EduLearn LMS',
    client: 'Knowledge First Academy',
    category: 'Education',
    shortDescription: 'Interactive learning management system with virtual classrooms.',
    description: 'Developed a comprehensive LMS platform featuring live virtual classrooms, gamified learning paths, AI-powered assessments, and progress tracking for 100K+ students.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'AWS'],
    challenges: 'Creating an engaging learning experience that keeps students motivated while handling concurrent classroom sessions for thousands of students.',
    solution: 'We built a gamification engine with achievements, leaderboards, and adaptive learning paths. Real-time classrooms use WebSocket for instant interaction.',
    results: '100K+ active students, 85% course completion rate (up from 30%), 4.9/5 student satisfaction, adopted by 50 educational institutions.',
    isFeatured: false,
    isActive: true,
    order: 4,
  },
  {
    title: 'LogiFlow Supply Chain',
    client: 'TransGlobal Logistics',
    category: 'Logistics',
    shortDescription: 'AI-driven supply chain optimization and fleet management platform.',
    description: 'Built an end-to-end supply chain management platform with real-time fleet tracking, route optimization using ML, warehouse automation, and predictive demand forecasting.',
    technologies: ['React', 'Python', 'PostgreSQL', 'TensorFlow', 'Azure'],
    challenges: 'Optimizing delivery routes across 10,000+ vehicles in real-time while accounting for traffic, weather, delivery windows, and vehicle capacity constraints.',
    solution: 'Developed a custom ML model for route optimization that factors in real-time traffic data, historical patterns, and constraint satisfaction algorithms.',
    results: '25% reduction in delivery times, $5M annual fuel cost savings, 99.2% on-time delivery rate, real-time visibility across 10,000+ vehicles.',
    isFeatured: false,
    isActive: true,
    order: 5,
  },
  {
    title: 'PropView Real Estate',
    client: 'Metro Realty Group',
    category: 'Real Estate',
    shortDescription: 'Smart property management platform with virtual 3D tours.',
    description: 'Created a comprehensive real estate platform featuring 3D virtual property tours, AI-powered price estimations, tenant management, and automated lease processing.',
    technologies: ['Next.js', 'Three.js', 'Node.js', 'PostgreSQL', 'GCP'],
    challenges: 'Rendering high-fidelity 3D property tours in the browser while maintaining fast load times and mobile compatibility.',
    solution: 'Used Three.js with progressive loading, level-of-detail rendering, and WebGL optimization to deliver smooth 3D tours even on mobile devices.',
    results: '200% increase in virtual viewings, 35% faster lease processing, $3M in property sales attributed to virtual tours, 4.7/5 user rating.',
    isFeatured: false,
    isActive: true,
    order: 6,
  },
];

const seedJobs = [
  {
    title: 'Senior Full-Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'full-time',
    experience: '5+ years',
    description: 'We are looking for a Senior Full-Stack Developer to lead the development of complex web applications. You will architect solutions, mentor junior developers, and work closely with our design and product teams to deliver exceptional user experiences.',
    requirements: [
      '5+ years of experience with React, Node.js, and TypeScript',
      'Strong understanding of cloud services (AWS/GCP/Azure)',
      'Experience with microservices architecture and containerization',
      'Excellent problem-solving skills and attention to detail',
      'Strong communication skills and experience mentoring others',
    ],
    responsibilities: [
      'Lead the architecture and development of full-stack applications',
      'Conduct code reviews and ensure code quality standards',
      'Mentor junior developers and share knowledge through tech talks',
      'Collaborate with designers and product managers to define features',
      'Optimize application performance and ensure scalability',
    ],
    benefits: ['Competitive salary', 'Remote work', 'Health insurance', 'Learning budget', 'Stock options'],
    salaryRange: { min: 120000, max: 180000, currency: 'USD' },
    isActive: true,
  },
  {
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Remote / Hybrid',
    type: 'full-time',
    experience: '3+ years',
    description: 'Join our design team to create beautiful, intuitive interfaces for web and mobile applications. You will lead the design process from user research through to final implementation, working closely with developers to bring your vision to life.',
    requirements: [
      '3+ years of UI/UX design experience with a strong portfolio',
      'Proficiency in Figma, Adobe XD, or similar design tools',
      'Experience with design systems and component libraries',
      'Understanding of accessibility standards and responsive design',
      'Strong understanding of user-centered design principles',
    ],
    responsibilities: [
      'Create wireframes, prototypes, and high-fidelity designs',
      'Conduct user research and usability testing',
      'Build and maintain design systems and component libraries',
      'Collaborate with engineering to ensure design fidelity',
      'Present design decisions to stakeholders and incorporate feedback',
    ],
    benefits: ['Competitive salary', 'Remote-friendly', 'Health insurance', 'Conference budget', 'Flexible hours'],
    salaryRange: { min: 90000, max: 140000, currency: 'USD' },
    isActive: true,
  },
  {
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'Remote',
    type: 'full-time',
    experience: '4+ years',
    description: 'We need a skilled DevOps Engineer to design and maintain our cloud infrastructure, CI/CD pipelines, and monitoring systems. You will play a crucial role in ensuring the reliability, security, and scalability of our platforms.',
    requirements: [
      '4+ years of DevOps/SRE experience',
      'Strong expertise with AWS, GCP, or Azure',
      'Experience with Docker, Kubernetes, and Terraform',
      'Proficiency in CI/CD tools (GitHub Actions, Jenkins, GitLab CI)',
      'Strong scripting skills (Bash, Python)',
    ],
    responsibilities: [
      'Design and manage cloud infrastructure across multiple providers',
      'Build and maintain CI/CD pipelines for automated deployments',
      'Implement monitoring, alerting, and incident response procedures',
      'Ensure security best practices and compliance requirements',
      'Optimize infrastructure costs and performance',
    ],
    benefits: ['Competitive salary', 'Fully remote', 'Health insurance', 'Home office budget', 'Stock options'],
    salaryRange: { min: 110000, max: 170000, currency: 'USD' },
    isActive: true,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    // Create/update admin user
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      if (!isGeneratedPassword) {
        // ADMIN_PASSWORD env var provided — update the password
        existingAdmin.password = ADMIN_PASSWORD;
        await existingAdmin.save();
        console.log(`✅ Admin password updated for: ${ADMIN_EMAIL}`);
      } else {
        console.log('⚠️  Admin user already exists (set ADMIN_PASSWORD env var to reset password)');
      }
    } else {
      const admin = new User({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        isActive: true,
      });
      await admin.save();
      console.log(`✅ Admin user created: ${ADMIN_EMAIL}`);
      if (isGeneratedPassword) {
        console.error(`⚠️  SENSITIVE - Generated password: ${ADMIN_PASSWORD}`);
        console.error('   ⚠️  Save this password now — it will not be shown again. Set ADMIN_PASSWORD env var for future seeding.');
      } else {
        console.log('   Password: (from ADMIN_PASSWORD env var)');
      }
    }

    // Seed CMS content (upsert)
    for (const [page, content] of Object.entries(seedCMSContent)) {
      await CMS.findOneAndUpdate(
        { page },
        { page, content },
        { upsert: true, new: true }
      );
      console.log(`✅ CMS page '${page}' seeded`);
    }

    // Seed Services (use create() so pre-save hooks generate slugs)
    const existingServices = await Service.countDocuments();
    if (existingServices === 0) {
      for (const serviceData of seedServices) {
        await Service.create(serviceData);
      }
      console.log(`✅ ${seedServices.length} services seeded`);
    } else {
      console.log(`⚠️  Services already exist (${existingServices})`);
    }

    // Seed Portfolio
    const existingPortfolios = await Portfolio.countDocuments();
    if (existingPortfolios === 0) {
      for (const portfolioData of seedPortfolios) {
        await Portfolio.create(portfolioData);
      }
      console.log(`✅ ${seedPortfolios.length} portfolio items seeded`);
    } else {
      console.log(`⚠️  Portfolio items already exist (${existingPortfolios})`);
    }

    // Seed Jobs
    const existingJobs = await Job.countDocuments();
    if (existingJobs === 0) {
      for (const jobData of seedJobs) {
        await Job.create(jobData);
      }
      console.log(`✅ ${seedJobs.length} jobs seeded`);
    } else {
      console.log(`⚠️  Jobs already exist (${existingJobs})`);
    }

    // Seed Skills
    const existingSkills = await Skill.countDocuments();
    if (existingSkills === 0) {
      for (const skillData of seedSkills) {
        await Skill.create(skillData);
      }
      console.log(`✅ ${seedSkills.length} skills seeded`);
    } else {
      console.log(`⚠️  Skills already exist (${existingSkills})`);
    }

    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
