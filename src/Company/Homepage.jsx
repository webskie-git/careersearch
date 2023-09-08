import React, { useState, useEffect } from 'react';
import "./Homepagecom.css"
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../config/firebase';


export default function Homepage() {

  const [companiesList, setCompaniesList] = useState([]);
  const [jobList, setJobList] = useState([]);


  const [navbarBackground, setNavbarBackground] = useState('transparent');


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


  const companylogout = () => {
    sessionStorage.removeItem("cid");
    sessionStorage.removeItem("cname");

    window.location.href = '/';

  };

  
  return (
    <div>
      {/* navbar */}
      <nav className="navbar" style={{ backgroundColor: navbarBackground }}>
        <h2 className='navbar-logo'><a href="#">CAREER <span className='careersearch'>SEARCH</span></a></h2>
        <div className="navbar-menu justify-content-end">
          <a href="/Company/NewJobVac" className="navbar-menu-item">Add New Vacancies</a>
          <a href="/Company/PrejobVac" className="navbar-menu-item">Pre-Job Vacancies</a>
          <a href="/Company/ViewApplications" className="navbar-menu-item">View Applications</a>
          <button onClick={companylogout} className='btnLogout'>Log-Out</button>
        </div>
      </nav>

      {/* header */}
      <header className='mainheadercomp'>
        <h1 className='header-title'>
          Best Place To<br /> <span>Grow Your Company</span> <br /> Easily
        </h1>
      </header>

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

      {/* featured company */}
      <section className='featured' id='companies'>
        <h1 className='section-title'>Featured Companies</h1>
        <p>As your digital enablement partner, we apply our talent-first approach to accelerate your digital journey,
           helping you unleash your potential and unlock unseen opportunities.</p>
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
          <p>As your digital enablement partner,
             we apply our talent-first approach to accelerate your digital journey,
              helping you unleash your potential and unlock unseen opportunities.</p>
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
