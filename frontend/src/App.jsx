import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import UserLookup from './pages/UserLookup'
import SharedDriveLookup from './pages/SharedDriveLookup'
import GroupLookup from './pages/GroupLookup'


export default function App(){
return (
<div className="app-root">
<NavBar />
<main className="container">
<Routes>
<Route path="/" element={<UserLookup />} />
<Route path="/drive" element={<SharedDriveLookup />} />
<Route path="/group" element={<GroupLookup />} />
</Routes>
</main>
</div>
)
}

