const express = require('express');
const router = express.Router();
const applicationsController = require('../Controller/applicationsController');

router.post('/registerApplication', applicationsController.registerApplication);
router.put('/updateApplications/:id', applicationsController.updateApplication);
router.delete('/deleteApplication/:id', applicationsController.deleteApplication);

module.exports = router;