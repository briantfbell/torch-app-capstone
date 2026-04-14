// hrhAuth middleware — same as auth, but also enforces that the caller
// has role 'hrh' or 'admin'. Use this on routes that should be
// restricted to HRH users and admins only.
//
// Returns 403 Forbidden (not 401) when the token is valid but the role
// is insufficient — this lets the frontend distinguish "not logged in"
// from "logged in but not permitted".

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

    req.user = decoded; // assign user obj {id, email, role}

    if (!req.user.role?.includes('hrh')) {
      return res.status(403).json({ message: 'HRH access only.' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};
