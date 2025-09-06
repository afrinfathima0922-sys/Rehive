import React, {useState} from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const nav = useNavigate();
  const submit = async e => {
    e.preventDefault();
    try {
      const res = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password })});
      localStorage.setItem('token', res.token);
      localStorage.setItem('userEmail', res.user.email);
      nav('/');
    } catch (err) {
      alert(err.error || 'Login failed');
    }
  };
  return (
    <div className="card">
      <h2>Sign in</h2>
      <form onSubmit={submit}>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} required/></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}

