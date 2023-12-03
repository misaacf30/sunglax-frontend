import { CheckCircle } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";



export default function Success() {
    const sessionId = window.location.href.split("session_id=")[1]
    const [completed, setCompleted] = useState(false);
    const navigate = useNavigate();

    async function confirmOrder() {
        const result = await fetch(`/api/Stripe/session/getStatus/${sessionId}`, { method: "GET" })
        .then(response => response.text())
        .then(data => {return JSON.parse(data)})
        

        if(result && result.status === "complete")
        {
            const requestBody = {
                stripeSessionId: sessionId,
                name: result.name
            }
            
            await fetch(`/api/Order/confirm/`, { 
                method: "PUT",
                headers: {"content-type": "application/json"},
                body: JSON.stringify(requestBody)
            })
            .then(response => setCompleted(true))
            .catch(error => console.log(error))    
            // Change items quantity from db after being sold
        }
        else {
            setCompleted(false)
            toast.error('Oops, something went wrong. Please try again later.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
        }     
    }

    console.log(window.location.href)

    useEffect(() => {
        confirmOrder();
    },[])


    return(
        <Container sx={{ minHeight: "81vh", display: "flex", justifyContent: "center", alignContent: "center"}}>
            {completed &&
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" >            
                <CheckCircle color="success" sx={{ fontSize: '100px'}}/>
                <Typography fontSize="28px" mt="14px" textAlign="center" >
                    THANK YOU FOR YOUR PURCHASE!
                </Typography>
                <Typography fontSize="14px" textAlign="center" >
                Your order is available on your ordes page.
                </Typography>
                <Button onClick={() => navigate('/')} variant="contained" sx={{ mt: "50px" }}>
                    Back home
                </Button>
            </Box>   
            }
            <ToastContainer/>  
        </Container>
       
    )
}