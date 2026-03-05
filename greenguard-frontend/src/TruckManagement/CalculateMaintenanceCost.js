import Navbar from './Components/SideNav';
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/CalculateMaintenance.css";

function CalculateMaintenanceCost() {
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [regNum, setRegNum] = useState("");
    const [mileage, setMileage] = useState("");
    const [Servicemileage, setServiceMileage] = useState("");
    const [lastServiceDate, setLastServiceDate] = useState("");
    const [status, setStatus] = useState("");
    const [showEmailPopup, setShowEmailPopup] = useState(false);
    const [email, setEmail] = useState("");

    const [mileageError, setMileageError] = useState("");
    const [dateError, setDateError] = useState("");
    const [emailError, setEmailError] = useState("");

    //Get details of all trucks
    useEffect(() => {
        axios.get("http://localhost:8081/truck/")
            .then((response) => {
                setTrucks(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching trucks:", err);
                setError("Failed to load trucks. Please try again.");
                setLoading(false);
            });
    }, []);

    //Function to check maintenance status
    function checkMaintenanceDue(truck) {
        const balKms = truck.mileage - truck.Servicemileage;
        //Greater than 4500 if interval is 5000
        if (balKms > truck.serviceInterval * 0.9) {
            return "Maintenance due soon";
        }

        if (balKms > truck.serviceInterval) {
            return "Maintenance overdue";
        }
        //difference is divided by the number of milliseconds in a day to convert it to days.
        const daysSinceService = (Date.now() - new Date(truck.lastServiceDate)) / (1000 * 60 * 60 * 24);
        //If it has been more than 180 days(6 months)
        if (daysSinceService > 180) {
            return "Maintenance overdue";
        }

        return "All good";
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setMileageError("");
        setDateError("");

        let valid = true;
        const today = new Date();
        const selectedDate = new Date(lastServiceDate);
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(today.getFullYear() - 2);

        //Validate mileage input 
        if (parseFloat(mileage) < 0) {
            setMileageError("Mileage must not be negative.");
            valid = false;
        }

        //Validate date
        if (selectedDate > today) {
            setDateError("Last service date cannot be in the future.");
            valid = false;
        } else if (selectedDate < twoYearsAgo) {
            setDateError("Last service date must be within the past 2 years.");
            valid = false;
        }

        if (!valid) return;

        const truck = {
            regNum,
            mileage: parseFloat(mileage),
            lastServiceDate,
            Servicemileage,
            serviceInterval: 5000
        };

        //Get status from function
        const maintenanceStatus = checkMaintenanceDue(truck);
        setStatus(maintenanceStatus);
    };  

    const handleSendEmail = async () => {
        setEmailError("");

        //Validate Email address
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address.");
            return;
        }

        try {
            const subject = `Truck ${regNum} Maintenance Alert`;
            const message = `Truck ${regNum} status: ${status}. Please schedule a service.`;

            await axios.post("http://localhost:8081/api/send-email", {
                to: email,
                subject,
                message
            });

            alert(`Email sent to ${email}`);
            setShowEmailPopup(false);
            setEmail("");
        } catch (error) {
            console.error("Failed to send email", error);
            alert("Error sending email");
        }
    };

    return (
        <div className="maintCalc-col1Div">
            <div className="maintCalc-outerDiv">
                <div className="maintCalc-innerDiv1">
                    <Navbar />
                </div>
                <div className="maintCalc-innerDivR">
                    <h1 className='maintCalc-header'>Calculate Truck Maintenance</h1>
                    <form className="maintCalc-formlayout" onSubmit={handleSubmit}>
                        <table className="maintCalc-tableW">
                            <tbody>
                                <tr>
                                    <td className="maintCalc-tableLeft">
                                        <div className="maintCalc-formDiv">
                                            <div className="mb-3">
                                                <label className="form-label CalCost-form-label">Truck Registration Number</label>
                                                <select
                                                    className="maintCalc-form-control2"
                                                    required
                                                    value={regNum}
                                                    onChange={(e) => setRegNum(e.target.value)}>
                                                    <option value="">Select a truck</option>
                                                    {trucks.map((truck) => (
                                                        <option key={truck.RegNumber} value={truck.RegNumber}>
                                                            {truck.RegNumber}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label CalCost-form-label">Last Service Mileage (in KM)</label>
                                                <input
                                                    step = "500"
                                                    type="number"
                                                    className="maintCalc-form-control"
                                                    required
                                                    value={Servicemileage}
                                                    onChange={(e) => setServiceMileage(e.target.value)}
                                                />
                                                {mileageError && <div className="maintCalc-error">{mileageError}</div>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label CalCost-form-label">Current Mileage (in KM)</label>
                                                <input
                                                    step = "500"
                                                    type="number"
                                                    className="maintCalc-form-control"
                                                    required
                                                    value={mileage}
                                                    onChange={(e) => setMileage(e.target.value)}
                                                />
                                                {mileageError && <div className="maintCalc-error">{mileageError}</div>}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label CalCost-form-label">Last Service Date</label>
                                                <input
                                                    type="date"
                                                    className="maintCalc-form-control"
                                                    required
                                                    value={lastServiceDate}
                                                    onChange={(e) => setLastServiceDate(e.target.value)}
                                                />
                                                {dateError && <div className="maintCalc-error">{dateError}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="maintCalc-tableRight">
                                        <div className="mb-3">
                                            <label className="form-label marginCalMaint CalCost-form-label">Status</label>
                                            <input type="text" className="maintCalc-form-control" readOnly value={status} />
                                            <div className="form-text">
                                                <span
                                                    className="maintCalc-emailTrigger"
                                                    onClick={() => setShowEmailPopup(true)}>
                                                    Send Email
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <button type="submit" className="maintCalc-btnPadding">Calculate Cost</button>
                    </form>

                    {showEmailPopup && (
                        <div className="maintCalc-popupOverlay">
                            <div className="maintCalc-popupContent">
                                <h4>Send Maintenance Email</h4>
                                <input
                                    type="email"
                                    className="maintCalc-form-control mb-2"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {emailError && <div className="maintCalc-error">{emailError}</div>}
                                <button className="CalcMain-btn-success" onClick={handleSendEmail}>Send</button>
                                <button className="CalcMain-btn-danger" onClick={() => setShowEmailPopup(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CalculateMaintenanceCost;
