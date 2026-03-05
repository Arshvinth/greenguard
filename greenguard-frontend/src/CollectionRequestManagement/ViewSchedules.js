import BackBtn from "./components/BackBtn";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/viewShedules.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ViewSchedules() {
    const [pickUpSchedules, setSchedules] = useState([]);
    const [allSchedules, setAllSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchDate, setSearchDate] = useState("");

    const navigate = useNavigate();

    //Fetch all created schedule records
    useEffect(() => {
        axios.get("http://localhost:8081/shedulePickup/getAllSchedule")
            .then((response) => {
                setSchedules(response.data);
                setAllSchedules(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching Schedules:", err);
                setError("Failed to load Schedules. Please try again.");
                setLoading(false);
            });
    }, []);

    //Search function by schedule date
    const handleSearch = () => {
        if (!searchDate.trim()) return;
        axios.get(`http://localhost:8081/shedulePickup/SearchSchedule/${searchDate}`)
            .then((res) => {
                setSchedules(res.data.schedules);
            })
            .catch((err) => {
                console.error("Search error:", err);
                setSchedules([]);
            });
    };

    //reset table after search
    const resetTable = () => {
        setSchedules(allSchedules);
        setSearchDate("");
    };  

    //Delete specific record
    function DeleteSchedule(schedule_ID) {
        if (window.confirm(`Are you sure you want to delete schedule with schedule Number: ${schedule_ID}?`)) {
            axios.delete(`http://localhost:8081/shedulePickup/deleteSchedule/${schedule_ID}`)
                .then(() => {
                    alert("Schedule deleted successfully!");
                    setSchedules(prev => prev.filter(s => s.Schedule_ID !== schedule_ID));
                })
                .catch((error) => {
                    console.error("Error deleting schedule:", error);
                    alert("Failed to delete schedule.");
                });
        }
    }

    //Navigate to edit schedule page
    function UpdateSchedule(schedule_ID) {
        navigate(`/EditSchedule/${schedule_ID}`);
    }

    if (loading) return <p>Loading schedules...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    //Generate all schedule report function
    const generatePDFReport = (data, title = "All Schedules Report") => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(title, 14, 15);
        autoTable(doc, {
            head: [[
                "Schedule ID", "PickUp ID", "Truck Number", "Driver ID",
                "Schedule Date", "Comments", "Status"
            ]],
            body: data.map((schedule) => [
                schedule.Schedule_ID,
                schedule.PickUp_ID,
                schedule.Truck_RegNumber,
                schedule.driver_id,
                schedule.ScheduleDate,
                schedule.Comments,
                schedule.ScheduleStatus,
            ]),
            startY: 25,
        });
        doc.text(`Total Records: ${data.length}`, 14, doc.lastAutoTable.finalY + 10);
        doc.save(`${title}.pdf`);
    };

    const handleGenerateAll = () => generatePDFReport(pickUpSchedules, "All Schedules Report");

    //generate report only for past month from today
    const handleGeneratePastMonth = () => {
        const today = new Date();
        const pastMonth = new Date();
        pastMonth.setMonth(today.getMonth() - 1);
        const filteredData = pickUpSchedules.filter((schedule) => {
            const scheduleDate = new Date(schedule.ScheduleDate);
            return scheduleDate >= pastMonth && scheduleDate <= today;
        });
        generatePDFReport(filteredData, "Schedules - Past Month");
    };

    return (
        <div className="view-schedules-Outline">
            <BackBtn />
            <h2 className="view-schedules-title">View Schedules</h2>

            <div className="view-schedules-table-container">
                <div className="view-schedules-search-bar">
                    <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="view-schedules-search-input"
                    />
                    <button onClick={handleSearch} className="view-schedules-search-btn">Search</button>
                    <button onClick={resetTable} className="view-schedules-reset-btn">Reset</button>
                </div>

                <table className="view-schedules-request-table">
                    <thead>
                        <tr>
                            <th>Schedule ID</th>
                            <th>PickUp ID</th>
                            <th>Truck Number</th>
                            <th>Driver ID</th>
                            <th>Schedule Date</th>
                            <th>Time</th>
                            <th>Comments</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pickUpSchedules.length > 0 ? (
                            pickUpSchedules.map((schedule) => (
                                <tr key={schedule.Schedule_ID}>
                                    <td>{schedule.Schedule_ID}</td>
                                    <td>{schedule.PickUp_ID}</td>
                                    <td>{schedule.Truck_RegNumber}</td>
                                    <td>{schedule.driver_id}</td>
                                    <td>{schedule.ScheduleDate}</td>
                                    <td>{schedule.ScheduleTime}</td>
                                    <td>{schedule.Comments}</td>
                                    <td className="view-schedules-status-pending">{schedule.ScheduleStatus}</td>
                                    <td className="view-schedules-action-bar">
                                        <button className="view-schedules-edit-btn" onClick={() => UpdateSchedule(schedule.Schedule_ID)}>Edit</button>
                                        <button className="view-schedules-delete-btn" onClick={() => DeleteSchedule(schedule.Schedule_ID)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No schedules found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="view-schedules-report-btns">
                <button className="view-schedules-report-btn" onClick={handleGenerateAll}>Generate overall Report</button>
                <button className="view-schedules-report-btn" onClick={handleGeneratePastMonth} style={{ marginLeft: "20px" }}>
                    Generate for past 1 month
                </button>
            </div>
        </div>
    );
}

export default ViewSchedules;
