import Navbar from './components/sideNavBar';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./styles/EditTruckRequest.css";

function EditTruckRequest() {
    const { Trequest_ID } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [truck_RegNumber, setTruck_RegNumber] = useState("");
    const [driverId, setDriver_id] = useState("");
    const [pickUp_ID, setPickUp_ID] = useState("");
    const [truckCapacity, setTruckCapacity] = useState("");
    const [requestStatus, setRequestStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [request_Date, setRequest_Date] = useState("");
    const [errors, setErrors] = useState({});

    //Fetch truck request details of specific request
    useEffect(() => {
        axios.get(`http://localhost:8081/requestTruck/gettruckRequest/${Trequest_ID}`)
            .then((response) => {
                const data = response.data.truckRequestInfo;
                setTruck_RegNumber(data.Truck_RegNumber);
                setDriver_id(data.driver_id);
                setPickUp_ID(data.PickUp_ID);
                setRequest_Date(data.Request_Date);
                setTruckCapacity(data.TruckCapacity);
                setRequestStatus(data.RequestStatus);
                setPriority(data.Priority);
                setPickupLocation(data.PickupLocation);
                setLoading(false);
            })
            .catch(() => {
                setError("Error fetching request details.");
                setLoading(false);
            });
    }, [Trequest_ID]);

    //Validate request date - within 7days from today
    const validateRequestDate = (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 7);

        if (selectedDate < today) return "Past dates are not allowed.";
        if (selectedDate > maxDate) return "Date must be within the next 7 days.";
        return "";
    };

    //Validate truck capacity - must be within 1800 to 6000Kg
    const validateTruckCapacity = (capacity) => {
        if (capacity < 1800 || capacity > 6000) return "Truck capacity must be between 1800 - 6000 Kg.";
        return "";
    };

    //set new updated values
    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "requestDate") {
            setRequest_Date(value);
            setErrors((prev) => ({ ...prev, requestDate: validateRequestDate(value) }));
        } else if (name === "truckCapacity") {
            setTruckCapacity(value);
            setErrors((prev) => ({ ...prev, truckCapacity: validateTruckCapacity(value) }));
        } else if (name === "Priority") {
            setPriority(value);
        }
    };

    //Update request function
    function UpdateRequestInfo(e) {
        e.preventDefault();

        if (errors.requestDate || errors.truckCapacity || errors.priority) {
            alert("Please fix validation errors before submitting.");
            return;
        }

        const updatedTruckRequestInfo = {
            Request_Date: request_Date,
            TruckCapacity: truckCapacity,
            Priority: priority
        };

        axios.put(`http://localhost:8081/requestTruck/update/${Trequest_ID}`, updatedTruckRequestInfo)
            .then(() => {
                alert("Truck request updated successfully!");
                navigate("/ReadAllTruckRequests");
            })
            .catch((error) => {
                console.error("Error updating truck request data:", error);
                alert("Failed to update truck request details.");
            });
    }

    return (
        <div className="edit-truck-container">
            <div className="edit-truck-wrapper">
                <div className="edit-truck-sidebar">
                    <Navbar />
                </div>
                <div className="edit-truck-content">
                    <div className="edit-truck-form-wrapper">
                        <h2 className="edit-truck-title">Update Truck Request</h2>
                        <form className="edit-truck-form" onSubmit={UpdateRequestInfo}>
                            <label className="edit-truck-label" htmlFor="requestID">Request ID:</label>
                            <input className="edit-truck-input" type="text" id="requestID" value={Trequest_ID} required disabled />
                            <div className="edit-truck-hint">Check Request ID</div>

                            <label className="edit-truck-label" htmlFor="pickUpId">Pickup ID:</label>
                            <input className="edit-truck-input" type="text" id="pickUpId" value={pickUp_ID} required disabled />

                            <label className="edit-truck-label" htmlFor="requestDate">Request Date:</label>
                            <input className="edit-truck-input" type="date" id="requestDate" onChange={handleChange} value={request_Date} name="requestDate" required />
                            {errors.requestDate && <p className="edit-truck-error">{errors.requestDate}</p>}

                            <label className="edit-truck-label" htmlFor="truckCapacity">Truck Capacity (in Kg):</label>
                            <div className="edit-truck-input-container">
                                <input className="edit-truck-input" type="number" id="truckCapacity" onChange={handleChange} name="truckCapacity" value={truckCapacity} min="1800" max="6000" step="100" required />
                                <span className="edit-truck-unit">Kg</span>
                            </div>
                            {errors.truckCapacity && <p className="edit-truck-error">{errors.truckCapacity}</p>}
                            <div className="edit-truck-hint">Capacity must be between 1800 - 6000Kg</div>

                            <label className="edit-truck-label" htmlFor="pickupLocation">Pickup Location:</label>
                            <textarea className="edit-truck-textarea" id="pickupLocation" name="pickupLocation" value={pickupLocation} readOnly required></textarea>

                            <label className="edit-truck-label" htmlFor="priority">Select Priority *:</label>
                            <select id="priority" name="Priority" className="edit-truck-select" onChange={handleChange} value={priority} required>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>

                            <label className="edit-truck-label" htmlFor="status">Status:</label>
                            <input className="edit-truck-input" type="text" id="status" name="status" value={requestStatus} disabled />

                            <button className="edit-truck-button" type="submit">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditTruckRequest;
