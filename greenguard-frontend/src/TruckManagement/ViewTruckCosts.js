import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackBtn from "../TruckManagement/Components/BackBtn";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./styles/MaintenanceCost.css";

function ViewTruckCosts() {
    const [truckCost, setTruckCost] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [allTruckCosts, setAllTruckCosts] = useState([]);
    const [searchRegNum, setSearchRegNum] = useState("");
    const [filteredTruckCosts, setFilteredTruckCosts] = useState([]);

    const navigate = useNavigate();

    //Get all maintenance cost
    useEffect(() => {
        axios.get("http://localhost:8081/Maintenance/getAllCosts")
            .then((response) => {
                setTruckCost(response.data);
                setAllTruckCosts(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching truck costs:", err);
                setError("Failed to load truck costs. Please try again.");
                setLoading(false);
            });
    }, []);

    //Search function with RegNum
    const searchTruckCost = () => {
        if (!searchRegNum.trim()) {
            setTruckCost(allTruckCosts);
            setFilteredTruckCosts([]);
            return;
        }

        axios.get(`http://localhost:8081/Maintenance/SearchTruckCosts/${searchRegNum}`)
            .then((response) => {
                const results = response.data.truckMaintainance;
                setTruckCost(results);
                setFilteredTruckCosts(results);
            })
            .catch((err) => {
                console.error("Error searching truck costs:", err);
                setTruckCost([]);
                setFilteredTruckCosts([]);
            });
    };

    //Delete cost record
    function DeleteCost(costID) {
        if (window.confirm(`Are you sure you want to delete Cost?`)) {
            axios.delete(`http://localhost:8081/Maintenance/deleteCost/${costID}`)
                .then(() => {
                    alert("Cost deleted successfully!");
                    setTruckCost((prev) => prev.filter(cost => cost._id !== costID));
                })
                .catch((error) => {
                    console.error("Error deleting truck:", error);
                    alert("Failed to delete Cost.");
                });
        }
    }

    //Navigate to Edit page
    function EditCost(costID) {
        navigate(`/EditMaintenanceCost/${costID}`);
    }

    //Generate overall maintenance cost report
    function handleGeneratePDF() {
        const doc = new jsPDF();
        doc.text("Truck Cost Report", 14, 15);

        const tableColumn = ["Truck Number", "Date", "Type", "Expenses", "Description", "Status"];
        const tableRows = [];

        truckCost.forEach(cost => {
            tableRows.push([
                cost.Truck_RegNum,
                cost.Maintenance_Date,
                cost.maintenance_type,
                cost.Cost,
                cost.Description,
                cost.Status
            ]);
        });

        const totalCost = truckCost.reduce((sum, cost) => sum + parseFloat(cost.Cost || 0), 0);
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
                cellPadding: 3,
                halign: 'left',
                valign: 'middle',
                textColor: [40, 40, 40],
            },
            headStyles: {
                fillColor: [22, 160, 133],
                textColor: [255, 255, 255],
                fontSize: 12,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240],
            },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 25 },
                3: { halign: 'right' },
            },
            margin: { top: 20 },
        });

        doc.save("Truck_Cost_Report.pdf");
    }

    //Generate Maintenance cost report for specific truck
    function handleGenerateSpecificPDF() {
        if (!filteredTruckCosts.length) return;

        const doc = new jsPDF();
        const truckNum = filteredTruckCosts[0].Truck_RegNum;
        doc.text(`Maintenance Cost for ${truckNum}`, 14, 15);

        const tableColumn = ["Truck Number", "Date", "Type", "Expenses", "Description", "Status"];
        const tableRows = [];

        filteredTruckCosts.forEach(cost => {
            tableRows.push([
                cost.Truck_RegNum,
                cost.Maintenance_Date,
                cost.maintenance_type,
                cost.Cost,
                cost.Description,
                cost.Status
            ]);
        });

        const totalCost = filteredTruckCosts.reduce((sum, cost) => sum + parseFloat(cost.Cost || 0), 0);
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
                1: { cellWidth: 25 }, // Date
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


        doc.save(`Truck_Cost_Report_${truckNum}.pdf`);
    }

    if (loading) return <p>Loading truck Costs...</p>;
    if (error) return <p className="truckCostError">{error}</p>;

    return (
        <div className="truckCostContainer">
            <BackBtn />
            <h2 className="truckCostTitle">Maintenance Cost Details</h2>
            <input
                className="trucktextInput"
                type="text"
                placeholder="Enter Truck Reg Number"
                value={searchRegNum}
                onChange={(e) => setSearchRegNum(e.target.value)}
            />
            <button className="truckCostsearchBtn" onClick={searchTruckCost}>Search</button>
            <button className="truckCostresetBtn" onClick={() => {
                setTruckCost(allTruckCosts);
                setSearchRegNum("");
                setFilteredTruckCosts([]);
            }}>Reset</button>
            <table className="truckCostTable">
                <thead>
                    <tr>
                        <th className="truckCostHeader">Truck Number</th>
                        <th className="truckCostHeader">Date</th>
                        <th className="truckCostHeader">Type</th>
                        <th className="truckCostHeader">Expenses</th>
                        <th className="truckCostHeader">Description</th>
                        <th className="truckCostHeader">Status</th>
                        <th className="truckCostHeader">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {truckCost.length > 0 ? (
                        truckCost.map((cost) => (
                            <tr key={cost._id}>
                                <td>{cost.Truck_RegNum}</td>
                                <td>{cost.Maintenance_Date}</td>
                                <td>{cost.maintenance_type}</td>
                                <td>{cost.Cost}</td>
                                <td>{cost.Description}</td>
                                <td className="truckCostStatusCell">{cost.Status}</td>
                                <td>
                                    <button className="truckCostEditBtn" onClick={() => EditCost(cost._id)}>Edit</button>
                                    <button className="truckCostDeleteBtn" onClick={() => DeleteCost(cost._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="truckCostNoData">No costs found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <br />
            <button className="truckCostGenerateBtn" type="button" onClick={handleGeneratePDF}>
                Generate Report
            </button>
            <button
                className="truckCostGenerateBtn2"
                type="button"
                onClick={handleGenerateSpecificPDF}
                disabled={filteredTruckCosts.length === 0}
            >
                Generate Report for Specific Truck
            </button>
        </div>
    );
}

export default ViewTruckCosts;
