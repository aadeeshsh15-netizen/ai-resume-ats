from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.db.models import User, Analysis
from app.schemas.analysis import AnalysisCreate, AnalysisResponse, AnalysisListResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("", response_model=AnalysisResponse)
def create_analysis(
    analysis_in: AnalysisCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    analysis = Analysis(
        user_id=current_user.id,
        job_title=analysis_in.job_title,
        resume_data=analysis_in.resume_data,
        job_description_data=analysis_in.job_description_data,
        skill_match=analysis_in.skill_match,
        keyword_match=analysis_in.keyword_match,
        semantic_match=analysis_in.semantic_match,
        overall_score=analysis_in.overall_score
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis

@router.get("", response_model=List[AnalysisListResponse])
def get_analyses(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(Analysis.created_at.desc()).all()
    return analyses

@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(
    analysis_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis

@router.delete("/{analysis_id}")
def delete_analysis(
    analysis_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    db.delete(analysis)
    db.commit()
    return {"status": "success"}
