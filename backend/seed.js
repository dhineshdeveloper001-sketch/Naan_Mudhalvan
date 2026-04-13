import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Employee from './models/Employee.js';
import Log from './models/Log.js';

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear all collections
    await Promise.all([User.deleteMany(), Employee.deleteMany(), Log.deleteMany()]);
    console.log('🗑  Collections cleared');

    // ── Users ──────────────────────────────────────────────────────────────
    const users = await User.create([
      { name: 'Admin User', email: 'admin@gravityflow.com', password: 'admin123', role: 'admin' },
      { name: 'HR Manager', email: 'hr@gravityflow.com', password: 'hr1234', role: 'hr' },
      { name: 'IT Manager', email: 'it@gravityflow.com', password: 'it1234', role: 'it' },
    ]);
    console.log('✅ Users seeded:', users.length);

    // ── Employees ──────────────────────────────────────────────────────────
    const employees = await Employee.create([
      {
        name: 'Sarah Chen', role: 'Senior Software Engineer',
        status: 'active', department: 'Engineering', stage: 'active',
        tasks: [{ title: 'Asset Provisioning', department: 'IT', status: 'completed', assignee: 'IT Support' }],
      },
      {
        name: 'Marcus Johnson', role: 'Product Manager',
        status: 'active', department: 'Product', stage: 'active',
        tasks: [{ title: 'Email Account Setup', department: 'IT', status: 'completed', assignee: 'SysAdmin' }],
      },
      {
        name: 'Priya Patel', role: 'UX Designer',
        status: 'hired', department: 'Design', stage: 'onboarding',
        tasks: [
          { title: 'Laptop Provisioning', department: 'IT', status: 'in-progress', assignee: 'IT Fleet' },
          { title: 'Email Account Setup', department: 'IT', status: 'pending', assignee: 'SysAdmin' },
          { title: 'Access Badge Creation', department: 'Security', status: 'pending', assignee: 'Security Desk' },
          { title: 'Desk Allocation', department: 'Facilities', status: 'pending', assignee: 'Ops Team' },
        ],
      },
      {
        name: 'James Rivera', role: 'DevOps Engineer',
        status: 'hired', department: 'Engineering', stage: 'onboarding',
        tasks: [
          { title: 'Laptop Provisioning', department: 'IT', status: 'pending', assignee: 'IT Fleet' },
          { title: 'Email Account Setup', department: 'IT', status: 'pending', assignee: 'SysAdmin' },
          { title: 'Access Badge Creation', department: 'Security', status: 'pending', assignee: 'Security Desk' },
          { title: 'Desk Allocation', department: 'Facilities', status: 'pending', assignee: 'Ops Team' },
        ],
      },
    ]);
    console.log('✅ Employees seeded:', employees.length);

    // ── Logs ───────────────────────────────────────────────────────────────
    await Log.create([
      { message: 'System database synchronized — Enterprise backbone online.', type: 'success', triggeredBy: 'system' },
      { message: `New Hire Detected: ${employees[2].name} (${employees[2].role})`, type: 'info', triggeredBy: 'system' },
      { message: `Onboarding Workflow Triggered for ${employees[2].displayId}`, type: 'success', triggeredBy: 'system' },
      { message: `New Hire Detected: ${employees[3].name} (${employees[3].role})`, type: 'info', triggeredBy: 'system' },
      { message: `Onboarding Workflow Triggered for ${employees[3].displayId}`, type: 'success', triggeredBy: 'system' },
    ]);
    console.log('✅ Logs seeded');

    console.log('\n🎉 Seed complete!\n');
    console.log('   Demo credentials:');
    console.log('   ┌─────────────────────────────────────────────────────┐');
    console.log('   │  admin@gravityflow.com  /  admin123   (Admin)       │');
    console.log('   │  hr@gravityflow.com     /  hr1234     (HR Manager)  │');
    console.log('   │  it@gravityflow.com     /  it1234     (IT Manager)  │');
    console.log('   └─────────────────────────────────────────────────────┘');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
