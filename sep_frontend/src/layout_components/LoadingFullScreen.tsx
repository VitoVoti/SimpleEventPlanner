import { Box, CircularProgress } from "@mui/material";

function LoadingFullScreen() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <CircularProgress />
        </Box>
        
    )
}

export default LoadingFullScreen;