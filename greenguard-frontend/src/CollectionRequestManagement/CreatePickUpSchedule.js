import Navbar from './components/sideNavBar';
import react, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./styles/CreateTruckRequest.css";

function CreateTruckRequests() {
    //set input values to variables
    const [requestID, setRequestID] = useState("");
    const [truck_RegNumber, setTruck_RegNumber] = useState("");
    const [driver_id, setDriver_id] = useState();
    const [request_Date, setRequest_Date] = useState("");
    const [truckCapacity, setTruckCapacity] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [RequestStatus, setRequestStatus] = useState("Pending");

    //page navigation
    const navigate = useNavigate();

    //Make event to happen after button is clicked
    function sendData(e) {
        e.preventDefault();
        console.log("Function called");
        //Create object to send data to backend
        const newTruckRequest = {
            'RequestID': requestID,
            'Truck_RegNumber': truck_RegNumber,
            'driver_idCapacity': driver_id,
            'Request_Date': request_Date,
            'TruckCapacity': truckCapacity,
            'PickupLocation': pickupLocation,
            'RequestStatus': RequestStatus
        }
        console.log(newTruckRequest);

        axios.post("http://Localhost:8081/requestTruck/addtruckRequest", newTruckRequest).then(() => {
            alert("Truck request Created");
            navigate("/CollectManagerDashboard")
        }).catch((err) => {
            alert(err);
        })
    }

    const [reqID, setReqID] = useState("");
    const [error, setError] = useState("");
    const [DateError, setDateError] = useState("");
    const [capacityError, setcapacityError] = useState("");
    const [requestDate, setRequestDate] = useState(getTodayDate());
    const [pickupAddr, setPickupAddr] = useState("");
    const [destAddr, setDestAddr] = useState("");
    const [errors, setErrors] = useState({ pickup: "", destination: "" });

    // Validation request ID function
    const validateRequestID = (value) => {
        const pattern = /^R\d{3}$/; // R followed by exactly 3 digits
        if (!pattern.test(value)) {
            setError("Request ID must be in the format R000 (R followed by 3 digits).");
        } else {
            setError(""); // Clear error if valid
        }
    };

    //validate date 
    // Function to get today's date in YYYY-MM-DD format
    function getTodayDate() {
        const today = new Date();
        return today.toISOString().split("T")[0];
    }

    // Function to get the maximum allowed date (1 month from today)
    function getMaxDate() {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 1);
        return maxDate.toISOString().split("T")[0];
    }

    // Validation function
    const validateDate = (selectedDate) => {
        const today = new Date(getTodayDate());
        const maxDate = new Date(getMaxDate());
        const chosenDate = new Date(selectedDate);
 
        if (chosenDate < today) {
            setDateError("Date cannot be in the past.");
        } else if (chosenDate > maxDate) {
            setDateError("Date cannot be more than 1 month from today.");
        } else {
            setDateError(""); // Clear error if valid
        }
    };

    // Validate capacity
    const validateCapacity = (value) => {
        const capacity = Number(value);
        if (capacity < 100) {
            setcapacityError("Capacity cannot be less than 100 Kg.");
        } else if (capacity > 6000) {
            setcapacityError("Capacity cannot exceed 6000 Kg.");
        
        } else {
            setcapacityError(""); // Clear error if valid
        }
    };

    // Validation function for address fields
    const validateAddress = (value, field) => {
        const addressPattern = /^[a-zA-Z0-9\s,.\-]{10,}$/; // Allows letters, numbers, spaces, commas, periods, and at least 10 characters

        if (!addressPattern.test(value)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [field]: "Address must be at least 10 characters long and contain only letters, numbers, spaces, commas, and periods."
            }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, [field]: "" })); // Clear error if valid
        }
    };

    return (
        <div className="col1Div">
            <div className="outerDiv">
                <div className="innerDiv1">
                    <Navbar />
                </div>
                <div className="innerDivR">
                    <div class="form-container">
                        <h2>Create Pickup Schedule</h2>
                        <form onSubmit={sendData}>
                            <label for="requestID">Request ID:</label>
                            <input type="text" id="requestID" onChange={(e) => setRequestID(e.target.value)}
                                onBlur={(e) => validateRequestID(e.target.value)} name="requestID" required />.
                            <div className="hint-message">Enter in format R000 (e.g., R123)</div>
                            {error && <div className="error-message">{error}</div>}

                            <label for="requestDate">Request Date:</label>
                            <input type="date" id="requestDate" name="requestDate" min={getTodayDate()} max={getMaxDate()}
                                onChange={(e) => {
                                    setRequest_Date(e.target.value);
                                    validateDate(e.target.value);
                                }} required />
                            {DateError && <div className="error-message">{DateError}</div>}
                            <label for="truckCapacity">Truck Capacity (in Kg):</label>
                            <input type="number" id="truckCapacity" name="truckCapacity" min="0" max="6000"
                                onChange={(e) => {
                                    setTruckCapacity(e.target.value);
                                    validateCapacity(e.target.value);
                                }}
                                required />
                            <div className="hint-message">Capacity must be 1000 - 6000Kg</div>
                            {capacityError && <div className="error-message">{capacityError}</div>}
                            <label for="pickupLocation">Pickup Location:</label>
                            <textarea id="pickupLocation" name="pickupLocation"required></textarea>
                            {errors.pickup && <div className="error-message">{errors.pickup}</div>}
                            
                            {errors.destination && <div className="error-message">{errors.destination}</div>}
                            <label for="status">Status:</label>
                            <input type="text" id="status" value={RequestStatus} name="status" />

                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateTruckRequests;