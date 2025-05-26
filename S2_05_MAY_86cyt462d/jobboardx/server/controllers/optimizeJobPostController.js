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
        prompt: 'Emphasize career development opportunities like mentorship, upskilling, or internal mobility.',
      },
      {
        keyword: 'work-life',
        prompt: 'Mention flexible hours, remote work options, or mental health support programs.',
      },
      {
        keyword: 'feedback',
        prompt: 'Include a culture of open communication, 1:1 feedback sessions, or anonymous employee surveys.',
      },
      {
        keyword: 'compensation',
        prompt: 'Ensure salary transparency, performance bonuses, or clear benefit packages.',
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

    const suggestionText = suggestions.length
      ? `Based on employee feedback, consider the following enhancements:\n\n- ${suggestions.join('\n- ')}\n\n`
      : 'No specific issues were found in employee feedback. You may polish the language and improve clarity.';

    const userPrompt = `
You are a professional recruiter and copywriter. Your task is to improve the following job description to make it more appealing, inclusive, and reflective of a great workplace culture.

Here is the original job description:
---
${jobDescription}
---

${suggestionText}
Please:
- Keep the tone professional yet engaging.
- Use inclusive and inviting language.
- Enhance clarity and structure without changing the role's core responsibilities.
- Integrate any listed suggestions creatively and naturally.

Return only the revised job description.
`;

    const completion = await openai.chat.completions.create({
      model: 'mistralai/devstral-small:free',
      messages: [{ role: 'user', content: userPrompt }],
    });

    const optimizedText = completion.choices[0].message.content.trim();
    res.status(200).json({ optimizedDescription: optimizedText });
  } catch (error) {
    console.error('🔴 Job optimization failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = optimizeJobPost;
