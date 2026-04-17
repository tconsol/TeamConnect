const Portfolio = require('../models/Portfolio');
const Job = require('../models/Job');

// Base URL for your site
const BASE_URL = 'https://tconsolutions.com';

// Static pages with their priorities and update frequencies
const staticPages = [
  { path: '', priority: 1.0, changefreq: 'weekly' },
  { path: 'about', priority: 0.8, changefreq: 'monthly' },
  { path: 'services', priority: 0.9, changefreq: 'monthly' },
  { path: 'solutions', priority: 0.8, changefreq: 'monthly' },
  { path: 'portfolio', priority: 0.8, changefreq: 'weekly' },
  { path: 'careers', priority: 0.7, changefreq: 'weekly' },
  { path: 'contact', priority: 0.7, changefreq: 'monthly' },
];

exports.generateSitemap = async (req, res) => {
  try {
    // Fetch all portfolios and jobs
    const [portfolios, jobs] = await Promise.all([
      Portfolio.find({ active: true }).select('slug updatedAt').lean(),
      Job.find({ active: true }).select('_id updatedAt').lean(),
    ]);

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    staticPages.forEach(page => {
      const url = page.path ? `${BASE_URL}/${page.path}` : BASE_URL;
      xml += `  <url>\n`;
      xml += `    <loc>${url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Add dynamic portfolio pages
    portfolios.forEach(portfolio => {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/portfolio/${portfolio.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(portfolio.updatedAt).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    // Add dynamic career pages
    jobs.forEach(job => {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}/careers/${job._id}</loc>\n`;
      xml += `    <lastmod>${new Date(job.updatedAt).toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += '</urlset>';

    // Set headers and send
    res.type('application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ success: false, message: 'Error generating sitemap' });
  }
};
