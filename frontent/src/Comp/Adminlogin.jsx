import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../Styles/Adminlogin.css'

const Adminlogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
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
                alert(data.message || "Invalid credentials");
                setLoading(false);
                return;
            }

            if (data.user.role !== "Admin") {
                alert("You are not authorized as Admin");
                setLoading(false);
                return;
            }

            localStorage.setItem("adminToken", data.token);
            navigate("/admin-dashboard");
        } catch (error) {
            console.log(error);
            alert(
                "Unable to connect to server. Make sure backend is running."
            );
        }
        setLoading(false);
    };
    return (
        <div className="adminLoginPage">
            <div className="adminLoginBox">
                <h1>Admin Login</h1>
                <p>
                    Login to access Admin Dashboard
                </p>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter admin email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Submit"}
                    </button>
                </form>
                <button
                    className="backBtn"
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};
export default Adminlogin;