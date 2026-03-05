import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import AutoSwipeCards from './HorizontalScrollCards';
import theme from './theme';
import { PickupForm } from './publicSchedulePickupForm';
import { Element } from 'react-scroll';

// Home component
export function Home() {
    return (
        <Container>
            <Box sx={{ bgcolor: '#cfe8fc', height: '300px', }} />
            <Typography variant="body1" align="justify" paragraph sx={{ marginTop: 2, marginBottom: 2, }}>
                At Green Guard Solutions, we are dedicated to revolutionizing e-waste management through sustainable and innovative solutions. Our mission is to reduce environmental impact by efficiently recycling electronic waste and promoting responsible disposal methods. By integrating cutting-edge technology and eco-friendly practices, we ensure that discarded electronics are repurposed, reducing landfill waste. Join us in creating a cleaner, greener future by making informed choices about e-waste disposal and embracing sustainability.
            </Typography>

            <Services />
            <About />
            <Pickups />
            <Contact />

        </Container>
    );
}


// Services component
export function Services() {
    return (
        <Element name="services">
            <Typography 
                variant='h4' 
                align='center' 
                fontWeight={'bold'}
                sx={{ marginTop: 7, marginBottom: 2, color: theme.palette.lightgreen.main, }}
            >
                Green Guard Services
            </Typography>
            <Typography variant="body1" align="justify" paragraph sx={{ marginTop: 2, marginBottom: 2, }}
            >
                At Green Guard Solutions, we are dedicated to revolutionizing e-waste management through sustainable and innovative solutions.
            </Typography>
            <AutoSwipeCards />
        </Element>
    );
}



// About component
export function About() {
    return(
        <Element name="about">
            <Container sx={{ 
                bgcolor: theme.palette.grey.main, 
                padding: 1, 
                mt: 6, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', }}
            >
            <Typography 
                variant='h4' 
                align='center' 
                fontWeight={'bold'}
                sx={{ marginTop: 7, marginBottom: 2, color: theme.palette.lightgreen.main }}
            >
                Welcome to Green Guard Solutions
            </Typography>
            <Typography variant="body1" align="center" paragraph sx={{ marginTop: 4, marginBottom: 3, padding: 1, }}>
                At Green Guard Solutions, we are dedicated to revolutionizing e-waste management through sustainable and innovative solutions. Our mission is to reduce environmental impact by efficiently recycling electronic waste and promoting responsible disposal methods.
            </Typography>
            <Typography variant="body1" align="center" paragraph sx={{ marginTop: 2, marginBottom: 3, padding: 1, }}>
                At Green Guard Solutions, we are dedicated to revolutionizing e-waste management through sustainable and innovative solutions. Our mission is to reduce environmental impact by efficiently recycling electronic waste and promoting responsible disposal methods.
            </Typography>
            <Typography variant="body1" align="center" paragraph sx={{ marginTop: 2, marginBottom: 3, padding: 1, }}>
                At Green Guard Solutions, we are dedicated to revolutionizing e-waste management through sustainable and innovative solutions. Our mission is to reduce environmental impact by efficiently recycling electronic waste and promoting responsible disposal methods. By integrating cutting-edge technology and eco-friendly practices, we ensure that discarded electronics are repurposed, reducing landfill waste. Join us in creating a cleaner, greener future by making informed choices about e-waste disposal and embracing sustainability.
            </Typography>
            <Button variant="contained" sx={{ bgcolor: theme.palette.darkgreen.main, mb: 6 }}>Read More</Button>
            </Container>
        </Element>
    );
}



// Pickups component
export function Pickups() {
    return (
        <Element name='pickups'>
            <PickupForm />
        </Element>
    );
}


// Contact component
export function Contact() {
    return (
        <Element name='contact'></Element>
    );
}

