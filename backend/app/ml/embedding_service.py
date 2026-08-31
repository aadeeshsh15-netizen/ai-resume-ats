import os
import logging
import numpy as np
from typing import List, Optional

logger = logging.getLogger(__name__)

class EmbeddingService:
    _instance = None
    _model = None
    _model_name = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
            cls._instance._load_model()
        return cls._instance

    def _load_model(self):
        """Loads the sentence-transformer model securely and globally."""
        try:
            # Lazy import so we don't crash the entire app if the dependency is missing
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading embedding model: {self._model_name}")
            self._model = SentenceTransformer(self._model_name)
            logger.info("Embedding model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            self._model = None

    def get_embedding(self, text: str) -> Optional[np.ndarray]:
        """Returns the embedding vector for a given text."""
        if self._model is None or not text or not text.strip():
            return None
            
        try:
            return self._model.encode(text)
        except Exception as e:
            logger.error(f"Failed to encode text: {e}")
            return None
            
    def get_embeddings(self, texts: List[str]) -> Optional[List[np.ndarray]]:
        if self._model is None or not texts:
            return None
            
        try:
            return self._model.encode(texts)
        except Exception as e:
            logger.error(f"Failed to encode texts: {e}")
            return None

    @property
    def is_available(self) -> bool:
        return self._model is not None
