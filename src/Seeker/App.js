import React from 'react'
import { Route, Routes } from 'react-router-dom'
import JobDetails from './JobDetails'
import Homepage from "./Homepage"
import ViewApplication from './ViewApplication'


export default function SeekerApp() {
  return (
<Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/JobDetails" element={<JobDetails />} />
      <Route path="/ViewApplied" element={<ViewApplication />} />
    </Routes>  )
}
