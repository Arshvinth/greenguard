import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./styles/AllocateTruck.css";
import BackBtn from "../TruckManagement/Components/BackBtn";

function AllocateTruck() {
    const { reqID } = useParams();
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allTrucks, setAllTrucks] = useState([]);
    const [searchRegNum, setSearchRegNum] = useState("");
    const [requestID, setRequestID] = useState(null);
    const [truckCapacity, setTruckCapacity] = useState(null);
    const navigate = useNavigate();

    //Get details of one truck 
    useEffect(() => {
        axios.get(`http://localhost:8081/truckRequest/getOnetruckRequests/${reqID}`)
            .then((response) => {
                setRequestID(response.data.RequestInfo.RequestID);
                setTruckCapacity(response.data.RequestInfo.TruckCapacity);
                setLoading(false);
            })
            .catch(() => {
                setError("Error fetching truck request details.");
                setLoading(false);
            });
    }, [reqID]);

    //Get details of all trucks
    useEffect(() => {
        axios.get("http://localhost:8081/truck/")
            .then((response) => {
                setTrucks(response.data);
                setAllTrucks(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching trucks:", err);
                setError("Failed to load trucks. Please try again.");
                setLoading(false);
            });
    }, []);

    //Search truck function
    const searchTruck = () => {
        if (!searchRegNum.trim()) {
            setTrucks(allTrucks);
            return;
        }
        const filteredTrucks = allTrucks.filter(truck =>
            truck.RegNumber.toLowerCase().includes(searchRegNum.toLowerCase())
        );
        setTrucks(filteredTrucks);
    };

    //Assign truck to request
    const AssignTruck = (RegNum, driverID) => {
        const updatedTruckRequest = {
            Truck_RegNumber: RegNum,
            driver_id: driverID,
            RequestStatus: "Assigned"
        };

        axios.put(`http://localhost:8081/truckRequest/updateTRequest/${requestID}`, updatedTruckRequest)
            .then(() => {
                return axios.put(`http://localhost:8081/truck/update/${RegNum}`, {
                    isActive: false
                });
            })
            .then(() => {
                alert("Truck assigned and marked as inactive!");
                navigate("/truck");
            })
            .catch((error) => {
                console.error("Error during truck assignment:", error);
                alert("Failed to assign truck.");
            });
    };

    if (loading) return <p>Loading trucks...</p>;
    if (error) return <p className="allocate-truck-error-text">{error}</p>;

    return (
        <div className="allocate-truck-container">
            <BackBtn />
            <div className="allocate-truck-outer">
                <div className="allocate-truck-inner">
                    <div className="allocate-truck-content">
                        <h2>Assign Truck</h2>
                        <label className="allocate-truck-label">Request ID: {requestID}</label>
                        <label className="allocate-truck-label">Capacity: {truckCapacity}</label>

                        <div className="allocate-truck-search">
                            <input
                                type="text"
                                className="allocate-truck-input"
                                placeholder="Enter Truck Reg Number"
                                value={searchRegNum}
                                onChange={(e) => setSearchRegNum(e.target.value)}
                            />
                            <button className="allocate-truck-btn" onClick={searchTruck}>Search</button>
                            <button className="allocate-truck-btn reset" onClick={() => setTrucks(allTrucks)}>Reset</button>
                        </div>

                        <table className="allocate-truck-table">
                            <thead>
                                <tr>
                                    <th>Reg Number</th>
                                    <th>Model</th>
                                    <th>Capacity</th>
                                    <th>Insurance Expiry</th>
                                    <th>Inspection Date</th>
                                    <th>Collection Center</th>
                                    <th>Driver ID</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trucks.length > 0 ? (
                                    trucks.map((truck) => (
                                        <tr key={truck.RegNumber}>
                                            <td>{truck.RegNumber}</td>
                                            <td>{truck.Model}</td>
                                            <td>{truck.Capacity}</td>
                                            <td>{truck.Insurance_Expiry}</td>
                                            <td>{truck.Inspection__date}</td>
                                            <td>{truck.Collection_center_id}</td>
                                            <td>{truck.driver_id}</td>
                                            <td className="allocate-truck-status">{truck.isActive ? "Active" : "Inactive"}</td>
                                            <td>
                                                <button
                                                    className="allocate-truck-assign-btn"
                                                    onClick={() => AssignTruck(truck.RegNumber, truck.driver_id)}
                                                    disabled={!truck.isActive}
                                                >
                                                    Assign
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No trucks found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllocateTruck;

