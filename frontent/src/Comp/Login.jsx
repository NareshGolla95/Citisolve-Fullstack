import React, { useState } from "react";
import "../Styles/login.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
const Login = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror("");
    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        seterror("Email or Password is wrong");
        setloading(false);
        return;
      }
      if (data.user.role !== "Citizen") {
        seterror("Only Citizen accounts can login here.");
        setloading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
      setloading(false);
      navigate("/complaint");
    } catch (err) {
      console.error(err);
      seterror(
        "Unable to connect to server. Please try again later."
      );
      setloading(false);
    }
  };
  return (
    <div className="mainDiv2">
      <form onSubmit={handleLogin}>
        <div className="formDiv">
          <h2>
            Login to Citizen
            <br />
            Resolution
          </h2>
          <div className="InputDiv">
            <label>Email :</label>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="loginInput"
              value={email}
              required
              onChange={(e) =>
                setemail(e.target.value)
              }
            />
            <label>Password :</label>
            <input
              type="password"
              placeholder="Enter Your Password"
              className="loginInput"
              value={password}
              required
              onChange={(e) =>
                setpassword(e.target.value)
              }
            />
          </div>
          {error && (
            <p className="loginError">
              {error}
            </p>
          )}
          <button
            className="LoginBtn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging Account ..."
              : "Login"}
          </button>
          <hr />
          <p>
            Don't have an account?{" "}
            <button
              className="regNaviBtn"
              type="button"
              onClick={() =>
                navigate("/register")
              }
            >
              Register here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
export default Login;