import React from 'react';
import RiskBadge from './RiskBadge';

export default function StudentTable({ students, onSelect, compact = false }) {
  return <div className="table-scroll"><table className="student-table"><thead><tr><th>Student</th><th>Absences</th><th>Recent grade</th><th>Academic</th><th>Dropout screening</th></tr></thead><tbody>
    {students.map((student) => <tr key={student.student_id} onClick={() => onSelect(student)}>
      <td><strong>{student.student_id}</strong><small>{student.gender} · Grade {student.grade}</small></td>
      <td>{student.attendance.days_absent || '—'}</td>
      <td>{student.academic.recent_exam_score || '—'}</td>
      <td><RiskBadge value={student.risks.academic} /></td>
      <td><RiskBadge value={student.risks.dropout} /></td>
    </tr>)}
    {!students.length && <tr><td colSpan="5" className="empty">No students match these filters.</td></tr>}
  </tbody></table>{compact && <p className="table-note">Select a student to open the full profile.</p>}</div>;
}
