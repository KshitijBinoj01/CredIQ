"""Map Kaggle Give Me Some Credit columns onto BorrowerInput fields.

All money stays in USD (dataset native). Display conversion happens in the UI.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from app.ml.features import FEATURE_CONFIG, FEATURE_ORDER

FEATURE_BOUNDS = {item.key: (item.min, item.max) for item in FEATURE_CONFIG}


def clip_feature(name: str, values: np.ndarray) -> np.ndarray:
    low, high = FEATURE_BOUNDS[name]
    return np.clip(values, low, high)


def map_kaggle_frame(frame: pd.DataFrame) -> tuple[np.ndarray, np.ndarray]:
    monthly = pd.to_numeric(frame["MonthlyIncome"], errors="coerce")
    target = pd.to_numeric(frame["SeriousDlqin2yrs"], errors="coerce")
    util = pd.to_numeric(
        frame["RevolvingUtilizationOfUnsecuredLines"], errors="coerce"
    )
    debt_ratio = pd.to_numeric(frame["DebtRatio"], errors="coerce")
    age = pd.to_numeric(frame["age"], errors="coerce")
    real_estate = pd.to_numeric(
        frame["NumberRealEstateLoansOrLines"], errors="coerce"
    ).fillna(0)
    late_90 = pd.to_numeric(frame["NumberOfTimes90DaysLate"], errors="coerce").fillna(0)
    late_30 = pd.to_numeric(
        frame["NumberOfTime30-59DaysPastDueNotWorse"], errors="coerce"
    ).fillna(0)
    late_60 = pd.to_numeric(
        frame["NumberOfTime60-89DaysPastDueNotWorse"], errors="coerce"
    ).fillna(0)

    valid = (
        monthly.notna()
        & target.notna()
        & (monthly >= 1)
        & (monthly <= 500_000)
        & age.notna()
        & (age >= 18)
        & (age <= 100)
    )
    monthly = monthly[valid]
    target = target[valid]
    util = util[valid].fillna(0)
    debt_ratio = debt_ratio[valid].fillna(0)
    age = age[valid]
    real_estate = real_estate[valid]
    late_90 = late_90[valid]
    late_30 = late_30[valid]
    late_60 = late_60[valid]

    late_90 = np.where(late_90.to_numpy(dtype=float) >= 90, 8, late_90.to_numpy(dtype=float))
    late_30 = np.where(late_30.to_numpy(dtype=float) >= 90, 8, late_30.to_numpy(dtype=float))
    late_60 = np.where(late_60.to_numpy(dtype=float) >= 90, 8, late_60.to_numpy(dtype=float))

    annual_income = clip_feature("annualIncome", (monthly * 12).to_numpy(dtype=float))
    credit_utilization = clip_feature(
        "creditUtilization", (util * 100).to_numpy(dtype=float)
    )
    outstanding_debt = clip_feature(
        "outstandingDebt", (debt_ratio * monthly * 12).to_numpy(dtype=float)
    )
    loan_amount = clip_feature(
        "loanAmount", (real_estate * 25000).to_numpy(dtype=float)
    )
    employment_years = clip_feature(
        "employmentYears", np.maximum(0, age.to_numpy(dtype=float) - 22)
    )
    delinquencies = clip_feature(
        "delinquencies",
        late_90 + late_30 + late_60,
    )
    credit_history = clip_feature(
        "creditHistoryMonths",
        np.maximum(6, (age.to_numpy(dtype=float) - 18) * 12),
    )

    columns = {
        "annualIncome": annual_income,
        "creditUtilization": credit_utilization,
        "outstandingDebt": outstanding_debt,
        "loanAmount": loan_amount,
        "employmentYears": employment_years,
        "delinquencies": delinquencies,
        "creditHistoryMonths": credit_history,
    }
    X = np.column_stack([columns[key] for key in FEATURE_ORDER])
    y = target.to_numpy(dtype=int)
    return X, y
