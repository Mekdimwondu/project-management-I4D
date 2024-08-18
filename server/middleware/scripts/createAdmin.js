require('dotenv').config({path:"../../.env"})
const mongoose = require('mongoose');
const User = require('../../models/user');

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const mongoUri = process.env.MONGO_URI;

// Check if mongoUri is defined
if (!mongoUri) {
  console.error('Error: MONGO_URI is not defined in the environment variables');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoUri, { })
  .then(() => {
    console.log('MongoDB connected');
    createAdmin();
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin already exists');
      return;
    }

    const admin = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'adminpassword',
      role: 'Admin',
    });

    await admin.save();
    console.log('Admin user created');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
};
