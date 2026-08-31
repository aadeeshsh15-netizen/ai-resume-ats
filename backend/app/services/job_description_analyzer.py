import re
from typing import Dict, List, Tuple, Set
from app.parsers.skills_dict import KNOWN_SKILLS, SKILL_ALIASES
from app.services.skill_matcher import _build_skill_pattern, normalize_skill

ROLE_KEYWORDS = [
    "engineer", "developer", "intern", "internship", "architect", "analyst",
    "manager", "specialist", "designer", "lead", "consultant", "scientist",
    "administrator", "officer", "associate", "director", "representative",
    "coordinator", "technician", "programmer", "full stack", "fullstack",
    "backend", "frontend", "devops", "qa", "sre", "data", "cloud", "security",
    "product", "ai", "ml", "software", "mobile", "ios", "android", "sysadmin"
]

GENERIC_HEADERS = [
    "job description", "job overview", "about us", "who we are", "about the role",
    "about the company", "company overview", "role overview", "role summary",
    "overview", "summary", "description", "requirements", "responsibilities",
    "qualifications", "what we do", "the opportunity", "position summary",
    "job summary", "job details", "careers", "we are hiring", "job description to test role"
]

def clean_title_text(raw: str) -> str:
    """Strips emojis, markdown formatting, and generic prefixes from job title candidate."""
    cleaned = re.sub(r'[\U00010000-\U0010ffff]', '', raw)
    cleaned = re.sub(r'[\u2600-\u27bf]', '', cleaned)
    cleaned = re.sub(r'[*_~`#]+', '', cleaned)
    cleaned = re.sub(r'(?i)^\s*(?:job\s+description|job\s+title|title|role|position|about\s+the\s+role)\s*[:\-–—]\s*', '', cleaned)
    cleaned = cleaned.strip(" -:–—\t\r\n")
    return cleaned

def extract_job_title(text: str) -> str:
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if not lines:
        return "Software Engineer"
        
    # 1. Explicit pattern match: "Job Title: Software Engineering Intern"
    match = re.search(r'(?i)(?:job\s*title|position|role|opening|target\s+role)\s*[:\-–—]\s*([^\n\r]+)', text)
    if match:
        candidate = clean_title_text(match.group(1))
        if 3 <= len(candidate) <= 60 and candidate.lower() not in GENERIC_HEADERS:
            return candidate

    # 2. Search first 6 lines for title-like headings containing role keywords
    for line in lines[:6]:
        cleaned = clean_title_text(line)
        cleaned_lower = cleaned.lower()
        if cleaned_lower in GENERIC_HEADERS or len(cleaned) < 3 or len(cleaned) > 60:
            continue
        words = cleaned.split()
        if len(words) <= 7 and not re.search(r'(?i)^(?:we\b|the\b|our\b|this\b|looking\b|seeking\b|join\b|about\b|who\b|at\b)', cleaned):
            if any(re.search(rf'\b{re.escape(kw)}\b', cleaned_lower) for kw in ROLE_KEYWORDS):
                return cleaned

    # 3. Sentence pattern: "We are looking for a Software Engineering Intern to join..."
    match_sentence = re.search(r'(?i)(?:looking for|seeking|hiring)\s+(?:an?|the)\s+([A-Za-z0-9\s/\-&]+?)\s+(?:to\s+join|to\s+build|to\s+lead|to\s+help|to\s+work|who|with|\.|\n)', text)
    if match_sentence:
        candidate = clean_title_text(match_sentence.group(1))
        if 3 <= len(candidate) <= 50 and candidate.lower() not in GENERIC_HEADERS:
            return candidate

    # 4. Fallback to first non-generic short line
    for line in lines[:3]:
        cleaned = clean_title_text(line)
        cleaned_lower = cleaned.lower()
        if cleaned_lower not in GENERIC_HEADERS and 3 <= len(cleaned) <= 50 and not cleaned.endswith(('.', ':', ',')):
            return cleaned

    return "Target Position"

