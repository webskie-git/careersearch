import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Homepage from './Homepage'
import CompanyRegistration from './CompanyRegistration'
import SeekerRegistration from './SeekerRegistration'
import Login from './Login'

export default function GuestApp() {
  
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/CompanyReg" element={<CompanyRegistration />} />
      <Route path="/SeekerReg" element={<SeekerRegistration />} />
      <Route path="/Login" element={<Login />} />
    </Routes>
  )
}
