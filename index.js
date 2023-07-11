import express from "express";
import * as Yup from "yup";
import nodeMailer from "nodemailer";


const app = express();

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

	static getInstance(){
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

const sendEmail = async (
	to,
	subject,
	html,
) => {
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
})
    



app.post("/api/v1/email/otp", async (req, res) => {
  const { email, name, code } = req.body;
  // send email with nodemailer
  try {
    await reqSchema.validate({ email, name });
    // send email



    return res.status(200).json({ message: "Email sent" }); 
  }
  catch (error) {
   return res.status(400).json({ message: error.message });
  }
});

app.post("/api/v1/email/reset", async (req, res) => {
  const { email, name, code } = req.body;
  // send email with nodemailer
  try {
    await reqSchema.validate({ email, name });
    // send email


    return res.status(200).json({ message: "Email sent" }); 
  }
  catch (error) {
   return res.status(400).json({ message: error.message });
  }
});

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Dambel Smtp Api!" });
})

app.listen(3000, () => {


});