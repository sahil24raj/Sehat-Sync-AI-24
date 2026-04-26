const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  resources: {
    icu_beds: { type: Number, default: 0 },
    general_beds: { type: Number, default: 0 },
    oxygen_cylinders: { type: Number, default: 0 },
    ventilators: { type: Number, default: 0 },
    ambulances: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Hospital', hospitalSchema);
