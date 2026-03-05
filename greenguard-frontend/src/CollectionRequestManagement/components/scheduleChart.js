import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../styles/Shedulechart.css'; // make sure the path is correct

ChartJS.register(ArcElement, Tooltip, Legend);

function ScheduleChart() {
    const [totalRequests, setTotalRequests] = useState(0);
    const [scheduledPickups, setScheduledPickups] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:8081/pickupRequests/")
            .then(res => setTotalRequests(res.data.length))
            .catch(err => console.error("Error fetching pickup requests:", err));

        axios.get("http://localhost:8081/shedulePickup/getAllSchedule")
            .then(res => setScheduledPickups(res.data.length))
            .catch(err => console.error("Error fetching scheduled pickups:", err));
    }, []);

    const data = {
        labels: ['Scheduled Pickups', 'Unscheduled Pickups'],
        datasets: [{
            data: [scheduledPickups, totalRequests - scheduledPickups],
            backgroundColor: ['#4CAF50', '#F44336'],
            hoverOffset: 8
        }]
    };

    return (
        <div className="chart-wrapper">
            <div className="chart-section">
                <Pie data={data} />
            </div>
            <div className="summary-section">
                <h3>Summary</h3>
                <p><strong>Total Requests:</strong> {totalRequests}</p>
                <p><strong>Scheduled Pickups:</strong> {scheduledPickups}</p>
                <p><strong>Unscheduled Pickups:</strong> {totalRequests - scheduledPickups}</p>
            </div>
        </div>
    );
}

export default ScheduleChart;
