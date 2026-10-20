import React from 'react';
import { getFactors } from '../utils/data';
import RiskBadge from '../components/RiskBadge';
import MetricCard from '../components/MetricCard';

export default function StudentProfile({ student, factors, onBack }) {
  const academicFactors = getFactors(factors, student.student_id, 'academic');
  const dropoutFactors = getFactors(factors, student.student_id, 'dropout');
  return <section className="page">
    <button className="back-link" onClick={onBack}>← Back to students</button>
    <div className="profile-title"><div><p className="eyebrow">Student profile</p><h1>{student.student_id}</h1><p>{student.gender} · {student.school_id}</p></div><div className="profile-risks"><span>Academic <RiskBadge value={student.risks.academic} /></span><span>Dropout screening <RiskBadge value={student.risks.dropout} /></span></div></div>
    <div className="metrics four"><MetricCard label="Absences" value={student.attendance.days_absent || '—'} detail="reported absences" /><MetricCard label="Study time" value={student.engagement.study_hours_per_week || '—'} detail="source scale 1–4" /><MetricCard label="Grade 1" value={student.academic.previous_exam_score || '—'} detail="early assessment" /><MetricCard label="Grade 2" value={student.academic.recent_exam_score || '—'} detail="later assessment" /></div>
    <div className="profile-grid">
      <div className="panel"><div className="panel-heading"><div><p className="eyebrow">Academic record</p><h2>Assessment context</h2></div></div><dl className="details"><div><dt>Grade 1</dt><dd>{student.academic.previous_exam_score || '—'}</dd></div><div><dt>Grade 2</dt><dd>{student.academic.recent_exam_score || '—'}</dd></div><div><dt>Change</dt><dd>{student.academic.performance_change || '—'}</dd></div><div><dt>Previous failures</dt><dd>{student.academic.previous_failed_subjects || '—'}</dd></div><div><dt>Absences</dt><dd>{student.attendance.days_absent || '—'}</dd></div></dl></div>
      <div className="panel"><div className="panel-heading"><div><p className="eyebrow">Model signals</p><h2>Ranked factors</h2></div></div><div className="details"><strong>Academic risk</strong>{academicFactors.slice(0, 3).map((factor) => <div key={`academic-${factor.factor_name}`}><dt>{factor.factor_name}</dt><dd>{Number(factor.contribution).toFixed(3)}</dd></div>)}<strong>Dropout screening</strong>{dropoutFactors.slice(0, 3).map((factor) => <div key={`dropout-${factor.factor_name}`}><dt>{factor.factor_name}</dt><dd>{Number(factor.contribution).toFixed(3)}</dd></div>)}</div></div>
    </div>
    <div className="panel recent-data"><p className="eyebrow">Interpretation</p><h2>Use as a support prompt</h2><p className="muted">These are screening signals from a small retrospective dataset. They should support a conversation rather than determine a student’s outcome.</p></div>
  </section>;
}
