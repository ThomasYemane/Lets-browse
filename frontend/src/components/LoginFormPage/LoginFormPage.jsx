import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { login } from '../../store/session';
import './LoginForm.css';

export default function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  // If already logged in, go home
  if (sessionUser) return <Navigate to="/" replace />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    dispatch(login({ credential, password })).catch(async (res) => {
      try {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      } catch {
        setErrors({ credential: 'Something went wrong.' });
      }
    });
  };

  return (
    <div className="login-wrap">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {errors.credential && <p className="error">{errors.credential}</p>}

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
