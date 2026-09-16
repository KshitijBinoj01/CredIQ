from fastapi import APIRouter

from app.ml.features import FEATURE_CONFIG
from app.schemas.prediction import FeatureMeta

router = APIRouter(prefix="/api", tags=["features"])


@router.get("/features", response_model=list[FeatureMeta])
def features_endpoint() -> list[FeatureMeta]:
    return FEATURE_CONFIG
