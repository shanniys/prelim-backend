const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const employeesRoutes = require('./app/Routes/employeesRoutes.js');
const applicantsRoutes = require('./app/Routes/applicantsRoutes.js');
const applicationsRoutes = require('./app/Routes/applicationRoutes.js');
const scholarsRoutes = require('./app/Routes/scholarsRoutes.js');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', employeesRoutes);
app.use('/api', applicantsRoutes);
app.use('/api', applicationsRoutes);
app.use('/api', scholarsRoutes);


const PORT = process.env.PORT || 3001;
app.get('/', (req, res) => {
    res.json({ message: 'Restful API Backend Using ExpressJS' });
});

app.listen(PORT, () => { 
 	console.log(`Server is running on http://localhost:${PORT}`); 
});	
	
	// const express = require('express');
	// const bodyParser = require('body-parser');
	// const cors = require('cors');
	// const roleRoutes = require('./node_modules/app/routes/roleRoutes.js');
	//const userRoutes = require('./node_modules/app/routes/userRoutes.js');
	// const indicatorRoutes = require('app/routes/indicatorRoutes.js');

	// const app = express();

	// app.use(cors());
	// app.use(bodyParser.json());

	// app.use('/api', roleRoutes);
	// app.use('/api', userRoutes);
	// app.use('/api', indicatorRoutes);

	// const PORT = process.env.PORT || 3001;

	// app.get('/', (req, res) => {
  	// res.json({ message: 'Restful API Backend Using ExpresJS' });
	// });

	// app.listen(PORT, () => { 
	// 	console.log(`Server is running on http://localhost:${PORT}`); 
	// });
	