const express = require('express');
const router = express.Router();
exports.router = router;
const {
  submitSurvey,
  getSurveyTrends,
  createSurvey,
  updateSurveyQuestions,
  deleteSurvey,
  deleteQuestion,
  distributeSurvey,
  activateSurvey
} = require('../controllers/surveyController');
router.post('/', submitSurvey); // Submit survey responses
router.get('/:companyId', getSurveyTrends); // Survey trends
router.post('/create', createSurvey); // Create new survey
router.put('/:companyId/:surveyId', updateSurveyQuestions); // Update survey questions
router.delete('/:companyId/:surveyId', deleteSurvey); // Delete a survey
router.delete('/:companyId/:surveyId/question/:index', deleteQuestion); // Delete a question
router.post('/distribute', distributeSurvey); // Email distribution
router.put('/:companyId/:surveyId/activate', activateSurvey); // Activate a survey
module.exports = router;
