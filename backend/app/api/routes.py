import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Body, Form
from app.schemas.resume import UploadResponse, ParseResponse
from app.schemas.job_description import JobDescriptionRequest, JobDescriptionAnalyzeResponse, ExperienceRequirement, EducationRequirement
from app.schemas.matching import MatchingResponse
from app.schemas.llm import AIInsightsRequest, AIInsightsResponse, RewriteBulletRequest, RewriteBulletResponse, InterviewQuestionsRequest, InterviewQuestionsResponse
from app.parsers.resume_parser import parse_resume
from app.services.job_description_analyzer import extract_job_title, extract_skills, extract_experience, extract_education, extract_responsibilities, extract_keywords
from app.services.matching_engine import run_matching_engine
from app.services.llm_service import LLMService

router = APIRouter()

UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 5 * 1024 * 1024 # 5 MB

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/health")
def health_check():
    return {"status": "ok", "message": "API is healthy"}

@router.post("/resume/upload", response_model=UploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    # Validate file type
    allowed_types = [
        "application/pdf", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    if file.content_type not in allowed_types and not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF and DOCX are supported."
        )

    # Validate file size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File is too large. Maximum size is 5MB."
        )

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty file."
        )

    identifier = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    safe_filename = f"{identifier}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )

    return UploadResponse(
        status="success",
        message="File uploaded successfully",
        filename=file.filename,
        file_type="PDF" if file.filename.endswith(".pdf") else "DOCX",
        identifier=identifier
    )

@router.post("/resume/parse", response_model=ParseResponse)
async def parse_uploaded_resume(file: UploadFile = File(...)):
    # Validate file type
    allowed_types = [
        "application/pdf", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    if file.content_type not in allowed_types and not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF and DOCX are supported."
        )

    # Validate file size
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File is too large. Maximum size is 5MB."
        )

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty file."
        )

    identifier = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    safe_filename = f"{identifier}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )
        
    try:
        file_type = "PDF" if file.filename.endswith(".pdf") else "DOCX"
        parsed_data = parse_resume(file_path, file_type)
        
        return ParseResponse(
            status="success",
            filename=file.filename,
            file_type=file_type,
            character_count=parsed_data["character_count"],
            word_count=parsed_data["word_count"],
            full_text=parsed_data["full_text"],
            sections=parsed_data["sections"]
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error parsing document: {str(e)}"
        )

