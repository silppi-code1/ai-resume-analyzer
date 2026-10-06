import { useState } from "react";

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeResume = async () => {
    if (!resume) {
      setError("Please upload your resume.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);

    try {
      const endpoint = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/analyze`
        : "/api/analyze";

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Analysis failed.");
      }

      setResult(data);
    } catch (err) {
      if (err.name === "TypeError" && (err.message.includes("fetch") || err.message.includes("Network"))) {
        setError("Unable to connect to the backend server. Please ensure the backend is running.");
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResume(null);
    setJobDescription("");
    setResult(null);
    setError("");
  };

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">AI-POWERED TOOL</p>
        <h1>AI Resume Analyzer</h1>
        <p className="subtitle">
          Compare your resume with a job description and find your strengths
          and skill gaps.
        </p>
      </section>

      <section className="card">
        <label htmlFor="resume">Upload Resume PDF</label>

        <div className="file-box">
          <input
            id="resume"
            type="file"
            accept=".pdf,application/pdf"
            onChange={(event) => {
              setResume(event.target.files?.[0] || null);
              setError("");
              setResult(null);
            }}
          />
          <span>
            {resume ? resume.name : "Choose a PDF resume"}
          </span>
        </div>

        <label htmlFor="jobDescription">Job Description</label>

        <textarea
          id="jobDescription"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
        />

        <div className="actions">
          <button
            className="primary"
            onClick={analyzeResume}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

          {(resume || jobDescription || result) && (
            <button className="secondary" onClick={reset}>
              Reset
            </button>
          )}
        </div>

        {error && <p className="error">{error}</p>}
      </section>

      {result && (
        <section className="results">
          <div className="score-card">
            <p className="result-label">RESUME MATCH SCORE</p>
            <div className="score">{result.score}%</div>
            <p className="muted">
              Based on skill match and text similarity
            </p>
          </div>

          <div className="stats">
            <div>
              <strong>{result.skillScore}%</strong>
              <span>Skill Match</span>
            </div>
            <div>
              <strong>{result.textSimilarity}%</strong>
              <span>Text Similarity</span>
            </div>
            <div>
              <strong>{result.matchingSkills.length}</strong>
              <span>Matching Skills</span>
            </div>
            <div>
              <strong>{result.missingSkills.length}</strong>
              <span>Missing Skills</span>
            </div>
          </div>

          <div className="skill-grid">
            <div className="skill-card">
              <h2>Matching Skills</h2>

              {result.matchingSkills.length > 0 ? (
                <div className="skills">
                  {result.matchingSkills.map((skill) => (
                    <span className="skill matching" key={skill}>
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="muted">No matching skills detected.</p>
              )}
            </div>

            <div className="skill-card">
              <h2>Missing Skills</h2>

              {result.missingSkills.length > 0 ? (
                <div className="skills">
                  {result.missingSkills.map((skill) => (
                    <span className="skill missing" key={skill}>
                      + {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="muted">
                  No missing skills detected from the current skill list.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <footer>
        Built with React, Node.js, Express and basic NLP.
      </footer>
    </main>
  );
}

export default App;