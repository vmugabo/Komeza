# Komeza

Komeza helps teachers review student progress and decide who may need extra
support. It combines a Python-based risk analysis notebook with a React web
application.

The project is an early-warning tool, not a way to label students or make
decisions about their education. Its results are best used to start a
supportive conversation and decide what to look at next.

## How it works

The notebook reads the source student dataset, prepares the analysis fields,
trains academic and dropout early-warning models, and checks how well they
perform. The web application presents the resulting student indicators and
risk results to authorised users.

```text
Python notebook → React web application
```

## Project layout

```text
Komeza/
├── frontend/                         # React/Vite web application
├── komeza_wige/
│   ├── student_risk_assessment.ipynb # Analysis and model-training notebook
│   └── model_exports/                # Models and evaluation reports
├── requirements.txt                  # Python dependencies
└── README.md
```

## Run the notebook

You need Python 3.10 or newer and Jupyter Notebook or JupyterLab.

```bash
python3 -m venv .venv
source .venv/bin/activate       # macOS/Linux
# .venv\Scripts\activate        # Windows PowerShell

python -m pip install --upgrade pip
python -m pip install -r requirements.txt
jupyter notebook komeza_wige/student_risk_assessment.ipynb
```

Run the notebook cells in order. It loads and checks the source data, prepares
the features, trains five calibrated classifiers for each target, evaluates
them with repeated stratified cross-validation, and writes the model and
evaluation files.

The current source file has 649 rows and 34 columns. Its accompanying
description refers to 700 rows and 36 columns; the notebook reports this
difference rather than hiding it.

## What the notebook analyses

- Academic risk based on final attainment, without using the final grade as a
  predictor.
- Dropout early-warning risk based on contextual and behavioural information,
  without using grade columns.
- Academic risk includes Grade 1/Grade 2 trajectory features:
  `grade_change`, `mean_prior_grade`, `grade_decline`, and
  `absence_per_failure`.
- `Going_Out`, `Weekend_Alcohol_Consumption`, and
  `Weekday_Alcohol_Consumption` are excluded from both models.
- Model performance, calibrated probabilities, and concise subgroup checks.

The source uses ordinal values for fields such as `Travel_Time` and
`Study_Time`. The notebook converts these values into readable bands before
training the models.

Preprocessing is fitted inside each training pipeline. The models use
class-weighting rather than post-encoding SMOTE, and probability calibration
uses sigmoid `CalibratedClassifierCV`. Thresholds are selected from
training-only out-of-fold predictions with a high-risk recall target of at
least 0.85 where achievable. The final test partition remains untouched until
evaluation.

## Model outputs

The notebook keeps the following files in `komeza_wige/model_exports/`:

- `academic_risk_model.joblib`
- `dropout_risk_model.joblib`
- `model_metadata.json`
- `model_metrics.csv`
- `calibration_metrics.csv`
- `subgroup_outcomes.csv`
- `feature_importance.csv`

The `.joblib` files contain the trained models. The JSON and CSV files explain
how they were built and how they performed. These are development and
evaluation artifacts; the React application does not load them directly.

## Frontend

Install the frontend dependencies and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The production frontend is served at [nile.co.rw](https://nile.co.rw) when
deployed to the configured Linode server.

Risk predictions support separate `academic_probability` and
`dropout_probability` values. The frontend falls back to the legacy
`prediction_probability` field when target-specific probabilities are not
available. Supabase schema support for these fields is defined in
`supabase/migrations/003_model_probability_fields.sql`.

## Current evaluation

The current notebook run selected a calibrated Decision Tree for academic risk
and a calibrated Random Forest for dropout risk:

| Output                | Selected model | High-risk recall | High-risk precision | Balanced accuracy | Macro-F1 |
| --------------------- | -------------- | ---------------: | ------------------: | ----------------: | -------: |
| Academic risk         | Decision Tree  |             0.85 |                0.68 |             0.811 |    0.788 |
| Dropout early warning | Random Forest  |             0.55 |                0.22 |             0.593 |    0.525 |

These results describe this dataset and this model run. They are not a
guarantee of performance for another school or future cohort. The dropout
result should be treated with particular care because the supplied label is
derived from final grade rather than confirmed withdrawal or enrolment data.

## Responsible use

Risk results should guide review and support, not determine a student's future.
Before using the system in practice:

- Review the results with education stakeholders.
- Confirm consent, governance, and data-retention requirements.
- Give staff a way to correct inaccurate records.
- Review false positives, false negatives, calibration, and subgroup outcomes.
- Keep student data and model artifacts in protected storage.
