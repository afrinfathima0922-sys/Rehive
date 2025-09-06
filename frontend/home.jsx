import React, {useEffect, useState} from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';

export default function Home(){
  const [listings, setListings] = useState([]);
  useEffect(()=>{ api('/listings').then(d=>setListings(d.listings)).catch(()=>{}); }, []);
  return (
    <div className="container">
      <h2>Listings</h2>
      <div className="grid">
        {listings.map(l=>(
          <div key={l.id} className="card">
            <h3>{l.title}</h3>
            <p>{l.description?.slice(0,120)}</p>
            <p><small>{l.location} • ${l.price}</small></p>
            <Link to={`/listing/${l.id}`}>View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
