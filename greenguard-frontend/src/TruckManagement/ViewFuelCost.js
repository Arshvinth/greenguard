import React, { useState, useEffect } from "react";
import axios from "axios";
import BackBtn from "../TruckManagement/Components/BackBtn";
import { useNavigate } from "react-router-dom";
import "./styles/ViewFuelCost.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ViewFuelCost() {
    const [truckFuelCosts, setTruckFuelCosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [allTruckCosts, setAllTruckCosts] = useState([]);
    const [searchRegNum, setSearchRegNum] = useState("");
    const [filteredTruckCosts, setFilteredTruckCosts] = useState([]);

    const navigate = useNavigate();

    //Get all fuel costs
    useEffect(() => {
        axios.get("http://localhost:8081/FuelCost/getAllFuelCost")
            .then((response) => {
                setTruckFuelCosts(response.data);
                setAllTruckCosts(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching truck Fuel costs:", err);
                setError("Failed to load truck fuel costs. Please try again.");
                setLoading(false);
            });
    }, []);

    //Delete costs
    function deleteFuelCost(fuelId, regNum) {
        if (window.confirm(`Are you sure you want to delete Fuel cost with Reg Number: ${regNum}?`)) {
            axios.delete(`http://localhost:8081/FuelCost/deleteFuelCost/${fuelId}`)
                .then(() => {
                    alert("Fuel cost deleted successfully!")
                    setTruckFuelCosts((prev) => prev.filter(cost => cost._id !== fuelId));
                })

                .catch((error) => {
                    console.error("Error deleting Fuel cost:", error);
                    alert("Failed to delete cost.");
                });
        }
    }

    //Search function with RegNum
    const searchTruckCost = () => {
        if (!searchRegNum.trim()) {
            setTruckFuelCosts(allTruckCosts);
            setFilteredTruckCosts([]);
            return;
        }

        axios.get(`http://localhost:8081/FuelCost/SearchTruckFuelCosts/${searchRegNum}`)
            .then((response) => {
                const results = response.data.truckFuelCosts;
                setTruckFuelCosts(results);
                setFilteredTruckCosts(results);
            })
            .catch((err) => {
                console.error("Error searching truck fuel costs:", err);
                setTruckFuelCosts([]);
                setFilteredTruckCosts([]);
            });
    };

    //Generate Maintenance cost report for specific truck
    function handleGenerateSpecificPDF() {
        if (!filteredTruckCosts.length) return;

        const doc = new jsPDF();
        const truckNum = filteredTruckCosts[0].Truck_RegNum;
        doc.text(`GreenGuard E-waste Management - Fuel Cost for ${truckNum}`, 14, 15);

        const tableColumn = ["Truck Number", "Date", "Type", "Expenses", "Litres", "Status"];
        const tableRows = [];

        filteredTruckCosts.forEach(cost => {
            tableRows.push([
                cost.Truck_RegNum,
                cost.Fuel_Date,
                cost.FuelType,
                cost.FuelCost,
                cost.Litres,
                cost.Status
            ]);
        });

        const totalCost = filteredTruckCosts.reduce((sum, cost) => sum + parseFloat(cost.FuelCost || 0), 0);
        tableRows.push([
            { content: "Total", colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } },
            { content: totalCost.toFixed(2), styles: { fontStyle: 'bold', halign: 'right' } },
            "", ""
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: {
                fontSize: 10,
                cellPadding: 4,
                halign: 'left',
                valign: 'middle',
                textColor: [33, 33, 33],
                lineColor: [200, 200, 200],
                lineWidth: 0.1,
            },
            headStyles: {
                fillColor: [41, 128, 185], // Navy blue header
                textColor: [255, 255, 255],
                fontSize: 11,
                fontStyle: 'bold',
                halign: 'center',
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245], // light gray
            },
            columnStyles: {
                0: { cellWidth: 30 }, // Truck Number
                1: { cellWidth: 35 }, // Date
                2: { cellWidth: 25 }, // Type
                3: { halign: 'right' }, // Expenses
                4: { cellWidth: 45 }, // Description
                5: { halign: 'center' }, // Status
            },
            margin: { top: 20, left: 14, right: 14 },
            didDrawPage: function (data) {
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text("Generated by E-Waste System", data.settings.margin.left, doc.internal.pageSize.height - 10);
            },
        });


        doc.save(`Truck_FuelCost_Report_${truckNum}.pdf`);
    }

    if (loading) return <p>Loading truck costs...</p>;
    if (error) return <p className="fuelError">{error}</p>;

    //Navigate to edit fuel page
    function EditCost(costID) {
        navigate(`/EditFuelCost/${costID}`);
    }

    //Total of all costs
    function calculateTotal(data) {
        return data.reduce((sum, cost) => sum + parseFloat(cost.FuelCost), 0).toFixed(2);
    }

    //generate overall report
    function generateFullReport() {
        const doc = new jsPDF();
        doc.text("Greenguard E-waste Management - Fuel Cost Report", 14, 15);

        const headers = [["Truck Number", "Fuel Date", "Fuel Type", "Fuel Cost", "Litres", "Status"]];
        const data = truckFuelCosts.map(cost => [
            cost.Truck_RegNum,
            cost.Fuel_Date,
            cost.FuelType,
            cost.FuelCost,
            cost.Litres,
            cost.Status
        ]);

        autoTable(doc, {
            head: headers,
            body: data,
            startY: 20,
            headStyles: {
                fillColor: [0, 153, 76], // Green headers
                textColor: [255, 255, 255],
                halign: 'center'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            styles: {
                fontSize: 10
            }
        });

        const totalCost = calculateTotal(truckFuelCosts);
        const finalY = doc.lastAutoTable.finalY || 30;
        doc.setFontSize(11);
        doc.text(`Total Fuel Cost: Rs. ${totalCost}`, 14, finalY + 10);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Generated by Truck Manager", 14, doc.internal.pageSize.height - 10);

        doc.save("Fuel_Cost_Report.pdf");
    }

    //Generate report for past one month
    function generateLastMonthReport() {
        const oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

        const recentCosts = truckFuelCosts.filter(cost => {
            const costDate = new Date(cost.Fuel_Date);
            return costDate >= oneMonthAgo;
        });

        const doc = new jsPDF();
        doc.text("Greenguard E-waste Management - Fuel Cost Report - Last 1 Month", 14, 15);

        const headers = [["Truck Number", "Fuel Date", "Fuel Type", "Fuel Cost", "Litres", "Status"]];
        const data = recentCosts.map(cost => [
            cost.Truck_RegNum,
            cost.Fuel_Date,
            cost.FuelType,
            cost.FuelCost,
            cost.Litres,
            cost.Status
        ]);

        autoTable(doc, {
            head: headers,
            body: data,
            startY: 20,
            headStyles: {
                fillColor: [0, 153, 76],
                textColor: [255, 255, 255],
                halign: 'center'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            styles: {
                fontSize: 10
            }
        });

        const totalCost = calculateTotal(recentCosts);
        const finalY = doc.lastAutoTable.finalY || 30;
        doc.setFontSize(11);
        doc.text(`Total Fuel Cost: Rs. ${totalCost}`, 14, finalY + 10);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Generated by Greenguard Management", 14, doc.internal.pageSize.height - 10);

        doc.save("Fuel_Cost_Report_Last_30_Days.pdf");
    }

    return (
        <div className="fuelContainer">
            <div className="fuelHeaderSection">
                <BackBtn />
                <h2 className="fuelTitle">Truck Fuel Cost Details</h2>
                <input
                    className="FuelCosttextInput"
                    type="text"
                    placeholder="Enter Truck Reg Number"
                    value={searchRegNum}
                    onChange={(e) => setSearchRegNum(e.target.value)}
                />
                <button className="fuelCostsearchBtn" onClick={searchTruckCost}>Search</button>
                <button className="fuelCostresetBtn" onClick={() => {
                    setTruckFuelCosts(allTruckCosts);
                    setSearchRegNum("");
                    setFilteredTruckCosts([]);
                }}>Reset</button>
            </div>

            <table className="fuelCostTable">
                <thead>
                    <tr>
                        <th className="fuelHeader">Truck Number</th>
                        <th className="fuelHeader">Fuel Date</th>
                        <th className="fuelHeader">Fuel Type</th>
                        <th className="fuelHeader">Fuel Cost</th>
                        <th className="fuelHeader">Litres</th>
                        <th className="fuelHeader">Status</th>
                        <th className="fuelHeader">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {truckFuelCosts.length > 0 ? (
                        truckFuelCosts.map((FuelCost) => (
                            <tr key={FuelCost._id}>
                                <td>{FuelCost.Truck_RegNum}</td>
                                <td>{FuelCost.Fuel_Date}</td>
                                <td>{FuelCost.FuelType}</td>
                                <td>{FuelCost.FuelCost}</td>
                                <td>{FuelCost.Litres}</td>
                                <td className="fuelStatusCell">{FuelCost.Status}</td>
                                <td>
                                    <button className="fuelCostEditBtn" onClick={() => EditCost(FuelCost._id)}>Edit</button>
                                    <button className="fuelDeleteBtn" onClick={() => deleteFuelCost(FuelCost._id, FuelCost.Truck_RegNum)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="fuelNoData">No costs found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <button className="VF-generateBtn2" onClick={generateFullReport}>Generate overall Report</button>
            <button className="VF-generateBtn3" onClick={generateLastMonthReport}>Generate past 1 month Report</button>
            <button
                className="FuelCostGenerateBtn3"
                type="button"
                onClick={handleGenerateSpecificPDF}
                disabled={filteredTruckCosts.length === 0}
            >
                Generate Report for Specific Truck
            </button>
        </div>
    );
}

export default ViewFuelCost;

