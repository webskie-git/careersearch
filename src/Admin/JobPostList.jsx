import './city.css'
import React, { useEffect, useState } from 'react';
import companies from '../Admin/data/companies';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Typography, Button } from '@mui/material';
import Sidebar from './Sidebar';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function JobPostList() {

  const [selectedJobList, setSelectedJobList] = useState(null);
  const [jobList, setJobList] = useState([]);

  useEffect(() => {   
    getAllJobs(); 
  }, []);

  const handleRowClick = (company) => {
    setSelectedJobList(company);
  };

  const handleCloseModal = () => {
    setSelectedJobList(null);
  };

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

  return (
    <div>
      <div className='grid-container'>
        <Sidebar />

        <div >
          <h1 style={{ textAlign: 'center', margin: 100 }}>Job Lists</h1>
          <TableContainer component={Paper}>
            <Table style={{ backgroundColor: 'lightgray', borderRadius: 20 }} >
              <TableHead>
                <TableRow>
                  <TableCell>Position</TableCell>
                  <TableCell>Job Details</TableCell>
                  <TableCell>Job Location</TableCell>
                  <TableCell>Company Name</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {jobList.map((job, index) => (
                  <TableRow key={job.id} onClick={() => handleRowClick(job)}>
                    <TableCell>{job.job_title}</TableCell>
                    <TableCell>{job.job_details}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.company_name}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


          <Modal open={!!selectedJobList} onClose={handleCloseModal}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, height: 400, backgroundColor: 'white', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
              <Typography style={{ margin: 20 }} variant="h6">{selectedJobList?.job_title}</Typography>
              <Typography style={{ margin: 20 }} >Details: {selectedJobList?.job_details}</Typography>
              <Typography style={{ margin: 20 }} >Location: {selectedJobList?.location}</Typography>
              <Typography style={{ margin: 20 }} >Company: {selectedJobList?.company_name}</Typography>
              <Typography style={{ margin: 20 }} >Job Level: {selectedJobList?.job_level}</Typography>
              <Typography style={{ margin: 20 }} >Job Type: {selectedJobList?.job_type}</Typography>



              <Button style={{ marginLeft: 200, padding: 15, backgroundColor: 'blue', color: 'white', borderRadius: 20, height: 20 }} onClick={handleCloseModal}>Close</Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  )
}
