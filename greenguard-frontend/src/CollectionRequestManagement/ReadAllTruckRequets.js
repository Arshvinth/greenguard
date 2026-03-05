import BackBtn from "./components/BackBtn";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/ReadAllTruckRequests.css";

function ReadAllTruckRequests() {
    const [truckrequests, setTruckrequests] = useState([]);
    const [allTruckRequest, setAllTruckRequest] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchReqID, setSearchReqID] = useState("");

    const navigate = useNavigate();

    //Fetch all truck request record made by collection manager
    useEffect(() => {
        axios.get("http://localhost:8081/requestTruck/")
            .then((response) => {
                setTruckrequests(response.data);
                setAllTruckRequest(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching trucks:", err);
                setError("Failed to load trucks. Please try again.");
                setLoading(false);
            });
    }, []); 

    //Search function (Seacrh by Request ID)
    const handleSearch = () => {
        if (!searchReqID.trim()) return;
        axios.get(`http://localhost:8081/requestTruck/searcReqTruck/${searchReqID}`)
            .then((res) => {
                setTruckrequests(res.data.requests);
            })
            .catch((err) => {
                console.error("Search error:", err);
                setTruckrequests([]);
            });
    };

    const resetTable = () => {
        setTruckrequests(allTruckRequest);
        setSearchReqID("");
    };

    //Edit specific request - navigate to edit page with TruckReqID
    const EditTruckRequest = (Trequest_ID) => {
        navigate(`/UpdateTruckRequest/${Trequest_ID}`);
    };

    //Delete particular request record
    const DeleteTruckRequest = (req_ID) => {
        if (window.confirm(`Are you sure you want to delete truck with Request ID: ${req_ID}?`)) {
            axios.delete(`http://localhost:8081/requestTruck/deleteRequest/${req_ID}`)
                .then(() => {
                    alert("Truck request deleted successfully!");
                    setTruckrequests(prev => prev.filter(r => r.RequestID !== req_ID));
                })
                .catch((error) => {
                    console.error("Error deleting truck request:", error);
                    alert("Failed to delete request.");
                });
        }
    };

    //Generate all truck requests report
    const generatePDF = (filteredData, title) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(title, 14, 15);
        doc.setFontSize(12);
        doc.text(`Total Records: ${filteredData.length}`, 14, 23);

        const tableData = filteredData.map((req, i) => [
            i + 1,
            req.RequestID,
            req.Truck_RegNumber,
            req.driver_id,
            req.Priority,
            req.Request_Date,
            req.TruckCapacity,
            req.PickupLocation,
            req.RequestStatus
        ]);

        autoTable(doc, {
            head: [["#", "Request ID", "Truck Number", "Driver ID", "Priority", "Request Date", "Capacity", "Location", "Status"]],
            body: tableData,
            startY: 30
        });

        doc.save(`${title.replace(/\s/g, "_")}.pdf`);
    };

    //Report for only assigned truck for requests
    const handleGenerateAssignedReport = () => {
        const assigned = allTruckRequest.filter(r => r.RequestStatus.toLowerCase() === "assigned");
        generatePDF(assigned, "Assigned Truck Report");
    };

    //Report for only requested truck for pickup
    const handleGenerateRequestedReport = () => {
        const requested = allTruckRequest.filter(r => r.RequestStatus.toLowerCase() === "requested");
        generatePDF(requested, "Requested Truck Report");
    };

    if (loading) return <p>Loading requests...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="ReadAllTruck-Outline">
            <BackBtn />
            <h2 className="read-trucksReq-title">All Truck Requests</h2>
            <div className="read-req-table-container">
                <div className="read-req-search-bar">
                    <input
                        type="text"
                        placeholder="Search by Request ID"
                        onChange={(e) => setSearchReqID(e.target.value)}
                        value={searchReqID}
                        className="read-req-search-input"
                    />
                    <button onClick={handleSearch} className="read-req-search-btn">Search</button>
                    <button onClick={resetTable} className="read-req-reset-btn">Reset</button>
                </div>

                <table className="read-req-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Truck Number</th>
                            <th>Driver ID</th>
                            <th>Priority</th>
                            <th>Request Date</th>
                            <th>Truck Capacity</th>
                            <th>Pickup Location</th>
                            <th>Request Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {truckrequests.length > 0 ? (
                            truckrequests.map((requests) => (
                                <tr key={requests.RequestID}>
                                    <td>{requests.RequestID}</td>
                                    <td>{requests.Truck_RegNumber}</td>
                                    <td>{requests.driver_id}</td>
                                    <td>{requests.Priority}</td>
                                    <td>{requests.Request_Date}</td>
                                    <td>{requests.TruckCapacity}</td>
                                    <td>{requests.PickupLocation}</td>
                                    <td className="read-req-status">{requests.RequestStatus}</td>
                                    <td className="read-req-action-bar">
                                        <button className="read-req-edit-btn" onClick={() => EditTruckRequest(requests.RequestID)}>Edit</button>
                                        <button className="read-req-delete-btn" onClick={() => DeleteTruckRequest(requests.RequestID)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No truck requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <button className="read-req-report-btn" onClick={handleGenerateAssignedReport}>
                Generate Assigned Truck Report
            </button>
            <button className="read-req-report-btn" onClick={handleGenerateRequestedReport} style={{ marginLeft: "20px" }}>
                Generate Requested Truck Report
            </button>
        </div>
    );
}

export default ReadAllTruckRequests;
