import {  Box, Button, Card, CardContent, CardHeader, CardMedia, Container, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import axios  from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { styled } from '@mui/material/styles';
import ShopIcon from '@mui/icons-material/Shop';
import secureLocalStorage from "react-secure-storage";
import { setOrders } from '../state';
import { Error } from "@mui/icons-material";


const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });
  
export default function Orders() {
    const { state } = useLocation();   
    const[data, setData] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authenticated = useSelector((state) => state.cart.authenticated);
    const orders = useSelector((state) => state.cart.orders)

    // async function getOrders() {
    //     // await fetch("/api/Order/get/" + state, {
    //     //     method: 'GET',
    //     //     headers: { 'Authorization': axios.defaults.headers.common['Authorization'] }
    //     // })
    //     // .then(response => response.json())
    //     // .then(json => setData(json))

    //     const res = await axios.get(`/api/Auth/getOrders/${state}`, { withCredentials: true })
    //     setData(res.data)
    // }

    // useEffect(() => {
    //     getOrders()
    // },[authenticated])  // >?


    useEffect(() => {
        if(authenticated && !orders) {  // secureLocalStorage.getItem("authenticated") generates double api call
            (async () => {
                await axios.get(`/api/Auth/getOrders/${state}`, { withCredentials: true })
                .then(response => dispatch(setOrders(response.data)))
                //setData(res.data)
            }
        )();
        }     
    },[authenticated]);     //???

    return (
        <Container sx={{ minHeight: "80vh" }}>
            {/* pl:0 */}
            <CardHeader sx={{ mt: "5px", pb: 0}} title="ORDERS"/>
            <Divider/>
            {(orders) &&
                orders.map((order, i) => (                   
                    <Card key={i} sx={{ marginY: 3, border: '1px solid', borderColor: 'grey.300'}}>
                        <CardHeader
                            sx={{ backgroundColor: 'grey.200', borderBottom: '1px solid', borderColor: 'grey.300'}}
                            subheader=
                            {<Grid container>
                                <Grid container item xs={5} direction="column">
                                    <Typography>Order placed:</Typography>
                                    <Typography>{new Date (order.createdAt).toDateString()}</Typography>
                                </Grid>
                                <Grid container item xs={3} direction="column">
                                    <Typography>Total:</Typography>
                                    <Typography>${order.total.toFixed(2)}</Typography>
                                </Grid>
                                <Grid container item xs={4} direction="column">
                                    <Typography>Ship to:</Typography>
                                    <Typography>{order.name}</Typography>
                                </Grid>
                            </Grid>}
                        >                
                        </CardHeader>

                        <CardContent sx={{ pt: 0 }}>
                            {order.items.map((i, index) => (
                                <Grid key={index} container spacing={4} sx={{ marginY : '0'}}>
                                    <Grid container item xs={3} md={2}>                                
                                        <Img alt="" src={require(`../assets/${i.id}.jpg`)}/>
                                    </Grid>
                                    <Grid container item xs={5} sm direction="column">
                                        <Typography fontSize="large">{i.name}</Typography> 
                                        {i.quantity > 1 && 
                                            <Typography fontSize="large">x{i.quantity}</Typography>
                                        }                                                                           
                                    </Grid>

                                    <Grid container item xs={4} md={3} sx={{ }}>
                                        <Button onClick={() => navigate(`/product/${i.id}`, { state : { id: i.id }})} variant="text" size="small" sx={{ maxHeight: '50px', fontSize: "12px", color: "grey.500"}}>
                                            <ShopIcon sx={{ display: "flex", justifyContent: "flex-start"}}/>Buy it again
                                        </Button>
                                    </Grid>
                                   
                                </Grid>
                            ))}
                        </CardContent>
                    </Card>
                ))
            }
            { (!orders && secureLocalStorage.getItem("authenticated" === false)) &&
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="15px" my="60px">
                    <Error color="info" sx={{ fontSize: '100px'}}/>
                    <Typography fontSize="large" color="black">
                            You don't have orders!
                    </Typography>
                </Box>   
            }       
            <ToastContainer/>  
        </Container>
    )
}