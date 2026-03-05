import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";

const cardData = [
    { title: "Card 1", image: "https://via.placeholder.com/300", description: "Description for Card 1" },
    { title: "Card 2", image: "https://via.placeholder.com/300", description: "Description for Card 2" },
    { title: "Card 3", image: "https://via.placeholder.com/300", description: "Description for Card 3" },
    { title: "Card 4", image: "https://via.placeholder.com/300", description: "Description for Card 4" },
    { title: "Card 5", image: "https://via.placeholder.com/300", description: "Description for Card 5" },
];

const AutoSwipeScrollCards = () => {
    const scrollRef = useRef(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        let scrollAmount = 0;
        let direction = 1; // 1 for right, -1 for left

        const autoScroll = setInterval(() => {
            if (scrollContainer) {
                // Scroll gradually
                scrollAmount += 300 * direction; // Scroll by card width
                scrollContainer.scrollTo({ left: scrollAmount, behavior: "smooth" });

                // Reverse direction if end is reached
                if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
                    scrollAmount += 300 * direction; // Scroll by card width
                    direction = -1;
                } else if (scrollAmount <= 0) {
                    direction = 1;
                }
            }
        }, 3000); // Change cards every 3 seconds

        return () => clearInterval(autoScroll);
    }, []);

    return (
        <Box
        ref={scrollRef}
        sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            padding: 2,
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar
        }}
        >
        {cardData.map((card, index) => (
            <Card key={index} sx={{ minWidth: 300, boxShadow: 3, borderRadius: 2 }}>
            <CardMedia component="img" height="120" image={card.image} alt={card.title} />
            <CardContent>
                <Typography variant="h6" fontWeight="bold">{card.title}</Typography>
                <Typography variant="body2" color="text.secondary">{card.description}</Typography>
            </CardContent>
            </Card>
        ))}
        </Box>
    );
};

export default AutoSwipeScrollCards;
