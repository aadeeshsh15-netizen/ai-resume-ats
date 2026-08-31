import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import Base, get_db

# Create an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
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

def test_register_user():
    response = client.post("/api/auth/register", json={"email": "test@example.com", "password": "password123"})
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"
    assert "id" in response.json()

def test_register_duplicate_user():
    client.post("/api/auth/register", json={"email": "test@example.com", "password": "password123"})
    response = client.post("/api/auth/register", json={"email": "test@example.com", "password": "password123"})
    assert response.status_code == 400
    assert response.json()["detail"] == "The user with this email already exists in the system."

def test_login_user():
    client.post("/api/auth/register", json={"email": "test@example.com", "password": "password123"})
    response = client.post("/api/auth/login", data={"username": "test@example.com", "password": "password123"})
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_wrong_password():
    client.post("/api/auth/register", json={"email": "test@example.com", "password": "password123"})
    response = client.post("/api/auth/login", data={"username": "test@example.com", "password": "wrong"})
    assert response.status_code == 400

def test_get_me():
    client.post("/api/auth/register", json={"email": "test@example.com", "password": "password123"})
    login_response = client.post("/api/auth/login", data={"username": "test@example.com", "password": "password123"})
    token = login_response.json()["access_token"]
    
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"
