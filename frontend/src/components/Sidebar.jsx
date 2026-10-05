import React from 'react';

const items = [
  ['dashboard', 'Dashboard', '▦'],
  ['school', 'School', '▰'],
  ['academic', 'Academic Risk', '▥'],
  ['dropout', 'Dropout Risk', '↘'],
  ['interventions', 'Interventions', '✓'],
];

export default function Sidebar({ page, setPage, onLogout }) {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark">K</div><div><strong>Komeza</strong><span>District workspace</span></div></div>
    <div className="teacher-card"><div className="avatar">JM</div><div><strong>Jane Mwangi</strong><span>District Education Officer</span></div></div>
    <nav>{items.map(([key, label, icon]) => <React.Fragment key={key}><button className={page === key || (key === 'school' && page === 'students') ? 'selected' : ''} onClick={() => setPage(key)}><i>{icon}</i>{label}</button>{key === 'school' && <button className={`subnav ${page === 'students' ? 'selected-subnav' : ''}`} onClick={() => setPage('school')}><i>└</i>Grades</button>}</React.Fragment>)}</nav>
    <div className="sidebar-footer"><span>District workspace</span><small>District Overview.</small><button onClick={onLogout}>Sign out</button></div>
  </aside>;
}
