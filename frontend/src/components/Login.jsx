import React, { useState } from 'react';

export default function Login({ onLogin, configurationError = '' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(configurationError);
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email.trim(), password);
    } catch (reason) {
      setError(reason.message || 'Unable to sign in. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return <main className="login-page"><section className="login-card"><div className="brand login-brand"><div className="brand-mark">K</div><div><strong>Komeza</strong><span>Teacher workspace</span></div></div><p className="eyebrow">Secure workspace access</p><h1>Welcome back</h1><p className="login-copy">Sign in with your Komeza account to review student support data.</p><form onSubmit={submit}><label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{error && <p className="error-state">{error}</p>}<button className="primary full" type="submit" disabled={loading || Boolean(configurationError)}>{loading ? 'Signing in...' : 'Sign in'}</button></form><small className="login-note">Authentication is managed securely by Supabase.</small></section></main>;
}
