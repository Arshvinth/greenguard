import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function TruckRequestBarChart({ truckRequests }) {
    const data = [
        {
            name: "All Requests",
            count: truckRequests.length,
        },
        {
            name: "Assigned",
            count: truckRequests.filter(r => r.RequestStatus === "Assigned").length,
        },
        {
            name: "Scheduled",
            count: truckRequests.filter(r => r.RequestStatus === "Scheduled").length,
        },
    ];

    return (
        <div className="chart-box">
            <h3>Truck Requests Status</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TruckRequestBarChart;
