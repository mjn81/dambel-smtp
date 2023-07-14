var colors = require('colors');
const express = require('express');
const app = express();
const Yup = require('yup');
const getMailer = require('./services/mail').getInstance;
const {
	PORT,
	getOtpEmailContent: getResetEmailContent,
	getEnv,
	getVerifyEmailContent,
	TWO_DAY_MILISCOND,
} = require('./constants');

const sentMails = new Map();

const LOGGER_TYPES = {
	success: '[SUCCESS]',
	error: '[ERROR]',
	info: '[INFO]'
}

const logger = (type,...msgs) => {
	switch (type) {
		case LOGGER_TYPES.error:
			console.log(type.red, ...msgs);
			break;
		case LOGGER_TYPES.info:
			console.log(type.blue, ...msgs);
			break;
		case LOGGER_TYPES.success:
			console.log(type.green, ...msgs);
			break;
	}
}

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/v1/email/verify', async (req, res) => {
	// send email with nodemailer
	try {
		const { email, name, code } = req.body;
		await reqSchema.validate({ email, name });
		const isSent = sentMails.get(email);
		const sentTime = new Date() - isSent;
		if (!!isSent && sentTime < TWO_DAY_MILISCOND)
			return res.status(200).json({ message: 'Email sent' });
		sentMails.set(email, new Date());
		// send email
		sendEmail(email, 'Verify Account', getVerifyEmailContent({ code, name }));
		return res.status(201).json({ message: 'Email sent' });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
});

app.post('/api/v1/email/reset', async (req, res) => {
	try {
		const { email, name, code } = req.body;
		await reqSchema.validate({ email, name });
		const isSent = sentMails.get(email);
		const sentTime = new Date() - isSent;
		if (!!isSent && sentTime < TWO_DAY_MILISCOND)
			return res.status(200).json({ message: 'Email sent' });
		sentMails.set(email , new Date());
		// send email
		sendEmail(email, 'Reset password', getResetEmailContent({ code, name }));
		return res.status(201).json({ message: 'Email sent' });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
});

app.get('/api', (req, res) => {
	res.json({
		message: 'Welcome to Dambel Smtp API',
	});
});

app.get('/', (req, res) => {
	return res.send(`Welcome to Dambel Smtp!!`);
});

// LOGGER console
app.use((req, res) => {
	if (req.statusCode > 399) {
		logger(LOGGER_TYPES.error, `REQ: ${req.url}`, `BODY: ${req.body}`, `ERROR: ${res.statusCode}`);
	} else {

		logger(LOGGER_TYPES.info, `REQ: ${req.url}`, `BODY: ${req.body}`);
	}
});

app.listen(PORT, () => {
	logger(LOGGER_TYPES.success , `Server listening on port ${PORT}`);
});

module.exports = app;
