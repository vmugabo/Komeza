import React from 'react';

const items = [
  ['dashboard', 'Dashboard', '▦'],
  ['school', 'School', '▰'],
  ['academic', 'Academic Risk', '▥'],
  ['dropout', 'Dropout Risk', '↘'],
  ['interventions', 'Interventions', '✓'],
];

export default function Sidebar({ page, setPage, onLogout, user }) {
  const name = user?.user_metadata?.full_name || user?.email || 'Authenticated teacher';
  const initials = name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark">K</div><div><strong>Komeza</strong><span>District workspace</span></div></div>
    <div className="teacher-card"><div className="avatar">{initials}</div><div><strong>{name}</strong><span>Authenticated workspace user</span></div></div>
    <nav>{items.map(([key, label, icon]) => <React.Fragment key={key}><button className={page === key || (key === 'school' && page === 'students') ? 'selected' : ''} onClick={() => setPage(key)}><i>{icon}</i>{label}</button>{key === 'school' && <button className={`subnav ${page === 'students' ? 'selected-subnav' : ''}`} onClick={() => setPage('school')}><i>└</i>Grades</button>}</React.Fragment>)}</nav>
    <div className="sidebar-footer"><span>District workspace</span><small>District Overview.</small><button onClick={onLogout}>Sign out</button></div>
  </aside>;
}
