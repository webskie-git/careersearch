import './city.css';
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Typography, Button, TextField } from '@mui/material';
import Sidebar from './Sidebar';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const complaintsQuery = query(
          collection(db, 'seekercomplaints'),
          where('status', '==', false)
        );
        const complaintsSnapshot = await getDocs(complaintsQuery);
        const complaintsData = complaintsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComplaints(complaintsData);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };

    fetchComplaints();
  }, []);

  const handleReplyClick = (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleCloseModal = async () => {
    try {
      if (selectedComplaint) {
        const complaintRef = doc(db, 'seekercomplaints', selectedComplaint.id);
        await updateDoc(complaintRef, {
          adminReply: replyText,
          status: true,
        });
        setComplaints((prevComplaints) => prevComplaints.filter((c) => c.id !== selectedComplaint.id));
      }

      setSelectedComplaint(null);
      setReplyText('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const handleReplyTextChange = (event) => {
    setReplyText(event.target.value);
  };

  return (
    <div className='grid-container'>
      <Sidebar />
      <div style={{ backgroundColor: 'whitesmoke' }}>
        <h1 style={{ textAlign: 'center', margin: 100 }}>Complaints List</h1>
        <div style={{ margin: '20px' }}>
          <TableContainer component={Paper}>
            <Table style={{ backgroundColor: 'white', borderRadius: 20 }} >
              <TableHead>
                <TableRow>
                  <TableCell>Complaint</TableCell>
                  <TableCell>User Name</TableCell>

                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.uid}>
                    <TableCell>{complaint.complaint}</TableCell>
                    <TableCell>{complaint.uname}</TableCell>

                    <TableCell>
                      <Button variant="contained" onClick={() => handleReplyClick(complaint)}>
                        Reply
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <Modal open={!!selectedComplaint} onClose={handleCloseModal}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', width: 600, height: 300, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
            <Typography style={{ margin: 10 }} variant="h6">Reply to Complaint</Typography>
            <Typography style={{ margin: 10 }} variant="body2">{selectedComplaint?.text}</Typography>
            <TextField
              style={{ borderRadius: 50 }}
              label="Your Reply"
              multiline
              fullWidth
              rows={4}
              variant="outlined"
              value={replyText}
              onChange={handleReplyTextChange}
            />
            <Button style={{ margin: 10, padding: 10, backgroundColor: 'blue', color: 'white', borderRadius: 20, height: 30, width: 30 }} variant="contained" onClick={handleCloseModal}>
              Close
            </Button>
            <Button style={{ margin: 10, padding: 10, backgroundColor: 'blue', color: 'white', borderRadius: 20, height: 30 }} variant="contained" color="primary" onClick={handleCloseModal}>
              Submit Reply
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
