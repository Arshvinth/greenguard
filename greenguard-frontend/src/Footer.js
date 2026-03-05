import React from "react";
import theme from './theme';
import logo from './logo2.png'; 
import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";
import { Element } from "react-scroll";

function Footer() {
    return (
        <Box sx={{ bgcolor: theme.palette.darkgreen.main, color: theme.palette.white.main, py: 4, mt: 5 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} sx={{ m: "auto", }}>

                    <Grid item xs={12} md={6}>
                        <Grid item>
                            <img src={logo} alt="My Logo" style={{ height: '150px' }} />
                        </Grid>
                        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8, width: "50%", textAlign: "justify", }}>
                            We are dedicated to sustainable e-waste management, ensuring a cleaner and greener future.
                        </Typography>
                        
                        <Box sx={{ mt: 2 }}>
                            <IconButton href="https://facebook.com" target="_blank" sx={{ color: "white" }}>
                                <Facebook />
                            </IconButton>
                            <IconButton href="https://twitter.com" target="_blank" sx={{ color: "white" }}>
                                <Twitter />
                            </IconButton>
                            <IconButton href="https://instagram.com" target="_blank" sx={{ color: "white" }}>
                                <Instagram />
                            </IconButton>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Element name="contact">
                            <Typography variant="h5" fontWeight="bold">
                                Contact Us
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
                                23 Green Street, Eco City, Earth
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                support@greenguard.com
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                +1 234 567 890
                            </Typography>
                        </Element>
                    </Grid>
                    <Grid item md={12}>
                        <hr />
                        <Typography variant="body2" sx={{ opacity: 0.8, mt: 2, textAlign: "center" }}>
                            &#9400; 2021 Green Guard Solutions. All rights reserved. Design and developed by Green Guard Solutions
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Footer;