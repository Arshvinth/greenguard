import { Link, useLocation } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar() {
    const location = useLocation(); // Get current URL path

    return (
        <div>
            {/* Profile Image Section */}
            <div className="ImageNav"></div>

            {/* Navigation Menu */}
            <div className="nav flex-column nav-pills NavBar">
                <Link 
                    className={`nav-link ${location.pathname === "/" ? "active" : ""}`}  
                    to="/truck"
                >
                    DashBoard
                </Link>

                <Link 
                    className={`nav-link ${location.pathname === "/addTruck" ? "active" : ""}`}  
                    to="/addTruck"
                >
                    Add Trucks
                </Link>

                <Link 
                    className={`nav-link ${location.pathname === "/getAllTruck" ? "active" : ""}`}  
                    to="/getAllTruck"
                >
                    All Trucks
                </Link>

                <Link 
                    className={`nav-link ${location.pathname === "/truckCost" ? "active" : ""}`}  
                    to="/truckCost"
                >
                    Maintenance Costs
                </Link>

                <Link 
                    className={`nav-link ${location.pathname === "/truckFuelCost" ? "active" : ""}`}  
                    to="/truckFuelCost"
                >
                    Fuel Costs
                </Link>

                <Link 
                    className={`nav-link ${location.pathname === "/CalculateMaintainenceCost" ? "active" : ""}`}  
                    to="/CalculateMaintainenceCost"
                >
                    Calculate Cost
                </Link>
            </div>
        </div>
    );
}

export default NavBar;
