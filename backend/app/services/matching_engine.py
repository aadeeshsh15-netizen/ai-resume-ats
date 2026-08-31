import re
from typing import Tuple, Dict, Any, List
from app.schemas.matching import (
    MatchingResponse, 
    SkillMatchResult, 
    KeywordMatchResult, 
    ScoreBreakdown,
    SemanticMatchResult
)
from app.schemas.resume import ParseResponse
from app.schemas.job_description import JobDescriptionAnalyzeResponse
from app.services.skill_matcher import match_skills
from app.services.keyword_matcher import match_keywords
from app.ml.semantic_matcher import match_semantics

def match_experience(resume: ParseResponse, jd: JobDescriptionAnalyzeResponse) -> Tuple[str, int]:
    """
    Evaluates experience and project relevance for both seasoned professionals and students.
    Returns (status, score).
    """
    resume_text = resume.full_text.lower()
    sections = {k.lower(): v.lower() for k, v in resume.sections.items()}
    
    # Check for presence of projects and internship experience
    has_projects_section = bool(sections.get("projects", "").strip())
    has_experience_section = bool(sections.get("experience", "").strip())
    
    project_indicators = [
        "project", "developed", "built", "implemented", "engineered", 
        "architected", "designed", "created", "capstone", "hackathon",
        "intern", "internship", "open source", "contribution", "github"
    ]
    project_mentions_count = sum(1 for ind in project_indicators if ind in resume_text)
    has_rich_projects = has_projects_section or project_mentions_count >= 3
    
    # Extract years of experience mentions (e.g., "3+ years", "5 years")
    matches = re.findall(r'(\d+)\+?\s*years?(?:\s+of\s+experience)?', resume_text)
    years_found = [int(m) for m in matches if int(m) <= 40]
    max_years = max(years_found) if years_found else 0
    
    jd_min_years = jd.experience.minimum_years
    
    # Case A: Job does not specify minimum years
    if jd_min_years is None or jd_min_years == 0:
        if has_experience_section or has_rich_projects or max_years > 0:
            return "not_specified", 95
        return "not_specified", 80

    # Case B: Job specifies minimum years (e.g. 2 years)
    if max_years >= jd_min_years:
        return "met", 100
        
    if max_years > 0:
        # Partial formal years
        ratio = max_years / jd_min_years
        score = int(round(ratio * 75 + (25 if has_rich_projects else 10)))
        return "met" if ratio >= 0.7 else "unknown", min(100, max(40, score))
        
    # Case C: 0 formal years stated, but candidate has rich technical projects/internships
    if has_rich_projects or has_experience_section:
        # Student / new grad with strong project portfolio
        return "unknown", 70
        
    # Case D: No experience or projects detected
    return "not_met", 35

def match_education(resume: ParseResponse, jd: JobDescriptionAnalyzeResponse) -> Tuple[str, int]:
    """
    Evaluates education requirements. If JD does not require education, candidate is not penalized.
    Returns (status, score).
    """
    if not jd.education.required:
        # Job does not require a specific degree -> full credit
        return "not_specified", 100
        
    resume_text = resume.full_text.lower()
    
    # Look for degree mentions
    degree_patterns = r'(?i)(bachelor|master|phd|doctorate|b\.s\.|m\.s\.|b\.a\.|b\.tech|m\.tech|b\.e\.|beng|meng|bsc|msc|degree|associate)'
    has_degree = bool(re.search(degree_patterns, resume_text))
    
    # Look for student/in-progress mentions
    in_progress = bool(re.search(r'(?i)(pursuing|candidate|student|expected|undergraduate|coursework|university|college)', resume_text))
    
    jd_fields = [f.lower() for f in (jd.education.fields or [])]
    field_matched = False
    if jd_fields:
        for f in jd_fields:
            if f in resume_text:
                field_matched = True
                break
    else:
        field_matched = True
        
    if has_degree and field_matched:
        return "met", 100
    elif has_degree:
        return "met", 90
    elif in_progress:
        return "unknown", 75
    else:
        return "not_met", 45

def evaluate_resume_quality(resume: ParseResponse) -> int:
    """
    Evaluates the structural quality and completeness of the resume.
    Returns quality score between 50 and 100.
    """
    score = 50
    sections = resume.sections
    
    # Section presence points (up to 30 pts)
    key_sections = ["experience", "skills", "education", "projects", "summary"]
    present_count = sum(1 for k in key_sections if bool(sections.get(k, "").strip()))
    score += min(30, present_count * 7)
    
    # Length / content depth points (up to 20 pts)
    word_count = resume.word_count
    if word_count >= 150:
        score += 20
    elif word_count >= 80:
        score += 12
    elif word_count >= 30:
        score += 5
        
    return min(100, max(50, score))

def determine_score_label(score: int) -> str:
    """Returns human-readable score interpretation label."""
    if score >= 90:
        return "Excellent Match"
    elif score >= 75:
        return "Strong Match"
    elif score >= 60:
        return "Good Match"
    elif score >= 45:
        return "Moderate Match"
    elif score >= 30:
        return "Low Match"
    else:
        return "Very Low Match"

