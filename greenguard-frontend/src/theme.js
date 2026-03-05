import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        darkgreen: {
            main: "#00712d"
        },
        lightgreen: {
            main: "#77B254"
        },
        orange: {
            main: "#ff9100"
        },
        ivory: {
            main: "#fffbe6"
        },
        grey: {
            main: "#F1F0E9"
        },
        black: {
            main: "#000000"
        },
        white: {
            main: "#FDFAF6"
        },
    },
    
    typography: {
        fontFamily: "'poppins', sans-serif",
    },
});

export default theme;