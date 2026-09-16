const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_interviewai_jwt_key_2026_production_grade', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, experience, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'Full Stack Developer',
      experience: experience || 'Fresher',
      skills: skills || ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        experience: user.experience,
        skills: user.skills,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        experience: user.experience,
        skills: user.skills,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Demo Quick Login (Instant access for examiners/evaluators)
// @route   POST /api/auth/demo
const demoLogin = async (req, res, next) => {
  try {
    let demoUser = await User.findOne({ email: 'demo@interviewai.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Morgan',
        email: 'demo@interviewai.com',
        password: 'password123',
        role: 'Full Stack Developer',
        experience: 'Fresher',
        skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Python', 'Tailwind CSS'],
        preferredLanguage: 'javascript',
      });
    }

    const token = generateToken(demoUser._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: demoUser._id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        experience: demoUser.experience,
        skills: demoUser.skills,
        preferredLanguage: demoUser.preferredLanguage,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        experience: user.experience,
        skills: user.skills,
        preferredLanguage: user.preferredLanguage,
        resumeSummary: user.resumeSummary,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
};

module.exports = {
  register,
  login,
  demoLogin,
  getMe,
  logout,
};
