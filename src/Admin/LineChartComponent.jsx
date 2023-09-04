import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFirestore, collection, query, getDocs } from 'firebase/firestore';

function LineChartComponent({ data }) {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="appliedDate" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function App() {
  const [userApplicationsData, setUserApplicationsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();

      const userApplicationsRef = collection(db, 'userApplications');

      try {
        const querySnapshot = await getDocs(userApplicationsRef);
        const length = querySnapshot.docs.length
        const formattedData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
           
          return {
            appliedDate: data.appliedDateTime.length > 12 ?
            `${data.appliedDateTime.substring(0, 15)}` : data.appliedDateTime, 
            count: length, 
          };
        });

        setUserApplicationsData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
        <h4 style={{marginTop:2,textAlign:'center'}}>JOBS APPLIED</h4>
      <LineChartComponent data={userApplicationsData} />
    </div>
  );
}

export default App;
