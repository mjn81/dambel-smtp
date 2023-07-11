const express = require('express');
const app = express();
const Yup = require('yup');
const getMailer = require('./services/mail').getInstance;
const { PORT, getOtpEmailContent: getResetEmailContent, getEnv, getVerifyEmailContent } = require('./constants');

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
		// send email
		sendEmail(
			email,
			'Verify Account',
			getVerifyEmailContent({ code, name })
		);
		return res.status(201).json({ message: 'Email sent' });
	} catch (error) {
		return res.status(400).json({ message: error.message });
	}
});

app.post('/api/v1/email/reset', async (req, res) => {
	try {
		const { email, name, code } = req.body;
		await reqSchema.validate({ email, name });
		// send email
		sendEmail(
			email,
			'Reset password',
			getResetEmailContent({ code, name })
		);
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
})

app.listen(PORT, () => {
	console.log(`[MESSAGE] Server listening on port ${PORT}`)
});

module.exports = app;
