import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/ViewPickUpRequests.css";
import BackBtn from "./components/BackBtn";

function ViewPickUpRequests() {
    const [pickupRequests, setPickUpRequests] = useState([]);
    const [allRequest, setAllRequest] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchName, setSearchName] = useState("");

    const navigate = useNavigate();

    //Fetch all pickup requets from customer records
    useEffect(() => {
        axios.get("http://localhost:8081/pickupRequests/")
            .then((response) => {
                setPickUpRequests(response.data);
                setAllRequest(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching pickups:", err);
                setError("Failed to load pickups. Please try again.");
                setLoading(false);
            });
    }, []);

    //Search function by customer name
    const handleSearch = () => {
        if (!searchName.trim()) return;
        axios.get(`http://localhost:8081/pickupRequests/SearchPickupReq/${searchName}`)
            .then((res) => {
                setPickUpRequests(res.data.pickups);
            })
            .catch((err) => {
                console.error("Search error:", err);
                setPickUpRequests([]);
            });
    };

    //reset after search 
    const resetTable = () => {
        setPickUpRequests(allRequest);
        setSearchName("");
    };

    //Navigate to allocate truck page
    const Allocatetruck = (pickUpID) => {
        console.log(pickUpID);
        navigate(`/CreateTruckRequest/${pickUpID}`);
    };

    if (loading) return <p>Loading pickups...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="viewPickupReq-Outline">
            <BackBtn />
            <div className="pickup-req-table-container">
            <h2 className="View-Pick-title ">Pickup Requests</h2>
                <div className="pickup-req-search-bar">
                    <input
                        type="text"
                        placeholder="Search by name"
                        onChange={(e) => setSearchName(e.target.value)}
                        value={searchName}
                        className="pickup-req-search-input"
                    />
                    <button onClick={handleSearch} className="pickup-req-search-btn">Search</button>
                    <button onClick={resetTable} className="pickup-req-reset-btn">Reset</button>
                </div>

                <table className="pickup-req-table">
                    <thead>
                        <tr>
                            <th>PickUp_ID</th>
                            <th>Name</th>
                            <th>Pickup Date</th>
                            <th>Waste Type</th>
                            <th>Capacity</th>
                            <th>Pickup Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pickupRequests.length > 0 ? (
                            pickupRequests.map((pickup) => (
                                <tr key={pickup.PickUp_ID}>
                                    <td>{pickup.PickUp_ID}</td>
                                    <td>{pickup.Name}</td>
                                    <td>{pickup.PickupDate}</td>
                                    <td>{pickup.wasteType}</td>
                                    <td>{pickup.Capacity}</td>
                                    <td>{pickup.PickupLocation}</td>
                                    <td className="pickup-req-status">{pickup.Status}</td>
                                    <td className="pickup-req-action-bar">
                                        <button
                                            type="button"
                                            className="pickup-req-allocate-btn"
                                            onClick={() => Allocatetruck(pickup.PickUp_ID)}
                                            disabled={pickup.Status === "Requested"}
                                            style={{
                                                cursor: pickup.Status === "Requested" ? "not-allowed" : "pointer",
                                                backgroundColor: pickup.Status === "Requested" ? "#ccc" : "#e74c3c",
                                                width: "100px"
                                            }}
                                        >
                                            {pickup.Status === "Requested" ? "Already Requested" : "Allocate truck"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">No pickup requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ViewPickUpRequests;

