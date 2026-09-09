import os
import logging
import numpy as np
from typing import List, Optional

logger = logging.getLogger(__name__)

class EmbeddingService:
    _instance = None
    _model = None
    _use_tfidf = True
    _model_name = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
            cls._instance._init_service()
        return cls._instance

    def _init_service(self):
        """Initializes SentenceTransformer if explicitly enabled; otherwise uses lightweight TF-IDF fallback."""
        enable_local = os.getenv("ENABLE_LOCAL_EMBEDDINGS", "false").lower() in ("true", "1", "yes")
        self._model = None
        self._use_tfidf = True

        if enable_local:
            try:
                from sentence_transformers import SentenceTransformer
                logger.info(f"Loading embedding model: {self._model_name}")
                self._model = SentenceTransformer(self._model_name)
                logger.info("Embedding model loaded successfully.")
                self._use_tfidf = False
            except Exception as e:
                logger.error(f"Failed to load embedding model, falling back to TF-IDF: {e}")
                self._model = None
                self._use_tfidf = True
        else:
            logger.info("Local SentenceTransformer embeddings disabled (ENABLE_LOCAL_EMBEDDINGS!=true). Using lightweight TF-IDF semantic matching.")

    def compute_similarity(self, text1: str, text2: str) -> float:
        """
        Computes cosine similarity between two texts.
        Uses SentenceTransformer embeddings when loaded; otherwise computes TF-IDF cosine similarity.
        """
        t1 = (text1 or "").strip()
        t2 = (text2 or "").strip()
        if not t1 or not t2:
            return 0.0

        if self._model is not None:
            v1 = self.get_embedding(t1)
            v2 = self.get_embedding(t2)
            if v1 is not None and v2 is not None:
                norm1 = np.linalg.norm(v1)
                norm2 = np.linalg.norm(v2)
                if norm1 > 0 and norm2 > 0:
                    return float(np.dot(v1, v2) / (norm1 * norm2))
            return 0.0

        # Lightweight TF-IDF Cosine Similarity Fallback using scikit-learn
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity as sk_cosine_similarity
            vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
            tfidf_matrix = vectorizer.fit_transform([t1, t2])
            sim = sk_cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            return float(sim)
        except Exception as e:
            logger.error(f"TF-IDF similarity calculation failed: {e}")
            return 0.0

    def get_embedding(self, text: str) -> Optional[np.ndarray]:
        """Returns the embedding vector for a given text if SentenceTransformer is active."""
        if self._model is not None and text and text.strip():
            try:
                return self._model.encode(text)
            except Exception as e:
                logger.error(f"Failed to encode text: {e}")
        return None

    def get_embeddings(self, texts: List[str]) -> Optional[List[np.ndarray]]:
        if self._model is not None and texts:
            try:
                return self._model.encode(texts)
            except Exception as e:
                logger.error(f"Failed to encode texts: {e}")
        return None

    @property
    def is_available(self) -> bool:
        return self._model is not None or self._use_tfidf

    @property
    def is_transformer_loaded(self) -> bool:
        return self._model is not None
