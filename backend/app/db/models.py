from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    analyses = relationship("Analysis", back_populates="owner", cascade="all, delete-orphan")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_title = Column(String, nullable=False)
    
    # Store aggregated JSON results for the analysis history
    resume_data = Column(JSON, nullable=True)
    job_description_data = Column(JSON, nullable=True)
    skill_match = Column(JSON, nullable=True)
    keyword_match = Column(JSON, nullable=True)
    semantic_match = Column(JSON, nullable=True)
    overall_score = Column(Integer, nullable=True) # E.g. ATS Score proxy
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="analyses")
