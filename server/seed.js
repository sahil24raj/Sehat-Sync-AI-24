const mongoose = require('mongoose');
const Hospital = require('./models/Hospital');
require('dotenv').config();

const dummyHospitals = [
  {
    name: "City Central Hospital",
    location: { lat: 40.7128, lng: -74.0060 }, // Example coordinates (New York)
    resources: {
      icu_beds: 5,
      general_beds: 20,
      oxygen_cylinders: 50,
      ventilators: 10,
      ambulances: 2
    }
  },
  {
    name: "Mercy General",
    location: { lat: 40.7306, lng: -73.9352 },
    resources: {
      icu_beds: 2,
      general_beds: 5,
      oxygen_cylinders: 10,
      ventilators: 2,
      ambulances: 1
    }
  },
  {
    name: "Westside Clinic",
    location: { lat: 40.7589, lng: -73.9851 },
    resources: {
      icu_beds: 0,
      general_beds: 2,
      oxygen_cylinders: 5,
      ventilators: 0,
      ambulances: 1
    }
  }
];

module.exports = async function seedHospitals() {
  await Hospital.deleteMany({});
  await Hospital.insertMany(dummyHospitals);
  console.log("Dummy hospitals inserted.");
};
