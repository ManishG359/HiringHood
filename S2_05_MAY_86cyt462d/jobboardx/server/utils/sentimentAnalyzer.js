const natural = require('natural');

const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

const analyzeSentiment = (text) => {
  const score = analyzer.getSentiment(text.split(' '));
  if (score > 1) return 'positive';
  if (score < -1) return 'negative';
  return 'neutral';
};

module.exports = { analyzeSentiment };
