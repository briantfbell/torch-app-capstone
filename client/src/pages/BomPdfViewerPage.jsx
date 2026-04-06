/*--All the figures for the styling (shape size and dimensions are random
* and wil be changed later -- */
/* --This should work recommending no sidebar rendering here-- */

import { Box, Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BomPdfViewerPage() {
    const navigate = useNavigate();

    return (
        <Box>
            <Button
                variant="contained"
                sx={{ mb: 2 }}
                onClick={() => navigate(/*path)*/}
            >
                Back
            </Button>

            <Typography
                    variant="h4"
                    sx={{ mb: 2 }}>
                PDF Viewer
            </Typography>

            <Paper elevation={3} sx={{ p: 2 }}>
                <Box
                    component="iframe"
                    src="/inventory-guide.pdf"
                    sx={{
                        width: "100%",
                        height: "80vh",
                        border: "none",
                    }}
                />
            </Paper>
        </Box>
    );
}