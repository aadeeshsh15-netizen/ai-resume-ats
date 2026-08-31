import pytest
import json
from unittest.mock import patch, MagicMock
from app.services.llm_service import LLMService
from app.schemas.llm import RewriteBulletResponse
from app.services.prompts.bullet_rewrite import build_bullet_rewrite_prompt

@pytest.fixture
def dummy_rewrite_data():
    return {
        "original_bullet": "Built a student attendance app using Python.",
        "resume_context": "Software Engineer with 2 years experience. Projects: Student Attendance App built with Python.",
        "job_context": "Experience with Python, AWS, Docker and PostgreSQL.",
        "known_skills": ["Python"],
        "relevant_requirements": ["Python", "AWS", "Docker", "PostgreSQL"]
    }

@patch("app.services.llm_service.genai.Client")
def test_rewrite_bullet_success(mock_client_class, dummy_rewrite_data):
    mock_client = MagicMock()
    mock_client_class.return_value = mock_client
    
    mock_response = MagicMock()
    mock_response.text = json.dumps({
        "original": dummy_rewrite_data["original_bullet"],
        "concise": "Developed a student attendance application using Python.",
        "technical": "Engineered a backend application for student attendance tracking using Python.",
        "achievement_focused": "Improved student attendance tracking by developing a dedicated Python application."
    })
    mock_client.models.generate_content.return_value = mock_response
    
    with patch("os.getenv", return_value="fake_api_key"):
        llm = LLMService()
        response = llm.rewrite_resume_bullet(**dummy_rewrite_data)
        
        assert response is not None
        assert isinstance(response, RewriteBulletResponse)
        assert response.concise == "Developed a student attendance application using Python."

def test_prompt_factuality_rules(dummy_rewrite_data):
    """Test that the prompt string explicitly includes our strict anti-hallucination rules."""
    prompt = build_bullet_rewrite_prompt(**dummy_rewrite_data)
    assert "NEVER invent numerical metrics" in prompt
    assert "NEVER invent technologies" in prompt
    assert "ONLY incorporate technologies or skills if they are present" in prompt
    
    # Assert it injects the correct data
    assert dummy_rewrite_data["original_bullet"] in prompt
    assert "AWS" in prompt # It's in the job requirements

@patch("app.services.llm_service.genai.Client")
def test_rewrite_bullet_malformed_json(mock_client_class, dummy_rewrite_data):
    mock_client = MagicMock()
    mock_client_class.return_value = mock_client
    
    mock_response = MagicMock()
    mock_response.text = "This is not json."
    mock_client.models.generate_content.return_value = mock_response
    
    with patch("os.getenv", return_value="fake_api_key"):
        llm = LLMService()
        response = llm.rewrite_resume_bullet(**dummy_rewrite_data)
        assert response is None

def test_rewrite_bullet_unavailable(dummy_rewrite_data):
    with patch("os.getenv", return_value=""):
        llm = LLMService()
        response = llm.rewrite_resume_bullet(**dummy_rewrite_data)
        assert response is None
