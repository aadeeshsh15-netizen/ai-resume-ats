import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test2.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def cleanup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield

def get_auth_token():
    client.post("/api/auth/register", json={"email": "test@example.com", "password": "password123"})
    login_response = client.post("/api/auth/login", data={"username": "test@example.com", "password": "password123"})
    return login_response.json()["access_token"]

def test_create_and_get_analysis():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create
    create_payload = {
        "job_title": "Software Engineer",
        "resume_data": {"name": "Test"},
        "job_description_data": {"title": "Test"},
        "skill_match": {"score": 90},
        "keyword_match": {"score": 80},
        "semantic_match": {"score": 85},
        "overall_score": 85
    }
    create_response = client.post("/api/analyses", json=create_payload, headers=headers)
    assert create_response.status_code == 200
    analysis_id = create_response.json()["id"]
    
    # List
    list_response = client.get("/api/analyses", headers=headers)
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1
    assert list_response.json()[0]["job_title"] == "Software Engineer"
    
    # Get one
    get_response = client.get(f"/api/analyses/{analysis_id}", headers=headers)
    assert get_response.status_code == 200
    assert get_response.json()["skill_match"]["score"] == 90
    
    # Delete
    del_response = client.delete(f"/api/analyses/{analysis_id}", headers=headers)
    assert del_response.status_code == 200
    
    # List again
    list2_response = client.get("/api/analyses", headers=headers)
    assert len(list2_response.json()) == 0
