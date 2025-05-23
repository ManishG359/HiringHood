
const Company = require('../models/Company');
const sendEmail = require('../utils/sendEmail');

const createSurvey = async (req, res) => {
    const { companyId, title } = req.body;
  
    try {
      const company = await Company.findById(companyId);
      if (!company) return res.status(404).json({ message: 'Company not found' });
  
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ message: 'Title is required and must be a string' });
      }
  
      // ✅ Create survey as a Mongoose subdocument
      const newSurvey = company.surveys.create({
        title,
        isActive: false,
        questions: []
      });
      console.log('🧠 Using Company ID:', companyId);
      console.log('📦 Found Company:', company.name);
      console.log('📤 Saving survey:', newSurvey);

      company.surveys.push(newSurvey);
      await company.save();
  
      res.status(201).json({ message: 'Survey created', survey: newSurvey });
    } catch (error) {
      console.error('❌ createSurvey error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
const updateSurveyQuestions = async (req, res) => {
  const { companyId, surveyId } = req.params;
  const { questions } = req.body;

  try {
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    // Deactivate all other surveys
    company.surveys.forEach(s => s.isActive = false);

    const survey = company.surveys.id(surveyId);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });

    survey.questions = questions.map(q => ({ question: q, responses: [], sentiment: 'neutral' }));
    survey.isActive = true;
    await company.save();

    res.status(200).json({ message: 'Questions updated and survey activated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const activateSurvey = async (req, res) => {
  const { companyId, surveyId } = req.params;

  try {
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    company.surveys.forEach(s => {
      s.isActive = s._id.toString() === surveyId;
    });

    await company.save();
    res.status(200).json({ message: 'Survey activation updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteSurvey = async (req, res) => {
  const { companyId, surveyId } = req.params;
  try {
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    company.surveys = company.surveys.filter(s => s._id.toString() !== surveyId);
    await company.save();

    res.status(200).json({ message: 'Survey deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteQuestion = async (req, res) => {
  const { companyId, surveyId, index } = req.params;
  try {
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const survey = company.surveys.id(surveyId);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });

    if (survey.questions.length <= index) return res.status(400).json({ message: 'Invalid question index' });

    survey.questions.splice(index, 1);
    await company.save();

    res.status(200).json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const submitSurvey = async (req, res) => {
  const { companyId, surveyId, responses } = req.body;

  try {
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const survey = company.surveys.id(surveyId);
    if (!survey) return res.status(404).json({ message: 'Survey not found' });

    responses.forEach(({ question, score, employeeId }) => {
      const qObj = survey.questions.find(q => q.question === question);
      if (!qObj) return;

      const existing = qObj.responses.find(r => r.employeeId === employeeId);
      if (existing) {
        existing.score = score;
      } else {
        qObj.responses.push({ employeeId, score });
      }

      const avg = qObj.responses.reduce((a, r) => a + r.score, 0) / qObj.responses.length;
      qObj.sentiment = avg > 3.5 ? 'positive' : avg < 2.5 ? 'negative' : 'neutral';
    });

    await company.save();
    res.status(200).json({ message: 'Survey submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getSurveyTrends = async (req, res) => {
  const { companyId } = req.params;

  try {
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const trends = company.surveys.map(survey => ({
      _id: survey._id,
      title: survey.title,
      isActive: survey.isActive,
      questions: survey.questions.map(q => ({
        text: q.question,
        sentiment: q.sentiment,
        avgScore: q.responses.length ? (q.responses.reduce((a, b) => a + b.score, 0) / q.responses.length).toFixed(2) : 'N/A'
      }))
    }));

    res.status(200).json({ trends });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const distributeSurvey = async (req, res) => {
  const { emails, surveyId, companyName } = req.body;
  const baseUrl = process.env.SURVEY_BASE_URL;

  try {
    for (const email of emails) {
      const surveyLink = `${baseUrl}?id=${surveyId}&email=${encodeURIComponent(email)}`;
      await sendEmail({
        to: email,
        subject: `You're Invited to a ${companyName} Survey`,
        text: `Hi,\n\n${companyName} wants your feedback!\n\nPlease complete this survey:\n${surveyLink}\n\nYour responses are confidential.\n\nThanks,\nTeam`
      });
    }
    res.status(200).json({ message: 'Survey invitations sent successfully.' });
  } catch (err) {
    console.error('❌ Survey email distribution failed:', err);
    res.status(500).json({ error: 'Failed to distribute surveys' });
  }
};

module.exports = {
  createSurvey,
  updateSurveyQuestions,
  deleteSurvey,
  deleteQuestion,
  submitSurvey,
  getSurveyTrends,
  distributeSurvey,
  activateSurvey
};
