import React from 'react'
import { Link } from 'react-router-dom'
import './dashboard.css'

function Sidebar() {
  return (
    <div>
      <nav className="sidebar">
        <div className='sidebar1'>
          <Link to="/Admin">  <img className='admin-pic' src="https://cdn3.iconfinder.com/data/icons/character/512/31-512.png" alt="" /></Link>
          <h1 className='admin-n'>Admin</h1>
          <h1 className='admin-e'>admin123@gmail.com</h1>
        </div>
        <div className='list'>
          <button className='lists'><Link className='links' to="/Admin/City"><h3>ADD NEW CITY</h3></Link> </button>
          <button className='lists'><Link className='links' to="/Admin/Type"><h3>ADD NEW JOB TYPE</h3></Link> </button>

          <button className='lists'><Link className='links' to="/Admin/CompanyList"><h3>COMPANY LISTS</h3></Link> </button>
          <button className='lists'><Link className='links' to="/Admin/SeekerList"><h3>SEEKER LISTS</h3></Link> </button>
          <button className='lists'><Link className='links' to="/Admin/JobList"><h3>JOB LISTS</h3></Link> </button>
          <button className='lists'><Link className='links' to="/Admin/Complaint"><h3>COMPLAINTS</h3></Link> </button>

        </div>
      </nav>
    </div>
  )
}

export default Sidebar