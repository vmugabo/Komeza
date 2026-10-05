import React, { useEffect, useMemo, useState } from 'react';
import { loadLmsData } from './services/csvService';
import { combineStudentData, validData } from './utils/data';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import SchoolDirectory from './pages/SchoolDirectory';
import StudentProfile from './pages/StudentProfile';
import Interventions from './pages/Interventions';

const titles = { dashboard: 'Dashboard', school: 'School / Grades', students: 'School / Grades', academic: 'Academic Risk', dropout: 'Dropout Risk', interventions: 'Interventions' };

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('komeza-logged-in') === 'true');
  const [page, setPage] = useState('dashboard');
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { loadLmsData().then((loaded) => { if (!validData(loaded)) throw new Error('One or more required data files are empty or invalid.'); setData({ ...loaded, students: combineStudentData(loaded) }); }).catch((reason) => setError(reason.message)); }, []);
  const students = data?.students || [];
  const openProfile = (student) => { if (student) { setSelected(student); setPage('profile'); } };
  const logout = () => { localStorage.removeItem('komeza-logged-in'); setLoggedIn(false); };
  const login = () => { localStorage.setItem('komeza-logged-in', 'true'); setLoggedIn(true); };
  const content = useMemo(() => {
    if (!data) return <div className="loading"><div className="spinner" /><h2>Loading class data</h2><p>Preparing the district workspace...</p></div>;
    if (page === 'dashboard') return <Dashboard students={students} onSelect={openProfile} setPage={setPage} />;
    if (page === 'school' || page === 'students') return <SchoolDirectory students={students} onSelect={openProfile} />;
    if (page === 'academic') return <StudentList students={students} onSelect={openProfile} mode="academic" />;
    if (page === 'dropout') return <StudentList students={students} onSelect={openProfile} mode="dropout" />;
    if (page === 'interventions') return <Interventions students={students} onSelect={openProfile} />;
    if (page === 'profile') return selected ? <StudentProfile student={selected} factors={data.factors} onBack={() => { setSelected(null); setPage('students'); }} /> : <StudentList students={students} onSelect={openProfile} />;
    return null;
  }, [data, page, selected, students]);
  if (!loggedIn) return <Login onLogin={login} />;
  return <main className="app"><Sidebar page={page} setPage={(next) => { setSelected(null); setPage(next); }} onLogout={logout} /><div className="workspace"><header className="topbar"><div><span className="mobile-brand">Komeza</span><h2>{page === 'profile' ? 'Student Profile' : titles[page]}</h2></div><div className="topbar-meta"><span className="status-dot" /> Data loaded <span className="topbar-avatar">JM</span></div></header>{error ? <div className="error-state"><strong>Unable to load the class data</strong><p>{error}</p><button className="text-button" onClick={() => window.location.reload()}>Try again</button></div> : content}</div></main>;
}
