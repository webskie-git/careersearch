import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import './ViewApp.css'
import { db, storage } from '../config/firebase';
import { getDownloadURL, ref } from 'firebase/storage';


export default function ViewApplications() {

  const [userApplications, setUserApplications] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const companyId = sessionStorage.getItem('cid');
    const companyName = sessionStorage.getItem('cname');

    const userApplicationsQuery = query(
      collection(db, 'userApplications'),
      where('applied_company_name', '==', companyName)
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

  const verifyApplication = async (applicationId) => {
    try {
      const applicationRef = doc(db, 'userApplications', applicationId);
      await updateDoc(applicationRef, {
        status: 'approved',
        viewedByCompany: true,
      });

      alert("Application has been verified")
      console.log(`Application ${applicationId} has been verified.`);
    } catch (error) {
      console.error('Error verifying application:', error);
    }
  };

  const companylogout = () => {
    sessionStorage.removeItem("cid");
    sessionStorage.removeItem("cname");

    window.location.href = '/';

  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const downloadResumeFromStorage = async (resumePath, userName) => {
    try {
      const resumeRef = ref(storage, resumePath);
      const resumeUrl = await getDownloadURL(resumeRef);

      // Use the retrieved resume URL to trigger the download.
      const a = document.createElement('a');
      a.href = resumeUrl;
      a.download = `${userName}_Resume.pdf`; // You can customize the file name here.
      a.click();
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  // Modal component
function ImageViewerModal({ imageUrl, onClose }) {
  return (
    <div  className="modal">
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 400, backgroundColor: 'white', bgcolor: 'background.paper', boxShadow: 24 }} className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <img style={{height:600, width:600}} src={imageUrl} alt="Full-sized resume" />
      </div>
    </div>
  );
}

  return (
        <div className='main-div'>
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
            <h1 className='header-h1'>Application Submitted List</h1>
    
    <table className='JobTable' border="1">
      <tr className='Job-tr'>
        <th className='Job-th'>Sl.No</th>
        <th className='Job-th'>Date Applied</th>
        <th className='Job-th'>Applied User Name</th>
        <th className='Job-th'>Applied Job Title</th>
        <th className='Job-th'>User Resume</th>
        <th className='Job-th'>Status</th>
        <th className='Job-th'>Action</th>

      </tr>    
      {userApplications.map((application, index) => (
          <tr key={application.id} className='Job-tr'>
            <td className='Job-td'>{index + 1}</td>
            <td className='Job-td'>{application.appliedDateTime.length > 12 ?
              `${application.appliedDateTime.substring(0, 15)}` : application.appliedDateTime}</td>
            <td className='Job-td'>{application.applied_user_name}</td>
            <td className='Job-td'>{application.applied_job_title}</td>
            <td className='Job-td'> 
            <img
                onClick={() => openModal(application.applied_user_resume)}
                width="120"
                height="100"
                src={application.applied_user_resume}
                alt="resume"
              />
            </td>
            <td className='Job-td'>{application.status}</td>
            <td className='Job-td'>
              <button
                className='verify'
                onClick={() => verifyApplication(application.id)}
              >
                Verify
              </button>
              <button 
            className='verify' style={{marginLeft:10,marginTop:2}}
            onClick={() =>
              downloadResumeFromStorage(
                application.applied_user_resume, 
                application.applied_user_name
              )
            }
          >
            Download
          </button>
            </td>
          </tr>
        ))}
      
    </table>
    {selectedImage && (
        <ImageViewerModal imageUrl={selectedImage} onClose={closeModal} />
      )}
    
        </div>
  )
}
