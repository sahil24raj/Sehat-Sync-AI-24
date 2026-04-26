const express = require('express');
const router = express.Router();
const axios = require('axios');
const Hospital = require('../models/Hospital');
const Patient = require('../models/Patient');

// Utility to calculate distance between two coordinates (Haversine formula)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

module.exports = function(io) {
  // Get all hospitals
  router.get('/hospitals', async (req, res) => {
    try {
      const hospitals = await Hospital.find();
      res.json(hospitals);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get all patients
  router.get('/patients', async (req, res) => {
    try {
      const patients = await Patient.find().populate('allocated_hospital').sort({ createdAt: -1 });
      res.json(patients);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Add a new patient and allocate hospital
  router.post('/patients', async (req, res) => {
    try {
      const { name, age, symptoms, symptoms_severity, oxygen_level, comorbidities, location } = req.body;

      // 1. Get Priority from ML Service
      let priority_score = 50;
      let priority_label = "Medium";
      try {
        const mlResponse = await axios.post('http://127.0.0.1:8000/predict', {
          age,
          oxygen_level,
          symptoms_severity,
          comorbidities
        });
        priority_score = mlResponse.data.priority_score;
        priority_label = mlResponse.data.priority_label;
      } catch (mlErr) {
        console.error("ML Service error, using fallback priority.");
      }

      // 2. Find nearest hospital with resources
      const hospitals = await Hospital.find();
      let nearestHospital = null;
      let minDistance = Infinity;

      for (let h of hospitals) {
        const dist = getDistanceFromLatLonInKm(location.lat, location.lng, h.location.lat, h.location.lng);
        // Basic check: Needs ICU if severity is high or oxygen is very low, else general bed
        let canAccept = false;
        if (priority_label === 'High') {
          if (h.resources.icu_beds > 0 && h.resources.ventilators > 0) canAccept = true;
        } else {
          if (h.resources.general_beds > 0) canAccept = true;
        }

        if (canAccept && dist < minDistance) {
          minDistance = dist;
          nearestHospital = h;
        }
      }

      // 3. Create Patient
      const newPatient = new Patient({
        name, age, symptoms, symptoms_severity, oxygen_level, comorbidities, location,
        priority_score, priority_label,
        allocated_hospital: nearestHospital ? nearestHospital._id : null,
        status: nearestHospital ? 'Allocated' : 'Pending'
      });
      await newPatient.save();

      // 4. Update Hospital Resources if allocated
      if (nearestHospital) {
        if (priority_label === 'High') {
          nearestHospital.resources.icu_beds -= 1;
          nearestHospital.resources.ventilators -= 1;
        } else {
          nearestHospital.resources.general_beds -= 1;
        }
        await nearestHospital.save();
        io.emit('resource_update', { hospital: nearestHospital });
      }

      io.emit('new_patient', { patient: newPatient });
      if (priority_label === 'High' && !nearestHospital) {
        io.emit('alert', { message: `CRITICAL: No beds available for high priority patient ${name}!` });
      }

      const populatedPatient = await Patient.findById(newPatient._id).populate('allocated_hospital');
      res.status(201).json(populatedPatient);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};
