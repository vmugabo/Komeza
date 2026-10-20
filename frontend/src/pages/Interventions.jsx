import React, { useState } from 'react';
import RiskBadge from '../components/RiskBadge';

export default function Interventions({ students, onSelect }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('komeza-interventions') || '[]');
    } catch {
      return [];
    }
  });
  const [studentId, setStudentId] = useState('');
  const [note, setNote] = useState('');
  const save = (event) => {
    event.preventDefault();
    if (!studentId || !note.trim()) return;
    const next = [
      {
        id: Date.now(),
        studentId,
        note: note.trim(),
        date: new Date().toLocaleDateString(),
        followUpDate: event.currentTarget.followUpDate.value,
        status: event.currentTarget.status.value,
      },
      ...items,
    ];
    setItems(next);
    localStorage.setItem('komeza-interventions', JSON.stringify(next));
    setNote('');
    setStudentId('');
    event.currentTarget.reset();
  };
  return (
    <section className='page'>
      <div className='page-heading'>
        <div>
          <p className='eyebrow'>Teacher follow-up</p>
          <h1>Interventions</h1>
          <p>
            Record supportive actions and planned follow-up. Notes are stored
            only in this browser.
          </p>
        </div>
        <span className='data-label'>Local prototype records</span>
      </div>
      <div className='intervention-grid'>
        <form className='panel form-panel' onSubmit={save}>
          <p className='eyebrow'>Add a record</p>
          <h2>Record support action</h2>
          <label>
            Student
            <select
              name='student'
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            >
              <option value=''>Choose a student</option>
              {students.map((s) => (
                <option key={s.student_id} value={s.student_id}>
                  {s.student_id} · {s.school_id}
                </option>
              ))}
            </select>
          </label>
          <label>
            Action status
            <select name='status' defaultValue='Planned'>
              <option>Planned</option>
              <option>In progress</option>
              <option>Completed</option>
              <option>Follow-up needed</option>
            </select>
          </label>
          <label>
            Follow-up date
            <input name='followUpDate' type='date' />
          </label>
          <label>
            Notes
            <textarea
              rows='5'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='What support was discussed or provided?'
              required
            />
          </label>
          <button className='primary' type='submit'>
            Save intervention
          </button>
        </form>
        <div className='panel'>
          <p className='eyebrow'>Recent notes</p>
          <h2>Intervention log</h2>
          {items.length ? (
            items.map((item) => {
              const student = students.find(
                (s) => s.student_id === item.studentId,
              );
              return (
                <div className='intervention' key={item.id}>
                  <div>
                    <strong>{item.studentId}</strong>
                    <small>
                      {item.date} · {item.status || 'Recorded'}{' '}
                      {student?.risks.dropout && (
                        <RiskBadge value={student.risks.dropout} />
                      )}
                    </small>
                  </div>
                  <p>{item.note}</p>
                  <div className='intervention-actions'>
                    {item.followUpDate && (
                      <small>Follow-up: {item.followUpDate}</small>
                    )}
                    <button
                      className='text-button'
                      disabled={!student}
                      onClick={() => onSelect(student)}
                    >
                      Open profile
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className='muted'>No interventions recorded yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}
