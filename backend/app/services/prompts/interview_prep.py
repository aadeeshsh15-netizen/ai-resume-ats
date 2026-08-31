def build_interview_prep_prompt(resume_data: dict, jd_data: dict, matching: dict) -> str:
    """Builds the prompt instructing the LLM to generate interview questions."""
    return f"""
You are an expert technical interviewer and recruiting manager. Your task is to generate realistic, insightful interview questions for a candidate based on their resume and the target job description.

Use the provided context to tailor the questions. DO NOT invent or assume projects/technologies that the candidate has not claimed.

---
## Resume Data:
Experience: {resume_data.get('sections', {}).get('experience', 'Not Provided')}
Projects: {resume_data.get('sections', {}).get('projects', 'Not Provided')}
Skills: {resume_data.get('sections', {}).get('skills', 'Not Provided')}

---
## Job Description Requirements:
Title: {jd_data.get('job_title', 'Unknown')}
Responsibilities: {', '.join(jd_data.get('responsibilities', []))}
Required Skills: {', '.join(jd_data.get('required_skills', []))}

---
## Matching Context:
Matched Skills: {', '.join(matching.get('skill_match', {}).get('matched_required', []) + matching.get('skill_match', {}).get('matched_preferred', []))}
Missing Required Skills: {', '.join(matching.get('skill_match', {}).get('missing_required', []))}

---
## Instructions:
Generate 4 categories of questions:
1. "technical_questions": Deep dives into the matched skills and required job skills.
2. "resume_questions": Questions asking the candidate to explain specific projects or experience listed in their resume.
3. "job_specific_questions": Scenario-based questions derived directly from the job description responsibilities.
4. "behavioral_questions": Standard behavioral questions tailored to the seniority level implied by the experience.

For each category, provide 3 to 4 questions.
Each question MUST follow this structure:
- "question": The actual interview question.
- "difficulty": "Easy", "Medium", or "Hard".
- "topic": The core skill or topic being assessed.
- "why_it_matters": A brief explanation of what the interviewer is looking for in a good answer.

You must return your analysis strictly as a valid JSON object matching the following schema.
Output raw JSON only. Do not wrap in markdown tags like ```json.

{{
  "technical_questions": [
    {{
      "question": "...",
      "difficulty": "Medium",
      "topic": "Python",
      "why_it_matters": "..."
    }}
  ],
  "resume_questions": [],
  "job_specific_questions": [],
  "behavioral_questions": []
}}
"""
