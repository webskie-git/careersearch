import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import './dashboard.css'
import { MdAssuredWorkload } from "react-icons/md";
import { FaAngellist } from "react-icons/fa";
import Chart from './Chart';
import { AiFillFacebook } from "react-icons/ai";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { AiOutlineLinkedin } from "react-icons/ai";
import { AiOutlineGithub } from "react-icons/ai";
import Sidebar from './Sidebar';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FcPortraitMode } from "react-icons/fc";
import { FcDatabase } from "react-icons/fc";
import { FcReadingEbook } from "react-icons/fc";
import { GrLogout } from "react-icons/gr";
import LineChartComponent from './LineChartComponent';




export default function Dashboard() {

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
  const logoutAdmin = () => {
    sessionStorage.removeItem('aid');
    window.location.href = '/';
  }


  return (
    <>

      <div class="grid-container">
        {/* header section */}
        <header class="header1">
          
          <h2 className='cname'>CAREER SEARCH </h2>
          <div onClick={logoutAdmin} style={{ marginLeft: 1000, marginTop: 20 }}><GrLogout size={50} /></div>


        </header>


        {/* sidebar */}
        <Sidebar />

        <main class="main-content">
          <div className="db">

            <h1> <MdAssuredWorkload /> DASHBOARD</h1>
          </div>
          <div className="home">

            <div className="box box1" id='one'>
              <div style={{ marginTop: 35 }}>
                <h3>JOB SEEKERS</h3>
                <h3>
                  {userCount || 0} 
                </h3> <FcPortraitMode />
              </div>
            </div>


            <div id='two' className="box box1">
              <div style={{ marginTop: 35 }}>
                <h3>COMPANIES</h3>

                <h3>
                  {companyCount || 0}
                </h3> <FcDatabase />
              </div>

            </div>
            <div id='three' className="box box1">
              <div style={{ marginTop: 35 }}>
              <h3>JOB LISTS</h3>
                <h3>
                {jobLists || 0}
                </h3> <FcReadingEbook />
              </div>
            </div>


            <div className="box box4">
              <Chart />
            </div>
            <div className="box box4">
              <LineChartComponent/>
            </div>


          </div>


        </main>
        <footer class="footer-a">
          <div className='footer1'>
            <AiFillFacebook size='40px' padding='10px' />
            <AiOutlineWhatsApp size='40px' padding='10px' />
            <AiOutlineLinkedin size='40px' /><AiOutlineGithub size='40px' padding='10px' />
          </div>

        </footer>
      </div>

    </>
  )
}
