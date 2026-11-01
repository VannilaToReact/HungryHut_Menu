function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email.trim());
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim();
}

module.exports = {
  isValidEmail,
  isValidPassword,
  sanitizeString
};

