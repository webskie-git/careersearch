import React, { useEffect, useState } from 'react'
import './city.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Sidebar from './Sidebar';
import { db } from '../config/firebase';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';

function Type() {

  const [jobType, setJobType] = useState('');
  const [jobList, setJobList] = useState([]);

  const addJobType = async () => {
    const collectionRef = collection(db, 'jobtype')
    const data = {
      name: jobType,
      timestamp: new Date().getTime(),
    };
    await addDoc(collectionRef, data)
    setJobType('')
  }


  const handleDelete = async (itemId) => {
    const itemRef = doc(db, 'jobtype', itemId);
    await deleteDoc(itemRef);
  };
  useEffect(() => {
    const querySnapshot = query(collection(db, 'jobtype'));
    const unsubscribe = onSnapshot(querySnapshot, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
      setJobList(sortedData);
    });

    return () => unsubscribe();
  }, []);


  return (
    <div>
      <div className='grid-container'>
        <Sidebar />
        <div className='main'>
          {/* input box */}
          <div className="add-city-form">
            <h1>Add New JobType</h1>
            <input type="text" value={jobType} onChange={(e) => setJobType(e.target.value)}
              placeholder="Enter a new job type" />
            <button className='btn-a' onClick={addJobType} >Add New JobType</button>
          </div>

          {/* data table */}


          <div style={{ marginLeft: 10, marginRight: 10, }}>
            <h1 style={{ textAlign: 'center', margin: 10 }}>Added JobTypes </h1>
            <TableContainer style={{ backgroundColor: 'gray', borderRadius: 40 }} component={Paper}>
              <Table style={{ backgroundColor: 'white', borderRadius: 20 }} >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: 20, paddingLeft: 50 }}>Job Type</TableCell>
                    <TableCell style={{ fontSize: 20, paddingLeft: 50 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    jobList.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell style={{ paddingLeft: 50 }} >{item.name}</TableCell>
                        <TableCell style={{ paddingLeft: 50 }}>
                          <Button onClick={() => handleDelete(item.id)} variant="contained" >
                            delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <div />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Type