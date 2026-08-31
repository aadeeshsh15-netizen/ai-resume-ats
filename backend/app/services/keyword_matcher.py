import re
from typing import List, Dict
from app.services.skill_matcher import normalize_skill, _build_skill_pattern
from app.parsers.skills_dict import SKILL_ALIASES

def match_keywords(resume_text: str, jd_keywords: List[str]) -> Dict:
    """Finds keyword matches and frequency in the resume."""
    text_lower = resume_text.lower()
    
    # Normalize keywords to avoid duplication
    normalized_kws = []
    for k in jd_keywords:
        norm = normalize_skill(k)
        if norm and norm not in normalized_kws:
            normalized_kws.append(norm)
            
    matched = []
    missing = []
    frequencies = {}
    
    for kw in normalized_kws:
        terms_to_check = [kw.lower()]
        for alias, canonical in SKILL_ALIASES.items():
            if canonical.lower() == kw.lower():
                terms_to_check.append(alias.lower())
                
        terms_to_check = list(set(terms_to_check))
        
        count = 0
        for term in terms_to_check:
            pat = _build_skill_pattern(term)
            matches = re.findall(pat, text_lower)
            count += len(matches)
            
        frequencies[kw] = count
        if count > 0:
            matched.append(kw)
        else:
            missing.append(kw)
            
    if normalized_kws:
        score = int(round((len(matched) / len(normalized_kws)) * 100))
    else:
        score = 100 if text_lower.strip() else 50
        
    return {
        "score": score,
        "matched": matched,
        "missing": missing,
        "frequencies": frequencies
    }
