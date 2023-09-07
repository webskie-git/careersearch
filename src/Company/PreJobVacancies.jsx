import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../config/firebase';

export default function PreJobVacancies() {

  const [jobList, setJobList] = useState([]);
  const currentCompanyId = sessionStorage.getItem('cid');

  const jobsCollectionRef = collection(db, "joblists");

  // Function to fetch job data
  const fetchJobData = async () => {
    try {

      const q = query(jobsCollectionRef, where('company_id', '==', currentCompanyId));
      const querySnapshot = await getDocs(q);
      const jobData = [];
      querySnapshot.forEach((doc) => {
        jobData.push({ ...doc.data(), id: doc.id });
      });
      setJobList(jobData);
    } catch (error) {
      console.error("Error fetching job data: ", error);
    }
  };

  useEffect(() => {

    fetchJobData();
  }, [currentCompanyId]);

  const handleRemoveJob = async (id) => {
    try {
      await deleteDoc(doc(jobsCollectionRef, id));

      setJobList((prevJobList) => prevJobList.filter((job) => job.id !== id));
    } catch (error) {
      console.error("Error removing job vacancy: ", error);
    }
  };

  const companylogout = () => {
    sessionStorage.removeItem("cid");
    sessionStorage.removeItem("cname");

    window.location.href = '/';

  };


  return (
    <div>
      {/* navbar */}
      <nav className="navbarpre" >
        <h2 className='navbar-logo'><a href="/Company">CAREER <span className='careersearch'>SEARCH</span></a></h2>
        <div className="navbar-menu justify-content-end">
          <a href="/Company/NewJobVac" className="navbar-menu-item">Add New Vacancies</a>
          <a href="/Company/PrejobVac" className="navbar-menu-item">Pre-Job Vacancies</a>
          <a href="/Company/ViewApplications" className="navbar-menu-item">View Applications</a>
          <button onClick={companylogout} className='btnLogout'>Log-Out</button>
        </div>
      </nav>

      {
        jobList.length === 0 ? (
          <div className="job-card">
            <h3>There are currently no added job vacancies to display.</h3>
          </div>
        ) : (
        jobList.map((job, index) => (
          <div key={index}>
            <section className='job-list' id='jobs'>

              <div className="job-card">
                <div className="job-name">
                  <img className='job-profile' src={job.poster_url} alt="Job Poster" />
                  <div className="job-detail">
                    <h4>{job.job_title}</h4>
                    <h3>{job.job_type}</h3>
                    <p>{job.job_details}</p>
                  </div>
                </div>
                <div className="job-label">
                  <p>Location:{job.location}</p>
                </div>
                <div className="job-label">
                  <p>Salary:{job.job_salary}</p>
                </div>
                <div className="job-posted">
                  <p>{job.job_level}</p>
                </div>
                <button className='Removebtn' onClick={() => handleRemoveJob(job.id)}>Remove Post</button>
              </div>

              
            </section>
          </div>
        ))
      )}

    </div>
  )
}
