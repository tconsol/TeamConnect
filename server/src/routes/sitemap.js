const router = require('express').Router();
const sitemapController = require('../controllers/sitemapController');

router.get('/', sitemapController.generateSitemap);

module.exports = router;
