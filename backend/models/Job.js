import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String },
    status: {
      type: String,
      enum: ['saved', 'cold_email', 'applied', 'phone_screen', 'interview', 'offer', 'rejected', 'ghosted'],
      default: 'saved',
    },
    salary: { type: String },
    jobUrl: { type: String },
    notes: { type: String },
    appliedAt: { type: Date },
    interviewDate: { type: Date },
    offer: { type: String },
    noticePeriod: { type: String },
    jobSource: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
