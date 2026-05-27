require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const { User } = require('./models');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅  Connected to MongoDB');

  const email    = 'admin@school.edu.np';
  const password = 'Admin@1234';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('ℹ️   Admin already exists — skipping seed.');
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashed, role: 'admin' });

  console.log('');
  console.log('🎉  Admin account created!');
  console.log('    Email    :', email);
  console.log('    Password :', password);
  console.log('');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
