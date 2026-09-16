from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = BACKEND_ROOT / "data"
ARTIFACTS_DIR = BACKEND_ROOT / "artifacts"
MODEL_PATH = ARTIFACTS_DIR / "model.joblib"
SCALER_PATH = ARTIFACTS_DIR / "scaler.joblib"
FEATURE_CONFIG_PATH = ARTIFACTS_DIR / "feature_config.json"
METRICS_PATH = ARTIFACTS_DIR / "metrics.json"


def resolve_training_csv() -> Path:
    """Prefer data/cs-training.csv; fall back to a file named backend/data."""
    nested = DATA_DIR / "cs-training.csv"
    if nested.is_file():
        return nested
    if DATA_DIR.is_file():
        return DATA_DIR
    raise FileNotFoundError(
        "Kaggle training CSV not found. Place cs-training.csv at "
        "backend/data/cs-training.csv (or as the file backend/data)."
    )

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
