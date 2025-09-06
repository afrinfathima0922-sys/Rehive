import React from 'react';
export default function Dashboard(){
  const email = localStorage.getItem('userEmail');
  return (
    <div className="card">
      <h2>Dashboard</h2>
      {email ? <p>Signed in as {email}</p> : <p>Not signed in</p>}
      <p><a href="/create">Create listing</a></p>
    </div>
  );
}
