const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';


export async function fetchUser(email){
const res = await fetch(`${API_BASE}/user/${encodeURIComponent(email)}`);
if (!res.ok) throw new Error(await res.text());
return res.json();
}


export async function fetchDrive(driveId){
const res = await fetch(`${API_BASE}/drive/${encodeURIComponent(driveId)}`);
if (!res.ok) throw new Error(await res.text());
return res.json();
}


export async function fetchGroup(groupEmail){
const res = await fetch(`${API_BASE}/group/${encodeURIComponent(groupEmail)}`);
if (!res.ok) throw new Error(await res.text());
return res.json();
}