import Navbar from './Components/SideNav';
import React, { useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import "./styles/AddMaintainanceCost.css";

function AddMaintenanceCost() {
    const { regNum } = useParams();
    const [maintenance_Date, setMaintenance_Date] = useState("");
    const [truckRegNum] = useState(regNum);
    const [maintenanceType, setMaintenanceType] = useState("");
    const [truckCost, setTruckCost] = useState("");
    const [description, setDescription] = useState("");
    const [status] = useState("Pending");
    const navigate = useNavigate();

    //Send input data to backend
    function sendData(e) {
        e.preventDefault();

        const newMaintenanceCost = {
            Truck_RegNum: truckRegNum,
            Maintenance_Date: maintenance_Date,
            maintenance_type: maintenanceType,
            Cost: truckCost,
            Description: description,
            Status: status,
        };

        axios.post("http://localhost:8081/Maintenance/addTruckCost", newMaintenanceCost).then(() => {
            alert("Cost added");
            navigate("/truck");
        }).catch((err) => {
            alert(err);
        });
    }

    const [maintenanceDateError, setMaintenanceDateError] = useState("");
    const [expenseError, setExpenseError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");

    //Maintenance date validation
    const validateMaintenanceDate = (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        oneMonthAgo.setHours(0, 0, 0, 0);

        if (selectedDate < oneMonthAgo) {
            setMaintenanceDateError("Maintenance date cannot be older than 1 month.");
            return false;
        } else if (selectedDate > today) {
            setMaintenanceDateError("Maintenance date cannot be in the future.");
            return false;
        }

        setMaintenanceDateError("");
        return true;
    };

    const handleMaintenanceDateChange = (e) => {
        const value = e.target.value;
        setMaintenance_Date(value);
        validateMaintenanceDate(value);
    };

    //Expense validation
    const validateExpense = (value) => {
        const expenseRegex = /^\d+(\.\d{1,2})?$/;

        if (!expenseRegex.test(value)) {
            setExpenseError("Invalid amount. Enter a number (e.g., 1000 or 250.50).");
            return false;
        }

        if (parseFloat(value) <= 0) {
            setExpenseError("Expense must be greater than 0.");
            return false;
        }

        setExpenseError("");
        return true;
    };

    const handleExpenseBlur = (e) => {
        const value = e.target.value.trim();
        if (value && !validateExpense(value)) {
            setTruckCost("");
        } else {
            setTruckCost(value);
        }
    };

    const handleExpenseChange = (e) => {
        setTruckCost(e.target.value);
    };

    //Validate description
    const validateDescription = (value) => {
        const trimmedValue = value.trim();
        if (trimmedValue.length < 10) {
            setDescriptionError("Description must be at least 10 characters.");
            return false;
        }
        if (trimmedValue.length > 500) {
            setDescriptionError("Description cannot exceed 500 characters.");
            return false;
        }
        setDescriptionError("");
        return true;
    };

    const handleDescriptionBlur = (e) => {
        const value = e.target.value;
        if (value.trim() && !validateDescription(value)) {
            setDescription("");
        } else {
            setDescription(value.trim());
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    return (
        <div className="amc-container">
            <div className="amc-left-navbar">
                <Navbar />
            </div>
            <div className="amc-right-form">
                <form className="amc-form-layout" onSubmit={sendData}>
                <h2 className="amc-topic">Add maintenance cost</h2>
                    <div className="amc-form-group">
                        <label htmlFor="regNumber" className="amc-form-label">Truck Number</label><br></br>
                        <input type="text" className="amc-form-control" name="regNumber" id="regNumber" value={regNum} readOnly required />
                        <div className="form-text">Truck ID is filled</div>
                    </div>
                    <div className="amc-form-group">
                        <label htmlFor="MaintainDate" className="amc-form-label">Maintenance Date</label><br></br>
                        <input type="date" className="amc-form-control1" name="MaintainDate" id="MaintainDate"
                            onChange={handleMaintenanceDateChange} required />
                        {maintenanceDateError && <div className="error-message" style={{ color: 'red' }}>{maintenanceDateError}</div>}
                    </div>
                    <div className="amc-form-group">
                        <label htmlFor="maintainType" className="amc-form-label">Type</label><br></br>
                        <select className="amc-form-control3" id="maintainType" name="maintainType"
                            onChange={(e) => setMaintenanceType(e.target.value)} required>
                            <option value="" disabled selected>Maintenance Type</option><br></br>
                            <option value="Interior">Interior</option>
                            <option value="Exterior">Exterior</option>
                        </select>
                    </div>
                    <div className="amc-form-group">
                        <label htmlFor="cost" className="amc-form-label">Total Expenses</label><br></br>
                        <input type="text" className="amc-form-control" name="cost" id="truckCost"
                            onChange={handleExpenseChange}
                            onBlur={handleExpenseBlur}
                            required />
                        {expenseError && <div className="error-message" style={{ color: 'red' }}>{expenseError}</div>}
                    </div>
                    <div className="amc-form-group">
                        <label htmlFor="descriptCost" className="amc-form-label">Description</label><br></br>
                        <textarea className="amc-form-control2" name="descriptCost" id="description"
                            onChange={handleDescriptionChange}
                           
                            required />
                        {descriptionError && <div className="error-message" style={{ color: 'red' }}>{descriptionError}</div>}
                    </div>
                    <div className="amc-form-group">
                        <label htmlFor="status" className="amc-form-label">Status</label><br></br>
                        <input type="text" className="amc-form-control" name="status" value={status} id="status" readOnly />
                    </div>
                    <div className="amc-button-group">
                        <button type="submit" className="amc-btn amc-btn-primary">Submit</button>
                        <button type="button" className="amc-btn amc-btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddMaintenanceCost;
