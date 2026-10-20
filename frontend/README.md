# Komeza teacher frontend

This is a React/Vite teacher workspace. It reads the existing project CSV files
from `public/data/` in the browser and uses Supabase Auth for authentication.
The CSV records remain static browser data for now; Supabase database tables
and intervention persistence can be added separately.

## Production deployment

The production frontend is built and served from the Linode server. Keep the
Supabase configuration and CSV data on the server and do not commit them to
GitHub. The CSV files are intentionally excluded by the repository's
`.gitignore`.

Create users in the Supabase dashboard under **Authentication → Users**. The
login form signs in with `supabase.auth.signInWithPassword`, restores existing
sessions on startup, listens for auth state changes, and signs out through
Supabase. Only the publishable/anon key belongs in the browser; never expose a
Supabase service-role key in Vite environment variables.

For the current email/password setup:

1. Create or select a Supabase project.
2. Open **Authentication → Providers → Email** and enable Email.
3. Under **Authentication → Users**, create the teacher accounts.
4. Add the Linode production URL to the project's allowed redirect URLs if
   email confirmation or recovery flows are enabled.

The authenticated user's full name is read from `user_metadata.full_name` when
present, with the email used as the fallback display name.

Student risk labels, attendance, academic records, assignment completion, and
risk factors are read from private CSV files present on the Linode deployment.
Interventions are still stored in browser `localStorage`; they are not yet
protected database records.

## CSV sources

- `students.csv`
- `attendance_records.csv`
- `academic_records.csv`
- `engagement_records.csv`
- `risk_predictions.csv`
- `risk_factors.csv`

The exported `.joblib` models are not loaded by React. They remain Python
artifacts for a future Python inference service; this frontend displays the
prediction results already present in the CSV files.