def generate_score_explanation(
    final_score: int,
    matched_req: List[str],
    missing_req: List[str],
    matched_pref: List[str],
    missing_pref: List[str],
    has_projects: bool
) -> str:
    """Constructs a constructive, professional explanation of the score accurately reflecting the matching metrics."""
    parts = []
    total_req = len(matched_req) + len(missing_req)
    
    # 1. Score-dependent lead sentence
    if final_score >= 90:
        lead = "Excellent alignment with this role."
    elif final_score >= 75:
        lead = "Strong alignment with this role."
    elif final_score >= 60:
        lead = "Good alignment with this role."
    elif final_score >= 45:
        lead = "Moderate alignment with this role."
    elif final_score >= 30:
        lead = "Limited alignment with this role."
    else:
        lead = "Very limited alignment with this role."
    parts.append(lead)
    
    # 2. Required Skills Specific Feedback
    if total_req == 0:
        parts.append("The job posting does not specify strict mandatory skill requirements; your profile is evaluated on general domain alignment.")
    elif len(matched_req) == total_req:
        top_matched = ", ".join(matched_req[:6])
        parts.append(f"Your resume matches all {total_req} required skills, including {top_matched}.")
    elif len(matched_req) > 0 and (len(matched_req) / total_req) >= 0.60:
        top_matched = ", ".join(matched_req[:5])
        top_missing = ", ".join(missing_req[:4])
        parts.append(f"Your resume matches {len(matched_req)} of {total_req} required skills ({top_matched}). To increase your match, consider incorporating missing requirements such as {top_missing}.")
    elif len(matched_req) > 0:
        top_matched = ", ".join(matched_req[:4])
        top_missing = ", ".join(missing_req[:5])
        parts.append(f"Your resume has some transferable technical experience, but only {len(matched_req)} of {total_req} required skills matched ({top_matched}). Consider strengthening your resume with relevant experience in {top_missing}, and other missing requirements.")
    else:
        top_missing = ", ".join(missing_req[:5])
        parts.append(f"None of the {total_req} required skills from the job description were identified in your resume. Prioritize adding relevant experience in core requirements such as {top_missing}.")

    # 3. Preferred Skills Feedback (Handled Separately)
    if matched_pref:
        top_pref = ", ".join(matched_pref[:3])
        parts.append(f"Additionally, your familiarity with preferred tools like {top_pref} provides a valuable advantage.")
    elif missing_pref and final_score >= 60:
        top_miss_pref = ", ".join(missing_pref[:3])
        parts.append(f"Adding familiarity with preferred skills like {top_miss_pref} could further strengthen your application.")

    # 4. Project & Experience Positive Supporting Signals
    if has_projects and final_score >= 45:
        parts.append("Hands-on project work and technical implementation contribute positively to your profile.")

    return " ".join(parts)

def run_matching_engine(resume: ParseResponse, jd: JobDescriptionAnalyzeResponse) -> MatchingResponse:
    resume_text = resume.full_text
    
    # 1. Skill Matching
    skill_res = match_skills(resume_text, jd.required_skills, jd.preferred_skills)
    req_skill_score = skill_res["required_match_percentage"]
    
    # 2. Keyword Matching
    keyword_res = match_keywords(resume_text, jd.keywords)
    keyword_score = keyword_res["score"]
    
    # 3. Experience & Projects
    exp_status, exp_score = match_experience(resume, jd)
    
    # 4. Education
    edu_status, edu_score = match_education(resume, jd)
    
    # 5. Semantic Match
    semantic_res = match_semantics(resume, jd)
    semantic_score = semantic_res.get("overall_similarity", 0)
    if semantic_res.get("status") == "unavailable" or semantic_score == 0:
        # Fallback to blend of skill and keyword score if ML model embedding service is cold/unavailable
        semantic_score = int(round(0.6 * req_skill_score + 0.4 * keyword_score))
        
    # 6. Resume Quality / Completeness
    quality_score = evaluate_resume_quality(resume)
    
    # 7. Weighted Composite Score
    # Required skills: 40%, Semantic: 25%, Keywords: 15%, Experience/Projects: 10%, Education: 5%, Quality: 5%
    raw_score = (
        req_skill_score  * 0.40 +
        semantic_score   * 0.25 +
        keyword_score    * 0.15 +
        exp_score        * 0.10 +
        edu_score        * 0.05 +
        quality_score    * 0.05
    )
    
    # Calibrated final score bounded between 15 and 100
    final_score = max(15, min(100, int(round(raw_score))))
    score_label = determine_score_label(final_score)
    
    has_projects = bool(resume.sections.get("projects", "").strip()) or "project" in resume_text.lower()
    explanation = generate_score_explanation(
        final_score=final_score,
        matched_req=skill_res["matched_required"],
        missing_req=skill_res["missing_required"],
        matched_pref=skill_res["matched_preferred"],
        missing_pref=skill_res["missing_preferred"],
        has_projects=has_projects
    )
    
    breakdown = ScoreBreakdown(
        required_skills=req_skill_score,
        semantic_relevance=semantic_score,
        keywords=keyword_score,
        experience_projects=exp_score,
        education=edu_score,
        resume_quality=quality_score
    )
    
    return MatchingResponse(
        status="success",
        overall_score=final_score,
        score_label=score_label,
        explanation=explanation,
        score_breakdown=breakdown,
        resume_data=resume,
        job_description_data=jd,
        skill_match=SkillMatchResult(**skill_res),
        keyword_match=KeywordMatchResult(**keyword_res),
        experience_match=exp_status,
        education_match=edu_status,
        semantic_match=SemanticMatchResult(**semantic_res)
    )
