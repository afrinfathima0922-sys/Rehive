import React, {useState} from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

export default function CreateListing(){
  const [title,setTitle]=useState(''); const [desc,setDesc]=useState(''); const [price,setPrice]=useState(''); const [loc,setLoc]=useState('');
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await api('/listings', { method: 'POST', body: JSON.stringify({ title, description: desc, price: parseFloat(price||0), location: loc }), headers: { Authorization: `Bearer ${token}` }});
      nav(`/listing/${res.listing.id}`);
    } catch (err) {
      alert(err.error || 'Failed');
    }
  };
  return (
    <div className="card">
      <h2>Create Listing</h2>
      <form onSubmit={submit}>
        <label>Title<input value={title} onChange={e=>setTitle(e.target.value)} required/></label>
        <label>Description<textarea value={desc} onChange={e=>setDesc(e.target.value)} /></label>
        <label>Price<input value={price} onChange={e=>setPrice(e.target.value)} /></label>
        <label>Location<input value={loc} onChange={e=>setLoc(e.target.value)} /></label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

