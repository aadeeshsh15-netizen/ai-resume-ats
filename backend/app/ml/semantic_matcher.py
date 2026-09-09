import numpy as np
from typing import Dict, Any, List
from app.ml.embedding_service import EmbeddingService
from app.schemas.resume import ParseResponse
from app.schemas.job_description import JobDescriptionAnalyzeResponse
from app.services.skill_matcher import extract_resume_skills

def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """Calculates cosine similarity between two vectors."""
    if vec1 is None or vec2 is None:
        return 0.0
    
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
        
    return float(np.dot(vec1, vec2) / (norm1 * norm2))

def match_semantics(resume: ParseResponse, jd: JobDescriptionAnalyzeResponse) -> Dict[str, Any]:
    """
    Computes semantic similarity across resume text and JD with robust full-document fallbacks.
    Returns scores as percentages (0-100).
    """
    service = EmbeddingService()
    
    default_response = {
        "status": "unavailable" if not service.is_available else "success",
        "summary_similarity": 0,
        "experience_similarity": 0,
        "skills_similarity": 0,
        "overall_similarity": 0
    }
    
    if not service.is_available:
        return default_response
        
    resume_sections = resume.sections or {}
    resume_full_text = resume.full_text.strip()
    
    # 1. Full Document Anchor
    jd_skills_combined = " ".join(jd.required_skills + jd.preferred_skills)
    jd_resps_combined = " ".join(jd.responsibilities)
    jd_full_text = f"{jd.job_title} {jd_resps_combined} {jd_skills_combined} {' '.join(jd.keywords)}".strip()
    
    sim_full = service.compute_similarity(resume_full_text, jd_full_text)
    
    # 2. Summary Similarity
    resume_summary = resume_sections.get("summary", "").strip() or (resume_full_text[:400] if len(resume_full_text) > 50 else "")
    jd_summary = f"{jd.job_title} {jd_resps_combined[:300]}".strip()
    sim_summary = service.compute_similarity(resume_summary, jd_summary) if resume_summary else sim_full
    
    # 3. Experience & Projects Similarity
    resume_exp = (resume_sections.get("experience", "") + " " + resume_sections.get("projects", "")).strip()
    if not resume_exp or len(resume_exp) < 30:
        resume_exp = resume_full_text
        
    jd_exp_text = jd_resps_combined if jd_resps_combined else jd_full_text
    sim_exp = service.compute_similarity(resume_exp, jd_exp_text) if resume_exp else sim_full
    
    # 4. Skills Similarity
    resume_skills_text = resume_sections.get("skills", "").strip()
    if not resume_skills_text or len(resume_skills_text) < 10:
        extracted = extract_resume_skills(resume_full_text)
        resume_skills_text = " ".join(extracted) if extracted else resume_full_text
        
    jd_skills_text = jd_skills_combined if jd_skills_combined else jd_full_text
    sim_skills = service.compute_similarity(resume_skills_text, jd_skills_text) if resume_skills_text else sim_full
    
    # Weighting: Experience 35%, Skills 30%, Full Document 25%, Summary 10%
    overall = sim_exp * 0.35 + sim_skills * 0.30 + sim_full * 0.25 + sim_summary * 0.10
    
    return {
        "status": "success",
        "summary_similarity": int(round(sim_summary * 100)),
        "experience_similarity": int(round(sim_exp * 100)),
        "skills_similarity": int(round(sim_skills * 100)),
        "overall_similarity": int(round(overall * 100))
    }
