import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ViewApplications() {

  const logoutUser = () => {
    sessionStorage.removeItem("uid");
    sessionStorage.removeItem("uname");
    sessionStorage.removeItem("uresume");


    window.location.href = '/';

  };  
  const [userApplications, setUserApplications] = useState([]);

  useEffect(() => {

    const userId = sessionStorage.getItem('uid');

    const userApplicationsQuery = query(
      collection(db, 'userApplications'),
      where('applied_user_id', '==', userId)
    );

    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(userApplicationsQuery);
        const applicationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserApplications(applicationsData);
      } catch (error) {
        console.error('Error fetching user applications:', error);
      }
    };

    fetchData();


  }, []);

  return (
    <div className='main-div'>
      {/* navbar */}
      <nav className="navbarpre" >
        <h2 className='navbar-logo'><a href="/Seeker">CAREER <span className='careersearch'>SEARCH</span></a></h2>
        <div className="navbar-menu justify-content-end">
          <a href="/Seeker#jobs" className="navbar-menu-item">Jobs</a>
          <a href="/Seeker#companies" className="navbar-menu-item">Companies</a>
          <a href="/Seeker/JobDetails" className="navbar-menu-item">New jobs</a>
          <a href="/Seeker/ViewApplied" className="navbar-menu-item">View Job Applications</a>
          <button onClick={logoutUser} className='btnLogout'>Log-Out</button>
        </div>
      </nav>

      <h1 className='header-h1'>Application Submitted List</h1>

      <table className='JobTable' border="1">
        <tr className='Job-tr'>
          <th className='Job-th'>Sl.No</th>
          <th className='Job-th'>Date Applied</th>
          <th className='Job-th'>Job Title</th>
          <th className='Job-th'>Company Name</th>
          <th className='Job-th'>Position Applied</th>
          <th className='Job-th'>Status</th>
        </tr>
        {userApplications.map((application, index) => (
          <tr key={application.id} className='Job-tr'>
            <td className='Job-td'>{index + 1}</td>
            <td className='Job-td'>{application.appliedDateTime.length > 12 ?
              `${application.appliedDateTime.substring(0, 15)}` : application.appliedDateTime}</td>
            <td className='Job-td'>{application.applied_job_title}</td>
            <td className='Job-td'>{application.applied_company_name}</td>
            <td className='Job-td'>{application.applied_job_title}</td>
            <td className='Job-td'>
              <button className='verify'>{application.status}</button>
              <button className='verify'>Chat</button>
              <button className='verify'>Video</button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
