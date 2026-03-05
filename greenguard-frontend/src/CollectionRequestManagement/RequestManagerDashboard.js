import Navbar from './components/sideNavBar';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./styles/RequestManagerDashboard.css";
import RequestSchedulePieChart from './components/scheduleChart';

function RequestManagerDashboard() {
    const [assignedRequests, setAssignedRequests] = useState([]);
    const [pickupRequests, setPickupRequests] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const navigate = useNavigate();

    //Fetch relevant details from backend
    useEffect(() => {
        axios.get("http://localhost:8081/requestTruck/getAssignedRequests")
            .then(res => setAssignedRequests(res.data))
            .catch(err => console.error("Error fetching assigned requests:", err));

        axios.get("http://localhost:8081/pickupRequests/")
            .then(res => setPickupRequests(res.data))
            .catch(err => console.error("Error fetching pickup requests:", err));

        axios.get("http://localhost:8081/shedulePickup/getAllSchedule")
            .then(res => setSchedules(res.data))
            .catch(err => console.error("Error fetching schedules:", err));
    }, []);

    //Navigate to schedule page
    function handleCreateSchedule(truckReqID) {
        navigate(`/createSchedule/${truckReqID}`);
    }

    return (
        <div className="request-mgr-main-container">
            <div className="request-mgr-wrapper">
                <div className="request-mgr-sidebar">
                    <Navbar />
                </div>
                <div className="request-mgr-content">
                    <h1 className="request-mgr-title">Collection Request Manager</h1>

                    <RequestSchedulePieChart
                        requestCount={pickupRequests.length}
                        scheduleCount={schedules.length}
                    />

                    <h2 className="request-mgr-subtitle">Truck Assigned Requests</h2>

                    <div className="request-mgr-cards-container">
                        {assignedRequests.length > 0 ? (
                            assignedRequests.map((requestAssigned, index) => (
                                <div key={index} className="request-mgr-card">
                                    <p><strong>Truck Request ID:</strong> {requestAssigned.RequestID}</p>
                                    <p><strong>PickUp ID:</strong> {requestAssigned.PickUp_ID}</p>
                                    <p><strong>Truck Number:</strong> {requestAssigned.Truck_RegNumber}</p>
                                    <p><strong>Driver:</strong> {requestAssigned.driver_id}</p>
                                    <p><strong>Status:</strong> {requestAssigned.RequestStatus}</p>
                                    <button
                                        className="request-mgr-card-btn"
                                        onClick={() => handleCreateSchedule(requestAssigned.RequestID)}
                                    >
                                        Create Schedule
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="request-mgr-no-requests">No assigned truck requests found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RequestManagerDashboard;
