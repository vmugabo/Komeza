import React, { useState } from 'react';

const items = [
  ['dashboard', 'Dashboard', '▦'],
  ['students', 'My Students', '▰'],
  ['academic', 'Academic Risk', '▥'],
  ['dropout', 'Dropout Risk', '↘'],
  ['interventions', 'Interventions', '✓'],
];

export default function Sidebar({
  page,
  setPage,
  onLogout,
  user,
  scopeLabel,
  roleLabel,
}) {
  const metadata = user?.user_metadata || {};
  const name = metadata.full_name || user?.email || 'Authenticated teacher';
  const email = user?.email || '';
  const role = roleLabel || 'Teacher';
  const photo = metadata.avatar_url || metadata.picture || '';
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <aside className='sidebar'>
      <div className='brand'>
        <div className='brand-mark'>K</div>
        <div>
          <strong>Komeza</strong>
          <span>District workspace</span>
        </div>
      </div>
      <div className='teacher-card'>
        <button
          className='profile-trigger'
          type='button'
          onClick={() => setProfileOpen((open) => !open)}
          aria-expanded={profileOpen}
          aria-label='Open your profile'
        >
          {photo ? (
            <img className='avatar profile-photo' src={photo} alt='' />
          ) : (
            <span className='avatar'>{initials}</span>
          )}
          <span>
            <strong>{name}</strong>
            <small>{role}</small>
          </span>
        </button>
        {profileOpen && (
          <div className='profile-menu'>
            {photo ? (
              <img className='profile-menu-photo' src={photo} alt='' />
            ) : (
              <div className='profile-menu-photo avatar'>{initials}</div>
            )}
            <strong>{name}</strong>
            <span>{email}</span>
            <small>{role}</small>
            <button type='button' onClick={onLogout}>
              Sign out
            </button>
          </div>
        )}
      </div>
      <nav>
        {items.map(([key, label, icon]) => (
          <button
            key={key}
            className={page === key ? 'selected' : ''}
            onClick={() => setPage(key)}
          >
            <i>{icon}</i>
            {label}
          </button>
        ))}
      </nav>
      <div className='sidebar-footer'>
        <span>{scopeLabel}</span>
        <small>Need-to-know access</small>
      </div>
    </aside>
  );
}
