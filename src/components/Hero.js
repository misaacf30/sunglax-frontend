import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import hero from '../assets/hero.jpg'

export default function Hero() {
    return(
        <Paper
            sx={{
                position: 'relative',
                backgroundColor: 'grey.800',
                color: '#fff',
                mb: 4,
                bacgroundSize: 'cover', 
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url(${hero})`,
            }}
        >
            {<img style={{ display: 'none' }} src={hero} alt={hero} />}
            
            <Box
                sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                backgroundColor: 'rgba(0,0,0,.3)',
                }}
            />
            <Grid container>
                <Grid item md={6}>
                <Box
                    sx={{
                    position: 'relative',
                    p: { xs: 7, sm: 10, md: 12, lg: 14, xl: 15},
                    pr: { md: 0 },
                    }}
                >
                    <Typography component="h1" variant="h3"  color="inherit" gutterBottom align='left'>
                    SUMMER IS HERE!
                    </Typography>
                    <Typography variant="h7" color="inherit" paragraph align='left'>
                    Get your glasses before they get out of stock at our store or online.
                    </Typography>
                </Box>
                </Grid>
            </Grid>
        </Paper>
    )
}