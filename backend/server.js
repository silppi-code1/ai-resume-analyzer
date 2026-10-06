const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const calculateSimilarity = require("./analyzer");
const extractSkills = require("./skills");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/x-pdf" ||
      (file.originalname && file.originalname.toLowerCase().endsWith(".pdf"));

    if (isPdf) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  }
});

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "AI Resume Analyzer API is running!"
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.post(["/api/analyze", "/analyze"], upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume PDF."
      });
    }

    const jobDescription = req.body.jobDescription;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        message: "Please provide a job description."
      });
    }

    let pdfData;
    try {
      pdfData = await pdfParse(req.file.buffer);
    } catch (parseError) {
      console.error("PDF parse error:", parseError);
      return res.status(400).json({
        message: "Could not read this PDF file. Please ensure it is a valid, unencrypted PDF."
      });
    }

    const resumeText = (pdfData && pdfData.text) ? pdfData.text : "";

    if (!resumeText.trim()) {
      return res.status(400).json({
        message: "Could not extract text from this PDF. Please try a text-based PDF (not an image scan)."
      });
    }

    const textSimilarity = calculateSimilarity(
      resumeText,
      jobDescription
    );

    const resumeSkills = extractSkills(resumeText);
    const jobSkills = extractSkills(jobDescription);

    const matchingSkills = jobSkills.filter((skill) =>
      resumeSkills.includes(skill)
    );

    const missingSkills = jobSkills.filter((skill) =>
      !resumeSkills.includes(skill)
    );

    const skillScore =
      jobSkills.length > 0
        ? (matchingSkills.length / jobSkills.length) * 100
        : 0;

    const finalScore =
      jobSkills.length > 0
        ? Math.round(skillScore * 0.7 + textSimilarity * 0.3)
        : textSimilarity;

    res.json({
      score: finalScore,
      skillScore: Math.round(skillScore),
      textSimilarity,
      matchingSkills,
      missingSkills
    });
  } catch (error) {
    console.error("Analysis error:", error);

    res.status(500).json({
      message: error.message || "Error analyzing resume."
    });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "File is too large. Maximum size is 5 MB."
          : error.message
    });
  }

  if (error) {
    return res.status(400).json({
      message: error.message
    });
  }

  next();
});

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;