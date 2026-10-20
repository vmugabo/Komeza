# Komeza — Student Risk Assessment

Komeza is a student-support project for exploring academic performance and
early-warning indicators. The main work happens in the Python notebook:

[`komeza_wige/student_risk_assessment.ipynb`](komeza_wige/student_risk_assessment.ipynb)

The notebook examines the source data, defines the outcome labels, compares
classification approaches, checks reliability across student groups, and
exports the results used by the web application.

> **Important:** The source data does not contain independently confirmed
> dropout outcomes. Dropout results are therefore early-warning estimates, not
> decisions about a student's ability, future, or enrolment status.

## Repository layout

```text
Komeza/
├── frontend/                         # React/Vite web application
├── komeza_wige/
│   ├── student_risk_assessment.ipynb # Main analysis notebook
│   └── model_exports/                # Generated models, metrics, and results
├── requirements.txt                  # Python dependencies for the notebook
└── README.md
```

Private CSV files and generated model artefacts are excluded from GitHub by
`.gitignore`. Keep the source dataset and exports in a protected local or
server-side location.

## Notebook setup

### Requirements

- Git
- Python 3.10 or newer
- Jupyter Notebook or JupyterLab

Create a virtual environment and install the notebook dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate       # macOS/Linux
# .venv\Scripts\activate        # Windows PowerShell

python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Open the notebook:

```bash
jupyter notebook komeza_wige/student_risk_assessment.ipynb
```

Run the cells in order. The notebook loads the source dataset, checks its
shape and fields, prepares the analysis variables, trains the risk models,
evaluates them with stratified cross-validation, and writes the exported
results.

## Analysis workflow

The notebook follows this sequence:

1. Load and validate the source student dataset.
2. Inspect missing values, class balance, feature types, and documented
   category meanings.
3. Define academic-risk bands from final attainment while excluding the final
   grade from the predictors.
4. Define the supplied dropout label and train a separate early-warning model
   without grade columns.
5. Compare logistic regression and random forest pipelines.
6. Evaluate the selected approaches using stratified five-fold cross-validation.
7. Review calibration and subgroup outcomes.
8. Export models, metrics, ranked factors, and student-level results.

The source file currently contains 649 rows and 34 columns. The accompanying
description refers to 700 rows and 36 columns; the notebook reports this
difference rather than silently assuming the documented dimensions.

The source encodes `Travel_Time` and `Study_Time` as ordinal values from 1 to 4.
The notebook decodes them into labelled bands before analysis. Education codes
use 0–4, while family, wellbeing, and behaviour ratings use 1–5 where
documented.

## Exported outputs

The notebook writes generated files under `komeza_wige/model_exports/`,
including:

- `academic_risk_model.joblib`
- `dropout_risk_model.joblib`
- `model_metadata.json`
- `model_metrics.csv`
- `calibration_metrics.csv`
- `risk_factors.csv`
- `student_predictions.csv`
- `subgroup_outcomes.csv`

The exported models are Python artefacts. They are not loaded directly by the
React application; the web app displays prepared result data.

## Current evaluation

The current notebook run selected random forests after comparing candidate
pipelines:

| Output | Cross-validated balanced accuracy | Cross-validated macro-F1 |
| --- | ---: | ---: |
| Academic risk | 0.815 | 0.808 |
| Dropout early warning | 0.694 | 0.692 |

These figures describe the current dataset and run. They are not a guarantee
of performance on new schools or future cohorts. The dropout result is lower
confidence because it excludes grade columns and uses a supplied label derived
from final grade.

The exported calibration and subgroup files should be reviewed before any
operational use. Independent enrolment, withdrawal, or completion records
would be needed to validate dropout outcomes in practice.

## Frontend

The repository also contains a React/Vite web app in [`frontend/`](frontend/).
It displays the prepared student records and risk results for authenticated
users. Frontend setup and deployment are maintained as part of the project
configuration in `frontend/package.json` and the source files under
`frontend/src/`.

## Responsible use

Risk results should help teachers decide what to review and which students may
benefit from support. They should not automate decisions about a student's
education. Before operational use:

- Validate the results with education stakeholders.
- Confirm consent, governance, and data-retention requirements.
- Give staff a way to correct inaccurate source records.
- Review false positives, false negatives, calibration, and subgroup outcomes.
- Keep private student data and generated model files in protected storage.

## Contributing

Create a focused branch, keep notebook changes reproducible, and update this
README when the analysis workflow, inputs, or exported outputs change. If a
change affects the web app, update the relevant source or package configuration.
