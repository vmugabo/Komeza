import React, { useMemo, useState } from 'react';
import StudentTable from '../components/StudentTable';

export default function StudentList({ students, onSelect, mode = 'all' }) {
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState('All');
  const [sort, setSort] = useState('student_id');
  const filtered = useMemo(() => students.filter((student) => {
    const matchesQuery = `${student.student_id} ${student.gender} ${student.school_id}`.toLowerCase().includes(query.toLowerCase());
    const value = mode === 'academic' ? student.risks.academic : student.risks.dropout;
    return matchesQuery && (risk === 'All' || value === risk);
  }).sort((a, b) => sort === 'attendance' ? Number(b.attendance.attendance_rate) - Number(a.attendance.attendance_rate) : sort === 'completion' ? Number(b.engagement.assignment_completion_rate) - Number(a.engagement.assignment_completion_rate) : a.student_id.localeCompare(b.student_id)), [students, query, risk, sort, mode]);
  const title = mode === 'academic' ? 'Academic risk' : mode === 'dropout' ? 'Dropout risk' : 'My students';
  const copy = mode === 'academic' ? 'Review model-predicted academic risk alongside recent learning evidence.' : mode === 'dropout' ? 'Review model-predicted dropout risk with attendance and engagement context.' : 'Search, sort, and open a student record for a fuller view.';
  return <section className="page"><div className="page-heading"><div><p className="eyebrow">{mode === 'all' ? 'Class register' : 'Model predictions'}</p><h1>{title}</h1><p>{copy}</p></div><span className="data-label">{filtered.length} students shown</span></div><div className="toolbar"><input placeholder="Search student ID or school..." value={query} onChange={(e) => setQuery(e.target.value)} /><select value={risk} onChange={(e) => setRisk(e.target.value)}><option>All</option><option>High</option><option>Medium</option><option>Low</option></select><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="student_id">Sort by student</option><option value="attendance">Sort by attendance</option><option value="completion">Sort by completion</option></select></div><div className="panel"><StudentTable students={filtered} onSelect={onSelect} /></div></section>;
}
