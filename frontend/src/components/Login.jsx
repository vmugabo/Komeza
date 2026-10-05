import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('teacher@komeza.local');
  return <main className="login-page"><section className="login-card"><div className="brand login-brand"><div className="brand-mark">K</div><div><strong>Komeza</strong><span>Teacher workspace</span></div></div><p className="eyebrow">Local demo access</p><h1>Welcome back</h1><p className="login-copy">Sign in to review your class data and follow up with students who need support.</p><label>Email address<input value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input type="password" defaultValue="teacher" /></label><button className="primary full" onClick={() => onLogin(email)}>Sign in</button><small className="login-note">This is a local demonstration. No account is sent anywhere.</small></section></main>;
}
