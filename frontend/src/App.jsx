import React, { useEffect, useMemo, useState } from 'react';
import {
  loadDatabaseAccessScope,
  loadLmsData,
} from './services/dataService';
import { combineStudentData, validData } from './utils/data';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import StudentProfile from './pages/StudentProfile';
import Interventions from './pages/Interventions';
import { isSupabaseConfigured, supabase } from './services/supabaseClient';
import { formatRole, getDatabaseAccessScope } from './utils/access';

const titles = {
  dashboard: 'Dashboard',
  students: 'My Students',
  academic: 'Academic Risk',
  dropout: 'Dropout Risk',
  interventions: 'Interventions',
};

export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage] = useState('dashboard');
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [accessScope, setAccessScope] = useState({
    schoolIds: new Set(),
    label: 'Loading access',
  });
  const [accessProfile, setAccessProfile] = useState(null);
  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return undefined;
    }
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession }, error: sessionError }) => {
        if (sessionError) throw sessionError;
        if (active) {
          setSession(currentSession);
          setAuthLoading(false);
        }
      })
      .catch((reason) => {
        if (active) {
          setError(`Unable to restore your session: ${reason.message}`);
          setAuthLoading(false);
        }
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) =>
      setSession(nextSession),
    );
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (!session) return undefined;
    let active = true;
    loadDatabaseAccessScope(session.user.id)
      .then(({ profile, assignments }) => {
        if (active) {
          setAccessProfile(profile);
          setAccessScope(getDatabaseAccessScope(profile, assignments));
        }
      })
      .catch((reason) => {
        if (active) setError(reason.message);
      });
    return () => {
      active = false;
    };
  }, [session]);
  useEffect(() => {
    if (!session) {
      setData(null);
      return undefined;
    }
    let active = true;
    loadLmsData(accessScope)
      .then((loaded) => {
        if (!validData(loaded))
          throw new Error(
            'The school data response is invalid or incomplete.',
          );
        if (active)
          setData({ ...loaded, students: combineStudentData(loaded) });
      })
      .catch((reason) => {
        if (active) setError(reason.message);
      });
    return () => {
      active = false;
    };
  }, [session, accessScope]);
  const students = data?.students || [];
  const openProfile = (student) => {
    if (student) {
      setSelected(student);
      setPage('profile');
    }
  };
  const logout = async () => {
    if (!supabase) {
      setSession(null);
      setData(null);
      return;
    }
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(`Unable to sign out: ${signOutError.message}`);
  };
  const login = async (email, password) => {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) throw signInError;
  };
  const content = useMemo(() => {
    if (!data)
      return (
        <div className='loading'>
          <div className='spinner' />
          <h2>Loading school data</h2>
          <p>Preparing your secure workspace...</p>
        </div>
      );
    if (!accessScope.schoolIds && !students.length)
      return (
        <div className='access-state'>
          <h2>No student records available</h2>
          <p>
            There are currently no student records in the district workspace.
          </p>
        </div>
      );
    if (accessScope.schoolIds?.size === 0)
      return (
        <div className='access-state'>
          <h2>School access is not configured</h2>
          <p>
            Your account is not assigned to a school. Contact a district
            official to request access.
          </p>
        </div>
      );
    if (accessScope.schoolIds?.size && !students.length)
      return (
        <div className='access-state'>
          <h2>No records for your school</h2>
          <p>
            Your account is scoped to {accessScope.label}, but no student
            records are available.
          </p>
        </div>
      );
    if (page === 'dashboard')
      return (
        <Dashboard
          students={students}
          onSelect={openProfile}
          setPage={setPage}
        />
      );
    if (page === 'students')
      return <StudentList students={students} onSelect={openProfile} />;
    if (page === 'academic')
      return (
        <StudentList
          students={students}
          onSelect={openProfile}
          mode='academic'
        />
      );
    if (page === 'dropout')
      return (
        <StudentList
          students={students}
          onSelect={openProfile}
          mode='dropout'
        />
      );
    if (page === 'interventions')
      return <Interventions students={students} onSelect={openProfile} />;
    if (page === 'profile')
      return selected ? (
        <StudentProfile
          student={selected}
          factors={data.factors}
          onBack={() => {
            setSelected(null);
            setPage('students');
          }}
        />
      ) : (
        <StudentList students={students} onSelect={openProfile} />
      );
    return null;
  }, [accessScope, data, page, selected, students]);
  if (authLoading)
    return (
      <div className='loading'>
        <div className='spinner' />
        <h2>Checking your session</h2>
        <p>Preparing your secure workspace...</p>
      </div>
    );
  if (!isSupabaseConfigured)
    return (
      <Login
        configurationError='Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env.local, then restart the dev server.'
        onLogin={login}
      />
    );
  if (!session) return <Login onLogin={login} />;
  const userName =
    accessProfile?.full_name ||
    session.user.user_metadata?.full_name ||
    session.user.email ||
    'Authenticated user';
  const userInitials = userName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <main className='app'>
      <Sidebar
        page={page}
        setPage={(next) => {
          setSelected(null);
          setPage(next);
        }}
        onLogout={logout}
        user={session.user}
        scopeLabel={accessScope.label}
        roleLabel={formatRole(accessProfile?.role)}
      />
      <div className='workspace'>
        <header className='topbar'>
          <div>
            <span className='mobile-brand'>Komeza</span>
            <h2>{page === 'profile' ? 'Student Profile' : titles[page]}</h2>
          </div>
          <div className='topbar-meta'>
            <span className='status-dot' /> {accessScope.label} ·{' '}
            {formatRole(accessProfile?.role)} · {userName}{' '}
            <span className='topbar-avatar'>{userInitials}</span>
          </div>
        </header>
        {error ? (
          <div className='error-state'>
            <strong>Unable to load the school data</strong>
            <p>{error}</p>
            <button
              className='text-button'
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : (
          content
        )}
      </div>
    </main>
  );
}
