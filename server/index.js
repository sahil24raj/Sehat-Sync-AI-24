require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function connectDB() {
  let uri = process.env.MONGO_URI;
  if (!uri) {
    mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
  }
  await mongoose.connect(uri);
  console.log("MongoDB Connected:", uri);
  
  // Seed initial dummy data if using memory server
  if (!process.env.MONGO_URI) {
    const seedHospitals = require('./seed');
    await seedHospitals();
  }
}
connectDB().catch(console.error);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Import API routes
const apiRoutes = require('./routes/api')(io);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('MedAlloc API Running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
