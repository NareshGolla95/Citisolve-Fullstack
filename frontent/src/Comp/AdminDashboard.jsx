import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/AdminDashboard.css";
import { API_URL } from "../api";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const token = localStorage.getItem("adminToken");

    
    const fetchComplaints = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/complaints/all`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            if (response.ok) {
                setComplaints(data);
            } else {
                alert(data.message || "Unable to fetch complaints");
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(
                `${API_URL}/api/auth/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            if (response.ok) {
                setUsers(data);
            } else {
                alert(data.message || "Unable to fetch users");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/admin-login");
            return;
        }

        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchComplaints(),
                fetchUsers(),
            ]);
            setLoading(false);
        };
        loadData();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            const response = await fetch(
                `${API_URL}/api/complaints/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await response.json();
            if (response.ok) {
                setComplaints((prev) =>
                    prev.map((complaint) =>
                        complaint._id === id
                            ? {
                                ...complaint,
                                status: newStatus,
                            }
                            : complaint
                    )
                );
            } else {
                alert(data.message || "Status update failed");
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    };

    const deleteComplaint = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this complaint?"
        );
        if (!confirmDelete) return;
        try {
            const response = await fetch(
                `${API_URL}/api/complaints/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            if (response.ok) {
                setComplaints((prev) =>
                    prev.filter((complaint) => complaint._id !== id)
                );
            } else {
                alert(data.message || "Delete failed");
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    };

    const deleteCitizen = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this citizen account?"
        );
        if (!confirmDelete) return;
        try {
            const response = await fetch(
                `${API_URL}/api/auth/users/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            if (response.ok) {
                setUsers((prev) =>
                    prev.filter((user) => user._id !== id)
                );
                alert("Citizen account deleted successfully!");
            } else {
                alert(data.message || "Account deletion failed");
            }
        } catch (error) {
            console.log(error);
            alert("Server error");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
    };

    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter(
        (complaint) => complaint.status === "Pending"
    ).length;

    const inProgressComplaints = complaints.filter(
        (complaint) => complaint.status === "In Progress"
    ).length;

    const completedComplaints = complaints.filter(
        (complaint) =>
            complaint.status === "Completed" ||
            complaint.status === "Resolved"
    ).length;

    const filteredComplaints = complaints.filter((complaint) => {
        const searchText = search.toLowerCase();
        const matchesSearch =
            complaint.category?.toLowerCase().includes(searchText) ||
            complaint.location?.toLowerCase().includes(searchText) ||
            complaint.ward?.toLowerCase().includes(searchText) ||
            complaint.description?.toLowerCase().includes(searchText) ||
            complaint.user?.name?.toLowerCase().includes(searchText) ||
            complaint.user?.email?.toLowerCase().includes(searchText);

        const matchesStatus =
            statusFilter === "All" ||
            complaint.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="loadingScreen">
                <h2>Loading Admin Dashboard...</h2>
            </div>
        );
    }
    return (
        <div className="adminDashboard">
            <nav className="adminNavbar">
                <div
                    className="adminLogo"
                    onClick={() => navigate("/")}
                >
                    🏛️ CitiSolve
                </div>
                <div className="adminNavRight">
                    <span>👤 CitiSolve Admin</span>
                    <button
                        className="logoutBtn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </nav>
            {/* ================= MAIN ================= */}
            <main className="adminMain">
                {/* ================= HEADING ================= */}
                <div className="dashboardHeading">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p>
                            Manage citizen complaints and monitor resolution progress.
                        </p>
                    </div>
                </div>
                {/* ================= STAT CARDS ================= */}
                <div className="statsContainer">
                    <div className="statCard totalCard">
                        <div className="statIcon">
                            📋
                        </div>
                        <div>
                            <h3>Total Complaints</h3>
                            <h1>{totalComplaints}</h1>
                        </div>
                    </div>
                    <div className="statCard pendingCard">
                        <div className="statIcon">
                            ⏳
                        </div>
                        <div>
                            <h3>Pending</h3>
                            <h1>{pendingComplaints}</h1>
                        </div>
                    </div>
                    <div className="statCard progressCard">
                        <div className="statIcon">
                            🔄
                        </div>
                        <div>
                            <h3>In Progress</h3>
                            <h1>{inProgressComplaints}</h1>
                        </div>
                    </div>
                    <div className="statCard completedCard">
                        <div className="statIcon">
                            ✅
                        </div>
                        <div>
                            <h3>Completed</h3>
                            <h1>{completedComplaints}</h1>
                        </div>
                    </div>
                    <div className="statCard usersCard">
                        <div className="statIcon">
                            👥
                        </div>
                        <div>
                            <h3>Total Users</h3>
                            <h1>{users.length}</h1>
                        </div>
                    </div>
                </div>
                {/* ================= USERS ================= */}
                <section className="usersSection">
                    <div className="sectionTitle">
                        <h2>
                            Registered Citizens
                        </h2>
                        <span>
                            {users.length} Users
                        </span>
                    </div>
                    <div className="usersTableWrapper">
                        <table className="usersTable">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr key={user._id}>
                                            <td>
                                                {index + 1}
                                            </td>
                                            <td>
                                                👤 {user.name}
                                            </td>
                                            <td>
                                                {user.email}
                                            </td>
                                            <td>
                                                <span className="roleBadge">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                {user.role === "Citizen" && (
                                                    <button
                                                        className="deleteUserBtn"
                                                        onClick={() =>
                                                            deleteCitizen(
                                                                user._id
                                                            )
                                                        }
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
                {/* ================= COMPLAINTS ================= */}
                <section className="complaintsSection">
                    <div className="sectionTitle">
                        <div>
                            <h2>
                                All Complaints
                            </h2>
                            <span>
                                {filteredComplaints.length} complaints
                            </span>
                        </div>
                    </div>
                    {/* ================= SEARCH ================= */}
                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Search by name, email, category, location..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                        >
                            <option value="All">
                                All Status
                            </option>
                            <option value="Pending">
                                Pending
                            </option>
                            <option value="In Progress">
                                In Progress
                            </option>
                            <option value="Completed">
                                Completed
                            </option>
                        </select>
                    </div>
                    {/* ================= COMPLAINT CARDS ================= */}
                    <div className="complaintsContainer">
                        {filteredComplaints.length === 0 ? (
                            <div className="noComplaints">
                                <h3>
                                    No complaints found
                                </h3>
                                <p>
                                    There are no complaints matching your search.
                                </p>
                            </div>
                        ) : (
                            filteredComplaints.map(
                                (complaint, index) => (
                                    <div
                                        className="complaintCard"
                                        key={complaint._id}
                                    >
                                        {/* HEADER */}
                                        <div className="complaintHeader">
                                            <div>
                                                <h3>
                                                    Complaint #{index + 1}
                                                </h3>
                                                <p className="complaintDate">
                                                    {new Date(
                                                        complaint.createdAt
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                            <span
                                                className={`statusBadge ${complaint.status
                                                    ?.toLowerCase()
                                                    .replace(" ", "-")}`}
                                            >
                                                {complaint.status}
                                            </span>
                                        </div>
                                        {/* CITIZEN DETAILS */}
                                        <div className="complaintInfo">
                                            <div className="infoBox">
                                                <h4>
                                                    Citizen Details
                                                </h4>
                                                <p>
                                                    <strong>Name:</strong>{" "}
                                                    {complaint.user?.name ||
                                                        "Unknown"}
                                                </p>
                                                <p>
                                                    <strong>Email:</strong>{" "}
                                                    {complaint.user?.email ||
                                                        "Unknown"}
                                                </p>
                                            </div>
                                            {/* LOCATION */}
                                            <div className="infoBox">
                                                <h4>
                                                    Location Details
                                                </h4>
                                                <p>
                                                    <strong>Ward:</strong>{" "}
                                                    {complaint.ward}
                                                </p>
                                                <p>
                                                    <strong>Location:</strong>{" "}
                                                    {complaint.location}
                                                </p>
                                            </div>
                                            {/* COMPLAINT */}
                                            <div className="infoBox">
                                                <h4>
                                                    Complaint Details
                                                </h4>
                                                <p>
                                                    <strong>Category:</strong>{" "}
                                                    {complaint.category}
                                                </p>
                                                <p>
                                                    <strong>Description:</strong>{" "}
                                                    {complaint.description}
                                                </p>
                                            </div>
                                        </div>
                                        {/* PHOTO */}
                                        {complaint.photo && (
                                            <div className="complaintPhoto">
                                                <h4>
                                                    Complaint Photo
                                                </h4>
                                                <img
                                                    src={`${API_URL}/uploads/${complaint.photo}`}
                                                    alt="Complaint"
                                                />
                                            </div>
                                        )}
                                        {/* ACTIONS */}
                                        <div className="complaintActions">
                                            <div>
                                                <label>
                                                    Update Status:
                                                </label>
                                                <select
                                                    value={
                                                        complaint.status
                                                    }
                                                    onChange={(e) =>
                                                        updateStatus(
                                                            complaint._id,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="Pending">
                                                        Pending
                                                    </option>
                                                    <option value="In Progress">
                                                        In Progress
                                                    </option>
                                                    <option value="Completed">
                                                        Completed
                                                    </option>
                                                </select>
                                            </div>
                                            <button
                                                className="deleteComplaintBtn"
                                                onClick={() =>
                                                    deleteComplaint(
                                                        complaint._id
                                                    )
                                                }
                                            >
                                                🗑️ Delete Complaint
                                            </button>
                                        </div>
                                    </div>
                                )
                            )
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};
export default AdminDashboard;