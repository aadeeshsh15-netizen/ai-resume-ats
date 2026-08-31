import pytest
import json
from unittest.mock import patch, MagicMock
from app.services.llm_service import LLMService
from app.schemas.llm import AIInsightsResponse

@pytest.fixture
def dummy_llm_request_data():
    return {
        "resume_data": {"sections": {"summary": "Experienced dev"}},
        "jd_data": {"job_title": "Software Engineer", "required_skills": ["Python"]},
        "matching_results": {"skill_match": {"matched_required": ["Python"]}}
    }

def test_llm_service_unavailable():
    with patch("os.getenv", return_value=""):
        llm = LLMService()
        assert not llm.is_available()
        assert llm.generate_insights({}, {}, {}) is None

@patch("app.services.llm_service.genai.Client")
def test_llm_service_success(mock_client_class, dummy_llm_request_data):
    mock_client = MagicMock()
    mock_client_class.return_value = mock_client
    
    mock_response = MagicMock()
    mock_response.text = json.dumps({
        "strengths": ["Strong Python"],
        "weaknesses": ["No cloud"],
        "recommendations": ["Add AWS"],
        "section_feedback": {
            "summary": {"score": 80, "feedback": "Good summary"},
            "experience": {"score": 75, "feedback": "Needs metrics"},
            "projects": {"score": 0, "feedback": "Missing section"},
            "education": {"score": 90, "feedback": "Relevant degree"},
            "skills": {"score": 85, "feedback": "Good skills"}
        },
        "overall_resume_quality": 82
    })
    mock_client.models.generate_content.return_value = mock_response
    
    with patch("os.getenv", return_value="fake_api_key"):
        llm = LLMService()
        assert llm.is_available()
        
        insights = llm.generate_insights(
            resume_data=dummy_llm_request_data["resume_data"],
            jd_data=dummy_llm_request_data["jd_data"],
            matching=dummy_llm_request_data["matching_results"]
        )
        
        assert insights is not None
        assert isinstance(insights, AIInsightsResponse)
        assert insights.overall_resume_quality == 82
        assert len(insights.strengths) == 1
        assert insights.section_feedback["summary"].score == 80

@patch("app.services.llm_service.genai.Client")
def test_llm_service_malformed_json(mock_client_class, dummy_llm_request_data):
    mock_client = MagicMock()
    mock_client_class.return_value = mock_client
    
    mock_response = MagicMock()
    mock_response.text = "This is not json at all!"
    mock_client.models.generate_content.return_value = mock_response
    
    with patch("os.getenv", return_value="fake_api_key"):
        llm = LLMService()
        insights = llm.generate_insights(
            resume_data=dummy_llm_request_data["resume_data"],
            jd_data=dummy_llm_request_data["jd_data"],
            matching=dummy_llm_request_data["matching_results"]
        )
        
        assert insights is None
