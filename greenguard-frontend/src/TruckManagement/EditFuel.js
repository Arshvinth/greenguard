import Navbar from './Components/SideNav';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import "./styles/EditFuel.css";

function EditFuelCost() {
    const { costID } = useParams();
    const navigate = useNavigate();

    const [truck_RegNumber, setTruck_RegNum] = useState("");
    const [fuelDate, setFuelDate] = useState("");
    const [fuelType, setFuelType] = useState("");
    const [fuelCost, setFuelCost] = useState("");
    const [litres, setLitres] = useState("");

    const [fuelDateError, setFuelDateError] = useState("");
    const [fuelCostError, setFuelCostError] = useState("");
    const [litresError, setLitresError] = useState("");

    //Get details of particular fuel cost
    useEffect(() => {   
        axios.get(`http://localhost:8081/FuelCost/getOneFuelCost/${costID}`)
            .then((response) => {
                const data = response.data.FuelCostInfo;
                setTruck_RegNum(data.Truck_RegNum);
                setFuelDate(data.Fuel_Date);
                setFuelType(data.FuelType);
                setFuelCost(data.FuelCost);
                setLitres(data.Litres);
            })
            .catch(() => {
                alert("Error fetching fuel cost details.");
            });
    }, [costID]);

    // Validation Functions
    const validateFuelDate = (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        oneMonthAgo.setHours(0, 0, 0, 0);

        if (selectedDate < oneMonthAgo) {
            setFuelDateError("Fuel date cannot be older than 1 month.");
            return false;
        }
        if (selectedDate > today) {
            setFuelDateError("Fuel date cannot be in the future.");
            return false;
        }
        setFuelDateError("");
        return true;
    };

    const handleFuelDateChange = (e) => {
        const value = e.target.value;
        setFuelDate(value);
        validateFuelDate(value);
    };

    //Validate fuel cost
    const validateFuelCost = (value) => {
        const regex = /^\d+(\.\d{1,2})?$/;
        if (!regex.test(value)) {
            setFuelCostError("Enter a valid number (e.g., 1000, 250.50).");
            return false;
        }
        if (parseFloat(value) <= 0) {
            setFuelCostError("Fuel cost must be greater than 0.");
            return false;
        }
        setFuelCostError("");
        return true;
    };

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

    //Validate litres
    const validateLitres = (value) => {
        const regex = /^\d+(\.\d{1,2})?$/;
        if (!regex.test(value)) {
            setLitresError("Enter a valid number (e.g., 50.5).");
            return false;
        }
        if (parseFloat(value) <= 0) {
            setLitresError("Litres must be greater than 0.");
            return false;
        }
        setLitresError("");
        return true;
    };

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

    //Update record with new data
    const handleUpdate = (e) => {
        e.preventDefault();

        const isValidDate = validateFuelDate(fuelDate);
        const isValidCost = validateFuelCost(fuelCost);
        const isValidLitres = validateLitres(litres);

        if (!isValidDate || !isValidCost || !isValidLitres) {
            alert("Please fix all validation errors before submitting.");
            return;
        }

        const updatedFuel = {
            Fuel_Date: fuelDate,
            FuelType: fuelType,
            FuelCost: fuelCost,
            Litres: litres
        };

        axios.put(`http://localhost:8081/FuelCost/updateFuelCost/${costID}`, updatedFuel)
            .then(() => {
                alert("Fuel cost updated successfully.");
                navigate("/truck");
            })
            .catch(() => {
                alert("Failed to update fuel cost.");
            });
    };

    return (
        <div className="efc-container">
            <div className="efc-left-navbar">
                <Navbar />
            </div>
            <div className="efc-right-form">
                <form className="efc-form-layout" onSubmit={handleUpdate}>
                    <h2 className="efc-topic">Edit Fuel Cost</h2>

                    <div className="efc-form-group">
                        <label className="efc-form-label">Truck Number</label><br />
                        <input type="text" className="efc-form-control" value={truck_RegNumber} readOnly />
                    </div>

                    <div className="efc-form-group">
                        <label className="efc-form-label">Fuel Date</label><br />
                        <input type="date" className="efc-form-control1" value={fuelDate}
                            onChange={handleFuelDateChange} required />
                        {fuelDateError && <div style={{ color: 'red' }}>{fuelDateError}</div>}
                    </div>

                    <div className="efc-form-group">
                        <label className="efc-form-label">Fuel Type</label><br />
                        <select className="efc-form-control3" value={fuelType}
                            onChange={(e) => setFuelType(e.target.value)} required>
                            <option value="" disabled>Select Type</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                        </select>
                    </div>

                    <div className="efc-form-group">
                        <label className="efc-form-label">Fuel Cost (LKR)</label><br />
                        <input type="text" className="efc-form-control" value={fuelCost}
                            onChange={handleFuelCostChange}
                            onBlur={handleFuelCostBlur} required />
                        {fuelCostError && <div style={{ color: 'red' }}>{fuelCostError}</div>}
                    </div>

                    <div className="efc-form-group">
                        <label className="efc-form-label">Litres</label><br />
                        <input type="text" className="efc-form-control" value={litres}
                            onChange={handleLitresChange}
                            onBlur={handleLitresBlur} required />
                        {litresError && <div style={{ color: 'red' }}>{litresError}</div>}
                    </div>

                    <div className="efc-button-group">
                        <button type="submit" className="efc-btn efc-btn-primary">Update</button>
                        <button type="button" className="efc-btn efc-btn-secondary" onClick={() => navigate("/truck")}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditFuelCost;
