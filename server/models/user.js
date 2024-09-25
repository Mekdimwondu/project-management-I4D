const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema definition
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  gender: { type: String },
  jobType: { type: String },
  workType: { type: String },
  experienceLevel: { type: String },
  role: { type: String, enum: ['Admin', 'User'], default: 'User' },
  bio: { type: String },
  mustChangePassword: { type: Boolean, default: true }, 
  resetPasswordToken: { type: String }, // Add reset token field
  resetPasswordExpires: { type: Date }, // Add token expiration field
  resetCode: { type: String },  // Store the 4-digit reset code
  resetCodeExpires: { type: Date },
});

UserSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Comparing passwords for login
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

// Updating the password method
UserSchema.methods.updatePassword = async function(newPassword) {
  console.log('New password to set:', newPassword);

  // Assign the new password (this will trigger the pre('save') hook to hash it)
  this.password = newPassword;

  // Ensure that the user no longer needs to change their password
  this.mustChangePassword = false;

  // Save the user (the password will be hashed in the pre-save hook)
  await this.save();
  console.log('Password has been updated and saved.');
};



// Prevent multiple model registrations
let User;
try {
  User = mongoose.model('User');
} catch (error) {
  User = mongoose.model('User', UserSchema);
}

module.exports = User;
