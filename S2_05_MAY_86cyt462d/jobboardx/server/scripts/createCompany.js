
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Company = require('../models/Company');

// Load environment variables from the correct path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Debug: Show loaded MONGO_URI
console.log('🔍 MONGO_URI:', process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is missing from .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(async () => {
    const company = await Company.create({
      name: 'Demo Company',
      surveys: []
    });

    console.log('✅ Company created:');
    console.log(company);
    process.exit();
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
