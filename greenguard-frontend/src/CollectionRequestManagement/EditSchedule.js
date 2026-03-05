import Navbar from './components/sideNavBar';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./styles/EditSchedule.css";

function EditSchedule() {
    const { ScheduleID } = useParams();
    const navigate = useNavigate();

    const [truck_RegNumber, setTruck_RegNumber] = useState("");
    const [driverId, setDriver_id] = useState("");
    const [pickUpID, setPickUp_ID] = useState("");
    const [comments, setComments] = useState("");
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [scheduleStatus, setScheduleStatus] = useState("Processing");

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const formatTimeWithAmPm = (time24) => {
        if (!time24 || !/^\d{2}:\d{2}$/.test(time24)) return '';
        const [hourStr, minute] = time24.split(':');
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${String(hour).padStart(2, '0')}:${minute} ${ampm}`;
    };

    const convertTo24Hour = (time12h) => {
        const [time, modifier] = time12h.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };

    //Validate schedule date must be within 2 weeks from today
    const validateScheduleDate = (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 7);
        if (selectedDate < today) return "Past dates are not allowed.";
        if (selectedDate > maxDate) return "Date must be within the next 7 days.";
        return "";
    };

    //validate time - must be within 05.00AM to 10.00PM
    const validateScheduleTime = (time) => {
        if (!time || !/^\d{2}:\d{2}$/.test(time)) return "Invalid time format.";
        const [hours, minutes] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        const minTime = 5 * 60;
        const maxTime = 22 * 60;
        if (totalMinutes < minTime || totalMinutes > maxTime) {
            return "Schedule time must be between 5:00 AM and 10:00 PM.";
        }
        return "";
    };

    //Fetch schedule details of specific schedule
    useEffect(() => {
        axios.get(`http://localhost:8081/shedulePickup/getScheduleInfo/${ScheduleID}`)
            .then((response) => {
                const data = response.data.truckScheduleInfo;
                setTruck_RegNumber(data.Truck_RegNumber);
                setDriver_id(data.driver_id);
                setPickUp_ID(data.PickUp_ID);
                setScheduleDate(data.ScheduleDate);
                setComments(data.Comments);
                setScheduleStatus(data.ScheduleStatus);
                setScheduleTime(convertTo24Hour(data.ScheduleTime));
                setLoading(false);
            })
            .catch(() => {
                setErrors((prev) => ({ ...prev, fetch: "Error fetching Schedule details." }));
                setLoading(false);
            });
    }, [ScheduleID]);

    //set new input values to update
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "scheduleDate") {
            setScheduleDate(value);
            setErrors((prev) => ({ ...prev, scheduleDate: validateScheduleDate(value) }));
        } else if (name === "comment") {
            setComments(value);
        } else if (name === "scheduleStatus") {
            setScheduleStatus(value);
        } else if (name === "scheduleTime") {
            setScheduleTime(value);
            setErrors((prev) => ({ ...prev, scheduleTime: validateScheduleTime(value) }));
        }
    };

    //Update schedule
    const UpdateRequestInfo = (e) => {
        e.preventDefault();

        const validationErrors = {
            scheduleDate: validateScheduleDate(scheduleDate),
            scheduleTime: validateScheduleTime(scheduleTime)
        };

        if (validationErrors.scheduleDate || validationErrors.scheduleTime) {
            setErrors(validationErrors);
            return;
        }

        const updateSchedule = {
            ScheduleDate: scheduleDate,
            Comments: comments,
            ScheduleStatus: scheduleStatus,
            ScheduleTime: formatTimeWithAmPm(scheduleTime)
        };

        axios.put(`http://localhost:8081/shedulePickup/updateSchedule/${ScheduleID}`, updateSchedule)
            .then(() => {
                alert("PickUp Schedule updated successfully!");
                navigate("/readSchedules");
            })
            .catch((error) => {
                console.error("Error updating Schedule:", error);
                alert("Failed to update Schedule details.");
            });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="edit-schedule-col1Div">
            <div className="edit-schedule-outerDiv">
                <div className="edit-schedule-innerDiv1">
                    <Navbar />
                </div>
                <div className="edit-schedule-innerDivR">
                    <div className="edit-schedule-form-container">
                        <h2 className="edit-schedule-heading">Update Schedule</h2>
                        <form onSubmit={UpdateRequestInfo} className="edit-schedule-form">
                            <label htmlFor="scheduleID" className="edit-schedule-label">Schedule ID:</label>
                            <input type="text" id="scheduleID" value={ScheduleID} disabled className="edit-schedule-input" />

                            <label htmlFor="pickupID" className="edit-schedule-label">Pickup ID:</label>
                            <input type="text" id="pickupID" value={pickUpID} disabled className="edit-schedule-input" />

                            <label htmlFor="truckRegNumber" className="edit-schedule-label">Truck Reg Number:</label>
                            <input type="text" id="truckRegNumber" value={truck_RegNumber} disabled className="edit-schedule-input" />

                            <label htmlFor="driverID" className="edit-schedule-label">Driver ID:</label>
                            <input type="text" id="driverID" value={driverId} readOnly className="edit-schedule-input" />

                            <label htmlFor="scheduleDate" className="edit-schedule-label">Schedule Date:</label>
                            <input
                                type="date"
                                id="scheduleDate"
                                name="scheduleDate"
                                value={scheduleDate}
                                onChange={handleChange}
                                required
                                className="edit-schedule-input"
                            />
                            {errors.scheduleDate && <p className="edit-schedule-error">{errors.scheduleDate}</p>}

                            <label htmlFor="scheduleTime" className="edit-schedule-label">Schedule Time:</label>
                            <input
                                type="time"
                                id="scheduleTime"
                                name="scheduleTime"
                                value={scheduleTime}
                                onChange={handleChange}
                                required
                                className="edit-schedule-input"
                            />
                            {errors.scheduleTime && <p className="edit-schedule-error">{errors.scheduleTime}</p>}

                            <label htmlFor="comment" className="edit-schedule-label">Comment:</label>
                            <textarea
                                id="comment"
                                name="comment"
                                value={comments}
                                onChange={handleChange}
                                required
                                className="edit-schedule-textarea"
                            ></textarea>

                            <label htmlFor="scheduleStatus" className="edit-schedule-label">Schedule Status:</label>
                            <select
                                id="scheduleStatus"
                                name="scheduleStatus"
                                value={scheduleStatus}
                                onChange={handleChange}
                                required
                                className="edit-schedule-select"
                            >
                                <option value="Processing">Processing</option>
                                <option value="Ready for pickup">Ready for pickup</option>
                            </select>

                            <button type="submit" className="edit-schedule-submit-button">Submit</button>
                        </form>
                        {errors.fetch && <p className="edit-schedule-error">{errors.fetch}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditSchedule;





