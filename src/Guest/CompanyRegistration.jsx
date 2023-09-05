import React, { useState } from 'react';
import "./Register.css";
import { addDoc, collection } from 'firebase/firestore';
import { auth, db, storage } from '../config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Navigate } from 'react-router-dom';


export default function CompanyRegistration() {

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [mob, setMob] = useState('');
  const [address, setAddress] = useState('');
  const [pswd, setPswd] = useState('');
  const [proof, setProof] = useState("");
  const [logo, setLogo] = useState("");
  const [redirect, setRedirect] = useState(false)
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);



  const userCollectionRef = collection(db, "companies");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, pswd);
      const uid = auth?.currentUser?.uid;
      let proofUrl = "";
      let logoUrl = "";
      const proofRef = ref(storage, `seekerphoto/${uid}`);
      const logoRef = ref(storage, `seekerresume/${uid}`);

      await uploadBytes(proofRef, proof);
      await uploadBytes(logoRef, logo);

      const url = await getDownloadURL(proofRef);
      proofUrl = url;

      const url2 = await getDownloadURL(logoRef);
      logoUrl = url2;

      await addDoc(userCollectionRef, {
        user_id: uid,
        user: name,
        company_name: companyName,
        company_email: email,
        company_contact: mob,
        company_address: address,
        company_city: city,
        company_proof: proofUrl,
        company_logo: logoUrl,
        company_status: 0,
      });


      alert('Company Registration Successfull');
      setName('');
      setCompanyName('');
      setEmail('');
      setMob('');
      setAddress('');
      setCity('');
      setProof('');
      setLogo('');
      setPswd('');
      setRedirect(true);
      setIsLoading(false);

    } catch (error) {
      console.error(error);
      alert('Registration failed. Please try again later');
      setIsLoading(false);

    }
  };
  if (redirect) {
    return <Navigate to={'/'} />
  }

  return (
    <div>
      <section className='secReg'>
        <div className="form-box-2">
          <div className="form-value">
            <form onSubmit={handleSubmit}>
              <h2 className='formname'>Company <br />Register Form</h2>
              <div className="inputbox">
                <i className="fa-solid fa-user"></i>
                <input className="inputtext" name="name" value={name} onChange={(e) => setName(e.target.value)} type="text" required />
                <label >Full Name</label>
              </div>

              <div className="inputbox">
                <i class="fa-solid fa-hotel"></i>
                <input className="inputtext" name="name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} type="text" required />
                <label >Company Name</label>
              </div>

              <div className="inputbox">
                <i className="fa-solid fa-envelope"></i>
                <input className="inputtext" name="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
                <label >Email</label>
              </div>

              <div className="inputbox">
                <i className="fa-solid fa-phone"></i>
                <input className="inputtext" name="mob" value={mob} onChange={(e) => setMob(e.target.value)} type="number" required />
                <label>Contact</label>
              </div>

              <div className="inputbox">
                <i class="fa-solid fa-address-card"></i>
                <input className="inputtext" name="name" value={address} onChange={(e) => setAddress(e.target.value)} type="text-area" required />
                <label >Address</label>
              </div>

              <div className='inputbox'>
                <i class="fa-solid fa-location-dot"></i>
                <select value={city} onChange={(e) => setCity(e.target.value)} className='city-select' name="location" >
                  <option className='city-option' value="">---Select----</option>
                  <option className='city-option' value="INDIA">INDIA</option>
                  <option className='city-option' value="US">US</option>
                  <option className='city-option' value="UK">UK</option>
                </select>
                <label for="">City</label>
              </div>

              <div className="inputboxfile">
                <i class="fa-solid fa-paperclip"></i>
                <input className="proof" name="file" onChange={(e) => setProof(e.target.files[0])} type="file" required />
                <label >Proof</label>
              </div>

              <div className="inputboxfile">
                <i class="fa-solid fa-anchor"></i>
                <input className="proof" name="file" onChange={(e) => setLogo(e.target.files[0])} type="file" required />
                <label >Logo</label>
              </div>

              <div className="inputbox">
                <i className="fa-solid fa-lock"></i>
                <input className="inputtext" name="pswd" value={pswd} onChange={(e) => setPswd(e.target.value)} type="password" required />
                <label >Password</label>
              </div>

              <button className='bttn' type='submit' disabled={isLoading}>{isLoading ? "Loading..." : "Register"}</button>
              <div className="register">
                <p><a href="./Login">Login now...</a></p>
              </div>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}
