

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Chart() {

  const [data, setData] = useState({});
  const [userCount, setUserCount] = useState();
  const [companyCount, setCompanyCount] = useState();
  const [jobLists, setJobLists] = useState();


  useEffect(() => {
    getCount();
  }, []);

  const getCount = async () => {

    const userCountQuerySnapshot = await getDocs(query(collection(db, "seekers")));
    setUserCount(userCountQuerySnapshot.docs.length);

    const comanyCountQuerySnapshot = await getDocs(query(collection(db, "companies")));
    setCompanyCount(comanyCountQuerySnapshot.docs.length);

    const jobCountQuerySnapshot = await getDocs(query(collection(db, "joblists")));
    setJobLists(jobCountQuerySnapshot.docs.length);


  }

  const chartData = [
    { name: 'Companies', count: userCount || 0 },
    { name: 'Job Seekers', count: companyCount || 0 },
    { name: 'Job Lists', count: jobLists || 0 },

  ];

  return (
    <div>
      <div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis tick={false} />
            <Tooltip
            // labelStyle={{ display: "none" }}
            />
            <Legend />
            <Bar dataKey="count" fill="powderblue" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Chart