import os
import json
import logging
from typing import Optional
from google import genai
from google.genai import types
from app.schemas.llm import AIInsightsResponse, RewriteBulletResponse, InterviewQuestionsResponse
from app.services.prompts.resume_feedback import build_resume_feedback_prompt
from app.services.prompts.bullet_rewrite import build_bullet_rewrite_prompt
from app.services.prompts.interview_prep import build_interview_prep_prompt

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("LLM_API_KEY", "")
        self.model_name = os.getenv("LLM_MODEL", "gemini-2.5-flash")
        
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                logger.error(f"Failed to initialize LLM Client: {e}")

    def is_available(self) -> bool:
        return self.client is not None and bool(self.api_key)

    def generate_insights(self, resume_data: dict, jd_data: dict, matching: dict) -> Optional[AIInsightsResponse]:
        if not self.is_available():
            return None
            
        prompt = build_resume_feedback_prompt(resume_data, jd_data, matching)
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.3
                )
            )
            
            response_text = response.text
            if not response_text:
                raise ValueError("Empty response from LLM")
                
            data = json.loads(response_text)
            
            # Use Pydantic to validate and structure the parsed JSON
            insights = AIInsightsResponse(status="success", **data)
            return insights
            
        except json.JSONDecodeError as e:
            logger.error(f"Malformed JSON from LLM: {e}")
            return None
        except Exception as e:
            logger.error(f"LLM API Error: {e}")
            return None

    def rewrite_resume_bullet(
        self, original_bullet: str, resume_context: str, job_context: str, known_skills: list, relevant_requirements: list
    ) -> Optional[RewriteBulletResponse]:
        if not self.is_available():
            return None
            
        prompt = build_bullet_rewrite_prompt(original_bullet, resume_context, job_context, known_skills, relevant_requirements)
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2  # Lower temperature for strict factual rewriting
                )
            )
            
            response_text = response.text
            if not response_text:
                raise ValueError("Empty response from LLM")
                
            data = json.loads(response_text)
            
            # Use Pydantic to validate and structure the parsed JSON
            return RewriteBulletResponse(status="success", **data)
            
        except json.JSONDecodeError as e:
            logger.error(f"Malformed JSON from LLM for bullet rewrite: {e}")
            return None
        except Exception as e:
            logger.error(f"LLM API Error for bullet rewrite: {e}")
            return None

    def generate_interview_questions(self, resume_data: dict, jd_data: dict, matching: dict) -> Optional[InterviewQuestionsResponse]:
        if not self.is_available():
            return None
            
        prompt = build_interview_prep_prompt(resume_data, jd_data, matching)
        
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.4
                )
            )
            
            response_text = response.text
            if not response_text:
                raise ValueError("Empty response from LLM")
                
            data = json.loads(response_text)
            
            return InterviewQuestionsResponse(status="success", **data)
            
        except json.JSONDecodeError as e:
            logger.error(f"Malformed JSON from LLM for interview questions: {e}")
            return None
        except Exception as e:
            logger.error(f"LLM API Error for interview questions: {e}")
            return None
