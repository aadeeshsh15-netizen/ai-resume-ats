from pydantic import BaseModel
from typing import Dict, Optional

class UploadResponse(BaseModel):
    status: str
    message: str
    filename: str
    file_type: str
    identifier: str

class ParseResponse(BaseModel):
    status: str
    filename: str
    file_type: str
    character_count: int
    word_count: int
    full_text: str
    sections: Dict[str, str]