def find_skills_in_text_block(text_block: str) -> Set[str]:
    """Finds all canonical skills present in a given text snippet."""
    block_lower = text_block.lower()
    found = set()
    
    for canonical in KNOWN_SKILLS:
        terms_to_check = [canonical.lower()]
        for alias, mapped in SKILL_ALIASES.items():
            if mapped == canonical:
                terms_to_check.append(alias.lower())
        terms_to_check = list(set(terms_to_check))
        
        for term in terms_to_check:
            pat = _build_skill_pattern(term)
            if re.search(pat, block_lower):
                found.add(canonical)
                break
                
    return found

def extract_skills(text: str) -> Tuple[List[str], List[str]]:
    """
    Extracts required and preferred skills with strict section priority resolution.
    Explicit skill sections take precedence over all other occurrences in the JD.
    Preferred skills are preserved and never promoted to required simply because they
    appear in Responsibilities or general text.
    """
    explicit_required = set()
    explicit_preferred = set()
    other_skills = set()
    
    # Header regex patterns
    req_header_pat = re.compile(
        r'(?i)^\s*[-*•#]*\s*(?:(?:required|requirements|minimum|basic|core|mandatory|essential|must[\s\-_]*have|what\s+you(?:\'ll)?\s+need|what\s+we\s+are\s+looking\s+for|qualifications)(?:[\s/|&,]+(?:required|requirements|minimum|basic|core|mandatory|essential|must[\s\-_]*have|qualifications|skills|competencies))*)[\s\-_]*(?:skills|qualifications|requirements|competencies)?(?:\s*[:\-]|\s*$)',
        re.MULTILINE
    )
    pref_header_pat = re.compile(
        r'(?i)^\s*[-*•#]*\s*(?:(?:preferred|nice[\s\-_]*to[\s\-_]*have|bonus(?:\s*points)?|plus|desirable|desired|good[\s\-_]*to[\s\-_]*have|additional|optional)(?:[\s/|&,]+(?:preferred|nice[\s\-_]*to[\s\-_]*have|bonus(?:\s*points)?|plus|desirable|desired|good[\s\-_]*to[\s\-_]*have|additional|optional|skills|qualifications|competencies))*)[\s\-_]*(?:skills|qualifications|requirements|competencies)?(?:\s*[:\-]|\s*$)',
        re.MULTILINE
    )
    other_header_pat = re.compile(
        r'(?i)^\s*[-*•#]*\s*(?:responsibilities|duties|what you(?:\'ll)? do|about (?:us|the role|the company|team)|benefits|perks|compensation|how to apply|apply|equal opportunity|additional qualifications|additional requirements|summary|overview)(?:\s*[:\-]|\s*$)',
        re.MULTILINE
    )
    
    lines = text.split('\n')
    current_section = "general" # 'general', 'required', 'preferred', 'other'
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
            
        # 1. Check if line is a section header
        if req_header_pat.search(stripped):
            current_section = "required"
            header_content = re.sub(req_header_pat, '', stripped)
            if header_content.strip():
                explicit_required.update(find_skills_in_text_block(header_content))
            continue
            
        if pref_header_pat.search(stripped):
            current_section = "preferred"
            header_content = re.sub(pref_header_pat, '', stripped)
            if header_content.strip():
                explicit_preferred.update(find_skills_in_text_block(header_content))
            continue
            
        if other_header_pat.search(stripped):
            current_section = "other"
            header_content = re.sub(other_header_pat, '', stripped)
            if header_content.strip():
                other_skills.update(find_skills_in_text_block(header_content))
            continue
            
        # 2. Check inline prefixes (e.g. "- Preferred: Docker, AWS" inside another block)
        if re.search(r'(?i)\b(?:preferred|nice[\s\-_]*to[\s\-_]*have|bonus|plus)\s*:', stripped):
            explicit_preferred.update(find_skills_in_text_block(stripped))
            continue
            
        if re.search(r'(?i)\b(?:required|must[\s\-_]*have|essential)\s*:', stripped):
            explicit_required.update(find_skills_in_text_block(stripped))
            continue
            
        # 3. Extract skills on the line according to current section
        skills_on_line = find_skills_in_text_block(stripped)
        if not skills_on_line:
            continue
            
        if current_section == "required":
            explicit_required.update(skills_on_line)
        elif current_section == "preferred":
            explicit_preferred.update(skills_on_line)
        else:
            other_skills.update(skills_on_line)
            
    # Section priority resolution:
    final_required = set()
    final_preferred = set()
    
    if explicit_required:
        final_required = set(explicit_required)
    elif other_skills:
        # Fallback when no explicit "Required Skills" section header exists in the JD
        final_required = set(other_skills)
        
    if explicit_preferred:
        final_preferred = set(explicit_preferred)
        
    # Preferred skills must NOT be in required
    final_required = final_required - final_preferred
    
    # If both explicit sections had the same skill, required takes precedence
    if explicit_required and explicit_preferred:
        overlap = explicit_required & explicit_preferred
        if overlap:
            final_required.update(overlap)
            final_preferred.difference_update(overlap)
            
    # Fallback if no required skills were found at all, but preferred skills were
    if not final_required and final_preferred:
        final_required = final_preferred
        final_preferred = set()
        
    return list(final_required), list(final_preferred)

