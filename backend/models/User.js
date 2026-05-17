import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
      name:        String,
      currentRole: String,
      experience:  String,
      skills:      String,
      bio:         String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
