const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

require('dotenv').config();

connectDB();

const app = express();


app.use(cors());

app.use(express.json());


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/surveys', require('./routes/surveyRoutes'));
app.use('/api/company', require('./routes/companyRoutes'));
app.use('/api/jobs', require('./routes/JoboptimizerRoutes'));
app.use('/api/scheduler', require('./routes/schedulerRoutes'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✨`));

