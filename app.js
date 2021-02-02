const express = require('express');
const app = express();

const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');


// Serve static files from the React app
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Put all API endpoints under '/api'
let localTransporter;
let localMailOptions;
let localMailTo;
localTransporter = require('./email').transporter;
localMailOptions = require('./email').mailOptions;
localMailTo = require('./email').mailTo;
const serverEmail = process.env.EMAIL || localMailOptions;
const mailTo = process.env.MAILTO || localMailTo;
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
		const { firstName, lastName, email, phone, message, mornings, evenings } = req.body;
		if (!message) throw 'could not send email';
		let availability;
		if (mornings && evenings) {
			availability = 'Best time to reach me: mornings or evenings';
		} else if (mornings) {
			availability = 'Best time to reach me: mornings';
		} else if (evenings) {
			availability = 'Best time to reach me: evenings';
		} else {
			availability = '';
		}
		transporter.sendMail(
			{
				from: serverEmail,
				to: mailTo,
				subject: `New message from Website visitor`,
				text: `From: ${firstName} ${lastName} \n \n message: ${message} \n \n email: ${email}  ${
					phone ? ' \n \n phone number: ' + phone : ''
				} ${availability ? '\n \n ' + availability : availability}`,
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
