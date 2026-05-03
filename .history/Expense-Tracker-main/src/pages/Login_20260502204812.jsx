import React, { useState } from 'react';

const styles = `
.auth-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  padding: 1.5rem;
}
.auth-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--r);
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}
.auth-logo {
  font-family: 'DM Serif Display', serif;
  font-size: 30px;
  text-align: center;
  margin-bottom: 4px;
  color: var(--text);
}
.auth-logo em { font-style: italic; color: var(--green); }
.auth-tagline {
  text-align: center;
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 2rem;
}
.auth-tabs {
  display: flex;
  background: var(--bg);
  border-radius: var(--r-sm);
  padding: 3px;
  gap: 3px;
  margin-bottom: 1.5rem;
}
.auth-tab {
  flex: 1;
  padding: 7px;
  border: none;
  background: none;
  border-radius: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  color: var(--muted);
  transition: all 0.15s;
}
.auth-tab.active {
  background: #fff;
  color: var(--text);
  box-shadow: 0 1px 3px rgba(0,0,0,0.09);
}
.field { margin-bottom: 1rem; }
.field label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}
.field input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  background: var(--bg);
  color: var(--text);
  outline: none;
  transition: border 0.15s;
}
.field input:focus { border-color: #999; background: #fff; }
.btn-primary {
  width: 100%;
  padding: 11px;
  background: var(--text);
  color: #fff;
  border: none;
  border-radius: var(--r-sm);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.25rem;
  transition: opacity 0.15s;
}
.btn-primary:hover { opacity: 0.82; }
.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 1.25rem 0;
  color: var(--muted);
  font-size: 12px;
}
.auth-divider::before, .auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}
.google-btn {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  background: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;
}
.google-btn:hover { background: var(--bg); }
.auth-error {
  background: #FCEBEB;
  color: var(--red);
  border-radius: var(--r-sm);
  padding: 9px 12px;
  font-size: 13px;
  margin-bottom: 1rem;
}
`;

export default function Login({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Wire up your Firebase auth here ──
  // import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
  // import { auth } from '../firebase';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Replace below with real Firebase calls:
      // if (tab === 'login') {
      //   const cred = await signInWithEmailAndPassword(auth, form.email, form.password);
      //   onLogin(cred.user);
      // } else {
      //   const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      //   onLogin(cred.user);
      // }

      // DEMO: fake login
      onLogin({ displayName: form.name || 'User', email: form.email });
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    }
  };

  const handleGoogle = async () => {
    try {
      // const provider = new GoogleAuthProvider();
      // const cred = await signInWithPopup(auth, provider);
      // onLogin(cred.user);

      // DEMO:
      onLogin({ displayName: 'Arjun Kumar', email: 'arjun@example.com' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-bg">
        <div className="auth-card">
          <div className="auth-logo">Expense<em>ly</em></div>
          <div className="auth-tagline">Track every rupee, effortlessly</div>

          <div className="auth-tabs">
            {['login', 'signup'].map(t => (
              <button key={t} className={`auth-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t === 'login' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {tab === 'signup' && (
              <div className="field">
                <label>Full name</label>
                <input name="name" placeholder="Arjun Kumar" value={form.name} onChange={handleChange} required />
              </div>
            )}
            <div className="field">
              <label>Email</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="field">
              <label>Password</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <button className="btn-primary" type="submit">
              {tab === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <button className="google-btn" onClick={handleGoogle}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </>
  );
}