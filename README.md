# CreditIQ

Dual **Borrower** / **Lender** credit tool.

- **Borrower** uses a transparent FICO-style 5-factor score driven by the intake questionnaire (not the Kaggle model).
- **Lender** batch-scores applicants with logistic regression trained on Kaggle **Give Me Some Credit**.

Money is stored as **USD**. The UI can show **USD** or **INR** at **1 USD = 96 INR**. The 300–850 score does not change when you toggle currency.

## Quick start (frontend)

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173/. The borrower gauge scores **on-device** from your answers.

## Full stack

**1. Training data (lender model)**

Place the Kaggle file at `backend/data/cs-training.csv` or as the file `backend/data`.

**2. Train**

```powershell
cd backend
python -m pip install -r requirements.txt
python scripts/train_model.py
```

**Restart the API after every retrain** so it reloads `model.joblib`. An already-running process will keep the old weights.

**3. Start the API**

```powershell
cd backend
python scripts/run_api.py
```

If you see `WinError 10013`, port 8000 is already taken. Use http://127.0.0.1:8000/docs or stop the other process.

**4. Frontend with API**

```powershell
cd frontend
copy .env.example .env
npm run dev
```

`VITE_API_URL` wires lender ML + `POST /api/score/calculate`. Borrower still computes factors locally so the gauge always follows the form.

## 3-minute demo

1. Landing → **Check your score**.
2. Toggle **INR ₹**. Enter your income, limit, and balance. Submit **Calculate score**.
3. Gauge + five factor cards should match those answers (income is display-only). Try presets, **Pay off credit card**, and **Help**.
4. Lender tab: portfolio table still uses the Kaggle model.

## Borrower score (FICO-style)

`score = 300 + payment(35%) + utilization(30%) + age(15%) + mix(10%) + new credit(10%)`

| Band | Range |
|------|-------|
| Poor | 300–579 |
| Fair | 580–669 |
| Good | 670–739 |
| Very Good | 740–799 |
| Excellent | 800–850 |

Annual income is **not** in this score (classic FICO does not use it). It is stored from intake and shown for context.

## Currency

| | USD | INR |
|---|---|---|
| Toggle | Navbar | `localStorage` |
| Rate | canonical | × 96 display only |
| Converted | income, debt, loan, limit, balance | |
| Not converted | score, utilization %, years | |

## API

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/score/calculate` | FICO-style breakdown from intake |
| POST | `/api/predict` | Kaggle ML (lender / 7-field body) |
| POST | `/api/what-if` | Kaggle ML |
| POST | `/api/explain` | SHAP-style factors |
| GET | `/api/features` | Slider metadata |
| POST | `/api/lender/batch` | Portfolio |
| GET | `/health` | `{ status: "ok" }` |
