# API Documentation

## GET /api/health
Returns the API health status.

## POST /api/resume/upload
Uploads a resume securely, validating type and size.
**Response:** `UploadResponse` schema.

## POST /api/resume/parse
Uploads and parses a PDF or DOCX file, extracting text, cleaning it, and detecting sections using rule-based heuristics.
**Request:** `multipart/form-data` with a `file` field.
**Response:** `ParseResponse` schema.

## POST /api/job-description/analyze
Analyzes a raw job description using deterministic heuristics and a skills dictionary.
**Request:** `JobDescriptionRequest` schema.
**Response:** `JobDescriptionAnalyzeResponse` schema.

## POST /api/analyze/match
Executes the deterministic (Skill + Keyword + Heuristics) and Semantic (Text Embeddings Cosine Similarity) engines simultaneously.
**Request:** `multipart/form-data` with a `file` field and a `job_description` string.
**Response:** `MatchingResponse` schema.

## POST /api/analyze/ai-insights
Executes the Generative LLM pipeline (Gemini). Unlike `/analyze/match`, this endpoint is purely qualitative.
**Request:** `AIInsightsRequest` (requires the parsed Resume data, parsed JD data, and the Matching results payload).
**Response:** `AIInsightsResponse` schema.
```json
{
  "status": "success",
  "strengths": ["Strong Python experience"],
  "weaknesses": ["No cloud exposure listed"],
  "recommendations": ["Add AWS deployment metrics"],
  "section_feedback": {
    "summary": {"score": 85, "feedback": "Good summary"}
  },
  "overall_resume_quality": 82
}
```
*Note: If the `LLM_API_KEY` is not provided in the environment variables, this endpoint returns an immediate 503 HTTP status to signal graceful degradation to the frontend.*

## POST /api/analyze/rewrite-bullet
Accepts an original resume bullet along with factual parsed context to rewrite the bullet in three strict formats without hallucinating information.
**Request:** `RewriteBulletRequest`
```json
{
  "original_bullet": "Made a website using React.",
  "resume_context": "Software Engineer 2021-Present...",
  "job_context": "Looking for frontend React developer...",
  "known_skills": ["React", "JavaScript"],
  "relevant_requirements": ["React", "TypeScript"]
}
```
**Response:** `RewriteBulletResponse` schema.
```json
{
  "status": "success",
  "original": "Made a website using React.",
  "concise": "Developed a web application using React.",
  "technical": "Developed a React-based web application.",
  "achievement_focused": "Improved user experience by developing a React-based web application."
}
```
*Note: Includes the same graceful 503 fallback behavior if the LLM API is unreachable or unavailable.*
