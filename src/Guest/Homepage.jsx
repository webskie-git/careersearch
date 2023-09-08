import React, { useState, useEffect } from 'react';
import "./Homepage.css";
import "./Navbar.css";
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link, useNavigate } from 'react-router-dom';

export default function Homepage() {

  const [companiesList, setCompaniesList] = useState([]);
  const [jobList, setJobList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const Navigate = useNavigate()

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

  const filterJobs = (jobs) => {
    return jobs.filter((job) => {
      const jobTitle = (job.job_title || '').toLowerCase(); 
      const jobCity = (job.location || '').toLowerCase(); 
      const jobKeywords = (job.keywords || '').toLowerCase(); 
      const query = searchQuery.toLowerCase();

      return (
        jobTitle.includes(query) ||
        jobCity.includes(query) ||
        jobKeywords.includes(query)
      );
    });
  };

  const handleJoinButtonClick = () => {
    Navigate('/Login')
  };



  return (
    <div>
      <nav className="navbar" style={{ backgroundColor: navbarBackground }}>
        <h2 className='navbar-logo'><a href="#">CAREER <span className='careersearch'>SEARCH</span></a></h2>
        <div className="navbar-menu justify-content-end">
          <a href="#jobs" className="navbar-menu-item">Jobs</a>
          <a href="#companies" className="navbar-menu-item">Companies</a>
          <a href="#testimonial" className="navbar-menu-item">Testimonial</a>
          <a href="/CompanyReg" className="navbar-menu-item">Company Reg</a>
          <a href="/SeekerReg" className="navbar-menu-item">Seeker Reg</a>
          <a href="/Login" className="navbar-menu-item">Log-In</a>

        </div>
      </nav>
      {/* header */}
      <header className='mainheader'>
        <h1 className='header-title'>
          Best Place To<br /> <span>Grow Your Career</span> <br /> Easily
        </h1>
      </header>
      {/* search */}
      <div className="search-wrapper">
        <div className="search-box">
          <div className="search-card">
            <input className='search-input' type="text" placeholder='Job title, Country'  value={searchQuery}  onChange={(e) => setSearchQuery(e.target.value)} />
            <button className='search-button'>Type to Search</button>
          </div>
        </div>
      </div>

      {/* job listing */}
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
              <p>Location: {job.location}</p>
            </div>
            <div className="job-posted">
              <p>{job.job_level}</p>
            </div>

          </div>
        ))}
      </section>

      {/* join */}
      <section className='join'>
        <div className="join-detail">
          <h1 className='section-title'>LET START YOUR NEW JOB WITH US</h1>
          <p>Your first job will be filled with moments of, “I’m not sure how to do this,” or “I never learned this in school.”
             Take a page out of the former Yahoo CEO’s book and push through the moments of uncertainty.  But remember that pushing through doesn’t always mean keeping your head down and working through it. It can mean reaching out to your supervisor or coworker if you feel lost and pushing through with a little guidance.</p>
        </div>
        <button onClick={handleJoinButtonClick} className='join-button'>Join now</button>
      </section>

      {/* featured company */}
      <section className='featured' id='companies'>
        <h1 className='section-title'>Featured Companies</h1>
        <p>As your digital enablement partner,
           we apply our talent-first approach to accelerate your digital journey,
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

      {/*testimoni  */}
      <section className="testimonial" id="testimonial">
        <div className="container1">
          <div className="row">
            <div className="main-heading">
              <p>What Say Our Client</p>
              <h2>Our Success <span>Stories</span></h2></div>
          </div>
          <div className="row2">
            <div id="client-testimonial-slider">
              <div className="client-testimonial">
                <div className="pic">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUhOeKafTGJfok0AnWc_7KDEDdj63F_sUQQwFX11o20DbRx1S_1cIwZI8pT0tjQ7TkJ3g&usqp=CAU" alt="" />
                </div>
                <p className="client-description">It's always a pleasure to work with Career Search. They are personable, responsive, and results-oriented!</p>
                <h3 className="client-testimonial-title">Lacky Mole</h3>
                <ul className="client-testimonial-rating">
                  <li className="fa fa-star-o"></li>
                  <li className="fa fa-star-o"></li>
                  <li className="fa fa-star"></li>
                </ul>
              </div>
              <div className="client-testimonial">
                <div className="pic">
                  <img src="https://media.istockphoto.com/id/1200677760/photo/portrait-of-handsome-smiling-young-man-with-crossed-arms.jpg?s=612x612&w=0&k=20&c=g_ZmKDpK9VEEzWw4vJ6O577ENGLTOcrvYeiLxi8mVuo=" alt="" />
                </div>
                <p className="client-description">Always available to answer any questions. Very knowledgeable about the services they provide. Would recommend to anyone!</p>
                <h3 className="client-testimonial-title">Karan Wessi</h3>
                <ul className="client-testimonial-rating">
                  <li className="fa fa-star-o"></li>
                  <li className="fa fa-star"></li>
                  <li className="fa fa-star"></li>
                </ul>
              </div>
              <div className="client-testimonial">
                <div className="pic">
                  <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?cs=srgb&dl=pexels-andrea-piacquadio-774909.jpg&fm=jpg" alt="" />
                </div>
                <p className="client-description">Great results. Enjoyable to work with, and most importantly, enabled us to have the presence on the web we needed to conduct business in today's market.</p>
                <h3 className="client-testimonial-title">Roul Pinchai</h3>
                <ul className="client-testimonial-rating">
                  <li className="fa fa-star-o"></li>
                  <li className="fa fa-star"></li>
                  <li className="fa fa-star"></li>
                </ul>
              </div>
              <div className="client-testimonial">
                <div className="pic">
                  <img src="https://thumbs.dreamstime.com/b/portrait-charming-european-girl-years-old-has-beautiful-wavy-loose-hair-182448296.jpg" alt="" />
                </div>
                <p className="client-description">I'm incredibly impressed with Career Search. Our developer communicates with me every day, and is a very powerful coder. He's a true professional and his work is just excellent.</p>
                <h3 className="client-testimonial-title">Adam Jinna</h3>
                <ul className="client-testimonial-rating">
                  <li className="fa fa-star-o"></li>
                  <li className="fa fa-star"></li>
                  <li className="fa fa-star"></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* footer */}
      <footer className='footer'>
        <div className="footer-wrapper">
          <h3>CAREER SEARCH</h3>
          <p>As your digital enablement partner, we apply our talent-first approach to accelerate your digital journey,
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
