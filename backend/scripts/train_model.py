from __future__ import annotations

import json
import sys
from pathlib import Path

import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

BACKEND_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_ROOT))

from app.config import (  # noqa: E402
    ARTIFACTS_DIR,
    FEATURE_CONFIG_PATH,
    METRICS_PATH,
    MODEL_PATH,
    SCALER_PATH,
    resolve_training_csv,
)
from app.ml.features import FEATURE_CONFIG, FEATURE_ORDER  # noqa: E402
from app.ml.kaggle_map import map_kaggle_frame  # noqa: E402


def load_kaggle_training() -> tuple:
    path = resolve_training_csv()
    frame = pd.read_csv(path)
    X, y = map_kaggle_frame(frame)
    print(f"Loaded {path} — {len(y)} usable rows, default rate {y.mean():.4f}")
    return X, y


def main() -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    X, y = load_kaggle_training()
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = LogisticRegression(max_iter=800, class_weight="balanced")
    model.fit(X_train_scaled, y_train)

    y_prob = model.predict_proba(X_test_scaled)[:, 1]
    y_pred = (y_prob >= 0.5).astype(int)
    metrics = {
        "source": "kaggle_give_me_some_credit",
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "roc_auc": float(roc_auc_score(y_test, y_prob)),
        "precision": float(precision_score(y_test, y_pred, zero_division=0)),
        "recall": float(recall_score(y_test, y_pred, zero_division=0)),
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
        "positive_rate": float(y.mean()),
        "coefficients": {
            key: float(coef)
            for key, coef in zip(FEATURE_ORDER, model.coef_[0], strict=True)
        },
        "intercept": float(model.intercept_[0]),
    }

    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    FEATURE_CONFIG_PATH.write_text(
        json.dumps([item.model_dump() for item in FEATURE_CONFIG], indent=2),
        encoding="utf-8",
    )
    METRICS_PATH.write_text(json.dumps(metrics, indent=2), encoding="utf-8")

    sample = scaler.transform(X_test[:1])
    sample_prob = float(model.predict_proba(sample)[0, 1])
    print("Saved artifacts to", ARTIFACTS_DIR)
    print("Metrics:", json.dumps({k: metrics[k] for k in ("accuracy", "roc_auc", "precision", "recall", "n_train", "n_test", "positive_rate")}, indent=2))
    print(f"Sample default probability: {sample_prob:.4f}")


if __name__ == "__main__":
    main()
