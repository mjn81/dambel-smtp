exports.PORT = 3000;

exports.getEnv = (key) => {
  const value = process.env[key];
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


exports.TWO_DAY_MILISECOND = 2 * 24 * 60 * 60 * 1000;