# CreditIQ

Dual **Borrower** / **Lender** credit tool.

- **Borrower** uses a transparent FICO-style 5-factor score driven by the intake questionnaire (not the Kaggle model).
- **Lender** batch-scores applicants with a calibrated gradient-boosting model trained on Kaggle **Give Me Some Credit**.
- **Assistant** answers `/faq`, `/why`, `/improve`, and free-text questions. Math always comes from the factor engine; Ollama only narrates.

Money is stored as **USD**. The UI can show **USD** or **INR** at **1 USD = 96 INR**. The 300–850 score does not change when you toggle currency.

## Quick start (frontend)

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173/. The borrower gauge scores **on-device** from your answers. Slash commands in Help work offline.

## Full stack

**1. Training data (lender model)**

Place the Kaggle file at `backend/data/cs-training.csv` or as the file `backend/data`.

**2. Train**

```powershell
cd backend
python -m pip install -r requirements.txt
python scripts/train_model.py
```

Writes `artifacts/model.joblib`, `scaler.joblib`, and `metrics.json` (ROC-AUC, PR-AUC, Brier, KS, chosen flag **threshold**). **Restart the API after every retrain.**

**3. Start the API**

```powershell
cd backend
python scripts/run_api.py
```

If you see `WinError 10013`, port 8000 is already taken.

**4. Optional: Ollama (assistant free text)**

```powershell
ollama pull llama3.2
ollama serve
```

Defaults: `OLLAMA_BASE_URL=http://127.0.0.1:11434/v1`, `OLLAMA_MODEL=llama3.2`. If Ollama is down, slash commands and the local tip fallback still answer.

**5. Frontend with API**

```powershell
cd frontend
copy .env.example .env
npm run dev
```

`VITE_API_URL` wires lender ML, score calculate, and `POST /api/assistant/chat`. If `/health` fails, a banner appears and scoring stays local.

## 3-minute demo

1. Landing → **Check your score**.
2. Toggle **INR ₹**. Enter your income, limit, and balance. Submit **Calculate score**.
3. Gauge + five factor cards (points / max / % / why). Try presets, **Pay off credit card**, and **Help** (`/faq`, `/improve`).
4. Lender tab: portfolio uses the Kaggle default-risk model. Open a row for threshold + grouped drivers (lates, utilization, income, leverage).

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

## Assistant commands

| Command | What it does |
|---------|----------------|
| `/help` | List commands |
| `/faq` | Score, factors, INR, disclaimer |
| `/how` | Formula with *your* numbers |
| `/factors` | Five bars: points and % |
| `/why` | Weakest factor |
| `/improve` | Top estimated point lifts |
| `/whatif payoff` (also miss, wait, open, close, max) | Same patches as the dashboard |
| `/inr` `/usd` | Currency rules |
| `/intake` | Recap of answers |
| `/lender` | ML vs FICO split |
| `/disclaimer` | Not a bureau score |
| `/reset` | Clear the thread |

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
| POST | `/api/explain` | SHAP factors + grouped drivers |
| GET | `/api/features` | Slider metadata |
| GET | `/api/metrics` | Train metrics + flag threshold |
| POST | `/api/lender/batch` | Portfolio |
| POST | `/api/assistant/chat` | Slash tools + optional Ollama |
| GET | `/health` | `{ status: "ok" }` |

## Tests

```powershell
cd frontend
npm test

cd ..\backend
python -m pytest tests -q
```
