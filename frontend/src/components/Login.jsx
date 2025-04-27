import { useState } from 'react';
import { useNavigate } from 'react-router';
import './Login.css';
import newspaperImg from '../assets/newspaper.png';
import { createUser } from './createUser';  // Use relative path if it's in the same folder

function Login() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [classroom, setClassroom] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(e) {  
    e.preventDefault();
    const payload = mode === 'login'
      ? { username, password }
      : { username, password, classroom };

    if (mode === 'register') {
      try {
        await createUser(username, password, classroom);  // Call the createUser function here
        setMessage('Account created successfully! Go to login.');
        console.log('Account created successfully!');
      } catch (err) {
        setMessage('Error creating account: ' + err.message);
        console.log('Error creating account:', err);
      }
    } else {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      setMessage(text);

      if (res.ok) {
        localStorage.setItem('username', username); // Save username to local storage
        localStorage.setItem('classroom', classroom); // Save classroom to local storage
        navigate('/newsquiz');
        console.log('Login successful!');

        // Fetch and log all users with their classrooms and streaks
        const usersRes = await fetch('http://localhost:3000/getAllUsers');
        const usersData = await usersRes.json();
        localStorage.setItem('usersData', JSON.stringify(usersData)); // Save users data to local storage
        // Log the users data as an object in the console, which includes streak
        console.log('List of All Users with Streaks:', usersData);
      } else {
        console.log('Login failed');
      }
    }
  }

  return (
    
    <div className="login-container">
      <img className="login-icon" src={newspaperImg} alt="Login Icon" />

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
          {mode === 'login' ? 'Login' : 'Account Registration'}
        </h1>


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
              {message && <p className="message">{message}</p>}
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
