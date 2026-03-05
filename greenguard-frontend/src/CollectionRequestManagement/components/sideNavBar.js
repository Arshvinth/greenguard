import { Link, useLocation } from "react-router-dom";
import "../styles/sideNav.css";

function NavBar() {
    const location = useLocation(); // Get current URL path

    return (
        <div>
            {/* Profile Image Section */}
            <div className="ImageNav"></div>

            {/* Navigation Menu */}
            <div className="nav flex-column nav-pills NavBar">
                <Link 
                    className={`nav-link ${location.pathname === "/CollectManagerDashboard" ? "" : ""}`}  
                    to="/CollectManagerDashboard"
                >
                    DashBoard
                </Link>

                <Link 
                    className={`nav-link ${location.pathname === "/ReadPickups" ? "active" : ""}`}  
                    to="/ReadPickups"
                >
                    Pickup Requests
                </Link>
                
                <Link 
                    className={`nav-link ${location.pathname === "/ReadAllTruckRequests" ? "active" : ""}`}  
                    to="/ReadAllTruckRequests"
                >
                    Truck Requests
                </Link>

                <Link 
                    className={`nav-link ${location.pathname === "/readSchedules" ? "active" : ""}`}  
                    to="/readSchedules"
                >
                    Schedules
                </Link>
            </div>
        </div>
    );
}

export default NavBar;
