
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Citisolve from './Comp/Citisolve';
import Adminlogin from "./Comp/Adminlogin";
import AdminDashboard from "./Comp/AdminDashboard";
import Login from './Comp/Login';
import Register from './Comp/Register';
import NavBar from './Comp/NavBar';
import Complaint from './Comp/Complaint';
import MyComplaint from './Comp/MyComplaint';
import { useState, useEffect } from 'react';
function App() {
  const [com, setcom] = useState([]);
  useEffect(() => {
    const storedComplaints =
      JSON.parse(localStorage.getItem("complaints")) || [];
    setcom(storedComplaints);
  }, []);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Citisolve />} />
        <Route path="/complaint" element={<Complaint setcom={setcom} />} />
        <Route path='/mycomplaint' element={<MyComplaint com={com} setCom={setcom} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login/register' element={<Register />} />
        <Route path="/admin-login" element={<Adminlogin />} />
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />



      </Routes>
    </>
  )
}

export default App
