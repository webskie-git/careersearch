import React, { useEffect, useState } from 'react'
import './city.css'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Sidebar from './Sidebar';
import { db } from '../config/firebase';
import { addDoc, collection, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';




export default function City() {

  const [cityName, setCityName] = useState('');
  const [cityList, setCityList] = useState([]);

  const handleAddCity = async () => {
    const collectionRef = collection(db, 'city')
    const data = {
      name: cityName,
      timestamp: new Date().getTime(),
    };
    await addDoc(collectionRef, data)
    setCityName('');
  }

  const handleDelete = async (itemId) => {
    const itemRef = doc(db, 'city', itemId);
    await deleteDoc(itemRef);
  };
  useEffect(() => {
    const querySnapshot = query(collection(db, 'city'));
    const unsubscribe = onSnapshot(querySnapshot, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sortedData = data.sort((a, b) => b.timestamp - a.timestamp);
      setCityList(sortedData);
    });

    return () => unsubscribe();
  }, []);



  return (
    <div className='grid-container'>
      <Sidebar />
      <div className='main'>
        {/* input box */}
        <div className="add-city-form">
          <h1>Add New City</h1>
          <input type="text" value={cityName} onChange={(e) => setCityName(e.target.value)}
            placeholder="Enter a new city" />
          <button className='btn-a' onClick={handleAddCity} >Add City</button>
        </div>

        {/* data table */}


        <div style={{ marginLeft: 10, marginRight: 10, }}>
          <h1 style={{ textAlign: 'center', margin: 10 }}>Added Cities </h1>
          <TableContainer style={{ backgroundColor: 'gray', borderRadius: 40 }} component={Paper}>
            <Table style={{ backgroundColor: 'white', borderRadius: 20 }} >
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontSize: 20, paddingLeft: 50 }}>City Name</TableCell>
                  <TableCell style={{ fontSize: 20, paddingLeft: 50 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  cityList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell style={{ paddingLeft: 50 }} >{item.name}</TableCell>
                      <TableCell style={{ paddingLeft: 50 }}>
                        <Button className='btn-a' onClick={() => handleDelete(item.id)} variant="contained" >
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

  )
}

