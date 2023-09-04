
import './city.css'

import React, { useEffect, useState } from 'react';
import companies from '../Admin/data/companies';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Typography, Button } from '@mui/material';
import Sidebar from './Sidebar';
import { collection, deleteDoc, doc, getDocs, query, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const CompanyList = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companiesList, setCompaniesList] = useState([]);


  useEffect(() => {
    getAllCompanies();
  }, []);

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
  console.log(companiesList);

  const handleRowClick = (company) => {
    setSelectedCompany(company);
  };

  const handleCloseModal = () => {
    setSelectedCompany(null);
  };

  const handleApprove = async (cid) => {
    const companyRef = doc(db, "companies", cid);
    await updateDoc(companyRef, {
      company_status: 1,
    });

    getAllCompanies();
    setSelectedCompany(null);
  };

  const handleDelete = async (cid) => {
    const companyRef = doc(db, "companies", cid);
    await deleteDoc(companyRef);
    getAllCompanies();

    setSelectedCompany(null);
  };

  return (
    <div className='grid-container'>
      <Sidebar />

      <div >
        <h1 style={{ textAlign: 'center', margin: 100 }}>Companies List</h1>
        <TableContainer component={Paper}>
          <Table style={{ backgroundColor: 'lightgray', borderRadius: 20 }} >
            <TableHead>
              <TableRow  >
                <TableCell >Name</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companiesList.map((company, index) => (
                <TableRow key={company.id} onClick={() => handleRowClick(company)}>
                  <TableCell>{company.company_name}</TableCell>
                  <TableCell>{company.company_city}</TableCell>
                  <TableCell>{company.company_address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>


        <Modal open={!!selectedCompany} onClose={handleCloseModal}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, height: 400, backgroundColor: 'white', bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
            <Typography style={{ margin: 20, textAlign: 'center' }} variant="h6">Company Name: {selectedCompany?.company_name}</Typography>
            {/* <Typography style={{ margin: 20 , textAlign:'center' }} ><h3>Logo:</h3>
              <img 
               width="120"
               height="100"
              src={selectedCompany?.company_logo} alt="logo" /></Typography> */}
            <Typography style={{ margin: 20, textAlign: 'center' }} >Address: {selectedCompany?.company_address}</Typography>
            <Typography style={{ margin: 20, textAlign: 'center' }} >Location: {selectedCompany?.company_city}</Typography>
            <Typography style={{ margin: 20, textAlign: 'center' }} >Contact: {selectedCompany?.company_contact}</Typography>
            <Typography style={{ margin: 20, textAlign: 'center' }} >Email: {selectedCompany?.company_email}</Typography>

            <div>
              {selectedCompany?.company_status == 1 ? (
                ""
              ) : (
                <Button
                  style={{ marginLeft: 100, padding: 15, backgroundColor: 'blue', color: 'white', borderRadius: 20, height: 20, marginTop: 20 }}
                  onClick={() => handleApprove(selectedCompany.id)}
                >
                  Approve
                </Button>
              )}
              <Button style={{ marginLeft: 140, padding: 15, backgroundColor: 'blue', color: 'white', borderRadius: 20, height: 20, marginTop: 20 }} onClick={() => handleDelete(selectedCompany.id)}>Delete</Button>
            </div>

          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CompanyList;
