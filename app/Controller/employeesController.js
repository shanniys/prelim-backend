const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../Config/db');


const secretKey = 'roselle-secret-key';

//Employees
const registerEmployees = async (req, res) => {

    try {
        const { employee_name, employee_position, employee_cp, employee_email, username, password, applicant_id, application_id, scholars_id } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!employee_name || !employee_position || !employee_cp || !employee_email || !username || !password || !applicant_id || !application_id || !scholars_id ) {
            return res.status(400).send({ error: 'Missing required parameters' });
        }

        
        const checkApplicationQuery = 'SELECT * FROM applications WHERE applicant_id = ?';
        const [applicationRows] = await db.promise().execute(checkApplicationQuery, [application_id]);

        if (applicationRows.length === 0) {
            return res.status(400).json({ error: 'Application with the provided application_id does not exist' });
        }

        const checkScholarsQuery = 'SELECT * FROM scholars WHERE scholars_id = ?';
        const [scholarsRows] = await db.promise().execute(checkScholarsQuery, [scholars_id]);

        if (scholarsRows.length === 0) {
            return res.status(400).json({ error: 'Scholar with the provided applicant_id does not exist' });
        }

        const checkApplicantQuery = 'SELECT * FROM applicants WHERE applicant_id = ?';
        const [applicantRows] = await db.promise().execute(checkApplicantQuery, [applicant_id]);

        if (applicantRows.length === 0) {
            return res.status(400).json({ error: 'Applicant with the provided applicant_id does not exist' });
        }

        const parameters = [employee_name, employee_position, employee_cp, employee_email, username, password, applicant_id, application_id, scholars_id ];


        const filteredParameters = parameters.map(param => param !== undefined ? param : null);

        
        const insertEmployeeQuery = 'INSERT INTO employees (employee_name, employee_position, employee_cp, employee_email, username, password, applicant_id, application_id, scholars_id ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await db.promise().execute(insertEmployeeQuery, [employee_name, employee_position, employee_cp, employee_email, username, hashedPassword, applicant_id, application_id, scholars_id]);


        res.status(201).json({ message: 'Employee registered successfully' });
    } catch (error) {
        console.error('Error registering employee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const loginEmployees = async (req, res) => {

    try {
        const { username, password } = req.body;

        const getEmployeesQuery = 'SELECT * FROM employees WHERE username = ?';
        const [rows] = await db.promise().execute(getEmployeesQuery, [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password'});
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password'});
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, {expiresIn: '1h'});

        res.status(200).json({ token });
    }   catch (error) {
        console.error('Error logging in Employee:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};


const getAllemployees = (req, res) =>  {

    try {

        db.query('SELECT employee_id, employee_name, employee_position, employee_cp, employee_email, username, password, applicant_id, application_id, scholars_id FROM employees', (err, result) => {

            if (err) {
                console.error('Error fetching items:', err);
                res.status(500).json({ message: 'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading employees:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};

const getemployeesById = (req, res) => {
    let employee_id = req.params.id;

    if (!employee_id) {
        return res.status(400).send({ error: true, message: 'Please provide employee_id'});
    }
    
    try {

        db.query ('SELECT employee_id, employee_name, employee_position, employee_cp, employee_email, username, password, applicant_id, application_id, scholars_id FROM employees WHERE employee_id = ?', employee_id, (err, result) => {

        if (err) {
            console.error('Error fetching items:', err);
            res.status(500).json({ message: 'Internal Server Error'});
        } else {
            res.status(200).json(result);
        }
        });

    } catch (error) {

        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};

const updateemployees = async (req, res) => {
    let employee_id = req.params.id;

    const {employee_name, employee_position, employee_cp, employee_email, username, password, applicant_id, application_id, scholars_id} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!employee_id || !employee_name || !employee_position || !employee_cp || !employee_email || !username || !password || !applicant_id || !application_id || !scholars_id) {
        return res.status(400).send({ error: user, message: 'Please provide employees information'});
    }

    try {

        db.query('UPDATE employees SET employee_name = ?, employee_position = ?, employee_cp = ?, employee_email = ?, username = ?, password = ?, applicant_id = ?, application_id = ?, scholars_id = ? WHERE employee_id = ?', [employee_name, employee_position, employee_cp, employee_email, username, hashedPassword, applicant_id, application_id, scholars_id, employee_id], (err, result, fields) => {

            if (err) {
                console.error('Error updating item:', err);
                res.status(500).json({ message: 'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};

const deleteemployees = (req, res) => {
    let employee_id = req.params.id;

    if (!employee_id) {
        return res.status(400).send({ error: true, message: 'Please provide employee_id' });
    }

    try {
        db.query('DELETE FROM employees WHERE employee_id = ?', employee_id, (err, result, fields) => {
            if (err) {
                console.error('Error deleting item:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
});

    } catch (error) {

        console.error('Error loading employees:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};








//Applicants
const getAllApplicants = (req, res) =>  {

    try {

        db.query('SELECT applicant_id, first_name, middle_name, last_name, address, contact_number, email, date_of_birth, gender, course, school, year_level, family_income, employment_status, parent_guardian_name, parent_guardian_contact, application_status FROM applicants', (err, result) => {

            if (err) {
                console.error('Error fetching items:', err);
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


const geteApplicantById = (req, res) => {
    let applicant_id = req.params.id;

    if (!applicant_id) {
        return res.status(400).send({ error: true, message: 'Please provide applicant_id'});
    }
    
    try {

        db.query ('SELECT applicant_id, first_name, middle_name, last_name, address, contact_number, email, date_of_birth, gender, course, school, year_level, family_income, employment_status, parent_guardian_name, parent_guardian_contact, application_status FROM applicants WHERE applicant_id = ?', applicant_id, (err, result) => {

        if (err) {
            console.error('Error fetching items:', err);
            res.status(500).json({ message: 'Internal Server Error'});
        } else {
            res.status(200).json(result);
        }
        });

    } catch (error) {

        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};


const UpdateApplicant = async (req, res) => {
    let applicant_id = req.params.id;

    const { application_status } = req.body;
    

    if (!applicant_id || !application_status) {
        return res.status(400).send({ error: true, message: 'Please provide application_status' });
    }

    try {

        db.query('UPDATE applicants SET application_status = ? WHERE applicant_id = ?', [application_status, applicant_id], (err, result, fields) => {

            if (err) {
                console.error('Error updating item:', err);
                res.status(500).json({ message: 'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};


const applicants = (req, res) => {
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



//Scholars
const getAllScholars = (req, res) =>  {

    try {

        db.query('SELECT scholars_id, first_name, middle_name, last_name, school_institution, amount, status, application_id FROM scholars', (err, result) => {

            if (err) {
                console.error('Error fetching items:', err);
                res.status(500).json({ message: 'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading Scholars:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};


const getScholarById = (req, res) => {
    let scholars_id = req.params.id;

    if (!scholars_id) {
        return res.status(400).send({ error: true, message: 'Please provide scholars_id'});
    }
    
    try {

        db.query ('SELECT scholars_id, scholars_id, first_name, middle_name, last_name, school_institution, amount, status, application_id FROM scholars WHERE scholars_id = ?', scholars_id, (err, result) => {

        if (err) {
            console.error('Error fetching items:', err);
            res.status(500).json({ message: 'Internal Server Error'});
        } else {
            res.status(200).json(result);
        }
        });

    } catch (error) {

        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};


const updateScholar = async (req, res) => {
    let scholars_id = req.params.id;

    const { first_name, middle_name, last_name, school_institution, amount, status, application_id } = req.body;
    

    if (!scholars_id || !scholars_id || !first_name || !middle_name || !last_name || !school_institution || !amount || !status || !application_id) {
        return res.status(400).send({ error: true, message: 'Please provide needed Information' });
    }

    try {

        db.query('UPDATE scholars SET scholars_id = ?, first_name = ?, middle_name = ?, last_name = ?, school_institution = ?, amount = ?, status = ?, application_id = ? WHERE scholars_id = ?', [scholars_id, first_name, middle_name, last_name, school_institution, amount, status, application_id, scholars_id], (err, result, fields) => {

            if (err) {
                console.error('Error updating item:', err);
                res.status(500).json({ message: 'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading Scholars:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};


const deleteScholar = (req, res) => {
    let scholars_id = req.params.id;

    if (!scholars_id) {
        return res.status(400).send({ error: true, message: 'Please provide scholars_id' });
    }

    try {
        
        db.query('DELETE FROM employees WHERE scholars_id = ?', scholars_id, (err, result, fields) => {
            if (err) {
                console.error('Error deleting associated employees:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
        
                db.query('DELETE FROM scholars WHERE scholars_id = ?', scholars_id, (err, result, fields) => {
                    if (err) {
                        console.error('Error deleting scholar:', err);
                        res.status(500).json({ message: 'Internal Server Error' });
                    } else {
                        res.status(200).json(result);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error deleting scholar:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//Applications
const getAllapplications = (req, res) =>  {

    try {

        db.query('SELECT application_id, applicant_id, stauts, submission_date FROM applications', (err, result) => {

            if (err) {
                console.error('Error fetching items:', err);s
                res.status(500).json({ message: 'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading Scholars:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};


const getapplicationById = (req, res) => {
    let application_id = req.params.id;

    if (!application_id) {
        return res.status(400).send({ error: true, message: 'Please provide application_id'});
    }
    
    try {

        db.query ('SELECT application_id, applicant_id, stauts, submission_date FROM applications WHERE application_id = ?', application_id, (err, result) => {

        if (err) {
            console.error('Error fetching items:', err);
            res.status(500).json({ message: 'Internal Server Error'});
        } else {
            res.status(200).json(result);
        }
        });

    } catch (error) {

        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};


const Updateapplication = async (req, res) => {
    let application_id = req.params.id;

    const { stauts } = req.body;
    

    if (!application_id || !stauts) {
        return res.status(400).send({ error: true, message: 'Please provide stauts' });
    }

    try {

        db.query('UPDATE applications SET stauts = ? WHERE application_id = ?', [stauts, application_id], (err, result, fields) => {

            if (err) {
                console.error('Error updating item:', err);
                res.status(500).json({ message: 'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};


const deleteapplication = (req, res) => {
    let application_id = req.params.id;

    if (!application_id) {
        return res.status(400).send({ error: true, message: 'Please provide application_id' });
    }

    try {
        db.query('DELETE FROM applications WHERE application_id = ?', application_id, (err, result, fields) => {
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



module.exports= { registerEmployees, loginEmployees, getAllemployees, getemployeesById, updateemployees, deleteemployees,
    getAllApplicants, geteApplicantById, UpdateApplicant, applicants,
getAllScholars, getScholarById, updateScholar, deleteScholar, 
getAllapplications, getapplicationById, Updateapplication, deleteapplication };