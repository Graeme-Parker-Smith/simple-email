const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const compression = require('compression');
const path = require('path');

const app = express();

// Serve static files
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'fit')));

// Put all API endpoints under '/api'
let localTransporter;
let localMailOptions;
let localMailTo;
// localTransporter = require('./email').transporter;
// localMailOptions = require('./email').mailOptions;
// localMailTo = require('./email').mailTo;
const serverEmail = process.env.EMAIL || localMailOptions;
const transporter =
	localTransporter ||
	nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: serverEmail,
			pass: process.env.MAILPASS,
		},
	});

// app.get('/api/test', (req, res) => {
// 	console.log('test route activated');
// 	res.send('you got the test route');
// });

app.post('/api/sendemail', (req, res) => {
	// console.log('sendemail request received.');
	try {
		// console.log('req.body is: ', req.body);
		const { name, email, location, message } = req.body;
		if (!name || !email || !location || !message) throw 'could not send email';
		let mailTo;
		if (location === 'Boerne') {
			mailTo = process.env.MAILTOB;
		} else if (location === 'San Antonio') {
			mailTo = process.env.MAILTOS;
		} else {
			mailTo = localMailTo;
		}
		transporter.sendMail(
			{
				from: serverEmail,
				to: mailTo,
				subject: `New message from Website visitor`,
				text: `Name: ${name} \n \n Email: ${email} \n \n Location: ${location} \n \n Message: ${message}`,
			},
			function (error, info) {
				if (error) {
					return res.status(422).send({ error: 'could not send email' });
				} else {
					// console.log('Email sent: ' + info.response);
					return res.sendStatus(200);
				}
			}
		);
	} catch (err) {
		// console.log(err);
		return res.status(422).send({ error: 'could not send email' });
	}
});

app.get('/', (req, res) => {
	// console.log('ROOT ROUTE ACCESSED');
	res.sendFile(path.join(__dirname + '/fit/home.html'));
	// res.redirect('https://www.specializedfit.com');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
	console.log(`Specialized Fitness running on port ${PORT}`);
});
