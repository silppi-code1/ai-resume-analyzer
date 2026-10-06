const natural = require("natural");

const TfIdf = natural.TfIdf;

function calculateSimilarity(resumeText, jobDescription) {
  const tfidf = new TfIdf();

  tfidf.addDocument(resumeText);
  tfidf.addDocument(jobDescription);

  const resumeVector = {};
  const jobVector = {};

  tfidf.listTerms(0).forEach((item) => {
    resumeVector[item.term] = item.tfidf;
  });

  tfidf.listTerms(1).forEach((item) => {
    jobVector[item.term] = item.tfidf;
  });

  const allTerms = new Set([
    ...Object.keys(resumeVector),
    ...Object.keys(jobVector)
  ]);

  let dotProduct = 0;
  let resumeMagnitude = 0;
  let jobMagnitude = 0;

  allTerms.forEach((term) => {
    const resumeValue = resumeVector[term] || 0;
    const jobValue = jobVector[term] || 0;

    dotProduct += resumeValue * jobValue;
    resumeMagnitude += resumeValue * resumeValue;
    jobMagnitude += jobValue * jobValue;
  });

  if (resumeMagnitude === 0 || jobMagnitude === 0) {
    return 0;
  }

  const similarity =
    dotProduct /
    (Math.sqrt(resumeMagnitude) * Math.sqrt(jobMagnitude));

  return Math.round(similarity * 100);
}

module.exports = calculateSimilarity;