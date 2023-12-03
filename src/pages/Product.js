import { Box, Button, CardActionArea, CardContent, CardMedia, Container, Divider, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { addToCart } from "../state";
import { useDispatch, useSelector } from "react-redux";
import { setItems } from "../state";

export default function Product() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { productId } = useParams();
    const { state } = useLocation(); 
    const [product, setProduct] = useState([]);
    const [count, setCount] = useState(1);
    const products = useSelector((state) => state.cart.items);

    async function getProduct() {
        const response = await fetch(`/api/Product/${state.id}`, { method: "GET" });
        const data = await response.json();
        setProduct(data);
      }

    async function getProducts() {
    const response = await fetch("/api/Product", { method: "GET" });
    const data = await response.json();
    dispatch(setItems(data));
    }
    
    
    useEffect(() => {
        getProduct();
        if(!products || products.length === 0) {
            getProducts();
        }
        setCount(1);
    },[state.id]);


    return(
        <Container maxWidth="lg" sx={{ backgroundColor: '', minHeight: "80vh"}}>          
            <Grid container spacing={0} sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, mt: 4}}>
                <Grid item xs={12} sx={{ display: {xs: 'block', sm: 'none'}}}>
                    <Typography fontSize="24px">{product.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={5}
                sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    <CardMedia
                    component="img"
                    image={require(`../assets/${state.id}.jpg`)}
                    sx={{
                        width: '80%',
                    }}
                    />
                </Grid>
                <Grid item xs={12} sm={7}
                    sx={{ display: 'flex', flexDirection: 'column',}}>
                    <Typography fontSize="24px" fontWeight="bold" sx={{ display: {xs: 'none', sm: 'block'} }}>
                        {product.name}
                    </Typography>
                    <Typography fontSize="16px">
                        {product.description}
                    </Typography>
                    <Typography fontSize="16px" fontWeight="bold" my={1}>
                        Price: ${product.price}
                    </Typography>

                    {product.quantity > 0 && product.quantity <= 10 && (
                        <Typography fontSize="14px" color="error">
                        Only {product.quantity} left in stock.
                        </Typography>
                    )}
                    
                    <Box sx={{ fontSize: "16px"}}>
                        <Button onClick={() => count > 1 && setCount(count - 1)} sx={{fontSize: "16px", fontWeight: "bold"}}>-</Button>
                            {count}
                        <Button onClick={() => count < product.quantity && setCount(count + 1)} sx={{fontSize: "16px", fontWeight: "bold"}}>+</Button>
                    </Box>

                    
                    {product.quantity > 0 &&
                        <Button onClick={() => dispatch(addToCart({ item: { ...product, count } })) } 
                        variant="contained" size="medium" sx={{ maxWidth: '100%' }}
                        // disabled
                        >
                        ADD TO CART
                        </Button>  
                    }                                      
                </Grid>         
            </Grid>

            <Box mt={13} px="10px">
                <Typography variant="h5">
                    Similar items
                </Typography>
                <Divider/>            
                <Grid container spacing={4} wrap="nowrap" overflow="hidden">
                    {products.slice(0,5).map((item, i) => (
                        item.id != state.id &&     // used only 4 items ??   
                         <Grid key={i} container item md={3} mt={2}>
                            <CardActionArea onClick={() => navigate(`/product/${item.id}`, { state: { id: item.id, samePage: true }})}>
                                <CardMedia
                                component="img"
                                sx={{
                                    //width: { xs: "20%"},
                                }}
                                image={require(`../assets/${item.id}.jpg`)}
                                alt="pic"
                                />
                                <CardContent>
                                    <Typography>
                                        {item.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Grid>
                    ))}
                </Grid>               
            </Box>
            
        </Container>
    )
}