import pytest
import json
from unittest.mock import patch, MagicMock
from app.services.llm_service import LLMService
from app.schemas.llm import InterviewQuestionsResponse

@pytest.fixture
def dummy_interview_data():
    return {
        "resume_data": {"sections": {"experience": "2 years building Python apps.", "skills": "Python"}},
        "jd_data": {"job_title": "Python Dev", "responsibilities": ["Build APIs", "Fix bugs"], "required_skills": ["Python"]},
        "matching": {"skill_match": {"matched_required": ["Python"], "missing_required": []}}
    }

@patch("app.services.llm_service.genai.Client")
def test_generate_interview_questions_success(mock_client_class, dummy_interview_data):
    mock_client = MagicMock()
    mock_client_class.return_value = mock_client
    
    mock_response = MagicMock()
    mock_response.text = json.dumps({
        "technical_questions": [{"question": "How do you build a REST API in Python?", "difficulty": "Medium", "topic": "Python", "why_it_matters": "Tests knowledge"}],
        "resume_questions": [],
        "job_specific_questions": [],
        "behavioral_questions": []
    })
    mock_client.models.generate_content.return_value = mock_response
    
    with patch("os.getenv", return_value="fake_api_key"):
        llm = LLMService()
        response = llm.generate_interview_questions(**dummy_interview_data)
        
        assert response is not None
        assert isinstance(response, InterviewQuestionsResponse)
        assert len(response.technical_questions) == 1
        assert response.technical_questions[0].difficulty == "Medium"
