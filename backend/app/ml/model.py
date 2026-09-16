from functools import lru_cache

import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

from app.config import MODEL_PATH, SCALER_PATH


@lru_cache(maxsize=1)
def load_scaler() -> StandardScaler:
    return joblib.load(SCALER_PATH)


@lru_cache(maxsize=1)
def load_model() -> LogisticRegression:
    return joblib.load(MODEL_PATH)
