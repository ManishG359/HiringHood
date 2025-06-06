const Company = require('../models/Company');


const validateSurveyToken = async (req, res, next) => {
    const { token } = req.query;
  
    try {
      const company = await Company.findOne({ 'surveys.tokens.token': token });
      if (!company) {
        return res.status(404).json({ message: 'Invalid or expired token.' });
      }
      const survey = company.surveys.find(s =>
        s.tokens.some(t => t.token === token)
      );
      if (!survey) {
        return res.status(404).json({ message: 'Invalid or expired token.' });
      }
      const tokenRecord = survey.tokens.find(t => t.token === token);
      if (!tokenRecord) {
        return res.status(404).json({ message: 'Invalid or expired token.' });
      }
      if (new Date() > tokenRecord.expiresAt) {
        return res.status(403).json({ message: 'This survey link has expired.' });
      }
      if (tokenRecord.responses >= 2) {
        return res.status(403).json({ message: 'You have already submitted this survey twice.' });
      }
      req.tokenRecord = tokenRecord;
      req.survey = survey;
      req.company = company;
      next();
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      res.status(500).json({ message: 'Server error validating token.' });
    }
  };
  

module.exports = validateSurveyToken;