from app.ml.model import load_model, load_scaler
from app.ml.preprocess import transform
from app.ml.risk_score import get_risk_tier, get_tier_insight, probability_to_score
from app.schemas.prediction import BorrowerInput, PredictionResponse


def predict(profile: BorrowerInput) -> PredictionResponse:
    scaler = load_scaler()
    model = load_model()
    features = transform(scaler, profile)
    probability = float(model.predict_proba(features)[0, 1])
    score = probability_to_score(probability)
    tier = get_risk_tier(score)
    return PredictionResponse(
        score=score,
        probability=probability,
        tier=tier,
        insight=get_tier_insight(tier),
    )


def what_if(baseline: BorrowerInput, changes: dict[str, float]) -> PredictionResponse:
    merged = baseline.model_dump()
    merged.update({key: value for key, value in changes.items() if key in merged})
    return predict(BorrowerInput(**merged))
