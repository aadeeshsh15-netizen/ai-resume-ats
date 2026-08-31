import re
import os
import unicodedata
from app.parsers.pdf_parser import extract_text_from_pdf
from app.parsers.docx_parser import extract_text_from_docx

def clean_text(text: str) -> str:
    """Cleans extracted resume text by removing excessive whitespace and normalizing unicodes/ligatures."""
    if not text:
        return ""
        
    # 1. Unicode NFKD normalization (converts ligatures fi, fl, smart quotes, etc.)
    text = unicodedata.normalize('NFKD', text)
    
    # 2. Replace all zero-width, non-breaking, or invisible characters with spaces
    text = re.sub(r'[\u00a0\u200b\u200c\u200d\ufeff\u00ad\u2060]', ' ', text)
    
    # 3. Replace unicode bullet points and fancy dashes with space
    text = re.sub(r'[\u2022\u2023\u25e6\u2043\u2219\u25aa\u25cf\u25cb\u25a0\u25a1\u25c6\u25c7\u2013\u2014\u2015\u2012]', ' ', text)
    
    # 4. Ensure spacing around common inline separators (e.g. "Python,FastAPI" -> "Python, FastAPI", "React/TypeScript" -> "React / TypeScript")
    text = re.sub(r'([a-zA-Z0-9])([,/|;()\[\]{}])([a-zA-Z0-9])', r'\1 \2 \3', text)
    
    # 5. Fix hyphenated line breaks (e.g. "Type-\nscript" -> "Typescript")
    text = re.sub(r'(\w+)-\n(\w+)', r'\1\2', text)
    
    # 6. Normalize line endings
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    
    # 7. Collapse multiple spaces and excessive blank lines
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n\s*\n+', '\n\n', text)
    
    return text.strip()

def detect_sections(text: str) -> dict:
    """Rule-based section detection supporting all standard resume section formats."""
    sections = {
        "summary": "",
        "skills": "",
        "experience": "",
        "education": "",
        "projects": "",
        "certifications": "",
        "other": ""
    }
    
    # Comprehensive section headers regex
    header_patterns = {
        "summary": r'(?i)^\s*[-*•#]*\s*(?:SUMMARY|PROFILE|OBJECTIVE|ABOUT ME|PROFESSIONAL SUMMARY|EXECUTIVE SUMMARY|CAREER OBJECTIVE|CAREER SUMMARY|OVERVIEW)\b',
        "skills": r'(?i)^\s*[-*•#]*\s*(?:SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|TECHNOLOGIES|TECHNICAL PROFICIENCIES|KEY SKILLS|SKILLS & ABILITIES|AREAS OF EXPERTISE|TECH STACK|PROGRAMMING LANGUAGES|DEVELOPMENT SKILLS|TOOLBOX)\b',
        "experience": r'(?i)^\s*[-*•#]*\s*(?:EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT HISTORY|WORK HISTORY|PROFESSIONAL BACKGROUND|INTERNSHIP EXPERIENCE|INTERNSHIPS)\b',
        "education": r'(?i)^\s*[-*•#]*\s*(?:EDUCATION|ACADEMIC BACKGROUND|ACADEMIC HISTORY|ACADEMICS|EDUCATIONAL QUALIFICATIONS|UNIVERSITY EDUCATION|DEGREES|COURSEWORK)\b',
        "projects": r'(?i)^\s*[-*•#]*\s*(?:PROJECTS|PERSONAL PROJECTS|ACADEMIC PROJECTS|TECHNICAL PROJECTS|KEY PROJECTS|NOTABLE PROJECTS|CAPSTONE PROJECTS|PROJECT WORK|EXPERIENCE & PROJECTS|PROJECTS & EXPERIENCE)\b',
        "certifications": r'(?i)^\s*[-*•#]*\s*(?:CERTIFICATIONS|CERTIFICATES|LICENSES|COURSES|AWARDS|ACHIEVEMENTS|HONORS)\b'
    }
    
    current_section = "other"
    section_content = {k: [] for k in sections.keys()}
    
    lines = text.split('\n')
    for line in lines:
        cleaned_line = line.strip()
        if not cleaned_line:
            continue
            
        # Check if line is a section header (short line, matches keywords)
        is_header = False
        if len(cleaned_line) < 50:
            for section, pattern in header_patterns.items():
                if re.search(pattern, cleaned_line):
                    current_section = section
                    is_header = True
                    break
        
        if not is_header:
            section_content[current_section].append(line)
            
    # Join the collected lines
    for section in sections.keys():
        sections[section] = clean_text('\n'.join(section_content[section]))
        
    return sections

def parse_resume(file_path: str, file_type: str) -> dict:
    """Main resume parsing pipeline."""
    if not os.path.exists(file_path):
        raise FileNotFoundError("Resume file not found.")
        
    # 1. Extract
    text = ""
    if file_type.upper() == "PDF":
        text = extract_text_from_pdf(file_path)
    elif file_type.upper() == "DOCX":
        text = extract_text_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_type}")
        
    if not text or not text.strip():
        raise ValueError("No extractable text found in the document.")
        
    # 2. Clean & normalize
    cleaned_text = clean_text(text)
    
    # 3. Detect sections
    sections = detect_sections(cleaned_text)
    
    return {
        "full_text": cleaned_text,
        "sections": sections,
        "character_count": len(cleaned_text),
        "word_count": len(cleaned_text.split())
    }
