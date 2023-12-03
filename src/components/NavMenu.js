import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Badge, Box, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material';
import { ShoppingCart, BeachAccess, ArrowDropDown, PersonAdd, Logout, Edit, ListAlt, CardTravelTwoTone } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { blue } from '@mui/material/colors';
import { setCart } from '../state';
import secureLocalStorage from 'react-secure-storage';

import { ToastContainer, toast } from 'react-toastify';
import axios, * as others from 'axios';
import { setAuthenticated} from '../state';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }));

export default function NavMenu() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);
    const authenticated = useSelector((state) => state.cart.authenticated);

    const[userId, setUserId] = useState();
    const [username, setUsername] = useState();
    const[name, setName] = useState();
    const[lastName, setLastName] = useState();
    const[stripeCustomerId, setStripeCustomerId] = useState();

    const numOfItems = cart.reduce((total, item) => {
        return total + 1 * item.count ;
    }, 0);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };   

    useEffect(() => {
        if(cart.length === 0 && secureLocalStorage.getItem("cart")) {
            const jsonItems = secureLocalStorage.getItem("cart");
            const localItems = JSON.parse(jsonItems)
            dispatch(setCart(localItems))
        }
    }, [cart])

    useEffect(() => {
        if(secureLocalStorage.getItem("authenticated") === true) {
            dispatch(setAuthenticated(true))
        }
    }, [authenticated])   // axios.defaults.headers.common['Authorization'] ???
  
    useEffect(() => {
        if(authenticated) {  // secureLocalStorage.getItem("authenticated") generates double api call
            (async () => {
                await axios.get("/api/Auth/userInfo")
                .then(response => {
                    setName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setUsername(response.data.username);
                    setUserId(response.data.id);
                    setStripeCustomerId(response.data.stripeCustomerId);
                })
                // .catch(error => {
                //     setName(null);
                //     setUsername(null);
                // });
            }
        )();
        }     
    },[authenticated]);     //???

  async function logout() {
    await axios.post("/api/Auth/revoke", {}, {params: { username: username }})
        .catch(() => dispatch(setAuthenticated(false)))
    dispatch(setAuthenticated(false))   // ??
    secureLocalStorage.removeItem("cart")
    navigate('/');
    window.location.reload();  
  }  

    return (
        <Box sx={{ py: 0.5, display: 'flex', alignItems: 'center', textAlign: 'center', justifyContent: 'space-between',  backgroundColor: '#0e4686' }}>
            <Button 
            onClick={() => navigate("/")} 
            sx={{ minWidth: 100, color: 'white', textTransform: 'none', fontSize: '16px'}} 
            size="large">
                SUNGLAX <BeachAccess htmlColor='#4dabf5' fontSize="small" sx={{ transform: "rotate(90deg)" }}/>
            </Button>
                        
            <Box>
                {!authenticated && !secureLocalStorage.getItem("authenticated") &&
                <Button
                sx={{ px: 2.5, mr: 3 }}
                onClick={() => navigate("/signin")} variant="contained" size ="small" >
                    LOGIN
                </Button>
                }
                
                {authenticated &&
                <Button
                sx={{ minWidth: 100, color: 'white', textTransform: 'none', fontSize: '14px'}}
                size="small"
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}    
                >
                    {/* {username ?  <>Hi {username}</> : <>Account</> } */}
                    {/* secureLocalStorage.getItem("authenticated") === true && name */} 
                    <>
                        Hi {name}
                        <ArrowDropDown/>
                    </>
                </Button>
                }
                
                <IconButton onClick={() => navigate("/cart", { state : {stripeCustomerId : stripeCustomerId, username: username, userId : userId }})}
                sx={{ minWidth: 80, color: 'white', fontSize: "24px"}}
                aria-label="cart" 
                size="small">
                    <StyledBadge badgeContent={numOfItems} color="error">
                        <ShoppingCart fontSize=""/>                     
                    </StyledBadge>
                </IconButton>
                <ToastContainer/>
            </Box>
                  
            <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
            elevation: 0,
            sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
                },
                '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                },
            },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {/* {(!authenticated) &&
            <MenuItem>
                    <Button onClick={() => navigate("/signin")} variant="contained" size ="small" fullWidth={true}>
                        Sign in
                    </Button>   
            </MenuItem>
            } */}
            
            <MenuItem onClick={() => navigate("/account")}>
                <Avatar sx={{ bgcolor: blue[500] }}/> My account
            </MenuItem>

            <Divider/>

            <MenuItem onClick={() => navigate("/userInfo", { state : { userId: userId, username: username, firstName: name, lastName: lastName }})}>
                <ListItemIcon>
                    <Edit fontSize="small" />
                </ListItemIcon>
                Personal information
            </MenuItem>

                <MenuItem onClick={() => navigate("/orders", { state: userId })}>              
                        <ListItemIcon>
                            <ListAlt fontSize="small"/>
                        </ListItemIcon>
                        Orders
                    
                </MenuItem>

            <MenuItem onClick={logout}>           
            <ListItemIcon>
                <Logout fontSize="small" />
            </ListItemIcon>
            Logout       
            </MenuItem>

            </Menu>         
        </Box>   
    );
}