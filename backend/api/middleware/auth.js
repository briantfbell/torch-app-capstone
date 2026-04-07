// auth middleware — protects routes that require any logged-in user.
// Reads the httpOnly 'token' cookie set by the login endpoint, verifies
// the JWT signature, and attaches the decoded payload to req.user so
// downstream controllers can access the caller's id, email, and role.
//
// Frontend team: the cookie is set automatically by the browser on login.
// Requests to protected routes must include credentials (withCredentials: true
// in axios, or credentials: 'include' in fetch).

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: 'You need to login to view this content.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(token, process.env.JWT);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
