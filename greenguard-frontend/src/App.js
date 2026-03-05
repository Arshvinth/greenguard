import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Tabs, Tab, Box, Container } from "@mui/material";
import { Home, About, Services, Pickups, Contact } from './PublicPage';
import { Link as ScrollLink } from "react-scroll";
import ScrollToTop from "./ScrollToTop";
import Header from "./Header";
import Footer from "./Footer";
//Truck Management
import AddTrucks from './TruckManagement/AddTrucks.js';
import AddMaintenanceCost from './TruckManagement/AddMaintenanceCost';
import NavBar from './TruckManagement/Components/SideNav';
import ReadAllTrucks from './TruckManagement/ReadAllTrucks';
import ViewOneTruck from './TruckManagement/ViewOneTruck';
import ViewTruckCosts from './TruckManagement/ViewTruckCosts';
import AddFuelCost from "./TruckManagement/AddFuelCost";
import ViewFuelCost from "./TruckManagement/ViewFuelCost";
import TruckDashBoard from "./TruckManagement/TruckDashBoard";
import AllocateTruck from "./TruckManagement/AllocateTruck";
import CalculateMaintainenceCost from "./TruckManagement/CalculateMaintenanceCost";
import EditMaintenanceCost from "./TruckManagement/EditMaintenanceCost.js";
import EditFuelCost from "./TruckManagement/EditFuel.js";
//Collection Request Management
import CreateTruckRequests from "./CollectionRequestManagement/CreateTruckRequest";
import ReadAllTruckRequests from "./CollectionRequestManagement/ReadAllTruckRequets";
import RequestManagerDashboard from "./CollectionRequestManagement/RequestManagerDashboard";
import ViewPickUpRequests from "./CollectionRequestManagement/ViewPickUpRequests";
import CreateSchedule from "./CollectionRequestManagement/CreateSchedule";
import ViewSchedules from "./CollectionRequestManagement/ViewSchedules";
import EditSchedule from "./CollectionRequestManagement/EditSchedule";
import EditTruckRequest from "./CollectionRequestManagement/EditTruckRequest";

function Navigation() {
    const [value, setValue] = React.useState(0);

    return (
        <AppBar position="static" color="none" elevation={0}>
            <Header />

            <Toolbar sx={{ marginRight: 3, marginLeft: 3, marginBottom: 2, }}>
                <Tabs
                    value={value}
                    onChange={(e, newValue) => setValue(newValue)}
                    centered
                    textColor="secondary"
                    indicatorColor="secondary"
                >
                    <Tab label="Home" component={Link} to="/" />
                    <Tab label="Our Services" component={ScrollLink} to="services" smooth={true} duration={500} />
                    <Tab label="About Us" component={ScrollLink} to="about" smooth={true} duration={500} />
                    <Tab label="Schedule Pickups" component={ScrollLink} to="pickups" smooth={true} duration={500} />
                    <Tab label="Contact us" component={ScrollLink} to="contact" smooth={true} duration={500} />
                </Tabs>
            </Toolbar>
        </AppBar>
    );
}

export default function App() {
    return (
        <Router>
            <Navigation />
            <Container>
                <Box my={4}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/pickups" element={<Pickups />} />
                        <Route path="/contact" element={<Contact />} />
                        {/* Truck Management */}
                        <Route path="/truck" element={<TruckDashBoard />} />
                        <Route path="/addTruck" element={<AddTrucks />} />
                        <Route path="/EditMaintenanceCost/:costID" element={<EditMaintenanceCost />} />
                        <Route path="/EditFuelCost/:costID" element={<EditFuelCost />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/pickups" element={<Pickups />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/getAllTruck" element={<ReadAllTrucks />} />
                        <Route path="/truck/:regNum" element={<ViewOneTruck />} />
                        <Route path="/Maintenance/:regNum" element={<AddMaintenanceCost />} />
                        <Route path="/truckCost" element={<ViewTruckCosts />} />
                        <Route path="/allocateTruck/:reqID" element={<AllocateTruck />} />
                        <Route path="/CalculateMaintainenceCost" element={<CalculateMaintainenceCost />} />
                        <Route path="/FuelCost/:regNum" element={<AddFuelCost />} />
                        <Route path="/truckFuelCost" element={<ViewFuelCost />} />
                        {/* Collection Request Manager */}
                        <Route path="/CollectManagerDashboard" element={<RequestManagerDashboard />} />
                        <Route path="/ReadPickups" element={<ViewPickUpRequests />} />
                        <Route path="/CreateTruckRequest/:pickID" element={<CreateTruckRequests />} />
                        <Route path="/ReadAllTruckRequests" element={<ReadAllTruckRequests />} />
                        <Route path="/createSchedule/:truckReqID" element={<CreateSchedule />} />
                        <Route path="/readSchedules" element={<ViewSchedules />} />
                        <Route path="/EditSchedule/:ScheduleID" element={<EditSchedule />} />
                        <Route path="/UpdateTruckRequest/:Trequest_ID" element={<EditTruckRequest />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/pickups" element={<Pickups />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </Box>
            </Container>
            <Footer />
            <ScrollToTop />
        </Router>
    );
}
