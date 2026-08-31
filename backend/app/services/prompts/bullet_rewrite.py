def build_bullet_rewrite_prompt(
    original_bullet: str, 
    resume_context: str, 
    job_context: str, 
    known_skills: list, 
    relevant_requirements: list
) -> str:
    """Builds the prompt instructing the LLM to rewrite a resume bullet point."""
    return f"""
You are an expert technical resume writer. Your task is to rewrite a candidate's resume bullet point to make it stronger, more concise, and more impactful.

You must provide three rewritten variants:
1. Concise: Clear and straight to the point.
2. Technical: Emphasizes the technical tools, architecture, and engineering methods.
3. Achievement-focused: Highlights the impact, outcome, or value delivered.

CRITICAL FACTUALITY AND ANTI-HALLUCINATION RULES:
- NEVER invent numerical metrics (e.g., do not add "by 20%" or "for 50,000 users" if not in the original text).
- NEVER invent technologies, tools, or frameworks.
- NEVER invent responsibilities, awards, dates, or employers.
- ONLY incorporate technologies or skills if they are present in the provided Resume Context or Known Skills.
- The Job Requirements are provided to help you tailor the terminology (e.g., using "backend services" vs "server-side apps" depending on the job posting), but DO NOT inject technologies from the Job Requirements if the candidate's resume does not support them.
- If measurable impact is absent, improve the wording without fabricating numbers.

---
## Inputs:
Original Bullet: {original_bullet}

Resume Context: {resume_context}
Known Skills: {', '.join(known_skills)}

Job Context: {job_context}
Relevant Job Requirements: {', '.join(relevant_requirements)}
---

You must return your analysis strictly as a valid JSON object matching the following schema.
Output raw JSON only. Do not wrap in markdown tags like ```json.

{{
  "original": "{original_bullet.replace('"', "'")}",
  "concise": "...",
  "technical": "...",
  "achievement_focused": "..."
}}
"""
