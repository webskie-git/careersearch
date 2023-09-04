import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../config/firebase';

export default function JobDetails() {

  const [jobList, setJobList] = useState([]);

  useEffect(() => {
   
    getAllJobs();

  }, []);

  const getAllJobs = async () => {
    const jobQuerySnapshot = await getDocs(
      query(collection(db, "joblists"))
    );
    const data = jobQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setJobList(data);
  };

  const logoutUser = () => {
    sessionStorage.removeItem('uid');
    sessionStorage.removeItem('uname');
    sessionStorage.removeItem("uresume");

    window.location.href = '/';

  };

  return (
    <div>
      {/* navbar */}
      <nav className="navbarpre" >
        <h2 className='navbar-logo'><a href="/Seeker">CAREER <span className='careersearch'>SEARCH</span></a></h2>
        <div className="navbar-menu justify-content-end">
          <a href="#jobs" className="navbar-menu-item">Jobs</a>
          <a href="#companies" className="navbar-menu-item">Companies</a>
          <a href="/Seeker/JobDetails" className="navbar-menu-item">New jobs</a>
          <a href="/Seeker/ViewApplied" className="navbar-menu-item">View Job Applications</a>
          <button onClick={logoutUser} className='btnLogout'>Log-Out</button>
        </div>
      </nav>

      <div>
        <section className='job-list' id='jobs'>
        {jobList.map((job, index) => (
          <div key={index} className="job-card">
            <div className="job-name">
              <img className='job-profile' src={job.poster_url} alt="Job Poster" />
              <div className="job-detail">
                <h4>{job.job_title}</h4>
                <h3>{job.job_type}</h3>
                <p>{job.job_details}</p>
              
              </div>
            </div>
            <div className="job-label">
              <p>Location: {job.location}</p>
            </div>
            <div className="job-posted">
              <p>{job.job_level}</p>
            </div>
          </div>
        ))}

         
        </section>
      </div>
    </div>
  )
}
