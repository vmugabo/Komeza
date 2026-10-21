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
the features, trains the models, evaluates them with stratified
cross-validation, and writes the model and evaluation files.

The current source file has 649 rows and 34 columns. Its accompanying
description refers to 700 rows and 36 columns; the notebook reports this
difference rather than hiding it.

## What the notebook analyses

- Academic risk based on final attainment, without using the final grade as a
  predictor.
- Dropout early-warning risk based on contextual and behavioural information,
  without using grade columns.
- Model performance, calibration, and outcomes across student groups.

The source uses ordinal values for fields such as `Travel_Time` and
`Study_Time`. The notebook converts these values into readable bands before
training the models.

## Model outputs

The notebook keeps the following files in `komeza_wige/model_exports/`:

- `academic_risk_model.joblib`
- `dropout_risk_model.joblib`
- `model_metadata.json`
- `model_metrics.csv`
- `calibration_metrics.csv`
- `subgroup_outcomes.csv`

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

## Current evaluation

The current notebook run selected random forests:

| Output | Balanced accuracy | Macro-F1 |
| --- | ---: | ---: |
| Academic risk | 0.815 | 0.808 |
| Dropout early warning | 0.694 | 0.692 |

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
