import pytest
from app.schemas.resume import ParseResponse
from app.schemas.job_description import JobDescriptionAnalyzeResponse, ExperienceRequirement, EducationRequirement
from app.services.matching_engine import run_matching_engine
from app.services.skill_matcher import match_skills, extract_resume_skills, normalize_skill

@pytest.fixture
def sample_jd():
    return JobDescriptionAnalyzeResponse(
        status="success",
        job_title="Software Engineer",
        required_skills=["Python", "FastAPI", "PostgreSQL"],
        preferred_skills=["Docker", "AWS"],
        experience=ExperienceRequirement(minimum_years=2, maximum_years=None),
        education=EducationRequirement(required=True, fields=["Computer Science"]),
        responsibilities=["Build REST APIs and backend microservices"],
        keywords=["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"]
    )

def test_calibrated_scoring_and_labels(sample_jd):
    # Resume with partial matching
    resume = ParseResponse(
        status="success",
        filename="resume.pdf",
        file_type="PDF",
        character_count=200,
        word_count=35,
        full_text="I am a Python developer with 3 years of experience. I know React, Postgres, and Docker. I have a Bachelor's in Computer Science.",
        sections={"summary": "Python dev", "skills": "Python, React, Postgres, Docker", "experience": "3 years experience", "education": "Bachelor's Computer Science"}
    )
    
    result = run_matching_engine(resume, sample_jd)
    
    # Check score bounds
    assert 15 <= result.overall_score <= 100
    assert result.score_label in ["Very Low Match", "Low Match", "Moderate Match", "Good Match", "Strong Match", "Excellent Match"]
    assert result.score_breakdown.required_skills > 0
    assert result.score_breakdown.education == 100
    assert result.score_breakdown.experience_projects == 100
    assert len(result.explanation) > 0

def test_empty_or_very_weak_resume(sample_jd):
    # Completely empty / minimal resume
    weak_resume = ParseResponse(
        status="success",
        filename="weak.pdf",
        file_type="PDF",
        character_count=20,
        word_count=4,
        full_text="Seeking a new job.",
        sections={}
    )
    
    result = run_matching_engine(weak_resume, sample_jd)
    
    # Must never return < 15
    assert result.overall_score >= 15
    assert result.overall_score <= 35
    assert result.score_label in ["Very Low Match", "Low Match"]

def test_all_required_and_preferred_skills_matched(sample_jd):
    perfect_resume = ParseResponse(
        status="success",
        filename="perfect.pdf",
        file_type="PDF",
        character_count=400,
        word_count=60,
        full_text="Senior Backend Engineer with 5 years experience. Expert in Python, FastAPI, PostgreSQL, Docker, AWS. Bachelor of Science in Computer Science. Built scalable REST microservices.",
        sections={
            "summary": "Senior Backend Engineer with 5 years experience.",
            "skills": "Python, FastAPI, PostgreSQL, Docker, AWS",
            "experience": "5 years building REST microservices with Python and FastAPI.",
            "education": "Bachelor of Science in Computer Science."
        }
    )
    
    result = run_matching_engine(perfect_resume, sample_jd)
    assert result.overall_score >= 85
    assert result.score_label in ["Strong Match", "Excellent Match"]
    assert len(result.skill_match.missing_required) == 0
    assert len(result.skill_match.missing_preferred) == 0

def test_student_resume_with_projects_no_formal_experience(sample_jd):
    # Student candidate with rich personal/academic projects
    student_resume = ParseResponse(
        status="success",
        filename="student.pdf",
        file_type="PDF",
        character_count=350,
        word_count=55,
        full_text="Computer Science student graduating 2025. Projects: Developed a web application using Python, FastAPI and Postgres. Implemented Docker containerization and CI/CD pipelines. Capstone project winner.",
        sections={
            "summary": "CS student and open source contributor.",
            "skills": "Python, FastAPI, Postgres, Docker, Git",
            "projects": "Developed full-stack web application using Python, FastAPI and Postgres.",
            "education": "Pursuing Bachelor in Computer Science"
        }
    )
    
    result = run_matching_engine(student_resume, sample_jd)
    
    # Must receive project credit (experience_projects >= 65)
    assert result.score_breakdown.experience_projects >= 65
    assert result.overall_score >= 50
    assert result.overall_score <= 100

