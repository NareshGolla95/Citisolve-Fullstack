import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../Styles/mycomp.css';

const MyComplaint = () => {

    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/complaints/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch complaints");
            }

            setComplaints(data);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        const token = localStorage.getItem("token");

        if (!window.confirm("Are you sure you want to delete this complaint?")) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/api/complaints/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Delete failed");
            }

            setComplaints(prev =>
                prev.filter(item => item._id !== id)
            );

        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return <p className='pCom'>Loading complaints...</p>;
    }

    return (
        <div className='divmycom'>

            {complaints.length > 0 ? (
                <div className='cardsContainer'>
                    <div className='textdiv'>
                        <h1 className='h1text'>My Complaints</h1>
                        <p>Track the status of your submitted complaints</p>
                        <button
                            className='newcom'
                            onClick={() => navigate("/complaint")}
                        >
                            Submit New Complaint
                        </button>
                    </div>

                    {complaints.map((c) => (
                        <div key={c._id} className='cardDiv'>

                            <section className='idsec'>
                                <h4 className='id'>ID: {c._id.slice(0, 4)}</h4>

                                <div className='rightDiv'>
                                    <p className='id'>{c.status}</p>

                                    <button
                                        className="removeBtn"
                                        onClick={() => handleRemove(c._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </section>

                            <section className='wardsec'>
                                <h3>Ward:</h3>
                                <h3>{c.ward}</h3>
                            </section>

                            <section className='locationsec'>
                                <h3>Location:</h3>
                                <h3>{c.location}</h3>
                            </section>

                            <section className='categorysec'>
                                <h3>Category:</h3>
                                <h3>{c.category}</h3>
                            </section>

                            <section className='descriptionsec'>
                                <h3 className='dec'>Description:</h3>
                                <h3>{c.description}</h3>
                            </section>

                            {c.photo && (
                                <img
                                    src={`http://localhost:5000/uploads/${c.photo}`}
                                    alt="complaint"
                                    width="200"
                                />
                            )}

                        </div>
                    ))}
                </div>
            ) : (
                <p className='pCom'>No Complaints submitted yet.</p>
            )}

        </div>
    );
};

export default MyComplaint;