import React from 'react'
import Dashboard from './Dashboard'
import City from './City'
import Type from './Type'
import CompanyList from './CompanyList'
import JobPostList from './JobPostList'
import SeekerList from './SeekerList'
import Complaints from './Complaints'
import { Route, Routes } from 'react-router-dom'

export default function AdminApp() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/City" element={<City />} />
      <Route path="/Type" element={<Type />} />
      <Route path="/CompanyList" element={<CompanyList />} />
      <Route path="/JobList" element={<JobPostList />} />
      <Route path="/SeekerList" element={<SeekerList />} />
      <Route path="/Complaint" element={<Complaints />} />
    </Routes>
  )
}
