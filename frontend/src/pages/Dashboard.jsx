import React from 'react';
import MetricCard from '../components/MetricCard';
import RiskBadge from '../components/RiskBadge';
import StudentTable from '../components/StudentTable';
import { numericValue, percentValue, riskCount } from '../utils/data';

export default function Dashboard({ students, onSelect, setPage }) {
  const attention = students
    .filter(
      (student) =>
        student.risks.dropout === 'High' || student.risks.academic === 'High',
    )
    .slice(0, 8);
  const recentGrades = students
    .map((s) => numericValue(s.academic.recent_exam_score))
    .filter((value) => value !== null);
  const averageGrade = recentGrades.length
    ? (
        recentGrades.reduce((sum, value) => sum + value, 0) /
        recentGrades.length
      ).toFixed(1)
    : '—';
  const attendance = students
    .map((s) => numericValue(s.attendance.attendance_rate))
    .filter((value) => value !== null);
  const averageAttendance = attendance.length
    ? percentValue(
        attendance.reduce((sum, value) => sum + value, 0) / attendance.length,
      )
    : '—';
  const completion = students
    .map((s) => numericValue(s.engagement.assignment_completion_rate))
    .filter((value) => value !== null);
  const averageCompletion = completion.length
    ? percentValue(
        completion.reduce((sum, value) => sum + value, 0) / completion.length,
      )
    : '—';
  return (
    <section className='page'>
      <div className='page-heading'>
        <div>
          <p className='eyebrow'>Teacher workspace</p>
          <h1>Student support overview</h1>
          <p>
            Review current indicators, then decide which students need a closer
            conversation.
          </p>
        </div>
        <span className='data-label'>{students.length} students in scope</span>
      </div>
      <div className='metrics four'>
        <MetricCard
          label='Students'
          value={students.length}
          detail='records in your workspace'
        />
        <MetricCard
          label='Average attendance'
          value={averageAttendance}
          detail='from attendance records'
        />
        <MetricCard
          label='Assignment completion'
          value={averageCompletion}
          detail='where reported'
        />
        <MetricCard
          label='Recent grade average'
          value={averageGrade}
          detail='assessment records'
        />
      </div>
      <div className='dashboard-grid'>
        <div className='panel'>
          <div className='panel-heading'>
            <div>
              <p className='eyebrow'>Next review</p>
              <h2>Students requiring attention</h2>
            </div>
            <button className='text-button' onClick={() => setPage('dropout')}>
              Open dropout risk →
            </button>
          </div>
          <StudentTable
            students={attention}
            onSelect={onSelect}
            compact
            showAssignments={false}
          />
          <p className='table-note'>
            Priority list includes students with High academic or dropout risk
            results.
          </p>
        </div>
        <div className='panel summary-panel'>
          <p className='eyebrow'>Risk summary</p>
          <h2>Risk distribution</h2>
          <div className='risk-group'>
            <h3>Academic risk</h3>
            {['High', 'Medium', 'Low'].map((level) => (
              <div className='signal' key={`academic-${level}`}>
                <span>
                  <RiskBadge value={level} /> {level}
                </span>
                <strong>{riskCount(students, 'academic', level)}</strong>
              </div>
            ))}
          </div>
          <div className='risk-group'>
            <h3>Dropout risk</h3>
            {['High', 'Medium', 'Low'].map((level) => (
              <div className='signal' key={`dropout-${level}`}>
                <span>
                  <RiskBadge value={level} /> {level}
                </span>
                <strong>{riskCount(students, 'dropout', level)}</strong>
              </div>
            ))}
          </div>
          <button
            className='secondary-button'
            onClick={() => setPage('academic')}
          >
            Review academic risk
          </button>
        </div>
      </div>
      <div className='dashboard-footnote'>
        <strong>How to use this workspace</strong>
        <span>
          Risk results are indicators from the available student records. Use
          them to guide supportive follow-up, not as a final judgement.
        </span>
      </div>
    </section>
  );
}
