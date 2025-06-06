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
router.post('/', submitSurvey); 
router.get('/:companyId', getSurveyTrends); 
router.post('/create', createSurvey); 
router.put('/:companyId/:surveyId', updateSurveyQuestions); 
router.delete('/:companyId/:surveyId', deleteSurvey); 
router.delete('/:companyId/:surveyId/question/:index', deleteQuestion);
router.post('/distribute', distributeSurvey);
router.put('/:companyId/:surveyId/activate', activateSurvey);
module.exports = router;
