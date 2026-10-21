import { supabase } from './supabaseClient';

const TABLES = {
  students: 'students',
  attendance: 'attendance_records',
  academic: 'academic_records',
  engagement: 'engagement_records',
  predictions: 'risk_predictions',
  factors: 'risk_factors',
};

async function readTable(table, studentIds = null) {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add the required environment variables before loading school data.',
    );
  }

  let query = supabase.from(table).select('*');
  if (studentIds) {
    if (!studentIds.length) return [];
    query = query.in('student_id', studentIds);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Unable to load ${table}: ${error.message}`);
  return data || [];
}

export async function loadLmsData(scope) {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add the required environment variables before loading school data.',
    );
  }

  const schoolIds = scope?.schoolIds || null;
  let studentQuery = supabase.from(TABLES.students).select('*');
  if (schoolIds) {
    if (!schoolIds.length) {
      return {
        students: [],
        attendance: [],
        academic: [],
        engagement: [],
        predictions: [],
        factors: [],
      };
    }

  }

  const { data: students, error } = await studentQuery;
  if (error) throw new Error(`Unable to load students: ${error.message}`);

  const studentIds = (students || []).map(({ student_id }) => student_id);
  const [attendance, academic, engagement, predictions, factors] =
    await Promise.all([
      readTable(TABLES.attendance, studentIds),
      readTable(TABLES.academic, studentIds),
      readTable(TABLES.engagement, studentIds),
      readTable(TABLES.predictions, studentIds),
      readTable(TABLES.factors, studentIds),
    ]);

  return {
    students: students || [],
    attendance,
    academic,
    engagement,
    predictions,
    factors,
  };
}

export async function loadDatabaseAccessScope(userId) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const [
    { data: profile, error: profileError },
    { data: assignments, error: assignmentError },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('role, full_name')
      .eq('user_id', userId)
      .maybeSingle(),
    supabase.from('user_school_access').select('school_id').eq('user_id', userId),
  ]);
  if (profileError)
    throw new Error(`Unable to load access profile: ${profileError.message}`);
  if (assignmentError)
    throw new Error(`Unable to load school access: ${assignmentError.message}`);
  return { profile, assignments: assignments || [] };
}
