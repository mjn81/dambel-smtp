const nodeMailer = require('nodemailer');
const { getEnv } = require('../constants');

class NodeMailer {
	static instance;
	user;
	password;
	transporter;

	constructor() {
		this.user = getEnv('APP_EMAIL_USER');
		this.password = getEnv('APP_EMAIL_PASSWORD');
		this.transporter = nodeMailer.createTransport({
			service: getEnv('APP_EMAIL_HOST'),
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


module.exports = NodeMailer;