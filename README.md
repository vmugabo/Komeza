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
│   ├── public/data/             # CSV data displayed by the frontend
│   ├── src/                     # Pages, components, styles, and CSV services
│   └── package.json
├── komeza_wige/
│   ├── Student_Performance.csv  # Source dataset
│   ├── student_risk_assessment.ipynb
│   └── model_exports/            # Exported Python model artefacts
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
comparison, and exported model artefacts. The root
[`requirements.txt`](requirements.txt) contains the Python dependencies used by
the notebook.

### 3. Set up and run the teacher frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, normally
[`http://localhost:5173`](http://localhost:5173). The frontend is a browser-only
demo: it reads the CSV files in `frontend/public/data/` and stores intervention
notes in `localStorage`. It does not currently require a server, database,
Supabase, or API.

To create and preview a production build:

```bash
npm run build
npm run preview
```

## How it works

1. Load and inspect the student data.
2. Remove duplicate records.
3. Explore the data with summaries, tables, and charts.
4. Create transparent academic- and dropout-risk rules.
5. Prepare the features for machine learning.
6. Train and compare logistic regression, decision tree, random forest, and
   optionally XGBoost models.
7. Compare accuracy, balanced performance, macro-F1, and high-risk detection.
8. Export the strongest models and present prepared predictions in the teacher
   workspace.

The current React frontend displays prediction results already present in CSV
files. The `.joblib` models are not loaded directly by React; they are Python
artefacts intended for a future inference service.

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
