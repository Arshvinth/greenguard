import { Link, useLocation } from "react-router-dom";

function VerticalNav() {
    const location = useLocation(); // Get current URL path

    return (
        <div className="vertical-nav">
            {/* Brand / Logo */}
            <div className="brand">
                <h3>Truck Management</h3>
            </div>

            {/* Navigation Links */}
            <ul className="nav-links">
                <li className={location.pathname === "/" ? "active" : ""}>
                    <Link to="/">Dashboard</Link>
                </li>
                <li className={location.pathname === "/addTruck" ? "active" : ""}>
                    <Link to="/addTruck">Add Trucks</Link>
                </li>
                <li className={location.pathname === "/getAllTruck" ? "active" : ""}>
                    <Link to="/getAllTruck">All Trucks</Link>
                </li>
                <li className={location.pathname === "/truckCost" ? "active" : ""}>
                    <Link to="/truckCost">Maintenance Costs</Link>
                </li>
                <li className={location.pathname === "/truckFuelCost" ? "active" : ""}>
                    <Link to="/truckFuelCost">Fuel Costs</Link>
                </li>
            </ul>
        </div>
    );
}

export default VerticalNav;


