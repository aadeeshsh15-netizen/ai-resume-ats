from pydantic import BaseModel
from typing import List, Dict, Optional
from app.schemas.resume import ParseResponse
from app.schemas.job_description import JobDescriptionAnalyzeResponse

class SkillMatchResult(BaseModel):
    score: int
    matched_required: List[str]
    missing_required: List[str]
    required_match_percentage: int = 100
    matched_preferred: List[str] = []
    missing_preferred: List[str] = []
    preferred_match_percentage: int = 100

class KeywordMatchResult(BaseModel):
    score: int
    matched: List[str]
    missing: List[str]
    frequencies: Dict[str, int]

class SemanticMatchResult(BaseModel):
    status: str
    summary_similarity: int
    experience_similarity: int
    skills_similarity: int
    overall_similarity: int

class ScoreBreakdown(BaseModel):
    required_skills: int
    semantic_relevance: int
    keywords: int
    experience_projects: int
    education: int
    resume_quality: int

class MatchingResponse(BaseModel):
    status: str
    overall_score: int
    score_label: str
    explanation: str
    score_breakdown: ScoreBreakdown
    resume_data: ParseResponse
    job_description_data: JobDescriptionAnalyzeResponse
    skill_match: SkillMatchResult
    keyword_match: KeywordMatchResult
    experience_match: str
    education_match: str
    semantic_match: SemanticMatchResult
