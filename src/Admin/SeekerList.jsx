import './city.css'
import React, { useEffect, useState } from 'react';
import companies from '../Admin/data/companies';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Typography, Button } from '@mui/material';
import Sidebar from './Sidebar';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function SeekerList() {

  const [selectedSeeker, setSelectedSeeker] = useState(null);
  const [seekersList, setSeekersList] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);



  useEffect(() => {
    getAllSeekers();
  }, []);

  const getAllSeekers = async () => {
    const userQuerySnapshot = await getDocs(
      query(collection(db, "seekers"))
    );
    const data = userQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSeekersList(data);
  };

  const handleRowClick = (seeker) => {
    setSelectedSeeker(seeker);
  };

  const handleCloseModal = () => {
    setSelectedSeeker(null);
  };

  return (
    <div>
      <div className='grid-container'>
        <Sidebar />

        <div >
          <h1 style={{ textAlign: 'center', margin: 100 }}>Job Seekers List</h1>
          <TableContainer component={Paper}>
            <Table style={{ backgroundColor: 'lightgray', borderRadius: 20 }} >
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {seekersList.map((seeker) => (
                  <TableRow key={seeker.id} onClick={() => handleRowClick(seeker)}>
                    <TableCell>{seeker.user}</TableCell>
                    <TableCell>{seeker.user_city}</TableCell>
                    <TableCell>{seeker.user_address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


          <Modal open={!!selectedSeeker} onClose={handleCloseModal}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, height: 400, backgroundColor: 'white', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
              <Typography style={{ margin: 20, textAlign: 'center' }} variant="h6">User Name: {selectedSeeker?.user}</Typography>
              {/* <Typography style={{ margin: 20 , textAlign:'center' }} ><h3>Photo:</h3>
              <img 
               width="120"
               height="100"
              src={selectedSeeker?.user_photo} alt="logo" /></Typography> */}
              <Typography style={{ margin: 20, textAlign: 'center' }} >Address: {selectedSeeker?.user_address}</Typography>
              <Typography style={{ margin: 20, textAlign: 'center' }} >Location: {selectedSeeker?.user_city}</Typography>
              <Typography style={{ margin: 20, textAlign: 'center' }} >Contact: {selectedSeeker?.user_contact}</Typography>
              <Typography style={{ margin: 20, textAlign: 'center' }} >Email: {selectedSeeker?.user_email}</Typography>
              {/* <Typography style={{ margin: 20 , textAlign:'center' }} ><h3>Resume:</h3>
              <img 
               width="120"
               height="100"
              src={selectedSeeker?.user_resume} alt="resume" /></Typography> */}
              <Button style={{ marginLeft: 200, padding: 15, backgroundColor: 'blue', color: 'white', borderRadius: 20, height: 20, marginTop: 20 }} onClick={handleCloseModal}>Close</Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  )
}
