import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  department: { type: String, enum: ['IT', 'Security', 'Facilities', 'HR'], required: true },
  status:     { type: String, enum: ['pending', 'in-progress', 'completed', 'delayed'], default: 'pending' },
  assignee:   { type: String, required: true },
}, { timestamps: true });

const employeeSchema = new mongoose.Schema({
  name:              { type: String, required: true, trim: true },
  role:              { type: String, required: true, trim: true },
  status:            { type: String, enum: ['hired', 'active', 'promoted', 'terminated'], default: 'hired' },
  department:        { type: String, required: true },
  stage:             { type: String, enum: ['onboarding', 'active', 'offboarding'], default: 'onboarding' },
  tasks:             [taskSchema],
  previousRole:      { type: String, default: '' },
  terminationReason: { type: String, default: '' },
}, { timestamps: true });

// Human-readable display ID
employeeSchema.virtual('displayId').get(function () {
  return `EMP_${this._id.toString().slice(-6).toUpperCase()}`;
});

employeeSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Employee', employeeSchema);
