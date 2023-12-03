import { BeachAccess } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Footer() {
    const navigate = useNavigate()
    return(
        <Box
        component="footer"
        sx={{
            py: 4,
            px: 2,
            mt: 4,
            backgroundColor: "#0e4686",
        }}
        >
            <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
                <Typography sx={{ color: "grey.400", display: "flex", justifyContent: "center" }} fontSize="14px">
                    SUNGLAX <BeachAccess htmlColor='#4dabf5' fontSize="small" sx={{ transform: "rotate(90deg)"}}/>
                </Typography>
                <Typography sx={{ color: "grey.400" }} variant="body2" color="text.secondary" fontSize="14px">
                    {'Copyright © '}
                    Miguel Fernandez 
                    {' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Container>
        </Box>
    )
}