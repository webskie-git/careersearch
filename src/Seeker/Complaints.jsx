import React, { useEffect, useState } from 'react';
import { collection,addDoc,query,where,getDocs,updateDoc,doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Complaints() {
    const [complaint, setComplaint] = useState('');
    const [complaints, setComplaints] = useState([]);
    const [adminReply, setAdminReply] = useState('');
    const uid = sessionStorage.getItem('uid');
    const uname = sessionStorage.getItem('uname');

    useEffect(() => {
        const fetchComplaints = async () => {
            const complaintsQuery = query(
                collection(db, 'seekercomplaints'),
                where('uid', '==', uid)
            );
            const complaintsSnapshot = await getDocs(complaintsQuery);
            const complaintsData = complaintsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setComplaints(complaintsData);
        };

        fetchComplaints();
    }, [uid]);

    const logoutUser = () => {
        sessionStorage.removeItem("uid");
        sessionStorage.removeItem("uname");
        sessionStorage.removeItem("uresume");
    
    
        window.location.href = '/';
    
      };  

    const submitComplaint = async () => {
        try {

            const newComplaintRef = await addDoc(collection(db, 'seekercomplaints'), {
                complaint,
                adminReply: '',
                uid,
                uname,
                status: false,
            });

            setComplaints((prevComplaints) => [
                ...prevComplaints,
                {
                    id: newComplaintRef.id,
                    complaint,
                    adminReply: '',
                    uid,
                    uname,
                    status: false,
                },
            ]);

            setComplaint('');
        } catch (error) {
            console.error('Error submitting complaint:', error);
        }
    };

    const replyToComplaint = async (complaintId) => {
        try {

            const complaintRef = doc(db, 'seekercomplaints', complaintId);
            await updateDoc(complaintRef, {
                adminReply,
            });

            setComplaints((prevComplaints) =>
                prevComplaints.map((complaint) =>
                    complaint.id === complaintId
                        ? { ...complaint, adminReply }
                        : complaint
                )
            );


            setAdminReply('');
        } catch (error) {
            console.error('Error replying to complaint:', error);
        }
    };

    return (
        <div className='Complaint-box'>
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
            {/* Complaint submission form */}
            <div className='complaint'>
                <h2>Submit a Complaint</h2>
                <textarea
                className='complaint-txt'
                    rows="4"
                    cols="50"
                    placeholder="Write your complaint here"
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                ></textarea>
                <button className='btn-sub' onClick={submitComplaint}>Submit</button>
            </div>

            {/* List of complaints and admin replies */}
            <div className='reply'>
                <h2>Complaints and Replies</h2>
                {complaints.map((complaintItem) => (
                    <div key={complaintItem.id}>
                        <p>
                            <strong>Complaint :</strong>
                        </p>
                        <p>{complaintItem.complaint}</p>
                        {complaintItem.adminReply && (
                            <div>
                                <p>
                                    <strong>Admin Reply :</strong>
                                </p>
                                <p>{complaintItem.adminReply}</p>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}
