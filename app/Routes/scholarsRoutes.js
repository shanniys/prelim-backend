const express = require('express');
const router = express.Router();
const scholarsController = require('../Controller/scholarsController.js');
//const authenticateToken = require('../middleware/authentication.js');

router.post('/registerScholar', scholarsController.registerScholar);
router.put('/updateScholar/:id', scholarsController.updateScholar);
router.delete('/deleteScholar/:id', scholarsController.deleteScholar);

module.exports = router;