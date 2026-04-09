const authServices = require('../services/authServices');

exports.getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await authServices.getMe(token);

    res.status(200).json({ user: user });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const newUser = await authServices.registerUser(req.body);

    res.status(201).json({
      newUser: newUser,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await authServices.login(email, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ token });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error.',
    });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};
