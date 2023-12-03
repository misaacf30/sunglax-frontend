import { CardActionArea, CardContent, CardMedia, Container, Divider, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setItems } from "../state";
import { useDispatch, useSelector } from "react-redux";


export default function ShoppingList() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  async function getProducts() {
    const response = await fetch("/api/Product", { method: "GET" });
    const data = await response.json();
    dispatch(setItems(data));
  }

  useEffect(() => {
    if(products === null || products.length === 0)
      getProducts();
  },[]);

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: ''}}>
      <Typography align='left' variant="h5">PRODUCTS</Typography>
      <Divider/>
      <Grid container spacing={4} mt={0}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={3} lg={3}>
            {/* <Link to={`/product/${product.id}`}
                  state={{ id: product.id }}
                  style={{ textDecoration: 'none', color: 'inherit'}}
            > */}
            <CardActionArea
              onClick={() => navigate(`/product/${product.id}`, { state : { id: product.id }})}
              sx={{ height: '100%', display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, 
                    border: 0.1, borderColor: 'grey.200', borderRadius: {xs: '4px', sm: '8px' }, overflow: 'hidden' }}
            >  
              <CardMedia
                component="img"
                sx={{
                  // 16:9,
                  width: { xs: '50%', sm: '100%'},
                  //pt: '56.25%',
                }}
                // sx={{
                //   width: { xs: '50%', sm: '100%'},
                  
                // }}
                image={require(`../assets/${product.id}.jpg`)}
                alt="random"
              />
              
              <CardContent sx={{ flexGrow: 1, width: { xs: '50%', sm: '100%'}}}>
                <Typography gutterBottom variant="h5" align='left'>
                    {product.name}
                </Typography>
                <Typography align='left'>
                    ${product.price.toFixed(2)}
                </Typography>
                {product.quantity > 0 && product.quantity <= 10 && (
                  <Typography color="red">
                    Only {product.quantity} left in stock.
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
            {/* </Link> */}
            </Grid>
        ))}
      </Grid>
    </Container>
   
  );
}