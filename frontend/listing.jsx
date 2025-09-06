import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Listing(){
  const { id } = useParams();
  const nav = useNavigate();
  const [listing, setListing] = useState(null);
  useEffect(()=>{ api(`/listings/${id}`).then(d=>setListing(d.listing)).catch(()=>{}); }, [id]);
  const remove = async () => {
    if(!confirm('Delete?')) return;
    const token = localStorage.getItem('token');
    await api(`/listings/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` }});
    nav('/');
  };
  if(!listing) return <div className="card">Loading...</div>;
  const owner = localStorage.getItem('userEmail') === listing.owner_email;
  return (
    <div className="card">
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
      <p><strong>${listing.price}</strong> • {listing.location}</p>
      <p>Owner: {listing.owner_email}</p>
      {owner && <div><button onClick={remove}>Delete</button></div>}
    </div>
  );
}
