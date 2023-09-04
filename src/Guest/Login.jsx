import React, { useState } from 'react';
import "./Login.css";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);



  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "admin@123") {
      navigate("/Admin");
    } else {
      try {
        const loginDetails = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const loginId = loginDetails.user.uid;
        const userQuerySnapshot = await getDocs(
          query(collection(db, "seekers"), where("user_id", "==", loginId))
        );
        const companyQuerySnapshot = await getDocs(
          query(
            collection(db, "companies"),
            where("user_id", "==", loginId)
          )
        );

        if (userQuerySnapshot.docs.length > 0) {
          sessionStorage.setItem(
            "uid",
            userQuerySnapshot.docs[0].data()["user_id"]
          );
          sessionStorage.setItem(
            "uname",
            userQuerySnapshot.docs[0].data()["user"]
          );
          sessionStorage.setItem(
            "uresume",
            userQuerySnapshot.docs[0].data()["user_resume"]
          );
          navigate("/Seeker");
        } else if (companyQuerySnapshot.docs.length > 0) {
          const companyData = companyQuerySnapshot.docs[0].data();
          const companyStatus = companyData["company_status"];

          if (companyStatus === 1) {
            sessionStorage.setItem("cid", companyData["user_id"]);
            sessionStorage.setItem("cname", companyData["company_name"]);

            navigate("/Company");
          } else {
            alert("Company is not active. Please contact support.");
          }
        }
        setIsLoading(false);
      } catch (err) {
        if (err.message == "Firebase: Error (auth/user-not-found).") {
          alert("Invalid Credentials");
        } else {
          alert("Something went wrong try again later");
        }
        setIsLoading(false);
      }
    }


  };


  return (

    <section className='section'>
      <div className="form-box">
        <div className="form-value">
          <form onSubmit={handleSubmit}>
            <h2 className='formname'>Log-In</h2>
            <div className="inputbox">
              <i className="fa-solid fa-envelope"></i>
              <input name="name" value={email} onChange={(e) => setEmail(e.target.value)} className="email" type="email" required />
              <label >Email</label>
            </div>
            <div className="inputbox">
              <i className="fa-solid fa-lock"></i>
              <input name="pswd" onChange={(e) => setPassword(e.target.value)} type="password" required />
              <label >Password</label>
            </div>
            <div className="text"></div>
            <button className='btn-3' type='submit'>{isLoading ? "Loading..." : "Login"}</button>
            <div className="register">
              <p>Don't have an Account :- <a href="./SeekerReg">Register as Seeker</a>,<br />
                <a href="./CompanyReg">Register as Company</a></p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
