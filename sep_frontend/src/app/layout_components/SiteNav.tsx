import { Box } from "@mui/material";

const SiteNav = () => {
    return (
        <Box
            component="nav"
            color="text.secondary"
        >
            <ul>
                <li>Home</li>
                <li>Events</li>
                <li>Contacts</li>
            </ul>
        </Box>
    );
}

export default SiteNav;