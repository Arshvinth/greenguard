import Navbar from './Components/SideNav';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./styles/TruckDashboard.css";
import { useNavigate } from "react-router-dom";
import TruckRequestBarChart from './Components/TruckRequestBarChart';
import TruckStatusPieChart from './Components/TruckStatusPieChart';

function TruckDashBoard() {
    const [truckRequests, setTruckRequests] = useState([]);
    const [truckRequestChart, setTruckRequestChart] = useState([]);
    const [trucks, setTrucks] = useState([]);
    const navigate = useNavigate();

    //Get all truck requests
    useEffect(() => {
        axios.get("http://localhost:8081/truckRequest/gettruckRequests")
            .then(response => {
                setTruckRequestChart(response.data);
                const filteredRequests = response.data.filter(request => request.RequestStatus !== "Scheduled");
                setTruckRequests(filteredRequests);
            })
            .catch(error => {
                console.error("Error fetching truck requests:", error);
            });

        axios.get("http://localhost:8081/truck")
            .then(response => {
                setTrucks(response.data);
            })
            .catch(error => {
                console.error("Error fetching truck data:", error);
            });
    }, []);

    function allocateTruck(reqID) {
        navigate(`/allocateTruck/${reqID}`);
    }

    return (
        <div className="col1Div">
            <div className="outerDiv">
                <div className="innerDiv1">
                    <Navbar />
                </div>

                <div className="innerDivR">
                    <h3 style={{ textAlign: "left" }}>
                        Truck Manager
                        <h1 style={{ textAlign: "center", color: "Green" }}>Dashboard</h1>
                    </h3>

                    <div className="charts-container">
                        <TruckRequestBarChart truckRequests={truckRequestChart} />
                        <TruckStatusPieChart trucks={trucks} />
                    </div>

                    <div className="card-container">
                        {truckRequests.length > 0 ? (
                            truckRequests.map((request, index) => (
                                <div key={index} className="card">
                                    <label><strong>Request ID:</strong> {request.RequestID}</label>
                                    <label><strong>Request Date:</strong> {request.Request_Date}</label>
                                    <label><strong>Truck Capacity:</strong> {request.TruckCapacity} Kg</label>
                                    <label><strong>Pickup Location:</strong> {request.PickupLocation}</label>
                                    <label><strong>Request Status:</strong> {request.RequestStatus}</label>
                                    <strong>Priority: <label
                                        style={{
                                            color:
                                                request.Priority === "High"
                                                    ? "red"
                                                    : request.Priority === "Medium"
                                                        ? "gold" // or "yellow", but gold is more visible
                                                        : request.Priority === "Low"
                                                            ? "green"
                                                            : "black",
                                        }}
                                    >
                                        {request.Priority}
                                    </label></strong>

                                    <button
                                        onClick={() => allocateTruck(request.RequestID)}
                                        className="allocate-btn"
                                        disabled={request.RequestStatus === "Assigned"}
                                    >
                                        Allocate Truck
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No truck requests available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TruckDashBoard;
