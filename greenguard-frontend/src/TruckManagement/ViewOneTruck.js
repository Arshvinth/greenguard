import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Components/SideNav";
import "./styles/ViewOneTruck.css";

function TruckDetails() {
    const { regNum } = useParams();
    const [truck, setTruck] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [disableElements, setDisabledElements] = useState(true);
    const [btnLabel, setBtnLabel] = useState("Edit");

    const [truckCapacity, setTruckCapacity] = useState(null);
    const [truckInsurance, setTruckInsurance] = useState(null);
    const [truckInspection, setTruckInspection] = useState(null);
    const [truckCollectID, setTruckCollectID] = useState(null);
    const [truckDriver, setTruckDriver] = useState(null);
    const [truckStatus, setTruckStatus] = useState(null);

    const [capacityError, setCapacityError] = useState("");
    const [insuranceDateError, setInsuranceDateError] = useState("");
    const [inspectionDateError, setInspectionDateError] = useState("");

    //Driver array
    const [drivers, setDriver] = useState([]);

    const navigate = useNavigate();

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

    //Get details of one truck using RegNum
    useEffect(() => {
        axios.get(`http://localhost:8081/truck/get/${regNum}`)
            .then((res) => {
                const data = res.data.TruckInfo;
                setTruck(data);
                setTruckCapacity(data.Capacity);
                setTruckInsurance(data.Insurance_Expiry);
                setTruckInspection(data.Inspection__date);
                setTruckCollectID(data.Collection_center_id);
                setTruckDriver(data.driver_id);
                setTruckStatus(data.isActive);
                setLoading(false);
            })
            .catch(() => {
                setError("Error fetching truck details.");
                setLoading(false);
            });
    }, [regNum]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="truckDetailsError">{error}</p>;

    //enable all updatable fields once Edit button is clicked
    const updateVehicleInfo = (e) => {
        e.preventDefault();
        if (btnLabel === 'Edit') {
            setDisabledElements(false);
            setBtnLabel("Update");
        } else if (btnLabel === 'Update') {
            updateTruck();
        }
    };

    //Update record with new data
    const updateTruck = () => {
        const updatedData = {
            Capacity: truckCapacity,
            Insurance_Expiry: truckInsurance,
            Inspection__date: truckInspection,
            Collection_center_id: truckCollectID,
            driver_id: truckDriver,
            isActive: truckStatus
        };

        axios.put(`http://localhost:8081/truck/update/${regNum}`, updatedData)
            .then(() => {
                alert("Truck details updated successfully!");
            })
            .catch(() => {
                alert("Failed to update truck details.");
            });
    };

    //Handle new input data to the form 
    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        switch (name) {
            case "updCapacity":
                validateCapacity(value, setCapacityError);
                break;
            case "updInsurance":
                setTruckInsurance(value);
                validateFutureDateWithinOneYear(value, setInsuranceDateError);
                break;
            case "updInspection":
                setTruckInspection(value);
                validateFutureDateWithinOneYear(value, setInspectionDateError);
                break;
            case "updCollectID":
                setTruckCollectID(value);
                break;
            case "updDriverID":
                setTruckDriver(value);
                break;
            case "updStatus":
                setTruckStatus(checked);
                break;
            default:
                break;
        }
    };

    //capacity validation
    const validateCapacity = (value, setError) => {
        const num = parseInt(value, 10);
        if (isNaN(num) || num < 1800 || num > 6000) {
            setError("Capacity must be between 1800Kg and 6000Kg.");
            return false;
        }
        const rounded = Math.round(num / 100) * 100;
        setTruckCapacity(rounded);
        setError("");
        return true;
    };

    //Date validation with one year
    const validateFutureDateWithinOneYear = (date, setError) => {
        const inputDate = new Date(date);
        const today = new Date();
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);

        if (inputDate <= today) {
            setError("Date must be in the future.");
            return false;
        } else if (inputDate > nextYear) {
            setError("Date cannot be more than 1 year from today.");
            return false;
        }
        setError("");
        return true;
    };

    return (
        <div className="truckDetail-col1Div">
            <div className="truckDetail-outerDiv">
                <div className="truckDetail-innerDiv1">
                    <Navbar />
                </div>
                <div className="truckDetail-innerDivR">
                    <h2>Truck Details</h2>
                    <table>

                        <td>
                            <div className="truckOuterWrapper">

                                <div className="truckDetailsWrapper">
                                    <form className="truckForm">

                                        <label className="ViewTruckLabel">Truck ID:</label>
                                        {/* truck.RegNumber */}
                                        <input type="text" value={regNum} disabled className="truckInput" />

                                        <label className="ViewTruckLabel">Capacity:</label>
                                        <input type="text" name="updCapacity" defaultValue={truckCapacity} onChange={handleChange} disabled={disableElements} className="truckInput" />
                                        {capacityError && <div className="truckErrorText">{capacityError}</div>}

                                        <label className="ViewTruckLabel">Insurance Expiry:</label>
                                        <input type="date" name="updInsurance" defaultValue={truckInsurance} onChange={handleChange} disabled={disableElements} className="truckInput" />
                                        {insuranceDateError && <div className="truckErrorText">{insuranceDateError}</div>}

                                        <label className="ViewTruckLabel">Inspection Date:</label>
                                        <input type="date" name="updInspection" defaultValue={truckInspection} onChange={handleChange} disabled={disableElements} className="truckInput" />
                                        {inspectionDateError && <div className="truckErrorText">{inspectionDateError}</div>}

                                        <label className="ViewTruckLabel">Collection Center ID:</label>
                                        <input type="text" name="updCollectID" defaultValue={truckCollectID} onChange={handleChange} disabled={disableElements} className="truckInput" />

                                        {/* <label className="ViewTruckLabel">Driver ID:</label>
                                        <input type="text" name="updDriverID" defaultValue={truckDriver} onChange={handleChange} disabled={disableElements} className="truckInput" /> */}
                                        <label className="ViewTruckLabel">Driver ID:</label>
                                        <select
                                            name="updDriverID"
                                            value={truckDriver}
                                            onChange={handleChange}
                                            disabled={disableElements}
                                            className="truckInput"
                                        >
                                            {/* Always show the current truckDriver as an option */}
                                            <option value={truckDriver}>{truckDriver}</option>

                                            {/* Only show all options if disableElements is false */}
                                            {!disableElements && (
                                                <>
                                                    {drivers.map((driver) => (
                                                        <option key={driver._id} value={driver.driverID}>
                                                            {driver.driverID} - {driver.first_name}
                                                        </option>
                                                    ))}
                                                </>
                                            )}
                                        </select>
                                        <label className="ViewTruckLabel">Status:</label><br></br>
                                        <input type="checkbox" name="updStatus" defaultChecked={truckStatus} onChange={handleChange} disabled={disableElements} />
                                        <label className="truckStatusLabel ViewTruckLabel">{truckStatus ? "Active" : "Inactive"}</label>

                                        <button type="submit" className="truckUpdateBtn" onClick={updateVehicleInfo}>{btnLabel}</button>
                                    </form>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className="truckActionButtons">
                                <button className="truckCostBtn" onClick={() => navigate(`/Maintenance/${truck.RegNumber}`)}>Add Maintenance Cost</button>
                                <button className="truckFuelBtn" onClick={() => navigate(`/FuelCost/${truck.RegNumber}`)}>Add Fuel Cost</button>
                            </div>
                        </td>
                    </table>

                </div>
            </div>


        </div>

    );
}

export default TruckDetails;
