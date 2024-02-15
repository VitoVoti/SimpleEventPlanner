import { Box } from "@mui/material";

const SiteFooter = () => {

    const current_year = new Date().getFullYear();

    return (
        <Box
            component="footer"
            color="text.secondary"
            sx={{
                textAlign: "center",
                padding: "20px",
            }}
        >
            <p>Simple Event Planner. (c) {current_year} Víctor Zúñiga M.</p>
        </Box>
    );
}

export default SiteFooter;