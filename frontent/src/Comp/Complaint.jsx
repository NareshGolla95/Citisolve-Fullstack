import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './complaint.css';
import { API_URL } from "../api";
const Complaint = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [values, setvalues] = useState({
        ward: "",
        location: "",
        category: "",
        description: "",
        photo: null
    });

    const handlechange = (e) => {
        setvalues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!values.ward || !values.location || !values.category || !values.description) {
            alert("Please fill in all required fields");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("ward", values.ward);
            formData.append("location", values.location);
            formData.append("category", values.category);
            formData.append("description", values.description);

            if (values.photo) {
                formData.append("photo", values.photo);
            }

            const response = await fetch(
                `${API_URL}/api/complaints`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to submit complaint");
            }

            alert("Complaint submitted successfully!");
            navigate("/mycomplaint");

            setvalues({
                ward: "",
                location: "",
                category: "",
                description: "",
                photo: null
            });

        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const canFun = () => {
        setvalues({
            ward: "",
            location: "",
            category: "",
            description: "",
            photo: null
        });
    };

    return (
        <div className='mainDiv'>
            <form onSubmit={handleSubmit} className='form'>

                <h2 className='h2'>Submit a Complaint</h2>
                <p className='p'>
                    Help us improve your community by reporting issues that need attention
                </p>

                <label className="labelcom">Ward :</label>
                <input
                    className='inputcom'
                    type="text"
                    placeholder='Enter Ward Number or Name'
                    name="ward"
                    onChange={handlechange}
                    required
                    value={values.ward}
                />

                <label className="labelcom">Location :</label>
                <input
                    type="text"
                    className='inputcom'
                    placeholder='Enter Location'
                    name="location"
                    required
                    onChange={handlechange}
                    value={values.location}
                />

                <label className="labelcom">Category :</label>
                <select
                    name="category"
                    onChange={handlechange}
                    value={values.category}
                    className='inputcom'
                    required
                >
                    <option value="">Select Category</option>
                    <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                    <option value="Water Supply">Water Supply</option>
                    <option value="Sanitation & Waste">Sanitation & Waste</option>
                    <option value="Street Lighting">Street Lighting</option>
                    <option value="Public Safety">Public Safety</option>
                    <option value="Environmental Issues">Environmental Issues</option>
                    <option value="Noise Pollution">Noise Pollution</option>
                    <option value="Other">Other</option>
                </select>

                <label className="labelcom">Description :</label>
                <textarea
                    className="textarea"
                    name="description"
                    rows="3"
                    placeholder='Describe the issue in detail...'
                    onChange={handlechange}
                    required
                    value={values.description}
                />

                <label className="labelcom">Photo (Optional)</label>
                <input
                    type="file"
                    className='inputcom'
                    onChange={(e) =>
                        setvalues({ ...values, photo: e.target.files[0] })
                    }
                />

                <p className='paracom'>
                    Supported formats: JPG, PNG, GIF. Max size: 5MB.
                </p>

                <div className='btnsss'>
                    <button className='btn' type='button' onClick={canFun}>
                        Cancel
                    </button>

                    <button type='submit' className='btn' disabled={loading}>
                        {loading ? "Submitting..." : "Submit Complaint"}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default Complaint;