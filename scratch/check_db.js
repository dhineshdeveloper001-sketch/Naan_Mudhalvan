import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: 'backend/.env' });

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected');
    
    // Define User schema simply for the check
    const User = mongoose.model('User', new mongoose.Schema({ email: String, name: String }));
    
    const user = await User.findOne({ email: 'admin@gravityflow.com' });
    console.log('User found:', user ? user.name : 'NOT FOUND');
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
