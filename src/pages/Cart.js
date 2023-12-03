import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Container, Divider, Grid, Typography } from "@mui/material";
import { increaseCount, decreaseCount, removeFromCart, clearCart } from "../state";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import axios, * as others from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import { BorderColor } from "@mui/icons-material";
import { useEffect } from "react";
import { setAuthenticated} from '../state';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

export default function Cart() {
    const { state } = useLocation();   
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);
    const authenticated = useSelector((state) => state.cart.authenticated);
    const homeUrl = window.location.href.split("/cart")[0]

    const customerId = state.stripeCustomerId;
    const username = state.username;
    const userId = state.userId;
 
    const totalPrice = cart.reduce((total, item) => {
        return total + item.count * item.price;
    }, 0);

    const numOfItems = cart.reduce((total, item) => {
        return total + 1 * item.count ;
    }, 0);

    useEffect(() => {
        if(secureLocalStorage.getItem("authenticated") === true) {
            dispatch(setAuthenticated(true))
        }
    }, [authenticated])

    async function checkout() {
        const stripe = await stripePromise;

        const requestBody = {
            customerEmail: secureLocalStorage.getItem("authenticated") ? null : username,
            customer: customerId,
            successUrl: homeUrl + "/success?session_id=" + "{CHECKOUT_SESSION_ID}",
            cancelUrl: homeUrl,
            products: cart.map((product) => {
                return { item1: product.stripePriceId, item2: product.count }
            })       
        }

        const session = await fetch("/api/Stripe/session/create", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(requestBody)
        }).then((response) => {
            return response.json().then((data) => {
                return data;
            })
        }).catch((err) => {
            toast.error('Oops, something went wrong. Please try again.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
        });

        const OrderRequestBody = {
            userId: userId ? userId : null,
            total: totalPrice,
            stripeSessionId: session.id,
            items: cart.map((product) => {
                return { item1: product.stripePriceId, item2: product.count }
            })
          };
        await fetch("/api/Order/add", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(OrderRequestBody)
        })

        secureLocalStorage.removeItem("cart");  // ?
        await stripe.redirectToCheckout({
            sessionId: session.id,
        });
    }

    return(
        <Container sx={{ minHeight: "80vh"}}>     
            {/* <Box sx={{my: "10px", border: 0}}> */}
                <CardHeader
                    title="SHOPPING CART"
                    subheader={cart.length > 0 && <Button onClick={() => dispatch(clearCart())} size="small" sx={{ fontSize:"12px", p:0}}>REMOVE ALL ITEMS</Button>}
                    sx={{ mt: "5px", pb: 0}}
                />
                <Divider/> 
               
                {cart.length === 0 &&
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" my="60px">
                        <ProductionQuantityLimitsIcon color="warning" sx={{ fontSize: '80px'}}/>
                        <Typography fontSize="large" color="black">
                            Your cart is currently empty!
                        </Typography>
                    </Box>              
                }

                <CardContent>                 
                    {cart.length > 0 &&
                        cart.map((item, i) => {
                            return (
                                <Box key={i}>
                                <Grid container spacing={4} sx={{ py: {xs: 1, md: 2} , borderColor: "grey.300"}}>
                                    <Grid container item xs={4} md={3}>
                                        <Img alt="" src={require(`../assets/${item.id}.jpg`)}/>
                                    </Grid>
                                    <Grid container item xs={5} md={6} direction="column" overflow="hidden">
                                        <Typography variant="h6">{item.name}</Typography>
                                        {item.quantity > 0 && item.count < item.quantity && <Typography variant="body2" color="green">In Stock</Typography>}
                                        {item.quantity > 0 && item.count == item.quantity && <Typography variant="body2" color="red">Only {item.quantity} in Stock</Typography>}
                                        <CardActions sx={{ display:'flex', justifyContent:'flex-start', alignItems:"flex-start", p:0, my: "20px"}}>
                                            <Button size="small" sx={{p: 0}} onClick={() => item.count > 1 && dispatch(decreaseCount({ id: item.id }))}>-</Button>
                                            <Typography>{item.count}</Typography>
                                            <Button size="small" sx={{p: 0}} onClick={() => item.count < item.quantity && dispatch(increaseCount({ id: item.id }))}>+</Button>
                                            <Button size="small" sx={{p: 0}} onClick={() => dispatch(removeFromCart({ id: item.id }))}>Delete</Button>
                                        </CardActions>
                                    </Grid>
                                    <Grid container item xs={2} sx={{ display: "flex", justifyContent:"flex-end"}}>
                                        <Typography>${item.price.toFixed(2)}</Typography>                                     
                                    </Grid>                              
                                </Grid>
                                <Divider light/>
                                </Box>
                            )
                        })
                    }
                    {cart.length > 0 &&
                        <Typography align="right" mb="20px">
                        Subtotal ({numOfItems} items): ${totalPrice}
                        </Typography>
                    }
                </CardContent>

                <CardActions>
                <Button onClick={() => checkout()} variant="contained" size ="large" fullWidth={true} disabled={cart.length===0}>
                    Checkout
                </Button>     
            </CardActions>
            {/* </Box>        */}
            <ToastContainer/>   
        </Container>
    )
}