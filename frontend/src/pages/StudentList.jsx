import React, { useMemo, useState } from 'react';
import StudentTable from '../components/StudentTable';
import { numericValue } from '../utils/data';

export default function StudentList({ students, onSelect, mode = 'all' }) {
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState('All');
  const [sort, setSort] = useState('student_id');
  const filtered = useMemo(
    () =>
      students
        .filter((student) => {
          const matchesQuery =
            `${student.student_id} ${student.gender} ${student.school_id} ${student.grade}`
              .toLowerCase()
              .includes(query.toLowerCase());
          const value =
            mode === 'academic'
              ? student.risks.academic
              : student.risks.dropout;
          return matchesQuery && (risk === 'All' || value === risk);
        })
        .sort((a, b) => {
          if (sort === 'attendance')
            return (
              (numericValue(b.attendance.days_absent) ?? -1) -
              (numericValue(a.attendance.days_absent) ?? -1)
            );
          if (sort === 'recent_grade')
            return (
              (numericValue(b.academic.recent_exam_score) || -1) -
              (numericValue(a.academic.recent_exam_score) || -1)
            );
          return a.student_id.localeCompare(b.student_id);
        }),
    [students, query, risk, sort, mode],
  );
  const title =
    mode === 'academic'
      ? 'Academic risk'
      : mode === 'dropout'
        ? 'Dropout risk'
        : 'My students';
  const copy =
    mode === 'academic'
      ? 'Review academic risk results alongside the student indicators that need attention.'
      : mode === 'dropout'
        ? 'Review dropout risk results alongside absences and prior performance.'
        : 'Search, sort, and open a student record for a fuller view.';
  return (
    <section className='page'>
      <div className='page-heading'>
        <div>
          <p className='eyebrow'>
            {mode === 'all' ? 'Class register' : 'Risk results'}
          </p>
          <h1>{title}</h1>
          <p>{copy}</p>
        </div>
        <span className='data-label'>
          {filtered.length} of {students.length} students
        </span>
      </div>
      {mode !== 'all' && (
        <div className='notice'>
          <strong>Risk results</strong>
          <span>
            Use these results with the underlying student indicators to plan
            supportive follow-up.
          </span>
        </div>
      )}
      <div className='toolbar'>
        <label className='search-field'>
          <span>Search</span>
          <input
            placeholder='Student ID, school, grade...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          <span>Risk level</span>
          <select value={risk} onChange={(e) => setRisk(e.target.value)}>
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </label>
        <label>
          <span>Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value='student_id'>Student ID</option>
            <option value='attendance'>Days absent</option>
            <option value='recent_grade'>Recent grade</option>
          </select>
        </label>
      </div>
      <div className='panel table-panel'>
        <StudentTable students={filtered} onSelect={onSelect} />
      </div>
    </section>
  );
}
