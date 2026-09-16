const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, role, experience, skills, preferredLanguage, resumeSummary } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (experience) user.experience = experience;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (resumeSummary !== undefined) user.resumeSummary = resumeSummary;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
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

module.exports = {
  getProfile,
  updateProfile,
};
