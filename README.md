# Komeza — Student Risk Assessment

Komeza is a student-support project that helps teachers identify learners who
may need additional academic or engagement support. It combines student
performance, attendance, study habits, assignment completion, internet access,
travel time, and school participation to produce **Low**, **Medium**, and
**High** academic- and dropout-risk categories.

The project has two parts:

- A Python notebook for exploring the data, creating transparent risk rules,
  training classification models, and exporting model artefacts.
- A React/Vite teacher workspace that displays the prepared student records,
  risk predictions, risk factors, and intervention notes in the browser.

> **Important:** The dataset does not contain confirmed dropout outcomes.
> Dropout risk is therefore a screening estimate, not a final decision about a
> student. Risk labels should be used to start a supportive conversation and
> never as a judgement about a learner's ability or future.

## Repository

The source code and project history are available on GitHub:

**[github.com/vmugabo/Komeza](https://github.com/vmugabo/Komeza)**

## Project structure

```text
Komeza/
├── frontend/                    # React/Vite teacher workspace
│   ├── public/data/             # Private CSV data, kept on Linode
│   ├── src/                     # Pages, components, styles, and CSV services
│   └── package.json
├── komeza_wige/
│   ├── student dropout.csv       # Private source dataset, kept on Linode
│   ├── student_risk_assessment.ipynb
│   └── model_exports/            # Private models and generated outputs
└── README.md
```

## Set up the environment

### Prerequisites

- Git
- Python 3.10 or newer
- Node.js 18 or newer and npm

### 1. Clone the repository

```bash
git clone https://github.com/vmugabo/Komeza.git
cd Komeza
```

### 2. Set up the Python analysis environment

Create and activate a virtual environment, then install the packages used by
the notebook:

```bash
python3 -m venv .venv
source .venv/bin/activate       # macOS/Linux
# .venv\Scripts\activate        # Windows PowerShell

python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Open the notebook with:

```bash
jupyter notebook komeza_wige/student_risk_assessment.ipynb
```

Run the notebook cells in order to reproduce the data exploration, model
comparison, reliability checks, and exported model artefacts. The root
[`requirements.txt`](requirements.txt) contains the Python dependencies used by
the notebook.

### 3. Production frontend

The teacher workspace is hosted on the Linode server and served by Nginx.
The GitHub repository contains the source and deployment configuration; the
production build and runtime environment are kept on the server.

The frontend reads private CSV files from `frontend/public/data/` and uses
Supabase Auth for sign-in, session restoration, and sign-out. Those CSV files,
the source dataset, model exports, and intervention notes remain on Linode and
are excluded from GitHub. Intervention notes are still stored in `localStorage`;
they are not yet protected database records. The Supabase URL and
publishable/anon key are configured privately during the server deployment and
are never committed to GitHub.

When deploying from a fresh GitHub clone, copy the private `frontend/public/data/`
files to the checkout before running `npm run build`. Do not commit those files.

## How it works

1. Load and validate the 649-row `student dropout.csv` dataset.
2. Define academic risk from final attainment bands while excluding `Final_Grade`
   from the predictors.
3. Train an academic-risk model using early assessment and student-context
   factors, including `Grade_1`, `Grade_2`, failures, absences, and study time.
4. Train a separate dropout-screening model using contextual, support, health,
   wellbeing, and attendance-related factors while excluding every grade column.
5. Compare logistic regression and random forest models with stratified
   five-fold cross-validation.
6. Export the selected models, metrics, ranked factor signals, and student
   predictions.

### Interpretation of the new outcomes

The supplied `Dropped_Out` column is exactly equal to `Final_Grade < 10` for
every row. The dropout model uses this dataset label and excludes `Grade_1`,
`Grade_2`, and `Final_Grade` to test whether non-performance factors provide an
earlier warning. Independent enrollment, withdrawal, or completion records
would be needed to validate the label against real-world retention outcomes.

### Dataset schema note

The repository file currently contains 649 rows and 34 columns. The accompanying
description says 700 rows and 36 columns, so the notebook reports this
discrepancy rather than assuming the documented dimensions. The source encodes
`Travel_Time` and `Study_Time` as ordinal values from 1 to 4; the notebook
decodes them into labelled bands before modelling. Education codes use 0–4 and
family, wellbeing, and behaviour ratings use 1–5 where documented.

The current React frontend displays prediction results already present in CSV
files. The `.joblib` models are not loaded directly by React; they are Python
artefacts intended for a future inference service.

### Current evaluation

The factor-specific models are evaluated with stratified five-fold
cross-validation. The current run selected random forests:

| Output | Cross-validated balanced accuracy | Cross-validated macro-F1 |
| --- | ---: | ---: |
| Academic risk | 0.815 | 0.808 |
| Dropout screening | 0.694 | 0.692 |

The notebook also exports `model_metrics.csv`, `calibration_metrics.csv`, and
`subgroup_outcomes.csv`. These should be reviewed before any operational use.
The dropout-screening score is deliberately lower-confidence because it excludes
all grade columns and the supplied target is derived from final grade.

The frontend CSVs are regenerated from the same 649 source records. Empty
fields represent information that the source dataset does not contain; the
pipeline does not invent attendance percentages, assignment completion, dates,
or intervention history.

## Designs and interface references

Design files are kept separate from application code so they can be replaced
without changing the setup instructions.

| Design resource | Status |
| --- | --- |
| Figma mockups | **To be added.** Add the share link here when the approved mockups are available. |
| Circuit diagram | **Not applicable to the current version.** Komeza is currently a software-only project and has no hardware circuit. |
| Application screenshots | **To be added.** Capture the login, dashboard, student list/profile, school directory, and interventions views after running the frontend locally. |

When these assets are available, add them under a versioned `docs/design/`
directory and link them here. Suggested layout:

```text
docs/design/
├── README.md
├── figma.md
├── circuit-diagram.png     # only if a hardware component is introduced
└── screenshots/
    ├── login.png
    ├── dashboard.png
    ├── student-profile.png
    └── interventions.png
```

## Deployment plan

### Phase 1 — Deploy the current teacher workspace

The current frontend is a static Vite application, so it can be deployed to
GitHub Pages, Netlify, Vercel, or another static hosting provider.

1. Install dependencies with `npm ci` in `frontend/`.
2. Run `npm run build`.
3. Publish the generated `frontend/dist/` directory.
4. Configure the host to serve `index.html` for client-side routes.
5. Enable HTTPS and restrict access to the intended teacher audience.
6. Verify that every CSV file in `frontend/public/data/` is included in the
   deployed build.

For GitHub Pages, the repository's Pages workflow should build from the
`frontend` directory and publish `frontend/dist/`. The Vite base path must be
configured if the app is served from a project subpath rather than a custom
domain.

### Phase 2 — Add a production inference service

The exported `.joblib` models should not be treated as a browser API. A future
deployment should:

1. Wrap model inference in a small authenticated Python API.
2. Validate and document the input schema and model version.
3. Keep raw student data and model files on trusted server-side storage.
4. Add role-based access, audit logging, rate limiting, and HTTPS.
5. Return predictions with confidence information and an explanation of the
   main contributing factors.
6. Replace the frontend's static prediction CSVs with API responses.
7. Monitor data drift, model performance, false negatives, and fairness across
   student groups.

### Phase 3 — Operate responsibly

Before production use, validate the models with education stakeholders, obtain
the required consent and governance approvals, define data-retention rules,
and provide teachers with a way to correct inaccurate records. Predictions
must support human-led intervention rather than automate decisions about a
student's education.

## Contributing

Create a feature branch, make focused changes, and verify both the notebook
workflow and frontend build when your change affects them. Please include
updated documentation or design references when adding a new interface or
deployment target.
