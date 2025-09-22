require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const { hashPassword } = require('./utils/auth');

async function run() {
  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not set');
    await mongoose.connect(process.env.MONGODB_URI);

    const email = process.env.ADMIN_EMAIL || 'admin@medicare.com';
    const name = process.env.ADMIN_NAME || 'Admin User';
    const password = process.env.ADMIN_PASSWORD || 'Admin@12345';

    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      // Ensure role is admin; if user exists, update role and password if desired
      const updates = {};
      if (user.role !== 'admin') updates.role = 'admin';
      if (process.env.RESET_ADMIN_PASSWORD === 'true') {
        const { hash, salt } = hashPassword(password);
        updates.passwordHash = hash; updates.passwordSalt = salt;
      }
      if (Object.keys(updates).length) {
        await User.updateOne({ _id: user._id }, { $set: updates });
        console.log('Updated existing user to admin:', email);
      } else {
        console.log('Admin user already present:', email);
      }
    } else {
      const { hash, salt } = hashPassword(password);
      user = await User.create({ name, email: email.toLowerCase(), passwordHash: hash, passwordSalt: salt, role: 'admin' });
      console.log('Created admin user:', email);
    }
  } catch (e) {
    console.error('Admin seed failed:', e.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
