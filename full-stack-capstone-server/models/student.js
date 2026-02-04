import mongoose from 'mongoose';

const { Schema } = mongoose;

const studentSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  school: String,
  studentId: Number,
  teacher: String,
  dateOfBirth: Date,
  gender: String,
  race: String,
  gradeLevel: Number,
  nativeLanguage: String,
  cityOfBirth: String,
  countryOfBirth: String,
  ellStatus: String,
  compositeLevel: String,
  active: Boolean,
  designation: String,
});

// Database indexes for query performance optimization
// Single field indexes for common queries
studentSchema.index({ fullName: 1 });
studentSchema.index({ ellStatus: 1 });
studentSchema.index({ gradeLevel: 1 });
studentSchema.index({ teacher: 1 });
studentSchema.index({ school: 1 });
studentSchema.index({ active: 1 });

// Compound indexes for common filter combinations
studentSchema.index({ school: 1, active: 1 });
studentSchema.index({ ellStatus: 1, active: 1 });
studentSchema.index({ teacher: 1, gradeLevel: 1 });

const StudentClass = mongoose.models.student || mongoose.model('student', studentSchema);

export default StudentClass;
