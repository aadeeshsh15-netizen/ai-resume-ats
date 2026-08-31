from pydantic import BaseModel, Field
from typing import List, Optional

class ExperienceRequirement(BaseModel):
    minimum_years: Optional[int] = None
    maximum_years: Optional[int] = None

class EducationRequirement(BaseModel):
    required: bool = False
    fields: List[str] = []

class JobDescriptionRequest(BaseModel):
    job_description: str = Field(..., min_length=50, max_length=20000)

class JobDescriptionAnalyzeResponse(BaseModel):
    status: str
    job_title: Optional[str] = None
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    experience: ExperienceRequirement
    education: EducationRequirement
    responsibilities: List[str] = []
    keywords: List[str] = []
