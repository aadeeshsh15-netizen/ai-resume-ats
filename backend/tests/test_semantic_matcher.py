import pytest
from app.schemas.resume import ParseResponse
from app.schemas.job_description import JobDescriptionAnalyzeResponse, ExperienceRequirement, EducationRequirement
from app.ml.semantic_matcher import match_semantics

@pytest.fixture
def similar_resume_and_jd():
    resume = ParseResponse(
        status="success",
        filename="resume.pdf",
        file_type="PDF",
        character_count=100,
        word_count=20,
        full_text="Built predictive models in Python using scikit-learn and processed datasets with pandas.",
        sections={
            "summary": "Data Scientist with experience in building machine learning models.",
            "experience": "Built predictive models in Python using scikit-learn and processed datasets with pandas.",
            "skills": "Python, Machine Learning, Data Science, Pandas, Scikit-learn"
        }
    )
    
    jd = JobDescriptionAnalyzeResponse(
        status="success",
        job_title="Machine Learning Engineer",
        required_skills=["Python", "Machine Learning"],
        preferred_skills=["Pandas"],
        experience=ExperienceRequirement(minimum_years=2, maximum_years=None),
        education=EducationRequirement(required=True, fields=["Computer Science"]),
        responsibilities=["Develop machine learning models and analyze datasets using Python.", "Clean datasets and run models."],
        keywords=["Python", "Machine Learning"]
    )
    
    return resume, jd

@pytest.fixture
def unrelated_resume():
    return ParseResponse(
        status="success",
        filename="resume.pdf",
        file_type="PDF",
        character_count=100,
        word_count=20,
        full_text="Designed responsive web interfaces using React and CSS.",
        sections={
            "summary": "Frontend developer.",
            "experience": "Designed responsive web interfaces using React and CSS.",
            "skills": "React, CSS, HTML, JavaScript"
        }
    )

def test_semantic_matcher(similar_resume_and_jd, unrelated_resume):
    resume, jd = similar_resume_and_jd
    
    res_similar = match_semantics(resume, jd)
    
    if res_similar["status"] == "unavailable":
        pytest.skip("Embedding model is not available in test environment.")
        
    assert res_similar["overall_similarity"] > 0
    assert res_similar["experience_similarity"] > 0
    
    # Run the unrelated one
    res_unrelated = match_semantics(unrelated_resume, jd)
    
    assert res_similar["overall_similarity"] > res_unrelated["overall_similarity"], "Similar text should have higher semantic similarity than unrelated text."
    assert res_similar["experience_similarity"] > res_unrelated["experience_similarity"]
