import React from "react";
import { Toolbar, Typography, Grid } from "@mui/material";
// import logo from "./logo.svg";
import theme from "./theme";

function Header() {
    return (
        <Toolbar>
            <Grid container alignItems="center" justifyContent="space-between" sx={{ marginRight: 3, marginLeft: 3, marginTop: 2, }}>
            <Grid item>
                {/* <img src={logo} alt="My Logo" style={{ height: '100px' }} /> */}
            </Grid>
            <Grid item sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.darkgreen.main }}>
                    Green Guard Solutions
                </Typography>
                <Typography variant="h6" sx={{ color: theme.palette.darkgreen.main, }}>
                    The Sustainable E-Waste Management System
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant="body1" sx={{ fontWeight: 'bold', }}>Contact: +94 456 7890</Typography>
            </Grid>
            </Grid>
        </Toolbar>
    );
}

export default Header;