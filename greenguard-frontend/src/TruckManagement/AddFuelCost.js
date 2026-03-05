import Navbar from './Components/SideNav';
import react, { useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./styles/AddFuel.css";

function AddFuelCost() {
    const { regNum } = useParams(); // Get RegNumber from URL
    //set input values to variables
    const [regNumber, setRegNum] = useState(regNum);
    const [fuelDate, setFuelDate] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [fuelCost, setFuelCost] = useState("");
    const [litres, setLitres] = useState("");
    const [Status, setStatus] = useState("Pending");

    const navigate = useNavigate();

    //Make event to happen after button is clicked
    function sendData(e) {
        e.preventDefault();
        console.log("Function called");

        //Create object to send data to backend
        const newFuelCost = {
            'Truck_RegNum': regNumber,
            'Fuel_Date': fuelDate,
            'FuelType': fuelType,
            'FuelCost': fuelCost,
            'Litres': litres,
            'Status': Status,
        }
        console.log(newFuelCost);

        axios.post("http://localhost:8081/FuelCost/addFuelCost", newFuelCost).then(() => {
            alert("Fuel Cost added");
            navigate("/truck")
        }).catch((err) => {
            alert(err);
        })
    }

    const [fuelDateError, setFuelDateError] = useState("");
    const [fuelCostError, setFuelCostError] = useState("");
    const [litresError, setLitresError] = useState("");

    // Validate Fuel Date
    const validateFuelDate = (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        oneMonthAgo.setHours(0, 0, 0, 0); // Reset time for accurate comparison

        if (selectedDate < oneMonthAgo) {
            setFuelDateError("Fuel date cannot be older than 1 month.");
            return false;
        }

        if (selectedDate.getTime() > today.getTime()) {
            setFuelDateError("Fuel date cannot be in the future.");
            return false;
        }

        setFuelDateError(""); // Clear error if valid
        return true;
    };

    const handleFuelDateChange = (e) => {
        const value = e.target.value;
        setFuelDate(value);

        validateFuelDate(value); // Validate while user types
    };

    // Validate Fuel Cost 
    const validateFuelCost = (value) => {
        const fuelCostRegex = /^\d+(\.\d{1,2})?$/;

        if (!fuelCostRegex.test(value)) {
            setFuelCostError("Enter a valid number with up to 2 decimal places (e.g., 1000, 250.50).");
            return false;
        }

        if (parseFloat(value) <= 0) {
            setFuelCostError("Fuel cost must be greater than 0.");
            return false;
        }

        setFuelCostError(""); // No error
        return true;
    };

    //Get cost with 2 decimal places
    const handleFuelCostChange = (e) => {
        const value = e.target.value;

        if (!/^\d*\.?\d{0,2}$/.test(value)) return;

        setFuelCost(value);
        validateFuelCost(value);
    };

    const handleFuelCostBlur = (e) => {
        const value = e.target.value.trim();
        if (value) validateFuelCost(value);
    };

    // Validate Litres
    const validateLitres = (value) => {
        const litresRegex = /^\d+(\.\d{1,2})?$/;

        if (!litresRegex.test(value)) {
            setLitresError("Enter a valid number with up to 2 decimal places (e.g., 50, 120.5, 75.25).");
            return false;
        }

        if (parseFloat(value) <= 0) {
            setLitresError("Litres must be greater than 0.");
            return false;
        }

        setLitresError(""); // No error
        return true;
    };

    //Get litres with 2 decimal places
    const handleLitresChange = (e) => {
        const value = e.target.value;

        if (!/^\d*\.?\d{0,2}$/.test(value)) return;

        setLitres(value);
        validateLitres(value);
    };

    const handleLitresBlur = (e) => {
        const value = e.target.value.trim();
        if (value) validateLitres(value);
    };

    return (
        <div className="fuel-cost-mainbox">
            <div className="af-left-navbar">
                <Navbar />
            </div>
            <form className="fuel-cost-form-wrapper" onSubmit={sendData}>
                <h2 className="fuel-cost-heading">Add Fuel Cost</h2>
                <div className="fuel-cost-group">
                    <label htmlFor="regNumber" className="fuel-cost-label">Truck Number</label>
                    <input type="text" className="fuel-cost-input" name="regNumber" id="regNumber" value={regNum} readOnly required />
                    <div className="fuel-cost-hint">Truck ID is filled</div>
                </div>
                <div className="fuel-cost-group">
                    <label htmlFor="FuelDate" className="fuel-cost-label">Fuel Date</label>
                    <input type="date" className="fuel-cost-input" name="FuelDate" id="fuelDate"
                        onChange={handleFuelDateChange} required />
                    {fuelDateError && <div className="fuel-cost-error-message">{fuelDateError}</div>}
                </div>
                <div className="fuel-cost-group">
                    <label htmlFor="FuelType" className="fuel-cost-label">Fuel Type</label>
                    <select className="fuel-cost-input2" id="fuelType" name="FuelType"
                        onChange={(e) => setFuelType(e.target.value)}>
                        <option value="" disabled selected>Select Type</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                    </select>
                </div>
                <div className="fuel-cost-group">
                    <label htmlFor="cost" className="fuel-cost-label">Fuel Cost</label>
                    <input type="text" className="fuel-cost-input" name="cost" id="fuelCost"
                        onChange={handleFuelCostChange} onBlur={handleFuelCostBlur} required />
                    {fuelCostError && <div className="fuel-cost-error-message">{fuelCostError}</div>}
                </div>
                <div className="fuel-cost-group">
                    <label htmlFor="fuelLitres" className="fuel-cost-label">Litres</label>
                    <input type="text" className="fuel-cost-input" name="fuelLitres" id="FuelLitres"
                        onChange={handleLitresChange} onBlur={handleLitresBlur} required />
                    {litresError && <div className="fuel-cost-error-message">{litresError}</div>}
                </div>
                <div className="fuel-cost-group">
                    <label htmlFor="status" className="fuel-cost-label">Status</label>
                    <input type="text" className="fuel-cost-input" name="status" value={Status} id="status" readOnly />
                </div>
                <div className="fuel-cost-button-section">
                    <button type="submit" className="fuel-cost-button fuel-cost-submit">Submit</button>
                    <button type="button" className="fuel-cost-button fuel-cost-cancel">Cancel</button>
                </div>
            </form>
        </div>

    );
}

export default AddFuelCost;