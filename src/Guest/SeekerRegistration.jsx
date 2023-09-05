import React, { useState } from 'react';
import "./Register.css";
import { addDoc, collection } from 'firebase/firestore';
import { auth, db, storage } from '../config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Navigate } from 'react-router-dom';


export default function SeekerRegistration() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mob, setMob] = useState('');
  const [address, setAddress] = useState('');
  const [pswd, setPswd] = useState('');
  const [resume, setResume] = useState("");
  const [photo, setPhoto] = useState("");
  const [redirect, setRedirect] = useState(false)
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);




  const userCollectionRef = collection(db, "seekers");




  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, pswd);
      const uid = auth?.currentUser?.uid;
      let imageUrl = "";
      let resumeUrl = "";
      const imageRef = ref(storage, `seekerphoto/${uid}`);
      const resumeRef = ref(storage, `seekerresume/${uid}`);

      await uploadBytes(imageRef, photo);
      await uploadBytes(resumeRef, resume);

      const url = await getDownloadURL(imageRef);
      imageUrl = url;

      const url2 = await getDownloadURL(resumeRef);
      resumeUrl = url2;

      await addDoc(userCollectionRef, {
        user_id: uid,
        user: name,
        user_email: email,
        user_contact: mob,
        user_address: address,
        user_city: city,
        user_photo: imageUrl,
        user_resume: resumeUrl
      });


      alert('User Registration Successfull');
      setName('');
      setEmail('');
      setMob('');
      setAddress('');
      setCity('');
      setResume('');
      setPhoto('');
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
              <h2 className='formname'>Seeker Register Form</h2>
              <div className="inputbox">
                <i className="fa-solid fa-user"></i>
                <input className="inputtext" name="name" value={name} onChange={(e) => setName(e.target.value)} type="text" required />
                <label >Full Name</label>
              </div>

              <div className="inputbox">
                <i className="fa-solid fa-envelope"></i>
                <input className="inputtext" value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="email" required />
                <label >Email</label>
              </div>

              <div className="inputbox">
                <i className="fa-solid fa-phone"></i>
                <input className="inputtext" value={mob} onChange={(e) => setMob(e.target.value)} name="mob" type="number" required />
                <label >Contact</label>
              </div>

              <div className="inputbox">
                <i class="fa-solid fa-address-card"></i>
                <input className="inputtext" value={address} onChange={(e) => setAddress(e.target.value)} name="name" type="text-area" required />
                <label >Address</label>
              </div>

              <div className='inputbox'>
                <i class="fa-solid fa-location-dot"></i>
                <select value={city} onChange={(e) => setCity(e.target.value)} className='city-select' name="location" >
                <option className='city-option' value="">----Select----</option>
                <option className='city-option' value="INDIA">INDIA</option>
                  <option className='city-option' value="US">US</option>
                  <option className='city-option' value="UK">UK</option>
                </select>
                <label >City</label>
              </div>

              <div className="inputboxfile">
                <i class="fa-solid fa-image"></i>
                <input className="proof" onChange={(e) => setPhoto(e.target.files[0])} name="file" type="file" required />
                <label >Photo</label>
              </div>

              <div className="inputboxfile">
                <i class="fa-solid fa-file"></i>
                <input className="proof" name="file" onChange={(e) => setResume(e.target.files[0])} type="file" required />
                <label >Resume</label>
              </div>

              <div className="inputbox">
                <i className="fa-solid fa-lock"></i>
                <input className="inputtext" value={pswd} onChange={(e) => setPswd(e.target.value)} name="pswd" type="password" required />
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
