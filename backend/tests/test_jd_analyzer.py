import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.job_description_analyzer import (
    extract_job_title, extract_skills, extract_experience,
    extract_education, extract_responsibilities, extract_keywords
)

client = TestClient(app)

def test_extract_job_title():
    text = "Senior Python Developer\nWe are looking for..."
    assert extract_job_title(text) == "Senior Python Developer"
    
    text2 = "Job Title: Machine Learning Engineer\nAbout the role..."
    assert extract_job_title(text2) == "Machine Learning Engineer"

def test_extract_skills():
    text = """
    Requirements:
    - Minimum 3 years of Python and FastAPI.
    - Experience with PostgreSQL.
    
    Nice to have:
    - Docker
    - AWS and CI/CD pipelines
    """
    req, pref = extract_skills(text)
    assert "Python" in req
    assert "FastAPI" in req
    assert "PostgreSQL" in req
    assert "Docker" in pref
    assert "AWS" in pref
    assert "CI/CD" in pref

def test_extract_experience():
    assert extract_experience("Minimum 5 years of experience")[0] == 5
    assert extract_experience("3-5 years of experience") == (3, 5)
    assert extract_experience("2+ years of experience")[0] == 2
    assert extract_experience("no experience needed") == (None, None)

def test_extract_education():
    req, fields = extract_education("Bachelor's degree in Computer Science or Mathematics")
    assert req is True
    assert "Computer Science" in fields
    assert "Mathematics" in fields
    
    req, fields = extract_education("We want a good coder.")
    assert req is False
    assert len(fields) == 0

def test_extract_responsibilities():
    text = """
    Responsibilities:
    - Develop REST APIs
    - Build scalable backend services
    - Work with cross-functional teams
    
    Requirements:
    - Python
    """
    resp = extract_responsibilities(text)
    assert "Develop REST APIs" in resp
    assert "Build scalable backend services" in resp
    assert "Work with cross-functional teams" in resp

def test_extract_keywords():
    keywords = extract_keywords("We use Agile and REST APIs", ["Python"])
    assert "Python" in keywords
    assert "Agile" in keywords
    assert "REST" in keywords
    assert "API" in keywords

def test_api_endpoint():
    payload = {
        "job_description": "Title: Backend Developer\nRequirements:\n- 2+ years of Python and FastAPI.\n\nPreferred:\n- Docker"
    }
    response = client.post("/api/job-description/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["job_title"] == "Backend Developer"
    assert "Python" in data["required_skills"]
    assert "FastAPI" in data["required_skills"]
    assert "Docker" in data["preferred_skills"]
    assert data["experience"]["minimum_years"] == 2

def test_api_endpoint_too_short():
    payload = {
        "job_description": "Too short."
    }
    response = client.post("/api/job-description/analyze", json=payload)
    assert response.status_code == 422 # Pydantic validation fails because min_length=50

def test_section_priority_preferred_skill_in_responsibilities():
    """
    Regression Test:
    When a skill like Docker or Machine Learning is explicitly listed in Preferred / Nice-to-Have,
    and also mentioned in Responsibilities, it MUST remain in preferred_skills and NOT be promoted to required_skills.
    """
    jd_text = """Software Engineering Intern

Required Skills:
- Python
- JavaScript
- TypeScript
- React
- SQL
- MySQL
- PostgreSQL
- FastAPI
- Flask
- REST API
- Git

Responsibilities:
- Develop and maintain backend and frontend applications.
- Build and integrate RESTful APIs.
- Work with relational databases and write efficient SQL queries.
- Collaborate with developers using Git-based workflows.
- Deploy microservices and containerized workflows using Docker.
- Build machine learning and artificial intelligence features.
- Participate in code reviews and debugging.
- Write clean, maintainable and well-documented code.

Preferred / Nice-to-Have Skills:
- Docker
- AWS
- Machine Learning
- Artificial Intelligence
"""
    req, pref = extract_skills(jd_text)
    assert len(req) == 11
    assert len(pref) == 4
    for s in ["Python", "JavaScript", "TypeScript", "React", "SQL", "MySQL", "PostgreSQL", "FastAPI", "Flask", "Git", "REST API"]:
        assert s in req
    for s in ["Docker", "AWS", "Machine Learning", "Artificial Intelligence"]:
        assert s in pref
        assert s not in req

def test_section_priority_no_explicit_skill_sections():
    """When no explicit skill section headers exist, skills in text become required."""
    text = "We are seeking a developer with hands-on experience in Python, FastAPI, and PostgreSQL to build web services."
    req, pref = extract_skills(text)
    assert "Python" in req
    assert "FastAPI" in req
    assert "PostgreSQL" in req
    assert len(pref) == 0

def test_section_priority_case_and_aliases():
    """Skills listed with aliases or case variations are normalized and deduplicated."""
    text = """Requirements:
- python3, react.js, POSTGRES, git/github
Nice to have:
- k8s, docker-compose, amazon web services
"""
    req, pref = extract_skills(text)
    assert "Python" in req
    assert "React" in req
    assert "PostgreSQL" in req
    assert "Git" in req
    assert "Kubernetes" in pref
    assert "Docker" in pref
    assert "AWS" in pref

