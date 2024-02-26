const db = require('../Config/db');

const registerApplicants = async(req, res) => {

    try {

        const {
                first_name,
                middle_name,
                last_name,
                address,
                contact_number,
                email,
                date_of_birth,
                gender,
                course,
                school,
                year_level,
                family_income,
                employment_status,
                parent_guardian_name,
                parent_guardian_contact
            } = req.body;
    
       if (!first_name || !middle_name || !last_name ||!address ||!contact_number ||!email ||!date_of_birth ||!gender ||!course 
            ||!school ||!year_level ||!family_income ||!employment_status ||!parent_guardian_name ||!parent_guardian_contact) {
            return res.status(400).json({error: 'Please provide first_name, middle_name, last_name, address, contact_number, email, date_of_birth, gender, course, school, year_level, family_income, employment_status, parent_guardian_name, parent_guardian_contact'});
     }

     const insertApplicantsQuery = 'INSERT INTO applicants (first_name, middle_name, last_name, address, contact_number, email, date_of_birth, gender, course, school, year_level, family_income, employment_status, parent_guardian_name, parent_guardian_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
     await db.promise().execute(insertApplicantsQuery, [first_name, middle_name, last_name, address, contact_number, email, date_of_birth, gender, course, school, year_level, family_income, employment_status, parent_guardian_name, parent_guardian_contact]);

        res.status(201).json({ message: 'Applicants has been registered succesfully!'});
    } catch (error) {

        console.error('Error registering applicants:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};

const updateApplicants = async(req, res) => {

    let applicant_id = req.params.id;

    const {
        first_name,
        middle_name,
        last_name,
        address,
        contact_number,
        email,
        date_of_birth,
        gender,
        course,
        school,
        year_level,
        family_income,
        employment_status,
        parent_guardian_name,
        parent_guardian_contact
    } = req.body;

    if (!applicant_id ||!first_name || !middle_name || !last_name ||!address ||!contact_number ||!email ||!date_of_birth ||!gender ||!course 
        ||!school ||!year_level ||!family_income ||!employment_status ||!parent_guardian_name ||!parent_guardian_contact ) {
        return res.status(400).send({error: 'Please provide first_name, middle_name, last_name, address, contact_number, email, date_of_birth, gender, course, school, year_level, family_income, employment_status, parent_guardian_name, parent_guardian_contact'});
 }

    try {

        db.query('UPDATE applicants SET first_name = ?, middle_name = ?, last_name = ?, address = ?, contact_number = ?, email = ?, date_of_birth = ?, gender = ?, course = ?, school = ?, year_level = ?, family_income = ?, employment_status = ?, parent_guardian_name = ?, parent_guardian_contact = ? WHERE applicant_id = ?', 
        [first_name, 
        middle_name, 
        last_name, 
        address, 
        contact_number, 
        email, 
        date_of_birth, 
        gender, 
        course, 
        school,
        year_level, 
        family_income, 
        employment_status, 
        parent_guardian_name, 
        parent_guardian_contact, 
        applicant_id], (err, result, fields) => {

            if (err) {
                console.error('Error updating applicants information:', err);
                res.status(500).json({ message: 'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading applicants:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }

};

const deleteApplicants = (req, res) => {
    let applicant_id = req.params.id;

    if (!applicant_id) {
        return res.status(400).send({ error: true, message: 'Please provide applicant_id' });
    }

    try {
        db.query('DELETE FROM applicants WHERE applicant_id = ?', applicant_id, (err, result, fields) => {
            if (err) {
                console.error('Error deleting item:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
});

    } catch (error) {

        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




module.exports = { registerApplicants, updateApplicants, deleteApplicants }
