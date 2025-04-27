import { useState } from 'react';
import './Login.css';
import newspaperImg from '../assets/newspaper.png';
import { createUser } from './createUser';  // Use relative path if it's in the same folder

function Login() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [classroom, setClassroom] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {  
    e.preventDefault();
    const endpoint = mode === 'login' ? '/login' : '/register';
    const payload = mode === 'login'
      ? { username, password }
      : { username, password, classroom };

    if (mode === 'register') {
      // Use createUser function for registration
      try {
        await createUser(username, password, classroom);  // Call the createUser function here
        setMessage('Account created successfully!');
        console.log('Account created successfully!');
      } catch (err) {
        setMessage('Error creating account: ' + err.message);
        console.log('Error creating account:', err);
      }
    } else {
      // Handle login here
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      setMessage(text);

      if (res.ok) {
        console.log('Login successful!');
      } else {
        console.log('Login failed');
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="mode-toggle">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Login
          </button>

          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <h1 className="login-title">
          {mode === 'login' ? 'Current Events Login' : 'Account Registration'}
        </h1>

        <img className="login-icon" src={newspaperImg} alt="Login Icon" />

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="login-input"
            required
          /><br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-input"
            required
          /><br />

          {mode === 'register' && (
            <>
              <input
                type="text"
                placeholder="Classroom"
                value={classroom}
                onChange={e => setClassroom(e.target.value)}
                className="login-input"
                required
              />
              <br />
            </>
          )}

          <button type="submit" className="login-button">
            {mode === 'login' ? 'Login' : 'Create Account'}
          </button>
          <p>{message}</p>
        </form>
      </div>
    </div>
  );
}

export default Login;
