import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8000/users?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();

      if (data.length > 0) {
        localStorage.setItem('user', JSON.stringify(data[0]));
        setStatus('Login successful!');
        navigate('/'); 
      } else {
        setStatus('User not found');
      }
    } catch (err) {
      console.error(err);
      setStatus('Error logging in');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>{status}</p>
    </div>
  );
};
