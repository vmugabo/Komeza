export const displayValue = (value, fallback = '—') => {
  const text = String(value ?? '').trim();
  return text || fallback;
};

export const numericValue = (value) => {
  if (String(value ?? '').trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const percentValue = (value) => {
  const parsed = numericValue(value);
  if (parsed === null) return null;
  return `${parsed <= 1 ? (parsed * 100).toFixed(0) : parsed.toFixed(0)}%`;
};

export const riskCount = (students, field, value) =>
  students.filter((student) => student.risks[field] === value).length;

export function combineStudentData(data) {
  const byId = (rows) =>
    Object.fromEntries(rows.map((row) => [row.student_id, row]));
  const attendance = byId(data.attendance);
  const academic = byId(data.academic);
  const engagement = byId(data.engagement);
  const predictions = byId(data.predictions);
  return data.students.map((student) => {
    const prediction = predictions[student.student_id] || {};
    return {
      ...student,
      age: numericValue(student.age),
      attendance: attendance[student.student_id] || {},
      academic: academic[student.student_id] || {},
      engagement: engagement[student.student_id] || {},
      prediction,
      risks: {
        academic: prediction.academic_risk || 'Unknown',
        dropout: prediction.dropout_risk || 'Unknown',
      },
    };
  });
}

export function getFactors(factors, studentId, riskType) {
  return factors
    .filter(
      (factor) =>
        factor.student_id === studentId && factor.risk_type === riskType,
    )
    .sort((a, b) => Number(a.importance_rank) - Number(b.importance_rank))
    .slice(0, 5);
}

export function validData(data) {
  const required = [
    'students',
    'attendance',
    'academic',
    'engagement',
    'predictions',
    'factors',
  ];
  return required.every((key) => Array.isArray(data[key]));
}
