import React, { useState, useEffect } from "react";
import { Fab, Zoom } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    // Show button when scrolled down
    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300); // Show button after scrolling 300px
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Zoom in={visible}>
            <Fab 
                color="success"
                size="medium" 
                onClick={scrollToTop} 
                sx={{ 
                    position: "fixed", 
                    bottom: 30, 
                    right: 20, 
                    boxShadow: 3 
                }}
            >
                <KeyboardArrowUpIcon />
            </Fab>
        </Zoom>
    );
}