def test_jd_without_education_or_experience_requirements():
    flexible_jd = JobDescriptionAnalyzeResponse(
        status="success",
        job_title="Full Stack Developer",
        required_skills=["JavaScript", "React"],
        preferred_skills=[],
        experience=ExperienceRequirement(minimum_years=None, maximum_years=None),
        education=EducationRequirement(required=False, fields=[]),
        responsibilities=[],
        keywords=["JavaScript", "React"]
    )
    
    resume = ParseResponse(
        status="success",
        filename="dev.pdf",
        file_type="PDF",
        character_count=200,
        word_count=30,
        full_text="Frontend developer with experience in JS and React.js. Built multiple web apps.",
        sections={"skills": "JS, React.js", "projects": "Web apps"}
    )
    
    result = run_matching_engine(resume, flexible_jd)
    
    # Education and experience must NOT penalize candidate
    assert result.score_breakdown.education == 100
    assert result.score_breakdown.experience_projects >= 80
    assert result.overall_score >= 70

def test_case_insensitive_and_skill_aliases():
    resume_text = "Experienced with js, ts, nodejs, postgres, git/github, python3, c++, and docker-compose."
    skills = extract_resume_skills(resume_text)
    
    assert "JavaScript" in skills
    assert "TypeScript" in skills
    assert "Node.js" in skills
    assert "PostgreSQL" in skills
    assert "Git" in skills
    assert "Python" in skills
    assert "C++" in skills
    assert "Docker" in skills

def test_prevent_false_positive_skill_aliases():
    # Verify related technologies are NOT treated as identical
    assert normalize_skill("Next.js") == "Next.js"
    assert normalize_skill("React") == "React"
    assert normalize_skill("Next.js") != normalize_skill("React")
    
    assert normalize_skill("PostgreSQL") != normalize_skill("MySQL")
    assert normalize_skill("AWS") != normalize_skill("Azure")
    assert normalize_skill("Docker") != normalize_skill("Kubernetes")
    assert normalize_skill("Java") != normalize_skill("JavaScript")
    assert normalize_skill("C") != normalize_skill("C++")

def test_regression_intern_matching_must_not_be_zero():
    """
    Regression Test from User Specification:
    Resume: Python, FastAPI, JavaScript, TypeScript, Git, Node.js, SQL
    Job: Software Engineering Intern with Python, JavaScript, SQL, Git and REST API experience.
    Must NOT produce 0.
    """
    intern_jd = JobDescriptionAnalyzeResponse(
        status="success",
        job_title="Software Engineering Intern",
        required_skills=["Python", "JavaScript", "SQL", "Git", "REST API"],
        preferred_skills=[],
        experience=ExperienceRequirement(minimum_years=None, maximum_years=None),
        education=EducationRequirement(required=False, fields=[]),
        responsibilities=["Develop web features and RESTful endpoints"],
        keywords=["Python", "JavaScript", "SQL", "Git", "REST API"]
    )
    
    intern_resume = ParseResponse(
        status="success",
        filename="intern.pdf",
        file_type="PDF",
        character_count=250,
        word_count=40,
        full_text="Skills: Python, FastAPI, JavaScript, TypeScript, Git, Node.js, SQL. Developed REST API services and responsive web applications.",
        sections={
            "skills": "Python, FastAPI, JavaScript, TypeScript, Git, Node.js, SQL",
            "projects": "Developed REST API services and responsive web applications."
        }
    )
    
    result = run_matching_engine(intern_resume, intern_jd)
    
    # Must NOT produce 0
    assert result.overall_score >= 70
    assert result.score_label in ["Good Match", "Strong Match", "Excellent Match"]
    assert "Python" in result.skill_match.matched_required
    assert "JavaScript" in result.skill_match.matched_required
    assert "SQL" in result.skill_match.matched_required
    assert "Git" in result.skill_match.matched_required

