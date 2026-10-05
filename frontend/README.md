# Komeza teacher frontend

This is an independent React/Vite teacher workspace. It reads the existing
project CSV files from `public/data/` in the browser and does not require a
server, database, Supabase, or API.

## Run

```bash
cd frontend
npm install
npm run dev
```

The login is a local demo gate. Student risk labels, attendance,
academic records, assignment completion, and risk factors are read from CSV
files. Interventions are stored in browser `localStorage`.

## CSV sources

- `students.csv`
- `attendance_records.csv`
- `academic_records.csv`
- `engagement_records.csv`
- `risk_predictions.csv`
- `student_predictions.csv`
- `risk_factors.csv`

The exported `.joblib` models are not loaded by React. They remain Python
artifacts for a future Python inference service; this frontend displays the
prediction results already present in the CSV files.
