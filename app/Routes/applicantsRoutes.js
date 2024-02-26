const express = require('express');
const router = express.Router();
const applicantsController = require('../Controller/applicantsController.js');
//const authenticateToken = require('../middleware/authentication.js');

router.post('/registerApplicants', applicantsController.registerApplicants);
router.put('/updateApplicants/:id', applicantsController.updateApplicants);
router.delete('/deleteApplicants/:id', applicantsController.deleteApplicants);

module.exports = router;