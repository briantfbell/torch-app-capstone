// adminAuth middleware — same as auth, but also enforces that the caller
// has role 'admin'. Use this instead of auth on routes that should be
// restricted to admin users only.
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

    if (!req.user.role?.includes('admin')) {
      return res.status(403).json({ message: 'Admin access only.' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};
