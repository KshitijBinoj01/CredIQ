from typing import Literal

from pydantic import BaseModel, Field

RiskTier = Literal["low", "medium", "high"]
FeatureKey = Literal[
    "annualIncome",
    "creditUtilization",
    "outstandingDebt",
    "loanAmount",
    "employmentYears",
    "delinquencies",
    "creditHistoryMonths",
]


class BorrowerInput(BaseModel):
    annualIncome: float
    creditUtilization: float
    outstandingDebt: float
    loanAmount: float
    employmentYears: float
    delinquencies: float
    creditHistoryMonths: float


class PredictionResponse(BaseModel):
    score: int
    probability: float
    tier: RiskTier
    insight: str


class WhatIfRequest(BaseModel):
    baseline: BorrowerInput
    changes: dict[str, float] = Field(default_factory=dict)


class ShapFactor(BaseModel):
    feature: FeatureKey
    label: str
    impact: float


class ExplainResponse(BaseModel):
    factors: list[ShapFactor]


class FeatureMeta(BaseModel):
    key: FeatureKey
    label: str
    min: float
    max: float
    step: float
    unit: str | None = None
