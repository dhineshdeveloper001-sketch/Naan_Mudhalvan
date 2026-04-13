import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  message:     { type: String, required: true },
  type:        { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
  employeeId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
  triggeredBy: { type: String, default: 'system' },
}, { timestamps: true });

export default mongoose.model('Log', logSchema);
