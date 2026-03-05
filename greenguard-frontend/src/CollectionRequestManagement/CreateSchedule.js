import Navbar from './components/sideNavBar';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./styles/CreateSchedule.css";

function CreateSchedule() {
    const { truckReqID } = useParams();
    const navigate = useNavigate();

    const [truck_RegNumber, setTruck_RegNumber] = useState("");
    const [driverId, setDriver_id] = useState("");
    const [scheduleID, setSchedule_ID] = useState("");

    const [sendSMS, setSendSMS] = useState(false);

    const [pickUpID, setPickUp_ID] = useState("");
    const [pickUpDate, setReqPickUpDate] = useState("");
    const [pickupTell, setPickupTell] = useState("");

    const [comments, setComments] = useState("");
    const [scheduleTime, setScheduleTime] = useState("");
    const [scheduleDate, setScheduleDate] = useState("");
    const [scheduleStatus, setScheduleStatus] = useState("Processing");
    const [errors, setErrors] = useState({});

    //Fetch latest schedule ID
    useEffect(() => {
        axios.get("http://localhost:8081/shedulePickup/latestScheduleID")
            .then(response => {
                setSchedule_ID(response.data.newSchedule_ID);
            })
            .catch(error => {
                console.error("Error fetching latest schedule ID:", error);
            });
    }, []);

    //Fetch truck request details
    useEffect(() => {
        axios.get(`http://localhost:8081/requestTruck/gettruckRequest/${truckReqID}`)
            .then((response) => {
                const data = response.data.truckRequestInfo;
                setTruck_RegNumber(data.Truck_RegNumber);
                setDriver_id(data.driver_id);
                setPickUp_ID(data.PickUp_ID);
            })
            .catch(() => {
                setErrors((prev) => ({ ...prev, pickup: "Error fetching truck request details." }));
            });
    }, [truckReqID]);

    //Fetch pickup details of particular pickup
    useEffect(() => {
        if (pickUpID) {
            axios.get(`http://localhost:8081/pickupRequests/getPickupInfo/${pickUpID}`)
                .then((response) => {
                    const data = response.data.pickUpInfo;
                    setReqPickUpDate(data.PickupDate);
                    setPickupTell(data.Phone);
                })
                .catch(() => {
                    console.error("Error fetching pickup details.");
                });
        }
    }, [pickUpID]);


    //Validate schedule date must be within 2 weeks from today
    const validateScheduleDate = (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 14);

        if (selectedDate < today) {
            return "Past dates are not allowed.";
        } else if (selectedDate > maxDate) {
            return "Date must be within the next two weeks.";
        }
        return "";
    };

    //Error message while selecting wrong date
    const handleScheduleDateChange = (e) => {
        const date = e.target.value;
        const errorMessage = validateScheduleDate(date);
        setErrors((prev) => ({ ...prev, scheduleDate: errorMessage }));
        setScheduleDate(date);
    };

    //validate time - must be within 05.00AM to 10.00PM
    const handleTimeChange = (e) => {
        const time = e.target.value;
        const [hour, minute] = time.split(":").map(Number);
        if ((hour >= 22 && hour <= 23) || (hour >= 0 && hour < 5)) {
            setErrors((prev) => ({ ...prev, scheduleTime: "Time must be between 5:00 AM and 10:00 PM." }));
        } else {
            setErrors((prev) => ({ ...prev, scheduleTime: "" }));
        }
        setScheduleTime(time);
    };

    const convertTo12Hour = (timeStr) => {
        const [hour, minute] = timeStr.split(":");
        const hourNum = parseInt(hour);
        const ampm = hourNum >= 12 ? "PM" : "AM";
        const hour12 = hourNum % 12 || 12;
        return `${hour12}:${minute} ${ampm}`;
    };
    
    //Send input data to backend 
    const sendData = async (e) => {
        e.preventDefault();

        if (errors.scheduleDate || errors.scheduleTime) {
            alert("Please fix the errors before submitting.");
            return;
        }

        const formattedTime = convertTo12Hour(scheduleTime);

        const newPickUpSchedule = {
            Schedule_ID: scheduleID,
            PickUp_ID: pickUpID,
            Truck_RegNumber: truck_RegNumber,
            driver_id: driverId,
            ScheduleDate: scheduleDate,
            Comments: comments,
            ScheduleStatus: scheduleStatus,
            ScheduleTime: formattedTime
        };

        try {
            await axios.post("http://localhost:8081/shedulePickup/addPickUpSchedule", newPickUpSchedule);
            await axios.put(`http://localhost:8081/requestTruck/updateStatus/${truckReqID}`, {
                RequestStatus: "Scheduled"
            });

            if (sendSMS && pickupTell) {
                const smsMessage =
                    `E-waste Pickup Scheduled!\n` +
                    `ID: ${pickUpID}\n` +
                    `Truck: ${truck_RegNumber}\n` +
                    `Date: ${scheduleDate}\n` +
                    `Time: ${formattedTime}`;
                await axios.post("http://localhost:8081/sms/send", {
                    to: '+94' + pickupTell,
                    message: smsMessage
                });
            }

            alert("Schedule created successfully!");
            navigate("/CollectManagerDashboard");
        } catch (err) {
            console.error(err);
            alert("Error occurred while creating schedule, updating status or sending SMS.");
        }
    };

    return (
        <div className="Csched-outerDiv">
            <div className="Csched-innerDiv1">
                <Navbar />
            </div>
            <div className="Csched-innerDivR">
                <div className="cs-form-container">
                    <div className="cs-title">Create Schedule</div>
                    <form onSubmit={sendData} className="cs-form">
                        <label className="cs-label">Schedule ID:</label>
                        <input className="cs-input" type="text" value={scheduleID} disabled />
                        <div className="cs-hint-message">Check Schedule ID</div>

                        <label className="cs-label">Pickup ID:</label>
                        <input className="cs-input" type="text" value={pickUpID} disabled />

                        <label className="cs-label">Truck Reg Number:</label>
                        <input className="cs-input" type="text" value={truck_RegNumber} disabled />

                        <label className="cs-label">Driver ID:</label>
                        <input className="cs-input" type="text" value={driverId} readOnly />

                        <label className="cs-label">Time:</label>
                        <input
                            className="cs-input"
                            type="time"
                            onChange={handleTimeChange}
                            required
                        />
                        {errors.scheduleTime && <div className="cs-error-message">{errors.scheduleTime}</div>}

                        <label className="cs-label">Schedule Date:</label>
                        <input
                            className="cs-input"
                            type="date"
                            value={scheduleDate}
                            onChange={handleScheduleDateChange}
                            required
                        />
                        {errors.scheduleDate && <div className="cs-error-message">{errors.scheduleDate}</div>}

                        <label className="cs-label">Comment:</label>
                        <textarea
                            className="cs-textarea"
                            onChange={(e) => setComments(e.target.value)}
                            required
                        ></textarea>

                        <label className="cs-label">Schedule Status:</label>
                        <select
                            className="cs-select"
                            value={scheduleStatus}
                            onChange={(e) => setScheduleStatus(e.target.value)}
                            required
                        >
                            <option value="Processing">Processing</option>
                            <option value="Ready for pickup">Ready for pickup</option>
                        </select>

                        <div className="cs-checkbox-container">
                            <input
                                type="checkbox"
                                checked={sendSMS}
                                onChange={(e) => setSendSMS(e.target.checked)}
                            />
                            <span>&nbsp;&nbsp;</span>
                            <span className="cs-label">Send SMS to customer</span>
                        </div>

                        {sendSMS && (
                            <div className="cs-sms-input">
                                <label className="cs-label">Recipient Phone</label>
                                <input className="cs-input" type="text" value={'+94' + pickupTell} disabled />
                            </div>
                        )}

                        <button className="cs-button" type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateSchedule;

