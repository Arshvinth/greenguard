import Navbar from './Components/SideNav';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import "./styles/EditMaintenanceCost.css";

function EditMaintenanceCost() {
    const { costID } = useParams();
    const navigate = useNavigate();

    const [truck_RegNumber, setTruck_RegNum] = useState("");
    const [maintenanceDate, setMaintenance_Date] = useState("");
    const [maintenanceType, setmaintenance_type] = useState("");
    const [cost, setCost] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    
    const [maintenanceDateError, setMaintenanceDateError] = useState("");
    const [expenseError, setExpenseError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");

    //Get details of particular maintenance cost
    useEffect(() => {
        axios.get(`http://localhost:8081/Maintenance/getOneCost/${costID}`)
            .then((response) => {
                const data = response.data.CostInfo;
                setTruck_RegNum(data.Truck_RegNum);
                setMaintenance_Date(data.Maintenance_Date);
                setmaintenance_type(data.maintenance_type);
                setCost(data.Cost);
                setDescription(data.Description);
                setStatus(data.Status);
            })
            .catch(() => {
                alert("Error fetching maintenance cost details.");
            });
    }, [costID]);

    //Date validation
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

    //Validate expense
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

    const handleExpenseChange = (e) => {
        const value = e.target.value;
        setCost(value);
    };

    const handleExpenseBlur = (e) => {
        const value = e.target.value.trim();
        if (value && !validateExpense(value)) {
            setCost("");
        } else {
            setCost(value);
        }
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

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleDescriptionBlur = (e) => {
        const value = e.target.value;
        if (value.trim() && !validateDescription(value)) {
            setDescription("");
        } else {
            setDescription(value.trim());
        }
    };

    //Handle update specific record with new data
    const handleUpdate = (e) => {
        e.preventDefault();

        const isDateValid = validateMaintenanceDate(maintenanceDate);
        const isCostValid = validateExpense(cost);
        const isDescriptionValid = validateDescription(description);

        if (!isDateValid || !isCostValid || !isDescriptionValid) {
            alert("Please fix validation errors before submitting.");
            return;
        }

        const updatedData = {
            Maintenance_Date: maintenanceDate,
            maintenance_type: maintenanceType,
            Cost: cost,
            Description: description
        };

        axios.put(`http://localhost:8081/Maintenance/updateMaintenanceCost/${costID}`, updatedData)
            .then(() => {
                alert("Maintenance cost updated successfully.");
                navigate("/truck");
            })
            .catch(() => {
                alert("Failed to update maintenance cost.");
            });
    };

    return (
        <div className="emc-container">
            <div className="emc-left-navbar">
                <Navbar />
            </div>
            <div className="emc-right-form">
                <form className="emc-form-layout" onSubmit={handleUpdate}>
                    <h2 className="emc-topic">Edit maintenance cost</h2>

                    <div className="emc-form-group">
                        <label className="emc-form-label">Truck Number</label><br />
                        <input type="text" className="emc-form-control" value={truck_RegNumber} readOnly required />
                    </div>

                    <div className="emc-form-group">
                        <label className="emc-form-label">Maintenance Date</label><br />
                        <input type="date" className="emc-form-control1" value={maintenanceDate}
                            onChange={handleMaintenanceDateChange} required />
                        {maintenanceDateError && <div className="error-message" style={{ color: 'red' }}>{maintenanceDateError}</div>}
                    </div>

                    <div className="emc-form-group">
                        <label className="emc-form-label">Type</label><br />
                        <select className="emc-form-control3" value={maintenanceType}
                            onChange={(e) => setmaintenance_type(e.target.value)} required>
                            <option value="" disabled>Maintenance Type</option>
                            <option value="Interior">Interior</option>
                            <option value="Exterior">Exterior</option>
                        </select>
                    </div>

                    <div className="emc-form-group">
                        <label className="emc-form-label">Total Expenses</label><br />
                        <input type="text" className="emc-form-control" value={cost}
                            onChange={handleExpenseChange}
                            onBlur={handleExpenseBlur} required />
                        {expenseError && <div className="error-message" style={{ color: 'red' }}>{expenseError}</div>}
                    </div>

                    <div className="emc-form-group">
                        <label className="emc-form-label">Description</label><br />
                        <textarea className="emc-form-control2" value={description}
                            onChange={handleDescriptionChange}
                            onBlur={handleDescriptionBlur} required />
                        {descriptionError && <div className="error-message" style={{ color: 'red' }}>{descriptionError}</div>}
                    </div>

                    <div className="emc-form-group">
                        <label className="emc-form-label">Status</label><br />
                        <input type="text" className="emc-form-control" value={status} readOnly />
                    </div>

                    <div className="emc-button-group">
                        <button type="submit" className="emc-btn emc-btn-primary">Update</button>
                        <button type="button" className="emc-btn emc-btn-secondary" onClick={() => navigate("/truck")}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditMaintenanceCost;
