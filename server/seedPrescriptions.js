require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Prescription = require('./models/Prescription');
const { hashPassword } = require('./utils/auth');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = 'demo@medicare.com';
    const password = 'Demo12345!';

    let user = await User.findOne({ email });
    if (!user) {
      const { hash, salt } = hashPassword(password);
      user = await User.create({ name: 'Demo User', email, passwordHash: hash, passwordSalt: salt });
      console.log('Created demo user:', email);
    } else {
      console.log('Using existing demo user:', email);
    }

    await Prescription.deleteMany({ user: user._id });

    const now = new Date();
    const d = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const docs = [
      {
        user: user._id,
        name: 'Amoxicillin 500mg',
        doctor: 'Dr. Sarah Johnson',
        rxNumber: 'RX-1001',
        prescribedAt: d(-20),
        nextRefillAt: d(10),
        refillsLeft: 2,
        status: 'active',
        note: 'Take with food',
      },
      {
        user: user._id,
        name: 'Lisinopril 10mg',
        doctor: 'Dr. Michael Chen',
        rxNumber: 'RX-1002',
        prescribedAt: d(-35),
        nextRefillAt: d(5),
        refillsLeft: 1,
        status: 'active',
      },
      {
        user: user._id,
        name: 'Metformin 500mg',
        doctor: 'Dr. Robert Williams',
        rxNumber: 'RX-2001',
        prescribedAt: d(-2),
        refillsLeft: 3,
        status: 'pending',
        note: 'Verification in progress',
      },
      {
        user: user._id,
        name: 'Prednisone 10mg',
        doctor: 'Dr. Michael Chen',
        rxNumber: 'RX-3001',
        prescribedAt: d(-120),
        expiredAt: d(-15),
        refillsLeft: 0,
        status: 'expired',
      },
    ];

    const inserted = await Prescription.insertMany(docs);
    console.log(`Seeded prescriptions: ${inserted.length}`);
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
}

run();