@router.post("/job-description/analyze", response_model=JobDescriptionAnalyzeResponse)
def analyze_job_description(request: JobDescriptionRequest = Body(...)):
    text = request.job_description
    
    if len(text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Job description is too short.")
        
    title = extract_job_title(text)
    req_skills, pref_skills = extract_skills(text)
    min_yrs, max_yrs = extract_experience(text)
    edu_req, edu_fields = extract_education(text)
    responsibilities = extract_responsibilities(text)
    keywords = extract_keywords(text, req_skills + pref_skills)
    
    return JobDescriptionAnalyzeResponse(
        status="success",
        job_title=title,
        required_skills=req_skills,
        preferred_skills=pref_skills,
        experience=ExperienceRequirement(minimum_years=min_yrs, maximum_years=max_yrs),
        education=EducationRequirement(required=edu_req, fields=edu_fields),
        responsibilities=responsibilities,
        keywords=keywords
    )

@router.post("/analyze/match", response_model=MatchingResponse)
def analyze_and_match(file: UploadFile = File(...), job_description: str = Form(...)):
    # 1. Parse JD
    if len(job_description.strip()) < 50:
        raise HTTPException(status_code=400, detail="Job description is too short.")
        
    jd_title = extract_job_title(job_description)
    req_skills, pref_skills = extract_skills(job_description)
    min_yrs, max_yrs = extract_experience(job_description)
    edu_req, edu_fields = extract_education(job_description)
    responsibilities = extract_responsibilities(job_description)
    keywords = extract_keywords(job_description, req_skills + pref_skills)
    
    jd_data = JobDescriptionAnalyzeResponse(
        status="success",
        job_title=jd_title,
        required_skills=req_skills,
        preferred_skills=pref_skills,
        experience=ExperienceRequirement(minimum_years=min_yrs, maximum_years=max_yrs),
        education=EducationRequirement(required=edu_req, fields=edu_fields),
        responsibilities=responsibilities,
        keywords=keywords
    )
    
    # 2. Parse Resume
    allowed_types = [
        "application/pdf", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    if file.content_type not in allowed_types and not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF and DOCX are supported."
        )

    identifier = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    safe_filename = f"{identifier}{ext}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
        
    try:
        file_type = "PDF" if file.filename.endswith(".pdf") else "DOCX"
        parsed_data = parse_resume(file_path, file_type)
        
        resume_data = ParseResponse(
            status="success",
            filename=file.filename,
            file_type=file_type,
            character_count=parsed_data["character_count"],
            word_count=parsed_data["word_count"],
            full_text=parsed_data["full_text"],
            sections=parsed_data["sections"]
        )
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing document: {str(e)}")
        
    # 3. Match
    from app.services.skill_matcher import extract_resume_skills
    skills_in_resume = extract_resume_skills(resume_data.full_text)
    
    print("\n" + "="*50)
    print(f"[MATCH API] Processing Resume: {file.filename} ({file_type})")
    print(f"[MATCH API] Extracted Text Length: {len(resume_data.full_text)} chars, {resume_data.word_count} words")
    print(f"[MATCH API] Sample Text:\n{resume_data.full_text[:300]}...")
    print(f"[MATCH API] Extracted Resume Skills: {sorted(list(skills_in_resume))}")
    print(f"[MATCH API] JD Title: {jd_data.job_title}")
    print(f"[MATCH API] JD Required Skills: {jd_data.required_skills}")
    print(f"[MATCH API] JD Preferred Skills: {jd_data.preferred_skills}")
    
    result = run_matching_engine(resume_data, jd_data)
    
    print(f"[MATCH API] Result Overall Score: {result.overall_score}/100 ({result.score_label})")
    print(f"[MATCH API] Breakdown: {result.score_breakdown.model_dump()}")
    print(f"[MATCH API] Matched Req: {result.skill_match.matched_required}")
    print(f"[MATCH API] Missing Req: {result.skill_match.missing_required}")
    print("="*50 + "\n")
    
    return result

@router.post("/analyze/ai-insights", response_model=AIInsightsResponse)
def analyze_ai_insights(request: AIInsightsRequest = Body(...)):
    llm = LLMService()
    
    if not llm.is_available():
        raise HTTPException(status_code=503, detail="AI insights are temporarily unavailable. API key missing or provider down.")
        
    insights = llm.generate_insights(
        resume_data=request.resume_data,
        jd_data=request.job_description_data,
        matching=request.matching_results
    )
    
    if not insights:
        raise HTTPException(status_code=500, detail="Failed to generate AI insights due to an internal error or malformed response.")
        
    return insights

@router.post("/analyze/rewrite-bullet", response_model=RewriteBulletResponse)
def analyze_rewrite_bullet(request: RewriteBulletRequest = Body(...)):
    llm = LLMService()
    
    if not llm.is_available():
        raise HTTPException(status_code=503, detail="AI rewriting is temporarily unavailable. API key missing or provider down.")
        
    if not request.original_bullet or len(request.original_bullet.strip()) < 5:
        raise HTTPException(status_code=400, detail="Bullet point is too short or empty.")
        
    if len(request.original_bullet) > 1000:
        raise HTTPException(status_code=400, detail="Bullet point is too long.")
        
    response = llm.rewrite_resume_bullet(
        original_bullet=request.original_bullet,
        resume_context=request.resume_context,
        job_context=request.job_context,
        known_skills=request.known_skills,
        relevant_requirements=request.relevant_requirements
    )
    
    if not response:
        raise HTTPException(status_code=500, detail="Failed to rewrite bullet due to an internal error or malformed response.")
        
    return response

@router.post("/analyze/interview-questions", response_model=InterviewQuestionsResponse)
def analyze_interview_questions(request: InterviewQuestionsRequest = Body(...)):
    llm = LLMService()
    
    if not llm.is_available():
        raise HTTPException(status_code=503, detail="AI interview preparation is temporarily unavailable.")
        
    questions = llm.generate_interview_questions(
        resume_data=request.resume_data,
        jd_data=request.job_description_data,
        matching=request.matching_results
    )
    
    if not questions:
        raise HTTPException(status_code=500, detail="Failed to generate interview questions due to an internal error or malformed response.")
        
    return questions
