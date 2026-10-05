import React, { useMemo, useState } from 'react';
import StudentTable from '../components/StudentTable';

export default function SchoolDirectory({ students, onSelect }) {
  const [openSchools, setOpenSchools] = useState({});
  const [openGrades, setOpenGrades] = useState({});
  const [query, setQuery] = useState('');
  const schools = useMemo(() => {
    const matching = students.filter((student) => `${student.student_id} ${student.school_id} ${student.grade}`.toLowerCase().includes(query.toLowerCase()));
    return Object.entries(matching.reduce((groups, student) => {
      const school = student.school_id || 'Unknown school';
      const grade = student.grade || 'Unknown grade';
      groups[school] ||= {};
      groups[school][grade] ||= [];
      groups[school][grade].push(student);
      return groups;
    }, {})).sort(([a], [b]) => a.localeCompare(b));
  }, [students, query]);

  const toggle = (setter, key) => setter((current) => ({ ...current, [key]: !current[key] }));
  return <section className="page">
    <div className="page-heading"><div><p className="eyebrow">School directory</p><h1>Schools and grades</h1><p>Browse students by school first, then open a grade sub-folder.</p></div><span className="data-label">{students.length} students</span></div>
    <div className="toolbar"><input placeholder="Search school, grade, or student..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
    <div className="school-list">{schools.map(([school, grades]) => {
      const schoolOpen = openSchools[school];
      return <div className="school-folder" key={school}>
        <button className="folder-header" onClick={() => toggle(setOpenSchools, school)}><span className="folder-icon">▰</span><strong>{school}</strong><span className="folder-count">{Object.values(grades).flat().length} students</span><b>{schoolOpen ? '−' : '+'}</b></button>
        {schoolOpen && <div className="grade-folders">{Object.entries(grades).sort(([a], [b]) => Number(a) - Number(b)).map(([grade, gradeStudents]) => {
          const gradeKey = `${school}-${grade}`;
          const gradeOpen = openGrades[gradeKey];
          return <div className="grade-folder" key={gradeKey}>
            <button className="folder-header grade-header" onClick={() => toggle(setOpenGrades, gradeKey)}><span className="folder-icon">▱</span><strong>Grade {grade}</strong><span className="folder-count">{gradeStudents.length} students</span><b>{gradeOpen ? '−' : '+'}</b></button>
            {gradeOpen && <div className="grade-table"><StudentTable students={gradeStudents} onSelect={onSelect} /></div>}
          </div>;
        })}</div>}
      </div>;
    })}{!schools.length && <div className="panel empty">No schools or grades match your search.</div>}</div>
  </section>;
}
