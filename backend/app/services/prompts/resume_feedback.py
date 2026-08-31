import json

def build_resume_feedback_prompt(resume_data: dict, jd_data: dict, matching: dict) -> str:
    """Builds the prompt instructing the LLM to generate qualitative feedback."""
    return f"""
You are an expert AI career coach and technical recruiter. Your task is to provide constructive, qualitative feedback and actionable recommendations on a candidate's resume, relative to a specific job description.

Use ONLY the supplied information. Do not invent experience, technologies, or achievements.

---
## Resume Data:
Summary: {resume_data.get('sections', {}).get('summary', 'Not Provided')}
Skills: {resume_data.get('sections', {}).get('skills', 'Not Provided')}
Experience: {resume_data.get('sections', {}).get('experience', 'Not Provided')}
Projects: {resume_data.get('sections', {}).get('projects', 'Not Provided')}
Education: {resume_data.get('sections', {}).get('education', 'Not Provided')}
Certifications: {resume_data.get('sections', {}).get('certifications', 'Not Provided')}

---
## Job Description Requirements:
Title: {jd_data.get('job_title', 'Unknown')}
Required Skills: {', '.join(jd_data.get('required_skills', []))}
Preferred Skills: {', '.join(jd_data.get('preferred_skills', []))}
Experience Needed: {jd_data.get('experience', {}).get('minimum_years', 'Not specified')} years

---
## Existing Deterministic Matching Context (Do NOT recalculate):
Matched Skills: {', '.join(matching.get('skill_match', {}).get('matched_required', []) + matching.get('skill_match', {}).get('matched_preferred', []))}
Missing Required Skills: {', '.join(matching.get('skill_match', {}).get('missing_required', []))}

---
## Instructions:
1. Evaluate clarity, conciseness, technical specificity, action-oriented language, and measurable impact.
2. Provide a list of "strengths", "weaknesses", and highly actionable "recommendations" (e.g., "Add measurable outcomes to X").
3. Provide qualitative feedback and a score (0-100) for major sections.
4. Provide an overall qualitative score (0-100) representing resume quality (NOT ATS score).
5. If a section is missing from the resume data, note it and give a score of 0.

You must return your analysis strictly as a valid JSON object matching the following schema.
Output raw JSON only. Do not wrap in markdown tags like ```json.

{{
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "recommendations": ["...", "..."],
  "section_feedback": {{
    "summary": {{"score": 80, "feedback": "..."}},
    "experience": {{"score": 75, "feedback": "..."}},
    "projects": {{"score": 0, "feedback": "Missing section"}},
    "education": {{"score": 90, "feedback": "..."}},
    "skills": {{"score": 85, "feedback": "..."}}
  }},
  "overall_resume_quality": 82
}}
"""
