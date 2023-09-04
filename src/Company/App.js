import React from 'react';
import { Route, Routes } from 'react-router-dom'
import Homepage from './Homepage'
import NewJobVacancy from './NewJobVacancy';
import ViewApplications from './ViewApplications';
import PreJobVacancies from './PreJobVacancies';

export default function CompanyApp() {

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/NewJobVac" element={<NewJobVacancy />} />
      <Route path="/ViewApplications" element={<ViewApplications />} />
      <Route path="/PrejobVac" element={<PreJobVacancies />} />
    </Routes>
  )
}
