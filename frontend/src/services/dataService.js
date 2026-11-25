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

function mapIntervention(row) {
  return {
    id: row.id,
    studentId: row.student_id,
    note: row.note,
    status: row.status,
    date: row.intervention_date,
    followUpDate: row.follow_up_date || '',
  };
}

export async function loadInterventions(studentId = null) {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add the required environment variables before loading interventions.',
    );
  }

  let query = supabase
    .from('interventions')
    .select(
      'id, student_id, note, status, intervention_date, follow_up_date',
    )
    .order('intervention_date', { ascending: false })
    .order('created_at', { ascending: false });
  if (studentId) query = query.eq('student_id', studentId);

  const { data, error } = await query;
  if (error) throw new Error(`Unable to load interventions: ${error.message}`);
  return (data || []).map(mapIntervention);
}

export async function saveIntervention({
  studentId,
  note,
  status,
  followUpDate,
}) {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add the required environment variables before saving interventions.',
    );
  }

  const { data, error } = await supabase
    .from('interventions')
    .insert({
      student_id: studentId,
      note,
      status,
      follow_up_date: followUpDate || null,
    })
    .select(
      'id, student_id, note, status, intervention_date, follow_up_date',
    )
    .single();
  if (error) throw new Error(`Unable to save intervention: ${error.message}`);
  return mapIntervention(data);
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
    const assignedSchoolIds = [...schoolIds];
    if (!assignedSchoolIds.length) {
      return {
        students: [],
        attendance: [],
        academic: [],
        engagement: [],
        predictions: [],
        factors: [],
      };
    }
    studentQuery = studentQuery.in('school_id', assignedSchoolIds);
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
