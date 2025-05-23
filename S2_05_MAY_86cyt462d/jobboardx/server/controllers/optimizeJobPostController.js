const Company = require('../models/Company');
const OpenAI = require('openai');
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const optimizeJobPost = async (req, res) => {
  const { companyId, jobDescription } = req.body;

  if (!companyId || !jobDescription) {
    return res.status(400).json({ error: 'Missing companyId or jobDescription' });
  }

  try {
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const suggestionRules = [
      {
        keyword: 'growth',
        prompt: 'Consider adding a mentorship program or career advancement paths.',
      },
      {
        keyword: 'work-life',
        prompt: 'Highlight flexible hours or remote work to support work-life balance.',
      },
      {
        keyword: 'feedback',
        prompt: 'Include regular 1:1 feedback or open communication channels.',
      },
      {
        keyword: 'compensation',
        prompt: 'Ensure salary transparency and benefits are well-communicated.',
      }
    ];

    const suggestions = [];

    company.surveys.forEach((survey) => {
      survey.questions.forEach((q) => {
        const avgScore = q.responses.length
          ? q.responses.reduce((sum, r) => sum + r.score, 0) / q.responses.length
          : 5;

        if (avgScore < 3) {
          suggestionRules.forEach(rule => {
            if (q.question.toLowerCase().includes(rule.keyword)) {
              suggestions.push(rule.prompt);
            }
          });
        }
      });
    });

    const userPrompt = `
You are an AI assistant that optimizes job descriptions based on employee feedback.

Here is the original job description:
---
${jobDescription}
---

${suggestions.length > 0 ? 'Please incorporate these suggestions:\n- ' + suggestions.join('\n- ') : 'No suggestions needed at this time.'}

Return a revised version that reflects these improvements.
`;

    const completion = await openai.chat.completions.create({
      model: 'mistralai/devstral-small:free',
      messages: [
        { role: 'user', content: userPrompt }
      ],
    });

    const optimizedText = completion.choices[0].message.content;
    res.status(200).json({ optimizedDescription: optimizedText });
  } catch (error) {
    console.error('🔴 Job optimization failed:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = optimizeJobPost;