def test_unrelated_resume_receives_low_calibrated_score(sample_jd):
    unrelated_resume = ParseResponse(
        status="success",
        filename="chef.pdf",
        file_type="PDF",
        character_count=300,
        word_count=50,
        full_text="Executive Chef with 10 years experience in Italian cuisine, menu design, kitchen inventory management, pasta preparation, and catering large events.",
        sections={
            "summary": "Executive Chef with 10 years in culinary arts.",
            "experience": "Managed kitchen staff and inventory at fine dining restaurants."
        }
    )
    
    result = run_matching_engine(unrelated_resume, sample_jd)
    
    # Must be between 15 and 35, classified as Low or Very Low Match
    assert 15 <= result.overall_score <= 35
    assert result.score_label in ["Very Low Match", "Low Match"]
    assert "Very limited alignment with this role." in result.explanation or "Limited alignment with this role." in result.explanation

def test_explanation_generation_all_tiers():
    from app.services.matching_engine import generate_score_explanation
    
    # Tier 1: 90-100 (Strong/Excellent with 15/15 required)
    req_15 = ["Python", "JavaScript", "TypeScript", "React", "SQL", "MySQL", "PostgreSQL", "FastAPI", "Flask", "Git", "REST API", "Docker", "AWS", "Node.js", "Redis"]
    exp_94 = generate_score_explanation(
        final_score=94,
        matched_req=req_15,
        missing_req=[],
        matched_pref=["Docker", "AWS"],
        missing_pref=[],
        has_projects=True
    )
    assert exp_94.startswith("Excellent alignment with this role.")
    assert "matches all 15 required skills" in exp_94
    assert "Python" in exp_94
    assert "valuable advantage" in exp_94
    
    # Tier 2: 60-74 (Good match with 7/11 required)
    req_11 = ["Python", "JavaScript", "TypeScript", "React", "SQL", "MySQL", "PostgreSQL"]
    miss_4 = ["FastAPI", "Flask", "Git", "REST API"]
    exp_68 = generate_score_explanation(
        final_score=68,
        matched_req=req_11,
        missing_req=miss_4,
        matched_pref=["Docker", "AWS"],
        missing_pref=["Machine Learning"],
        has_projects=True
    )
    assert exp_68.startswith("Good alignment with this role.")
    assert "matches 7 of 11 required skills" in exp_68
    assert "FastAPI" in exp_68
    assert "valuable advantage" in exp_68
    
    # Tier 3: 15-29 (Weak with 1/15 required skills)
    miss_14 = ["JavaScript", "TypeScript", "React", "SQL", "MySQL", "PostgreSQL", "FastAPI", "Flask", "Git", "REST API", "Docker", "AWS", "Node.js", "Redis"]
    exp_29 = generate_score_explanation(
        final_score=29,
        matched_req=["Python"],
        missing_req=miss_14,
        matched_pref=[],
        missing_pref=["Docker", "AWS"],
        has_projects=False
    )
    assert exp_29.startswith("Very limited alignment with this role.")
    assert "only 1 of 15 required skills matched" in exp_29
    assert "JavaScript" in exp_29
    assert "demonstrates relevant alignment" not in exp_29
    
    # Tier 4: Zero required skills matched
    exp_0 = generate_score_explanation(
        final_score=18,
        matched_req=[],
        missing_req=["Python", "React", "SQL"],
        matched_pref=[],
        missing_pref=["AWS"],
        has_projects=False
    )
    assert exp_0.startswith("Very limited alignment with this role.")
    assert "None of the 3 required skills" in exp_0
    assert "Prioritize adding relevant experience" in exp_0
    
    # Tier 5: No required skills specified in JD
    exp_no_req = generate_score_explanation(
        final_score=75,
        matched_req=[],
        missing_req=[],
        matched_pref=["Python", "Docker"],
        missing_pref=[],
        has_projects=True
    )
    assert exp_no_req.startswith("Strong alignment with this role.")
    assert "does not specify strict mandatory skill requirements" in exp_no_req

