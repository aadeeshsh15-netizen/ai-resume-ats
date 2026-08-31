# AI Resume Analyzer

A production-ready full-stack application that analyzes resumes against job descriptions, matching skills, keywords, and semantic concepts using AI.

## Features
- **File Uploads**: Supports PDF and DOCX parsing with fallback capabilities.
- **AI Matching**: Semantic similarity, deterministic keyword + skill matching.
- **LLM Insights**: Uses Google Gemini to extract missing skills, suggest improvements, and generate interview questions.
- **Authentication**: JWT-based login/registration to save your analysis history.
- **Modern UI**: Built with React, TailwindCSS, and Lucide Icons.

## Quickstart (Docker)
1. Copy `.env.example` to `.env` and fill in `LLM_API_KEY` and `JWT_SECRET`.
2. Run `docker-compose up --build`
3. Access the application at `http://localhost:80`

## Tech Stack
- **Backend**: FastAPI (Python), PostgreSQL, SQLAlchemy, PyJWT, passlib/bcrypt
- **Frontend**: React (TypeScript), Vite, TailwindCSS, Axios
- **AI**: Google Gemini (via google-genai)
