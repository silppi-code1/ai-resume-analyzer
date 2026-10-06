# AI Resume Analyzer

A beginner-friendly full-stack resume analyzer built with React, Node.js, Express, and basic NLP.

## Features

- Upload a resume PDF
- Extract text from the PDF
- Paste a job description
- Calculate text similarity using TF-IDF + cosine similarity
- Detect technical skills
- Show matching skills
- Show missing skills
- Calculate a combined match score
- No MongoDB or database required

## Project structure

```text
ai-resume-analyzer/
├── backend/
│   ├── analyzer.js
│   ├── server.js
│   ├── skills.js
│   ├── package.json
│   └── uploads/
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## Run the backend

```powershell
cd backend
npm install
npm run dev
```

Backend:

http://localhost:5000

## Run the frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend:

http://localhost:5173

## Score calculation

When job skills are detected:

```text
Final Score = 70% Skill Match + 30% Text Similarity
```

If no recognized job skills are found, the text similarity score is used.

## Notes

This is an educational MVP, not a production ATS. The skill list is manually maintained and the NLP score is based on TF-IDF/cosine similarity.

The backend deletes the uploaded PDF after processing.
