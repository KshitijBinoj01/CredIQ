from functools import lru_cache

import numpy as np
import shap

from app.ml.features import FEATURE_LABELS, FEATURE_ORDER
from app.ml.model import load_model, load_scaler
from app.ml.preprocess import transform
from app.schemas.prediction import BorrowerInput, ExplainResponse, ShapFactor


@lru_cache(maxsize=1)
def _explainer() -> shap.LinearExplainer:
    scaler = load_scaler()
    model = load_model()
    background = np.zeros((40, len(FEATURE_ORDER)))
    return shap.LinearExplainer(model, background)


def explain(profile: BorrowerInput) -> ExplainResponse:
    scaler = load_scaler()
    scaled = transform(scaler, profile)
    try:
        values = np.array(_explainer().shap_values(scaled), dtype=float).reshape(-1)
    except Exception:
        model = load_model()
        values = (model.coef_[0] * scaled.reshape(-1)).astype(float)

    # Positive SHAP raises default probability, which hurts score.
    # Frontend contract: positive impact helps the score.
    factors = [
        ShapFactor(
            feature=feature,  # type: ignore[arg-type]
            label=FEATURE_LABELS[feature],
            impact=float(-values[index] * 80),
        )
        for index, feature in enumerate(FEATURE_ORDER)
    ]
    factors.sort(key=lambda item: abs(item.impact), reverse=True)
    return ExplainResponse(factors=factors)
