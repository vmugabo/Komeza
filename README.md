# Komeza Wige

## Project links

- **Video demonstration:**
- **Project technical report:**

Komeza is a student-support early-warning platform for teachers and district
officials. It combines a Python model-training workflow with a React
dashboard backed by Supabase. Staff can review attendance, academic,
engagement, and risk information to decide which students may need a
supportive follow-up.

> **Responsible use:** Komeza is an early-warning and review tool, not a
> system for labelling students or making decisions about their education.
> Risk results should support professional judgement and a conversation with
> the student, never replace either one.

## Features

- Teacher dashboard with student counts, attendance, failed-subject, and recent
  grade summaries.
- Separate academic-risk and dropout-risk views.
- Student profiles with contributing risk factors and supporting records.
- Intervention workflow for prioritising students who may need follow-up.
- Supabase email/password authentication.
- Row-level security and school-scoped access for teachers.
- District-official access across schools.
- Calibrated Python models with exported metrics, probabilities, and subgroup
  evaluation results.

## Architecture

```text
student_risk_assessment.ipynb
        │
        ├── trains and evaluates academic/dropout models
        └── writes model_exports/ artifacts

Supabase Auth + PostgreSQL
        │
        ├── student, attendance, academic, engagement records
        ├── risk predictions and risk factors
        └── role and school-access policies

React/Vite frontend
        │
        └── authenticated teacher and district-official workspace
```

## Repository layout

```text
Komeza/
├── frontend/                         # React/Vite dashboard
│   ├── src/components/               # Reusable dashboard components
│   ├── src/pages/                    # Dashboard, student, and intervention views
│   └── src/services/                 # Supabase client and data access
├── komeza_wige/
│   ├── student_risk_assessment.ipynb # Data preparation and model training
│   ├── model_utils.py                # sklearn-compatible model helpers
│   └── model_exports/                # Generated models and evaluation reports
├── supabase/migrations/              # Database schema and access policies
├── deploy/nginx-komeza.conf          # Production Nginx configuration
├── requirements.txt                  # Python dependencies
└── README.md
```

## Prerequisites

- Python 3.10 or newer
- Node.js and npm
- A Supabase project
- Jupyter Notebook or JupyterLab

## Run the frontend locally

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, then sign in with an authenticated
Supabase user. The available data is determined by the user's role and school
assignments. A missing `.env.local` produces a configuration message instead
of attempting to load school data.

Create a production bundle with:

```bash
cd frontend
npm run build
npm run preview
```

## Train and evaluate the models

Create and activate a virtual environment from the repository root:

```bash
python3 -m venv .venv
source .venv/bin/activate       # macOS/Linux
# .venv\Scripts\activate        # Windows PowerShell

python -m pip install --upgrade pip
python -m pip install -r requirements.txt
jupyter notebook komeza_wige/student_risk_assessment.ipynb
```

Run the notebook cells in order. It loads the source dataset, prepares
features, trains and calibrates candidate classifiers, evaluates them with
cross-validation, selects thresholds using training-only out-of-fold
predictions, and exports the selected models and evaluation files.

The current source file contains 649 rows and 34 columns. The accompanying
dataset description refers to 700 rows and 36 columns; the notebook reports
that discrepancy rather than silently changing the data.

### Model design

- **Academic risk:** predicts risk based on final attainment without using the
  final grade as a predictor.
- **Dropout early warning:** uses contextual and behavioural information
  without using grade columns.
- Academic trajectory features include `grade_change`,
  `mean_prior_grade`, `grade_decline`, and `absence_per_failure`.
- `Going_Out`, `Weekend_Alcohol_Consumption`, and
  `Weekday_Alcohol_Consumption` are excluded from both models.
- Preprocessing is fitted inside each training pipeline.
- Class weighting is used instead of post-encoding SMOTE.
- Probabilities are calibrated with sigmoid `CalibratedClassifierCV`.
- Thresholds target high-risk recall of at least 0.85 where achievable.
- The final test partition remains untouched until evaluation.

### Generated model artifacts

The notebook writes these files to `komeza_wige/model_exports/`:

| File                         | Purpose                                    |
| ---------------------------- | ------------------------------------------ |
| `academic_risk_model.joblib` | Trained academic-risk pipeline             |
| `dropout_risk_model.joblib`  | Trained dropout-risk pipeline              |
| `model_metadata.json`        | Training configuration and selected models |
| `model_metrics.csv`          | Classification performance metrics         |
| `calibration_metrics.csv`    | Probability-calibration metrics            |
| `subgroup_outcomes.csv`      | Subgroup evaluation results                |
| `feature_importance.csv`     | Feature-importance summary                 |

These are development and evaluation artifacts. The React application reads
prediction records from Supabase; it does not load the `.joblib` files
directly.

## Data model

The Supabase schema stores:

- `students`: identity, grade, school, age, gender, and enrolment date.
- `attendance_records`: attendance rates, absences, and record dates.
- `academic_records`: assessment scores, failed subjects, and performance
  change.
- `engagement_records`: study time, assignment completion, participation, and
  platform activity.
- `risk_predictions`: academic and dropout risk labels plus calibrated
  target-specific probabilities.
- `risk_factors`: ranked factors contributing to a risk result.
- `profiles`: authenticated user role and display name.
- `user_school_access`: school assignments for teacher accounts.

The frontend keeps `prediction_probability` as a legacy fallback and prefers
`academic_probability` or `dropout_probability` when those fields are
available.

## Deployment

Build the frontend and copy the generated `frontend/dist/` contents to the
configured web root:

```bash
cd frontend
npm ci
npm run build
```

The production Nginx configuration in `deploy/nginx-komeza.conf` serves the
single-page application, falls back to `index.html` for client-side routes,
and redirects HTTP to HTTPS. It is configured for `nile.co.rw`; update the
domain, certificate paths, and web root before deploying to another server.

## Current evaluation snapshot

The current notebook run selected a calibrated Decision Tree for academic risk
and a calibrated Random Forest for dropout risk:

| Output                | Selected model | High-risk recall | High-risk precision | Balanced accuracy | Macro-F1 |
| --------------------- | -------------- | ---------------: | ------------------: | ----------------: | -------: |
| Academic risk         | Decision Tree  |             0.85 |                0.68 |             0.811 |    0.788 |
| Dropout early warning | Random Forest  |             0.55 |                0.22 |             0.593 |    0.525 |

These results describe this dataset and model run; they are not a guarantee of
performance for another school or future cohort. The dropout result requires
particular care because the supplied label is derived from final grade rather
than confirmed withdrawal or enrolment data.

## Privacy and responsible operation

Before using Komeza with real student data:

- Confirm consent, governance, and data-retention requirements.
- Keep student records, credentials, and model artifacts in protected storage.
- Use Row Level Security and verify school assignments before granting access.
- Give staff a way to correct inaccurate records.
- Review false positives, false negatives, calibration, and subgroup outcomes.
- Treat every risk result as a prompt for supportive review, not a final
  judgement about a student.
