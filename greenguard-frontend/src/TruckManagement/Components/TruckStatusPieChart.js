import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

function TruckStatusPieChart({ trucks }) {
    const activeCount = trucks.filter(t => t.isActive === true).length;
    const inactiveCount = trucks.filter(t => t.isActive === false).length;

    const data = [
        { name: "Active Trucks", value: activeCount },
        { name: "Inactive Trucks", value: inactiveCount }
    ];

    const COLORS = ["#00C49F", "#FF8042"];
    
    return (
        <div className="chart-box">
            <h3>Truck Status</h3>
            <ResponsiveContainer width="100%" height={300}>
                
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TruckStatusPieChart;
