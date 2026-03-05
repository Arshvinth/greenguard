import Navbar from './Components/SideNav';
import react, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "../TruckManagement/styles/AddTrucks.css";

function AddTrucks() {
    const [regNumber, setRegNum] = useState("");
    const [model, setModel] = useState("");

    const [capacity, setCapacity] = useState("");
    const [insurance_Expiry, setInsurDate] = useState("");
    const [inspection__date, setInspectDate] = useState("");
    const [collection_center_id, setCollectID] = useState(100);
    const [driver_id, setDriverID] = useState("");
    const [isActive, setStatus] = useState("");

    //Driver array
    const [drivers, setDriver] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const navigate = useNavigate();

    //Add truck function
    const sendData = (e) => {
        e.preventDefault();
        const newTruck = {
            'RegNumber': regNumber,
            'Model': model,
            'Capacity': capacity,
            'Insurance_Expiry': insurance_Expiry,
            'Inspection__date': inspection__date,
            'Collection_center_id': collection_center_id,
            'driver_id': driver_id,
            'isActive': isActive
        };

        console.log(newTruck);

        axios.post("http://localhost:8081/truck/addTruck", newTruck)
            .then(() => {
                alert("Truck added");
                navigate("/truck");
            }).catch((err) => {
                alert(err);
            });
    }

    //Get driver ID function
    useEffect(() => {
        axios.get("http://localhost:8081/user/drivers")
            .then((response) => {
                setDriver(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching Drivers:", err);
                setError("Failed to load Driver. Please try again.");
                setLoading(false);
            });
    }, []);

    const [truckIDError, setTruckIDError] = useState("");
    const [capacityError, setCapacityError] = useState("");
    const [inspectionDateError, setInspectionDateError] = useState("");
    const [insuranceDateError, setInsuranceDateError] = useState("");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = today.toISOString().split("T")[0];

    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    const maxDate = oneYearLater.toISOString().split("T")[0];

    //Validate inspection and Insurance
    const validateFutureDateWithinOneYear = (date, setError) => {
        const selectedDate = new Date(date);
        if (selectedDate <= today) {
            setError("Date must be in the future.");
            return false;
        } else if (selectedDate > oneYearLater) {
            setError("Date cannot be more than 1 year from today.");
            return false;
        }
        setError("");
        return true;
    };

    const handleDateChange = (e, setterFunction, setError) => {
        const value = e.target.value;
        setterFunction(value);
        validateFutureDateWithinOneYear(value, setError);
    };

    //Validate truck ID
    const validateTruckID = (value) => {
        const regex = /^(?:[A-Za-z]{2}-\d{4}|\d{2,3}-\d{4})$/;
        if (!regex.test(value)) {
            setTruckIDError("Invalid Truck ID format. Use XX-0000, 00-0000, or 000-0000.");
            return false;
        }
        setTruckIDError("");
        return true;
    };

    const handleTruckIDBlur = (e) => {
        const value = e.target.value;
        if (!validateTruckID(value)) {
            setRegNum("");
        } else {
            setRegNum(value);
        }
    };

    //Validate truck capacity to be within 1800 to 3600 Kg
    const validateCapacity = (value) => {   
        let numValue = parseInt(value, 10);
        if (isNaN(numValue) || numValue < 1800 || numValue > 6000) {
            setCapacityError("Capacity must be between 1800Kg and 6000Kg.");
            return false;
        }
        setCapacityError("");
        return true;
    };

    const handleCapacityBlur = (e) => {
        let value = parseInt(e.target.value, 10);
        if (!validateCapacity(value)) {
            setCapacity("");
        } else {
            let roundedValue = Math.round(value / 100) * 100;
            setCapacity(roundedValue);
        }
    };

    return (
        <div className="addTruck-col1Div">
            <div className="addTruck-outerDiv">
                <div className="addTruck-innerDiv1">
                    <Navbar />
                </div>
                <div className="addTruck-innerDivR">
                    <h1 className='addTruck-header'>Add Trucks</h1>
                    <form className="addTruck-formlayout" onSubmit={sendData}>
                        <table className="addTruck-tableW">
                            <td className="addTruck-tableLeft">
                                <div className="addTruck-formDiv">
                                    <div className="addTruck-mb-3">
                                        <label htmlFor="regNum" className="addTruck-form-label">Registration Number</label>
                                        <input type="text" className="addTruck-form-control" name="regNum" onChange={(e) => setRegNum(e.target.value)} onBlur={handleTruckIDBlur} required />
                                        {truckIDError && <div className="addTruck-error-message">{truckIDError}</div>}
                                    </div>
                                    <div className="addTruck-mb-3">
                                        <label htmlFor="selectModel" className="addTruck-form-label">Select Model</label>
                                        <select className="addTruck-select" onChange={(e) => setModel(e.target.value)} required>
                                            <option value="" disabled selected>Select truck Model</option>
                                            <option value="Izusu">Izusu</option>
                                            <option value="Volvo">Volvo</option>
                                            <option value="Force">Force</option>
                                            <option value="Toyota">Toyota</option>
                                            <option value="Mitzubishi">Mitzubishi</option>
                                        </select>
                                    </div>
                                    <div className="addTruck-mb-3">
                                        <label htmlFor="capacity" className="addTruck-form-label">Capacity</label>
                                        <input type="number" className="addTruck-form-control" min="1800" max="6000" step="100"
                                            onChange={(e) => setCapacity(e.target.value)}
                                            onBlur={handleCapacityBlur}
                                            required />
                                        {capacityError && <div className="addTruck-error-message">{capacityError}</div>}
                                    </div>
                                    <div className="addTruck-mb-3">
                                        <label htmlFor="collectID" className="addTruck-form-label">Collection Center ID</label>
                                        <input type="text" className="addTruck-form-control" value={collection_center_id} onChange={(e) => setCollectID(e.target.value)} disabled required />
                                    </div>
                                </div>
                            </td>
                            <td className="addTruck-TableRight">
                                <table className="addTruck-tableSmall">
                                    <td>
                                        <div className="addTruck-mb-3">
                                            <label className="addTruck-form-label">Insurance Expiry</label>
                                            <input type="date" className="addTruck-form-control" min={minDate} max={maxDate}
                                                onChange={(e) => handleDateChange(e, setInsurDate, setInsuranceDateError)}
                                                required />
                                            {insuranceDateError && <div className="addTruck-error-message">{insuranceDateError}</div>}
                                        </div>
                                    </td>
                                    <td className="addTruck-tableSmallLeft">
                                        <div className="addTruck-mb-3">
                                            <label className="addTruck-form-label">Inspection Date</label>
                                            <input type="date" className="addTruck-form-control" min={minDate} max={maxDate}
                                                onChange={(e) => handleDateChange(e, setInspectDate, setInspectionDateError)}
                                                required />
                                            {inspectionDateError && <div className="addTruck-error-message">{inspectionDateError}</div>}
                                        </div>
                                    </td>
                                </table>
                                <div className="addTruck-mb-3">
                                    <label className="addTruck-form-label">Driver</label>
                                    <select className="addTruck-select" onChange={(e) => setDriverID(e.target.value)} required>
                                        <option value="">Select a Driver</option>
                                        {drivers.map((driver) => (
                                            <option key={driver._id} value={driver.driverID}>
                                                {driver.driverID} - {driver.first_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="addTruck-mb-3">
                                    <label className="addTruck-form-label">Truck Status</label>
                                    <div className="addTruck-form-check">
                                        <input type="checkbox" className="addTruck-form-check-input" onChange={(e) => setStatus(e.target.checked)} />
                                        <label className="addTruck-form-check-label">Active</label>
                                    </div>
                                </div>
                            </td>
                        </table>
                        <button type="submit" className="addTruck-btn addTruck-btnPrimary">Submit</button>
                        <button type="button" className="addTruck-btn addTruck-btnSecondary" onClick={() => navigate("/truck")}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddTrucks;
