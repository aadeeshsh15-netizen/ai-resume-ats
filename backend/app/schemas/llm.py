from pydantic import BaseModel, Field
from typing import List, Dict

class SectionFeedback(BaseModel):
    score: int
    feedback: str

class AIInsightsResponse(BaseModel):
    status: str
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
    section_feedback: Dict[str, SectionFeedback]
    overall_resume_quality: int

class AIInsightsRequest(BaseModel):
    resume_data: dict
    job_description_data: dict
    matching_results: dict

class RewriteBulletRequest(BaseModel):
    original_bullet: str
    resume_context: str
    job_context: str
    known_skills: List[str]
    relevant_requirements: List[str]

class RewriteBulletResponse(BaseModel):
    status: str
    original: str
    concise: str
    technical: str
    achievement_focused: str

class InterviewQuestion(BaseModel):
    question: str
    difficulty: str
    topic: str
    why_it_matters: str

class InterviewQuestionsResponse(BaseModel):
    status: str
    technical_questions: List[InterviewQuestion]
    resume_questions: List[InterviewQuestion]
    job_specific_questions: List[InterviewQuestion]
    behavioral_questions: List[InterviewQuestion]

class InterviewQuestionsRequest(BaseModel):
    resume_data: dict
    job_description_data: dict
    matching_results: dict
