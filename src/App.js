import React from 'react'
import GuestApp from './Guest/App'
import CompanyApp from './Company/App'
import SeekerApp from './Seeker/App'
import AdminApp from './Admin/App'
import { Route, Routes } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/Admin/*" element={<AdminApp />} />
      <Route path="/Seeker/*" element={<SeekerApp />} />
      <Route path="/Company/*" element={<CompanyApp />} />
      <Route path="/*" element={<GuestApp />} />
    </Routes>
  )
}
