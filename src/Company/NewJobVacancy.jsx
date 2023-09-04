import React, { useState } from 'react'
import { db, storage } from '../config/firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Navigate } from 'react-router-dom';

export default function NewJobVacancy() {

  const [jobTitle, setJobTitle] = useState('');
  const [jobDetails, setJobDetails] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [poster, setPoster] = useState("");
  const [redirect, setRedirect] = useState(false)
  const [jobLevel, setJobLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const jobsCollectionRef = collection(db, "joblists");
  const storageRef = ref(storage, "posters");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const companyId = sessionStorage.getItem("cid");
      const companyName = sessionStorage.getItem('cname');

      if (!companyId) {
        throw new Error("Company ID not found in session storage");
      }
      const jobData = {
        job_title: jobTitle,
        job_details: jobDetails,
        job_type: jobType,
        location: location,
        job_level: jobLevel,
        company_id: companyId,
        company_name: companyName,


      };
      const docRef = await addDoc(jobsCollectionRef, jobData);
      const docId = docRef.id;

      const posterRef = ref(storageRef, `${docId}_poster.jpg`);
      await uploadBytes(posterRef, poster);

      const posterURL = await getDownloadURL(posterRef);

      await updateDoc(doc(jobsCollectionRef, docId), {
        poster_url: posterURL,
      });

      alert("Job vacancy added successfully!");

      setJobTitle('');
      setJobDetails('');
      setJobType('');
      setLocation('');
      setJobLevel('');
      setPoster(null);
      setIsLoading(false);


      setRedirect(true);

    } catch (error) {
      console.error("Error adding job vacancy: ", error);
      setIsLoading(false);
      alert("An error occurred while adding the job vacancy. Please try again.");
    }
  };
  if (redirect) {
    return <Navigate to={'/Company'} />
  }

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

      <div>
        <section className='secReg'>
          <div className="form-box-2">
            <div className="form-value">
              <form onSubmit={handleSubmit}>
                <h2 className='formname'>Add New Vacancies</h2>
                <div className="inputbox">
                  <input className="inputtext" name="name" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} type="text" required />
                  <label >Job Title :-</label>
                </div>

                <div className="inputbox">
                  <input className="inputtext" name="email" value={jobDetails} onChange={(e) => setJobDetails(e.target.value)} type="text" required />
                  <label >Job Details :-</label>
                </div>

                <div className='inputbox'>
                  <select className='city-select' value={jobType} onChange={(e) => setJobType(e.target.value)} name="jobtype" >
                    <option className='city-option' value="#">---select---</option>
                    <option className='city-option' value="Web Developer">Web Developer</option>
                    <option className='city-option' value="Human Resourse Manager">Human Resourse Manager</option>
                    <option className='city-option' value="Accoutant">Accoutant</option>
                    <option className='city-option' value="Lawyer">Lawyer</option>
                    <option className='city-option' value="Nuclear Engineer">Nuclear Engineer</option>
                    <option className='city-option' value="Registered Nurse">Registered Nurse</option>
                    <option className='city-option' value="High School Teacher">High School Teacher</option>
                    <option className='city-option' value="Database Administrator">Database Administrator</option>
                    <option className='city-option' value="Online Educators">Online Educators</option>

                  </select>
                  <label >Job Type :-</label>
                </div>

                <div className='inputbox'>
                  <select value={location} onChange={(e) => setLocation(e.target.value)} className='city-select' name="location" >
                    <option className='city-option' value="#">---select---</option>
                    <option className='city-option' value="INDIA">INDIA</option>
                    <option className='city-option' value="US">US</option>
                    <option className='city-option' value="UK">UK</option>
                  </select>
                  <label >Location :-</label>
                </div>

                <div className="inputboxfile">
                  <input className="proof" onChange={(e) => setPoster(e.target.files[0])} name="file" type="file" required />
                  <label >Job Poster :-</label>
                </div>

                <div className="inputboxfile">
                  <form className='Radiobtn'>
                    <input className="inputtext" type="radio" id="Internship" name="joblvl" value="Internship"
                      checked={jobLevel === "Internship"}
                      onChange={() => setJobLevel("Internship")}
                    />
                    <p className='rdbtn' for="male">Internship</p>

                    <input className="inputtext" type="radio" id="Full-Time" name="joblvl" value="Full-Time"
                      checked={jobLevel === "Full-Time"}
                      onChange={() => setJobLevel("Full-Time")}
                    />
                    <p className='rdbtn' for="female">Full Time</p>
                    <input className="inputtext" type="radio" id="Part-Time" name="joblvl" value="Part-Time"
                      checked={jobLevel === "Part-Time"}
                      onChange={() => setJobLevel("Part-Time")}
                    />
                    <p className='rdbtn' for="other">Part Time</p>
                  </form>
                  <label >Job Level :-</label>
                </div>

                <button className='bttn' type='submit' disabled={isLoading}>{isLoading ? "Loading..." : "submit"}</button>

              </form>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
