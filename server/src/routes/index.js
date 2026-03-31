const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/cms', require('./cms'));
router.use('/services', require('./services'));
router.use('/skills', require('./skills'));
router.use('/portfolio', require('./portfolio'));
router.use('/jobs', require('./jobs'));
router.use('/applications', require('./applications'));
router.use('/leads', require('./leads'));
router.use('/dashboard', require('./dashboard'));
router.use('/users', require('./users'));

module.exports = router;
