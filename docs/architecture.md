# Architecture

React -> FastAPI -> ML Services -> PostgreSQL

## Parsers
The parsing engine resides in `backend/app/parsers/`. It consists of:
- `pdf_parser.py`: Uses `pypdf` for reliable multi-page text extraction from PDFs.
- `docx_parser.py`: Uses `python-docx` for structured paragraph extraction from Word docs.
- `resume_parser.py`: Central pipeline that handles file type routing, text cleaning (collapsing whitespace/newlines), and heuristic rule-based section detection.
- `skills_dict.py`: Maintainable aliases and dictionary of known skills.

## Deterministic Analysis Services
- `job_description_analyzer.py`: Contains heuristic and rule-based logic to extract job title, required/preferred skills (using `skills_dict`), education, experience, and keywords from raw job description text.
- `skill_matcher.py` & `keyword_matcher.py`: Deterministic requirement checking.

## ML Pipeline (Semantic)
- `embedding_service.py`: A singleton wrapper around `sentence-transformers`. The model is loaded once upon initialization and kept in memory to efficiently serve multiple requests. The default model is `all-MiniLM-L6-v2`. If the model is not found on the first run, it will automatically download from HuggingFace to a local cache.
- `semantic_matcher.py`: Uses `embedding_service` to generate cosine similarities between the resume sections (summary, experience, skills) and the job description requirements.

## LLM Service Architecture (Generative)
- `llm_service.py`: Provider-agnostic LLM caller using `google-genai`. It handles the injection of the Google Gemini API key via environment variables. This service receives the *structured* parse tree of the resume and JD (to reduce tokens and prevent hallucination), injects it into a prompt, and extracts structured JSON responses via Pydantic (`AIInsightsResponse`).
- **Prompt Flow:** Prompts are modularized in `backend/app/services/prompts/`. 
  - `resume_feedback.py` instructs the model to return rigorous qualitative analysis mapping into `strengths`, `weaknesses`, and `actionable recommendations`.
  - `bullet_rewrite.py` instructs the model to generate 3 tailored variations of a user-supplied bullet point (`concise`, `technical`, `achievement-focused`) based on extracted factual constraints.
- **Security & Fallback:** API keys (`LLM_API_KEY`) strictly live in the backend `.env` file and are NEVER exposed to the frontend UI. If the LLM call times out, encounters an invalid key, or returns malformed JSON, it degrades gracefully—the API responds with a `503 Unavailable` for the AI route while allowing the deterministic features to function perfectly on the frontend.
- **Limitations & Factuality:** The LLM is strictly prompted to NOT invent metrics, tools, users, or dates via explicit prompt guidelines. However, since it is an LLM, it cannot fact-check fabricated resume entries and might occasionally hallucinate or return poorly formatted JSON. Retry loops or structured output strict modes must be continually audited.

OCR is intentionally excluded in this iteration; scanned image-only PDFs are not supported.
