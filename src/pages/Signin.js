import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { createSearchParams, useNavigate, useParams } from 'react-router-dom';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { setAuthenticated } from "../state";
import axios, * as others from 'axios';
import secureLocalStorage from 'react-secure-storage';


const validationSchema = yup.object({
  email: yup
    .string('Enter your email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});

const theme = createTheme();

export default function Signin() {
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      login(values.email, values.password)
    },
  })

  async function login(username, password) {
    //const {data} = 
    await axios.post("/api/Auth/login", {
      username,
      password,
     }, {withCredentials : true})
    // .then((response) => {
    //   secureLocalStorage.setItem("token", response.data);   // store token first
    //   dispatch(setAuthenticated(true))
    //   // const decoded = jwtDecode(response.data)
    //   // cookies.set("token", response.data, {
    //   //   expires: new Date(decoded.exp * 1000),
    //   // });      
    //   navigate('/'); 
    // })
    .then((response) => {
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;
      dispatch(setAuthenticated(true))
      navigate('/');
    })
    .catch((error) => {
      if(error.response.status === 400) {
        toast.error('Incorrect email or password. Please try again.', {
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
      else {
        toast.error('Opps, something went wrong. Please try again later', {
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
    })
      
    //axios.defaults.headers.common['Authorization'] = `Bearer ${data}`;
    //secureLocalStorage.setItem("autenticated", true);
    //dispatch(setAuthenticated(true))
    //navigate('/')
  };


  // function getUser() {
  //   let payload = {
  //       method: 'GET',
  //       headers: {   
  //           "access-control-allow-origin" : "*", 
  //           'Accept': 'application/json',
  //           'Content-Type': 'application/json',
  //           'Authorization': 'Bearer ' + token
  //        },
  //   }
  //   return fetch("/api/Auth", payload)
  //   .then(function(response) {
  //       if (!response.ok) {
  //           throw Error(response.statusText);
  //       }
  //       return response.json();
  //   })
  //   .then(function(result) {
  //       console.log(result)
  //       return result;
  //   }).catch(function(error) {
  //       console.log("ERROR: " + error);
  //   });
  // }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs" sx={{ minHeight: "75vh"}}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              //autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit'}}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Link>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Register"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <ToastContainer/>
      </Container>
    </ThemeProvider>
  );
}