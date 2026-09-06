import React, { useState } from "react";
import "../Styles/register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !pass.trim() || !role) {
      alert("Please fill in all fields before submitting!");
      return;
    }

    if (pass !== confirmPass) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: pass.trim(),
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Account created successfully!");
      navigate("/login");

      // Clear form
      setName("");
      setEmail("");
      setPass("");
      setConfirmPass("");
      setRole("");

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mainDiv3">
      <form onSubmit={submit} className="formREG">
        <h3 className="accH1">Create Account</h3>
        <p className="parahaid">
          Join our citizen resolution system
        </p>

        <div className="inputFieldDiv">
          <label>Full Name :</label>
          <input
            type="text"
            className="inputreg"
            placeholder="Enter Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email Address :</label>
          <input
            type="email"
            className="inputreg"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Role :</label>
          <select
            id="select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Citizen">Citizen</option>
            {/* <option value="Admin">Admin</option> */}
          </select>

          <p className="para">
            Citizen role can submit and view their own complaints!
          </p>

          <label>Password :</label>
          <input
            type="password"
            className="inputreg"
            placeholder="Enter Your Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <label>Confirm Password :</label>
          <input
            type="password"
            className="inputreg"
            placeholder="Confirm Your Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </div>

        <button
          className="CreateAcc"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p>
          Already have an account?
          <button
            className="signNavi"
            type="button"
            onClick={() => navigate("/login")}
          >
            {" "}
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;