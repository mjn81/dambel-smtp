const dotenv = require('dotenv');
exports.PORT = 3000;

exports.getEnv = (key) => {
  const result = dotenv.config();
  if (result.error) {
    throw result.error;
  }
  const value = result.parsed[key];
  if (!value) {
    throw new Error(`[ERROR] Environment variable ${key} is not set`);
  }
  return value;
}

exports.getOtpEmailContent = ({code, name}) => {
  return `<h2>Hi ${name},</h2><br />
<p>There was a request to change your password!<br/>
If you did not make this request then please ignore this email.<br/>
Otherwise, please back to the website and complete your reset password.</p><br/>
<strong>Verification Code : ${code}</strong>`;
}

exports.getVerifyEmailContent = ({ code, name }) => {
  return `<h2>Hi ${name},</h2><br />
<strong>Verification Code : ${code}</strong>
<p>Enter this code in our website to activate your account.</p><br />
<p>If you have any questions, send us an email dambelcorp@outlook.com.</p><br />
<p>We’re glad you’re here!</p><br />
<p>The Dambel team</p>
`;
}