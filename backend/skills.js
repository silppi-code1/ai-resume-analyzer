const skills = [
  "python",
  "java",
  "javascript",
  "typescript",
  "c++",
  "c",
  "react",
  "node.js",
  "express",
  "mongodb",
  "mysql",
  "sql",
  "postgresql",
  "html",
  "css",
  "git",
  "github",
  "docker",
  "aws",
  "azure",
  "flask",
  "rest api",
  "machine learning",
  "deep learning",
  "tensorflow",
  "pytorch",
  "scikit-learn",
  "pandas",
  "numpy",
  "fastapi",
  "redis",
  "graphql",
  "next.js",
  "vue",
  "angular",
  "power bi",
  "excel",
  "nlp",
  "llm",
  "openai",
  "embeddings",
  "rag",
  "prompt engineering"
];

function extractSkills(text) {
  const lowerText = text.toLowerCase();

  return skills.filter((skill) => {
    if (skill === "c++") {
      return lowerText.includes("c++");
    }

    if (skill === "c") {
      return /\bc\b/.test(lowerText);
    }

    return lowerText.includes(skill);
  });
}

module.exports = extractSkills;