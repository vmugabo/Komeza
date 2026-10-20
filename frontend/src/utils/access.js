const DISTRICT_ROLES = new Set([
  'district official',
  'district_official',
  'district-admin',
  'district admin',
]);

const normalize = (value) =>
  String(value || '')
    .trim()
    .toLowerCase();

export function getAccessScope(user) {
  const metadata = user?.user_metadata || {};
  const role = normalize(metadata.role);
  if (DISTRICT_ROLES.has(role)) {
    return {
      schoolIds: null,
      label: 'All schools',
    };
  }

  const configuredSchools = Array.isArray(metadata.school_ids)
    ? metadata.school_ids
    : [metadata.school_id];
  const schoolIds = new Set(configuredSchools.map(normalize).filter(Boolean));
  return {
    schoolIds,
    label: schoolIds.size ? [...schoolIds].join(', ') : 'No school assigned',
  };
}

export function restrictDataToScope(data, scope) {
  if (!scope.schoolIds) return data;
  const students = data.students.filter((student) =>
    scope.schoolIds.has(normalize(student.school_id)),
  );
  const studentIds = new Set(students.map((student) => student.student_id));
  const byStudent = (rows) =>
    rows.filter((row) => studentIds.has(row.student_id));
  return {
    ...data,
    students,
    attendance: byStudent(data.attendance),
    academic: byStudent(data.academic),
    engagement: byStudent(data.engagement),
    predictions: byStudent(data.predictions),
    factors: byStudent(data.factors),
  };
}
