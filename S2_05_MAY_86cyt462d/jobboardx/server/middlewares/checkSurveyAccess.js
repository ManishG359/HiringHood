const Survey = require('../models/Survey');

const checkSurveyAccess = async (req, res, next) => {
  const { surveyId, email } = req.query;

  try {
    const survey = await Survey.findById(surveyId);
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }

    const userRecord = survey.accessRecords.find(record => record.email === email);

    if (userRecord) {
      if (userRecord.accessCount >= 2) {
        return res.status(403).json({ message: 'You have already accessed this survey twice. The link is now deactivated.' });
      }

      // Increment access count
      userRecord.accessCount += 1;
    } else {
      // Add new record for the user
      survey.accessRecords.push({ email, accessCount: 1 });
    }

    await survey.save();
    next();
  } catch (error) {
    console.error('Error checking survey access:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = checkSurveyAccess;