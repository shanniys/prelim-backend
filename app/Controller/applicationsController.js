const db = require('../Config/db');

const registerApplication = async(req, res) => {

    try {
  
        const {applicant_id, stauts} = req.body;
  
       if (!applicant_id || !stauts) {
            return res.status(400).json({error: 'Please applicant_id, stauts'});
     }
  
        const insertApplicationsQuery = 'INSERT INTO applications (applicant_id, stauts, submission_date) VALUES (?, ?, DATE_FORMAT(NOW(), "%m-%d-%Y %h:%i:%p")) ';
        await db.promise().execute(insertApplicationsQuery, [applicant_id, stauts]);

        res.status(201).json({ message: 'New application inserted successfully'});
    } catch (error) {
  
        console.error('Error registering application:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
  };
  const updateApplication = async (req, res) => {
    let application_id = req.params.id;
    const { applicant_id, stauts } = req.body;

    if (!application_id || !applicant_id || !stauts) {
        return res.status(400).send({ error: 'Please provide applicant_id and stauts' });
    }

    try {
        db.query('UPDATE applications SET applicant_id = ?, stauts = ? WHERE application_id = ?', 
            [applicant_id, stauts, application_id], 
            (err, result, fields) => {
                if (err) {
                    console.error('Error updating application information:', err);
                    res.status(500).json({ message: 'Internal Server Error' });
                } else {
                    res.status(200).json(result);
                }
            });
    } catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteApplication = (req, res) => {
    let application_id = req.params.id;

    if (!application_id) {
        return res.status(400).send({ error: true, message: 'Please provide application_id' });
    }

    try {
        
        db.query('DELETE FROM employees WHERE application_id = ?', application_id, (err, result, fields) => {
            if (err) {
                console.error('Error deleting associated employees:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                
                db.query('DELETE FROM applications WHERE application_id = ?', application_id, (err, result, fields) => {
                    if (err) {
                        console.error('Error deleting application:', err);
                        res.status(500).json({ message: 'Internal Server Error' });
                    } else {
                        res.status(200).json(result);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { registerApplication, updateApplication, deleteApplication }
