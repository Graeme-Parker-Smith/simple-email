const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

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

app.get('/', function (req, res) {
	res.send('hello World!');
});

app.get('/api/test', (req, res) => {
	console.log('test route activated');
	res.send('you got the test route');
});

app.post('/api/sendemail', (req, res) => {
	console.log('sendemail request received.');
	try {
		console.log('req.body is: ', req.body);
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
				text: `Name: ${name} \n \n Email: ${email} \n \n location: ${location} \n \n message: ${message}`,
			},
			function (error, info) {
				if (error) {
					return res.status(422).send({ error: 'could not send email' });
				} else {
					console.log('Email sent: ' + info.response);
					return res.sendStatus(200);
				}
			}
		);
	} catch (err) {
		console.log(err);
		return res.status(422).send({ error: 'could not send email' });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
	console.log('Example app listening on port 3000!');
});
