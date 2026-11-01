import React from 'react';
import RiskBadge from './RiskBadge';
import { displayValue } from '../utils/data';

export default function StudentTable({
  students,
  onSelect,
  compact = false,
}) {
  return (
    <div className='table-scroll'>
      <table className='student-table'>
        <thead>
          <tr>
            <th>Student</th>
            <th>Days absent</th>
            <th>Recent grade</th>
            <th>Academic risk</th>
            <th>Dropout risk</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id} onClick={() => onSelect(student)}>
              <td>
                <strong>{student.student_id}</strong>
                <small>
                  {student.gender} · Grade {student.grade}
                </small>
              </td>
              <td>
                <strong>
                  {displayValue(student.attendance.days_absent)}
                </strong>
              </td>
              <td>{displayValue(student.academic.recent_exam_score)}</td>
              <td>
                <RiskBadge value={student.risks.academic} />
              </td>
              <td>
                <RiskBadge value={student.risks.dropout} />
              </td>
            </tr>
          ))}
          {!students.length && (
            <tr>
              <td colSpan={5} className='empty'>
                No students match these filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {compact && (
        <p className='table-note'>Select a student to open the full profile.</p>
      )}
    </div>
  );
}
