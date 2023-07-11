const app = require('express')();
const nodeMailer = require('nodemailer');
const Yup = require('yup');


class NodeMailer {
	static instance;
	user;
	password;
	transporter;

	constructor() {
		this.user = 'dambel.corp@outlook.com';
		this.password = 'hello world';
		this.transporter = nodeMailer.createTransport({
			service: getEnv('APP_EMAIL_SERVICE'),
			auth: {
				user: this.user,
				pass: this.password,
			},
		});
	}

	static getInstance() {
		if (!NodeMailer.instance) {
			NodeMailer.instance = new NodeMailer();
		}
		return NodeMailer.instance;
	}

	getTransporter() {
		return this.transporter;
	}

	getEmail() {
		return this.user;
	}
}

const getMailer = NodeMailer.getInstance;

const sendEmail = async (to, subject, html) => {
	const mailer = getMailer();
	const transporter = mailer.getTransporter();
	const mailOptions = {
		from: mailer.getEmail(),
		to,
		subject,
		html,
	};

	await transporter.sendMail(mailOptions);
};

const reqSchema = Yup.object({
	email: Yup.string().email().required(),
	name: Yup.string().required(),
});

app.post('/api/v1/email/otp', (req, res) => {
	const { email, name, code } = req.body;
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
	// send email with nodemailer
	try {
		reqSchema.validate({ email, name });
		// send email

		return res.status(200).end({ message: 'Email sent' });
	} catch (error) {
		return res.status(400).end({ message: error.message });
	}
});

app.post('/api/v1/email/reset', (req, res) => {
	const { email, name, code } = req.body;
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
	// send email with nodemailer
	try {
		reqSchema.validate({ email, name });
		// send email

		return res.status(200).end({ message: 'Email sent' });
	} catch (error) {
		return res.status(400).end({ message: error.message });
	}
});

app.get('/api', (req, res) => {
	res.setHeader('Content-Type', 'text/html');
	res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
	res.end(`Hello! Post Email to /api/v1/email/otp or reset`);
});

module.exports = app;
