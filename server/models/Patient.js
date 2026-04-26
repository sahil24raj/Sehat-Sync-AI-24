const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  symptoms: { type: String },
  symptoms_severity: { type: Number, required: true }, // 0-100
  oxygen_level: { type: Number, required: true },
  comorbidities: { type: Number, default: 0 }, // 0=none, 1=mild, 2=severe
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  priority_score: { type: Number },
  priority_label: { type: String },
  allocated_hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  status: { type: String, enum: ['Pending', 'Allocated', 'Discharged'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);
