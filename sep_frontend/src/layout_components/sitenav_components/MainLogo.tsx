import { CalendarMonth } from "@mui/icons-material";
import { Stack, Typography, Box } from "@mui/material";

const MainLogo = () => {
    return (
        <>
            <div style={{
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
}}>
                
                <CalendarMonth sx={{ mr: 1 }} />
                
                <Typography
                    variant="h6"
                    noWrap
                    sx={{
                        mr: 2,
                        fontWeight: 700,
                        color: 'white',
                        textDecoration: 'none',
                    }}
                >
                    Simple Event Planner
                </Typography>
            </div>
        </>
    );
    }

export default MainLogo;