def extract_experience(text: str) -> Tuple[int | None, int | None]:
    # Look for patterns like "3+ years", "2-4 years", "minimum 5 years"
    min_years = None
    max_years = None
    
    patterns = [
        r'(\d+)\s*(?:-|to)\s*(\d+)\s*\+?\s*years?', # 2-4 years
        r'(\d+)\+?\s*years?',                       # 3+ years
        r'minimum\s*(?:of\s*)?(\d+)\s*years?',      # minimum 5 years
        r'at\s*least\s*(\d+)\s*years?'              # at least 1 year
    ]
    
    text_lower = text.lower()
    for pattern in patterns:
        match = re.search(pattern, text_lower)
        if match:
            groups = match.groups()
            if len(groups) == 2 and groups[1] is not None:
                min_years = int(groups[0])
                max_years = int(groups[1])
            else:
                min_years = int(groups[0])
            break
            
    return min_years, max_years

def extract_education(text: str) -> Tuple[bool, List[str]]:
    required = False
    fields = []
    
    text_lower = text.lower()
    
    # Check if education is required
    if re.search(r'(?i)(bachelor|master|phd|degree|b\.s\.|m\.s\.|b\.a\.)', text_lower):
        required = True
        
    # Look for fields
    field_keywords = ["computer science", "engineering", "mathematics", "information technology", "related field"]
    for field in field_keywords:
        if field in text_lower:
            fields.append(field.title())
            
    return required, fields

def extract_responsibilities(text: str) -> List[str]:
    # Look for a responsibilities section and extract bullets
    responsibilities = []
    
    # Try to find the section
    match = re.search(r'(?i)(?:responsibilities|what you\'ll do|what you will do)[:\n]+(.*?)(?:\n\n[A-Z]|\Z)', text, re.DOTALL)
    if match:
        section_text = match.group(1)
        # Extract lines that look like bullets
        lines = section_text.split('\n')
        for line in lines:
            line = line.strip()
            # If line starts with a bullet character or dash, or is just a sentence
            line = re.sub(r'^[-*•]\s*', '', line)
            if len(line) > 10:
                responsibilities.append(line)
                
    return responsibilities

def extract_keywords(text: str, skills: List[str]) -> List[str]:
    keywords = set(skills)
    
    # Add domain-specific terms if they exist in the text
    extra_terms = ["REST", "API", "REST API", "Agile", "Scrum", "Microservices", "Cloud", "Frontend", "Backend", "Full Stack"]
    text_lower = text.lower()
    
    for term in extra_terms:
        term_lower = term.lower()
        pat = r'\b' + re.escape(term_lower) + r'(?:s)?\b'
        if re.search(pat, text_lower):
            keywords.add(term)
            
    return list(keywords)
