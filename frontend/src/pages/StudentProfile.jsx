import React, { useEffect, useState } from 'react';
import {
  displayValue,
  getFactors,
  percentValue,
} from '../utils/data';
import RiskBadge from '../components/RiskBadge';
import MetricCard from '../components/MetricCard';
import {
  loadInterventions,
  saveIntervention,
} from '../services/dataService';

export default function StudentProfile({ student, factors, onBack }) {
  const academicFactors = getFactors(factors, student.student_id, 'academic');
  const dropoutFactors = getFactors(factors, student.student_id, 'dropout');
  const [interventions, setInterventions] = useState([]);
  const [interventionsLoading, setInterventionsLoading] = useState(true);
  const [interventionsError, setInterventionsError] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    let active = true;
    setInterventionsLoading(true);
    setInterventionsError('');
    loadInterventions(student.student_id)
      .then((loaded) => {
        if (active) setInterventions(loaded);
      })
      .catch((reason) => {
        if (active) setInterventionsError(reason.message);
      })
      .finally(() => {
        if (active) setInterventionsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [student.student_id]);

  const save = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSaving(true);
    setSaveError('');
    try {
      const saved = await saveIntervention({
        studentId: student.student_id,
        note: note.trim(),
        status: form.status.value,
        followUpDate: form.followUpDate.value,
      });
      setInterventions((current) => [saved, ...current]);
      setNote('');
      form.reset();
    } catch (reason) {
      setSaveError(reason.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className='page'>
      <button className='back-link' onClick={onBack}>
        ← Back to students
      </button>
      <div className='profile-title'>
        <div>
          <p className='eyebrow'>Student profile</p>
          <h1>{student.student_id}</h1>
          <p>
            {displayValue(student.gender)} · {displayValue(student.school_id)} ·
            Grade {displayValue(student.grade)}
          </p>
        </div>
        <div className='profile-risks'>
          <span>
            Academic <RiskBadge value={student.risks.academic} />
          </span>
          <span>
            Dropout <RiskBadge value={student.risks.dropout} />
          </span>
        </div>
      </div>
      <div className='metrics four'>
        <MetricCard
          label='Days absent'
          value={displayValue(student.attendance.days_absent)}
          detail='from attendance records'
        />
        <MetricCard
          label='Failed subjects'
          value={displayValue(student.academic.previous_failed_subjects)}
          detail='previous assessment'
        />
        <MetricCard
          label='Grade 1'
          value={displayValue(student.academic.previous_exam_score)}
          detail='previous assessment'
        />
        <MetricCard
          label='Grade 2'
          value={displayValue(student.academic.recent_exam_score)}
          detail='recent assessment'
        />
      </div>
      <div className='profile-grid'>
        <div className='panel'>
          <div className='panel-heading'>
            <div>
              <p className='eyebrow'>Student indicators</p>
              <h2>Academic and engagement record</h2>
            </div>
          </div>
          <dl className='details'>
            <div>
              <dt>Previous assessment</dt>
              <dd>{displayValue(student.academic.previous_exam_score)}</dd>
            </div>
            <div>
              <dt>Recent assessment</dt>
              <dd>{displayValue(student.academic.recent_exam_score)}</dd>
            </div>
            <div>
              <dt>Performance change</dt>
              <dd>{displayValue(student.academic.performance_change)}</dd>
            </div>
            <div>
              <dt>Previous failed subjects</dt>
              <dd>{displayValue(student.academic.previous_failed_subjects)}</dd>
            </div>
            <div>
              <dt>Days absent</dt>
              <dd>{displayValue(student.attendance.days_absent)}</dd>
            </div>
            <div>
              <dt>Study time</dt>
              <dd>{displayValue(student.engagement.study_hours_per_week)}</dd>
            </div>
          </dl>
        </div>
        <div className='panel'>
          <div className='panel-heading'>
            <div>
              <p className='eyebrow'>Risk results</p>
              <h2>Risk levels and factors</h2>
            </div>
          </div>
          <div className='prediction-callout'>
            <span>Academic risk</span>
            <RiskBadge value={student.risks.academic} />
            <small>
              {percentValue(student.probabilities.academic) ||
                'Probability not supplied'}
            </small>
          </div>
          <div className='factor-section'>
            <strong>Academic factors</strong>
            {academicFactors.length ? (
              academicFactors.slice(0, 3).map((factor) => (
                <div className='factor' key={`academic-${factor.factor_name}`}>
                  <span>
                    <strong>{factor.factor_name}</strong>
                    <small>{displayValue(factor.factor_value)}</small>
                  </span>
                  <b>{displayValue(factor.contribution)}</b>
                </div>
              ))
            ) : (
              <p className='muted'>No academic factors supplied.</p>
            )}
          </div>
          <div className='prediction-callout'>
            <span>Dropout risk</span>
            <RiskBadge value={student.risks.dropout} />
            <small>
              {percentValue(student.probabilities.dropout) ||
                'Probability not supplied'}
            </small>
          </div>
          <div className='factor-section'>
            <strong>Dropout factors</strong>
            {dropoutFactors.length ? (
              dropoutFactors.slice(0, 3).map((factor) => (
                <div className='factor' key={`dropout-${factor.factor_name}`}>
                  <span>
                    <strong>{factor.factor_name}</strong>
                    <small>{displayValue(factor.factor_value)}</small>
                  </span>
                  <b>{displayValue(factor.contribution)}</b>
                </div>
              ))
            ) : (
              <p className='muted'>No dropout factors supplied.</p>
            )}
          </div>
        </div>
      </div>
      <div className='panel form-panel'>
        <p className='eyebrow'>Teacher follow-up</p>
        <h2>Record support action</h2>
        <form onSubmit={save}>
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
              rows='4'
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder='What support was discussed or provided?'
              required
            />
          </label>
          <button className='primary' type='submit' disabled={saving}>
            {saving ? 'Saving…' : 'Save intervention'}
          </button>
          {saveError && <p className='error-state' role='alert'>{saveError}</p>}
        </form>
      </div>
      <div className='panel recent-data'>
        <div className='panel-heading'>
          <div>
            <p className='eyebrow'>Support history</p>
            <h2>Intervention history</h2>
          </div>
        </div>
        {interventionsLoading ? (
          <p className='muted'>Loading intervention history…</p>
        ) : interventionsError ? (
          <p className='error-state' role='alert'>{interventionsError}</p>
        ) : interventions.length ? (
          interventions.map((item) => (
            <div className='intervention compact-intervention' key={item.id}>
              <div>
                <strong>{item.status || 'Recorded'}</strong>
                <small>
                  {item.date}
                  {item.followUpDate ? ` · follow-up ${item.followUpDate}` : ''}
                </small>
              </div>
              <p>{item.note}</p>
            </div>
          ))
        ) : (
          <p className='muted'>
            No intervention notes recorded for this student.
          </p>
        )}
      </div>
      <div className='notice'>
        <strong>Support reminder</strong>
        <span>
          Use these results to guide a supportive conversation and decide what
          to review next.
        </span>
      </div>
    </section>
  );
}
