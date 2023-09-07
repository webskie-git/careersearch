import React, { useState, useEffect } from 'react';
import "./Homepageseeker.css"
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';


export default function Homepage() {
  const [navbarBackground, setNavbarBackground] = useState('transparent');
  const [companiesList, setCompaniesList] = useState([]);
  const [jobList, setJobList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');



  const handleScroll = () => {

    if (window.scrollY > 200) {
      setNavbarBackground('rgba(0, 0, 0, 1)');
    } else {
      setNavbarBackground('transparent');
    }
  };

  useEffect(() => {
    getAllCompanies();
    getAllJobs();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

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


  const applyForJob = async (jobId) => {
    try {

      const userId = sessionStorage.getItem('uid');
      const userName = sessionStorage.getItem('uname');
      const userResume = sessionStorage.getItem('uresume');

      const jobRef = doc(db, 'joblists', jobId);
      const jobSnapshot = await getDoc(jobRef);

      if (jobSnapshot.exists()) {
        const jobData = jobSnapshot.data();

        // console.log('jobData:', jobData);


        const existingApplicationRef = query(
          collection(db, 'userApplications'),
          where('applied_user_id', '==', userId),
          where('applied_job_id', '==', jobId)
        );
        const existingApplicationSnapshot = await getDocs(existingApplicationRef);

        if (existingApplicationSnapshot.empty) {
          // console.log('Job applied');
          alert('Job applied');


          const applicationData = {
            applied_user_id: userId,
            applied_user_name: userName,
            applied_job_id: jobId,
            appliedDateTime: new Date().toString(),
            status: 'applied',
            applied_job_title: jobData.job_title,
            applied_company_name: jobData.company_name,
            applied_user_resume: userResume,
            viewedByCompany: false,
          };

          await addDoc(collection(db, 'userApplications'), applicationData);
        } else {
          // console.log('Already applied');
          alert('Job Already applied');
        }
      }
    } catch (error) {
      console.error('Error applying for job:', error);
    }
  };

  const getAllCompanies = async () => {
    const companyQuerySnapshot = await getDocs(
      query(collection(db, "companies"))
    );
    const data = companyQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCompaniesList(data);
  };

  const logoutUser = () => {
    sessionStorage.removeItem('uid');
    sessionStorage.removeItem('uname');
    sessionStorage.removeItem("uresume");

    window.location.href = '/';

  };

  const filterJobs = (jobs) => {
    return jobs.filter((job) => {
      const jobTitle = (job.job_title || '').toLowerCase(); 
      const jobType = (job.job_type || '').toLowerCase(); 
      const jobSalary = (job.job_salary || '').toLowerCase(); 
      const jobCity = (job.location || '').toLowerCase(); 
      const jobKeywords = (job.keywords || '').toLowerCase(); 
      const query = searchQuery.toLowerCase();

      return (
        jobTitle.includes(query) ||
        jobType.includes(query) ||
        jobSalary.includes(query) ||
        jobCity.includes(query) ||
        jobKeywords.includes(query)
      );
    });
  };



  return (
    <div>
      {/* navbar */}
      <nav className="navbar" style={{ backgroundColor: navbarBackground }}>
        <h2 className='navbar-logo'><a href="#">CAREER <span className='careersearch'>SEARCH</span></a></h2>
        <div className="navbar-menu justify-content-end">
          <a href="#jobs" className="navbar-menu-item">Jobs</a>
          <a href="#companies" className="navbar-menu-item">Companies</a>
          <a href="/Seeker/JobDetails" className="navbar-menu-item">New jobs</a>
          <a href="/Seeker/ViewApplied" className="navbar-menu-item">View Job Applications</a>
          <a href="/Seeker/Complaints" className="navbar-menu-item">Complaints</a>

          <button onClick={logoutUser} className='btnLogout'>Log-Out</button>
        </div>
      </nav>

      {/* header */}
      <header className='mainheaderseeker'>
        <h1 className='header-title'>
          Best Place To<br /> <span>Grow Your Career</span> <br /> Easily
        </h1>
      </header>
      {/* search */}
      <div className="search-wrapper">
        <div className="search-box">
          <div className="search-card">
            <input className='search-input' type="text" placeholder='Job title, country' value={searchQuery}  onChange={(e) => setSearchQuery(e.target.value)} />
            <button className='search-button'>Type to Search</button>
          </div>
        </div>
      </div>
      {/* filter box */}
      <div className="filter-box">
        <div className="filter-dropdown">
          <select className='filter-select' name="job-level" id="job-level">
            <option value="">Job Level</option>
            <option value="">Entry</option>
            <option value="">Senior</option>
            <option value="">Director</option>
          </select>
          <select className='filter-select' name="job-function" id="job-function">
            <option value="">Job Function</option>
            <option value="">IT</option>
            <option value="">Management</option>
            <option value="">Education</option>
          </select>
          <select className='filter-select' name="employment" id="employment">
            <option value="">Employement Type</option>
            <option value="">Internship</option>
            <option value="">Part Time</option>
            <option value="">Full Time</option>
          </select>
          <select className='filter-select' name="location" id="location">
            <option value="">Locations</option>
            <option value="">Remort</option>
            <option value="">US</option>
            <option value="">UK</option>
          </select>
          <select className='filter-select' name="education" id="education">
            <option value="">Education</option>
            <option value="">High School</option>
            <option value="">Bachelor's Degree</option>
            <option value="">Master's Degree</option>
          </select>
        </div>
      </div>
      <section className='job-list' id='jobs'>
        {filterJobs(jobList).map((job, index) => (
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
              <p>Salary: {job.job_salary}</p>
            </div>
            <div className="job-label">
              <p>Location: {job.location}</p>
            </div>
            <div className="job-posted">
              <p>{job.job_level}</p>
            </div>
            <button className='apply-button' onClick={() => applyForJob(job.id)}>Apply</button>

          </div>
        ))}
      </section>

      {/* featured company */}
      <section className='featured' id='companies'>
        <h1 className='section-title'>Featured Companies</h1>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          Tempora voluptatibus doloribus accusantium officiis voluptatum. Qui debitis nobis, ipsum</p>
          <div className="featured-wrapper">
          {companiesList.map((company, index) => (

            <div className="featured-card" >
              <img className='featured-image' src={company.company_logo} alt="" />
              <p>{company.company_name}</p>

            </div>

            
            ))}
          </div>
      </section>

      {/* footer */}
      <footer className='footer'>
        <div className="footer-wrapper">
          <h3>CAREER SEARCH</h3>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Odio exercitationem pariatur quisquam repudiandae repellendus totam enim
            reprehenderit a perferendis non adipisci.</p>
          <div className="social-media">
            <a href="#Explore"><i className='fab fa-facebook-f'></i></a>
            <a href="#Explore"><i className='fab fa-twitter'></i></a>
            <a href="#Explore"><i className='fab fa-youtube'></i></a>
            <a href="#Explore"><i className='fab fa-linkedin-in'></i></a>
          </div>
        </div>
        <div className="footer-wrapper">
          <h4>Explore</h4>
          <a href="#Explore">Top Companies</a>
          <a href="#Explore">Terms of Service</a>
          <a href="#Explore">Podcast</a>
          <a href="#Explore">Careers</a>
        </div>
        <div className="footer-wrapper">
          <h4>About</h4>
          <a href="#FAQ">FAQ</a>
          <a href="#Get">Get Inspired</a>
          <a href="#Blog">Blog</a>
        </div>
        <div className="footer-wrapper">
          <h4>Support</h4>
          <a href="#Customer">Customer Services</a>
          <a href="#Trust">Trust & Safety</a>
          <a href="#Partnership">Partnership</a>
        </div>
        <div className="footer-wrapper">
          <h4>Community</h4>
          <a href="#Community">Community</a>
          <a href="#Invite">Invite a Friend</a>
          <a href="#Events">Events</a>
        </div>
      </footer>
    </div>
  )
}
