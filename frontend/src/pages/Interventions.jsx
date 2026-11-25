import React, { useEffect, useState } from 'react';
import RiskBadge from '../components/RiskBadge';
import {
  loadInterventions,
  saveIntervention,
} from '../services/dataService';

export default function Interventions({ students, onSelect }) {
  const [items, setItems] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    loadInterventions()
      .then((loaded) => {
        if (active) setItems(loaded);
      })
      .catch((reason) => {
        if (active) setError(reason.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const save = async (event) => {
    event.preventDefault();
    if (!studentId || !note.trim()) return;
    const form = event.currentTarget;
    setSaving(true);
    setError('');
    try {
      const saved = await saveIntervention({
        studentId,
        note: note.trim(),
        followUpDate: form.followUpDate.value,
        status: form.status.value,
      });
      setItems((current) => [saved, ...current]);
      setNote('');
      setStudentId('');
      form.reset();
    } catch (reason) {
      setError(reason.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <section className='page'>
      <div className='page-heading'>
        <div>
          <p className='eyebrow'>Teacher follow-up</p>
          <h1>Interventions</h1>
          <p>
            Record supportive actions and planned follow-up. Notes are saved
            securely in Supabase.
          </p>
        </div>
        <span className='data-label'>Supabase records</span>
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
          <button className='primary' type='submit' disabled={saving}>
            {saving ? 'Saving…' : 'Save intervention'}
          </button>
          {error && <p className='error-state' role='alert'>{error}</p>}
        </form>
        <div className='panel'>
          <p className='eyebrow'>Recent notes</p>
          <h2>Intervention log</h2>
          {loading ? (
            <p className='muted'>Loading interventions…</p>
          ) : items.length ? (
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
