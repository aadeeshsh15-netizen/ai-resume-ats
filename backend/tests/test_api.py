import os
import io
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "API is healthy"}

def test_upload_resume_pdf():
    # Create a dummy PDF file in memory
    dummy_pdf = io.BytesIO(b"%PDF-1.4 dummy content")
    
    response = client.post(
        "/api/resume/upload",
        files={"file": ("test_resume.pdf", dummy_pdf, "application/pdf")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["filename"] == "test_resume.pdf"
    assert data["file_type"] == "PDF"
    assert "identifier" in data
    
    # Cleanup (tests shouldn't really clutter uploads, but for this milestone it's acceptable)
    file_path = os.path.join("uploads", f"{data['identifier']}.pdf")
    if os.path.exists(file_path):
        os.remove(file_path)

def test_upload_resume_invalid_type():
    dummy_txt = io.BytesIO(b"Hello world")
    
    response = client.post(
        "/api/resume/upload",
        files={"file": ("test.txt", dummy_txt, "text/plain")}
    )
    
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]
