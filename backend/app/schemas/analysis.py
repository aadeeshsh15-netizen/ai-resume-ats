from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

class AnalysisCreate(BaseModel):
    job_title: str
    resume_data: Any
    job_description_data: Any
    skill_match: Any
    keyword_match: Any
    semantic_match: Any
    overall_score: Optional[int] = None

class AnalysisResponse(AnalysisCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AnalysisListResponse(BaseModel):
    id: int
    job_title: str
    overall_score: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
