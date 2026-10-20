import React from 'react';
import RiskBadge from './RiskBadge';
import { displayValue, percentValue } from '../utils/data';

export default function StudentTable({
  students,
  onSelect,
  compact = false,
  showAssignments = true,
}) {
  return (
    <div className='table-scroll'>
      <table className='student-table'>
        <thead>
          <tr>
            <th>Student</th>
            <th>Attendance</th>
            {showAssignments && <th>Assignments</th>}
            <th>Recent grade</th>
            <th>Academic risk</th>
            <th>Dropout risk</th>
            <th>Probability</th>
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
                  {percentValue(student.attendance.attendance_rate) ||
                    displayValue(student.attendance.days_absent)}
                </strong>
                <small>
                  {displayValue(student.attendance.days_absent)} absent
                </small>
              </td>
              {showAssignments && (
                <td>
                  <strong>
                    {displayValue(student.engagement.completed_assignments)}
                  </strong>
                  <small>
                    {displayValue(student.engagement.missed_assignments)} missed
                    ·{' '}
                    {percentValue(
                      student.engagement.assignment_completion_rate,
                    ) || 'rate —'}
                  </small>
                </td>
              )}
              <td>{displayValue(student.academic.recent_exam_score)}</td>
              <td>
                <RiskBadge value={student.risks.academic} />
              </td>
              <td>
                <RiskBadge value={student.risks.dropout} />
              </td>
              <td>
                {percentValue(student.prediction.prediction_probability) || '—'}
              </td>
            </tr>
          ))}
          {!students.length && (
            <tr>
              <td colSpan={showAssignments ? 7 : 6} className='empty'>
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
