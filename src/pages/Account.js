import { ListAlt, Edit, ShoppingCart, Shop } from "@mui/icons-material";
import { Avatar, Button, CardActions, CardHeader, Container, Divider, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Account() {
    const navigate = useNavigate();
    const[userId, setUserId] = useState();
    const [username, setUsername] = useState();
    const[firstName, setFirstName] = useState();
    const[lastName, setLastName] = useState();
    const[stripeCustomerId, setStripeCustomerId] = useState();
    const authenticated = useSelector((state) => state.cart.authenticated);
    
    useEffect(() => {
        if(authenticated) {
            (async () => {
                await axios.get("/api/Auth/userInfo")
                .then(response => {
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setUsername(response.data.username);
                    setUserId(response.data.id);
                    setStripeCustomerId(response.data.stripeCustomerId);
                })
            }
        )();
        }     
    },[authenticated]);  

    return (
        <Container sx={{ minHeight: "80vh" }}>
            <CardHeader sx={{ mt: "5px", pb:0 }} title="ACCOUNT"/>
            <Divider/>

            <CardActions sx={{ mt: "40px"}}>
                <Grid container spacing={3} display="flex" justifyContent="center">
                    <Grid container item xs={12} sm={4}>
                        <Button onClick={() => navigate("/userInfo", {state: { userId: userId, username: username, firstName: firstName, lastName: lastName }})} variant="contained" fullWidth 
                        sx={{py: { xs: 3, sm: 5 }, backgroundColor: "grey.50", color: "black", ":hover": { backgroundColor: "grey.300" }}}
                        >
                            <Grid container>
                                <Grid container item xs={4} display="flex" justifyContent="center">
                                    <Avatar sx={{ bgcolor: "#3378af"}}>
                                        <Edit/>
                                    </Avatar>
                                </Grid>
                                <Grid container item xs={8}>
                                    <Typography align="left" sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>YOUR PERSONAL INFORMATION</Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                    <Grid container item xs={12} sm={4}>
                        <Button onClick={() => navigate("/orders", { state: userId })} variant="contained" fullWidth 
                        sx={{py: { xs: 3, sm: 5 }, backgroundColor: "grey.50", color: "black", ":hover": { backgroundColor: "grey.300" }}}
                        >
                            <Grid container>
                                <Grid container item xs={4} display="flex" justifyContent="center">
                                    <Avatar sx={{ bgcolor: "#3378af"}}>
                                        <ListAlt/>
                                    </Avatar>
                                </Grid>
                                <Grid container item xs={8}>
                                    <Typography align="left" sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>YOUR ORDERS</Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                    <Grid container item xs={12} sm={4}>                       
                        <Button onClick={() => navigate("/cart", { state : {stripeCustomerId : stripeCustomerId, username: username, userId : userId }}) } variant="contained" fullWidth 
                        sx={{ py: { xs: 3, sm: 5 }, backgroundColor: "grey.50", color: "black", ":hover": { backgroundColor: "grey.300" }}}
                        >
                            <Grid container>
                                <Grid container item xs={4} display="flex" justifyContent="center">
                                    <Avatar sx={{ bgcolor: "#3378af"}}>
                                        <ShoppingCart/>
                                    </Avatar>
                                </Grid>
                                <Grid container item xs={8}>
                                    <Typography align="left" sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>YOUR CART</Typography>
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                </Grid>              
            </CardActions>
        </Container>
    )
}