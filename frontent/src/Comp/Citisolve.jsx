import React from 'react'
import '../Styles/citisolve.css';
import { useNavigate } from "react-router-dom";

const Citisolve = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className='mainDiv1'>
                <div className='mainText'>
                    <h1>Citizen Resolution System</h1>
                    <p>Report and track community issues efficiently. Your voice matters in <br></br> building a better community.</p>
                    <div className='extraBtns'>
                        <button className='extraLogin' onClick={() => navigate('/login')}>Login</button>
                        <button className='extraReg' onClick={() => navigate('/register')}>Register</button>
                    </div>
                </div>
                <h3 className='workstext'>How it Works..?</h3>
                <div className='information'>
                    <div className='regInfm'>
                        <h1>1</h1>
                        <h3>Register</h3>
                        <p>Create your account as a citizen</p>
                    </div>
                    <div className='subInfm'>
                        <h1>2</h1>
                        <h3>Submit</h3>
                        <p>Report issues with details and photos</p>
                    </div>
                    <div className='trackInfm'>
                        <h1>3</h1>
                        <h3>Track</h3>
                        <p>Monitor progress and status updates</p>
                    </div>
                </div>
                <div className='readyToGo'>
                    <h2>Ready to Get Started?</h2>
                    <p>Join our community and help make a difference</p>
                    <div className='anotherBtns'>
                        <button className='acc' onClick={() => navigate("/register")}>Create Account</button>
                        <button className='SignIn' onClick={() => navigate("/login")}> Sign In</button>
                        <button
                            className='adminBtn'
                            onClick={() => navigate('/admin-login')}
                        >
                            Admin
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}
export default Citisolve
