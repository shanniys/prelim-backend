const express = require('express');
const router = express.Router();
const employeesController = require('../Controller/employeesController.js');
const authenticateToken = require('../middleware/authenticateToken.js');

//Router for Employees
router.post('/registerEmployees', employeesController.registerEmployees);
router.post('/loginEmployees', employeesController.loginEmployees);
router.get('/employees', authenticateToken, employeesController.getAllemployees);
router.get('/employees/:id', authenticateToken, employeesController.getemployeesById);
router.put('/updateEmployees/:id', authenticateToken, employeesController.updateemployees);
router.delete('/employees/:id', authenticateToken, employeesController.deleteemployees);

//Router for Applicants
router.get('/applicants', authenticateToken, employeesController.getAllApplicants);
router.get('/applicant/:id', authenticateToken, employeesController.geteApplicantById);
router.put('/UpdateApplicant/:id', authenticateToken, employeesController.UpdateApplicant);
router.delete('/applicants/:id', authenticateToken, employeesController.applicants);

//Scholars
router.get('/scholars', authenticateToken, employeesController.getAllScholars);
router.get('/scholar/:id', authenticateToken, employeesController.getScholarById);
router.put('/UpdateScholar/:id', authenticateToken, employeesController.updateScholar);
router.delete('/deleteScholar/:id', authenticateToken, employeesController.deleteScholar);

//Applications
router.get('/applications', authenticateToken, employeesController.getAllapplications);
router.get('/applications/:id', authenticateToken, employeesController.getapplicationById);
router.put('/Application/:id', authenticateToken, employeesController.Updateapplication);
router.delete('/deleteapplication/:id', authenticateToken, employeesController.deleteapplication);

module.exports = router;