const mongoose = require('mongoose');
const Company = require('./models/Company'); // adjust path if needed

// ⛓️ Replace with your actual Atlas URI


(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const companyId = '682ad866708775bce0311681';
    const company = await Company.findById(companyId);

    if (!company) {
      console.log('❌ Company not found');
      process.exit();
    }

    const originalCount = company.surveys.length;
    company.surveys = company.surveys.filter(s => s.title);
    const cleanedCount = company.surveys.length;

    await company.save();
    console.log(`✅ Cleaned invalid surveys: ${originalCount - cleanedCount} removed`);
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();
