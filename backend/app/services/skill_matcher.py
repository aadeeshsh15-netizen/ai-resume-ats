import re
from typing import List, Tuple, Dict, Set
from app.parsers.skills_dict import KNOWN_SKILLS, SKILL_ALIASES

def clean_skill_string(s: str) -> str:
    """Normalizes whitespace and common separator variations in skill names."""
    cleaned = s.strip().lower()
    # Replace multiple spaces with single space
    cleaned = re.sub(r'\s+', ' ', cleaned)
    return cleaned

def normalize_skill(skill: str) -> str:
    """Normalizes a skill string using case insensitivity, whitespace trimming, and the aliases dictionary."""
    s = clean_skill_string(skill)
    
    # Check if the lowercased string matches an alias
    if s in SKILL_ALIASES:
        return SKILL_ALIASES[s]
    
    # Try removing trailing punctuation like dots/commas
    s_clean = s.rstrip('.,;:')
    if s_clean in SKILL_ALIASES:
        return SKILL_ALIASES[s_clean]
    
    # Check if casing matches a known skill
    for known in KNOWN_SKILLS:
        if known.lower() == s or known.lower() == s_clean:
            return known
            
    # Capitalize appropriately if unknown
    return skill.strip().title()

def _build_skill_pattern(skill_term: str) -> str:
    """Builds a safe regex pattern for matching a skill term with proper boundaries."""
    escaped = re.escape(skill_term.lower())
    
    # If term ends with special characters like ++ or #, standard \b boundary won't match after the symbol
    if skill_term.endswith(('++', '#', '+')):
        return r'(?:^|[\s,;:(/])' + escaped + r'(?:[\s,;:)/]|$)'
    elif skill_term.startswith('.'):
        return r'(?:^|[\s,;:(/])' + escaped + r'\b'
    elif len(skill_term) <= 2:
        # For very short tokens like "C", "Go", "R", ensure strict word/punctuation isolation
        return r'(?<![A-Za-z0-9])' + escaped + r'(?![A-Za-z0-9])'
    else:
        return r'\b' + escaped + r'\b'

def extract_resume_skills(resume_text: str) -> Set[str]:
    """Finds all known skills in the resume text."""
    found_skills = set()
    text_lower = resume_text.lower()
    
    # 1. Search for known canonical skills and their configured aliases
    for canonical in KNOWN_SKILLS:
        terms_to_check = [canonical.lower()]
        for alias, mapped_canonical in SKILL_ALIASES.items():
            if mapped_canonical == canonical:
                terms_to_check.append(alias.lower())
                
        # Deduplicate terms
        terms_to_check = list(set(terms_to_check))
        
        for term in terms_to_check:
            pat = _build_skill_pattern(term)
            if re.search(pat, text_lower):
                found_skills.add(canonical)
                break
                
    return found_skills

def match_skills(resume_text: str, jd_req: List[str], jd_pref: List[str]) -> Dict:
    """Matches the extracted resume skills against JD required and preferred skills."""
    resume_skills = extract_resume_skills(resume_text)
    
    # Normalize JD skills
    req_normalized = []
    for s in jd_req:
        norm = normalize_skill(s)
        if norm and norm not in req_normalized:
            req_normalized.append(norm)
            
    pref_normalized = []
    for s in jd_pref:
        norm = normalize_skill(s)
        if norm and norm not in pref_normalized and norm not in req_normalized:
            pref_normalized.append(norm)
            
    matched_req = [s for s in req_normalized if s in resume_skills]
    missing_req = [s for s in req_normalized if s not in resume_skills]
    
    matched_pref = [s for s in pref_normalized if s in resume_skills]
    missing_pref = [s for s in pref_normalized if s not in resume_skills]
    
    # Calculate percentages
    req_pct = int(round((len(matched_req) / len(req_normalized)) * 100)) if req_normalized else 100
    pref_pct = int(round((len(matched_pref) / len(pref_normalized)) * 100)) if pref_normalized else 100
    
    # Score calculation
    if req_normalized and pref_normalized:
        overall_score = int(round(0.80 * req_pct + 0.20 * pref_pct))
    elif req_normalized:
        overall_score = req_pct
    elif pref_normalized:
        overall_score = pref_pct
    else:
        # If JD has no specified skills, score based on general presence of technical skills
        overall_score = 100 if resume_skills else 50
        
    return {
        "score": overall_score,
        "matched_required": matched_req,
        "missing_required": missing_req,
        "required_match_percentage": req_pct,
        "matched_preferred": matched_pref,
        "missing_preferred": missing_pref,
        "preferred_match_percentage": pref_pct
    }
