const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      default: 'Full Stack Developer',
      trim: true,
    },
    experience: {
      type: String,
      enum: ['Fresher', '1-2 years', '3-5 years', 'Experienced'],
      default: 'Fresher',
    },
    skills: {
      type: [String],
      default: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python'],
    },
    preferredLanguage: {
      type: String,
      enum: ['python', 'javascript', 'java', 'cpp'],
      default: 'javascript',
    },
    resumeSummary: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
