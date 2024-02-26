const db = require('../Config/db');

const registerScholar = async (req, res) => {
    try {
        const {first_name, middle_name, last_name, school_institution, amount, status, application_id} = req.body;

        if (!first_name || !middle_name || !last_name || !school_institution || !amount || !status || !application_id) {
            return res.status(400).json({ error: 'Please provide first_name, middle_name, last_name, school_institution, amount, status, and application_id' });
        }

        // Check if the application_id exists in the applications table
        const [rows] = await db.promise().execute('SELECT * FROM applications WHERE application_id = ?', [application_id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'The provided application_id does not exist' });
        }

        const insertScholarsQuery = 'INSERT INTO scholars (first_name, middle_name, last_name, school_institution, amount, status, application_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await db.promise().execute(insertScholarsQuery, [first_name, middle_name, last_name, school_institution, amount, status, application_id]);

        res.status(201).json({ message: 'Scholar registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateScholar = async(req, res) => {

    let scholars_id = req.params.id;

    const {first_name, middle_name, last_name, school_institution, amount, status} = req.body;

    if (!first_name || !middle_name || !last_name || !school_institution || !amount || !status) {
        return res.status(400).send({error: 'Please provide first_name, middle_name, last_name, school_institution, amount, status'});
 }

    try {

        db.query('UPDATE scholars SET first_name = ?, middle_name = ?, last_name = ?, school_institution = ?, amount = ?, status = ? WHERE scholars_id = ?', 
        [first_name, middle_name, last_name, school_institution, amount, status, scholars_id], (err, result, fields) => {

            if (err) {
                console.error('Error updating scholars information:', err);
                res.status(500).json({ message: 'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading scholars:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }

};

const deleteScholar = (req, res) => {
    let scholars_id = req.params.id;

    if (!scholars_id) {
        return res.status(400).send({ error: true, message: 'Please provide scholars_id' });
    }

    try {
        db.query('DELETE FROM scholars WHERE scholars_id = ?', scholars_id, (err, result, fields) => {
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

module.exports = { registerScholar, updateScholar, deleteScholar }