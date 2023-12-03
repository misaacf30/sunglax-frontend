import { AccountBox, AccountCircle, CheckBox, Satellite } from "@mui/icons-material";
import { Box, Button, Card, CardActions, CardContent, CardHeader, Checkbox, Container, Divider, FormControlLabel, Grid, TextField, Typography } from "@mui/material";
import { getIn, useFormik } from "formik";
import * as yup from "yup"
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';


export default function UserInfo() {
    const navigate = useNavigate();
    const { state } = useLocation();

    const initialValues ={
        firstName: state.firstName,
        lastName: state.lastName,
        username: state.username,
        password: "",
        newPassword: "",
        changePassword: false
    }
    const userSchema = yup.object({
        firstName: yup.string().required("First name required"),
        lastName: yup.string().required("Last name required"),
        username: yup.string().email("Enter vaild email").required("Username required"),
        password: yup.string().min(8, "Password should be of minimum 8 characters length").required("Password required"),
        newPassword: yup.string().when('changePassword', {
            is: true,
            then: () => yup.string().min(8, "Password should be of minimum 8 characters length").required("New passwowrd required")
        }),
        changePassword: yup.boolean()
    })
    
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: userSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (values) => {       
            updateInfo(values);
        }
    })

    async function updateInfo(values) {
        await axios.put('/api/Auth/userInfo' , {
            Id: state.userId,
            FirstName: values.firstName,
            LastName: values.lastName,
            Password: values.password,
            NewPassword: values.newPassword
        })
        .then(response => {
            if(response.status == 200) {
                navigate("/userInfo", { state: { userId: state.userId, username: values.username, firstName: values.firstName, lastName: values.lastName, updated: true }});                
                window.location.reload();                           
            }
        })
        .catch(error => {
            if(error.response.status == 400) {
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
            }        
        })
    }

    useEffect(() => {
        if(state.updated) {
            toast.success('Personal information updated.', {
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
    },[])

    return(
        <Container sx={{ minHeight: "80vh" }}>
            <Box component="form" onSubmit={formik.handleSubmit} noValidate >            
                <CardHeader sx={{ mt: "5px", pb:0 }} title="PERSONAL INFORMATION"/>
                <Divider/>

                <CardContent 
                sx={{ display: "flex", flexDirection: { xs: "column", sm: "row"}, mt: 5, gap: 5, justifyContent: "center"}}>
                    <Box textAlign="center">
                        <AccountBox color="info" sx={{ fontSize: "250px"}} />
                    </Box>
                    <Box // textAlign="left" alignContent="center" alignItems="center" alignSelf="center"
                    display="grid"
                    gap= "5px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                    >
                        <TextField
                        margin="dense"
                        size="medium"
                        fullWidth                  
                        name="firstName"
                        label="First Name"      
                        placeholder="First Name"          
                        autoComplete="firstName"
                        type="text"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.firstName}                
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                        sx={{ gridColumn: "span 2"}}
                        />
                        <TextField
                        margin="dense"
                        size="medium"
                        fullWidth                  
                        name="lastName"
                        label="Last Name"
                        autoComplete="lastName"
                        placeholder="Last Name" 
                        type="text"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.lastName}                
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                        sx={{ gridColumn: "span 2"}}
                        />
                        <TextField
                        disabled
                        margin="dense"
                        size="medium"
                        fullWidth                  
                        name="username"
                        label="Username"                
                        autoComplete="username"
                        placeholder="example@gmail.com"
                        type="email"
                        onBlur={formik.handleBlur}
                        //onChange={formik.handleChange}
                        value={formik.values.username}                
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
                        sx={{ gridColumn: "span 4"}}
                        />
                        <TextField
                        margin="dense"
                        size="medium"
                        fullWidth                  
                        name="password"
                        label="Password"                           
                        autoComplete="password"
                        placeholder="Password"  
                        type="password"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.password}                
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        sx={{ gridColumn: "span 4" }}
                        />
                        
                        {formik.values.changePassword === true && 
                        <TextField
                        margin="dense"
                        size="medium"
                        fullWidth                  
                        name="newPassword"
                        label="New Password" 
                        placeholder="New password"               
                        autoComplete="newPassword"
                        type="password"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.newPassword}                
                        error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                        helperText={formik.touched.newPassword && formik.errors.newPassword}
                        sx={{ gridColumn: "span 4"}}
                        />
                        }
                        
                        <FormControlLabel
                        sx={{ gridColumn: "span 4"}}
                        label="Change password"                  
                        control={
                            <Checkbox
                            defaultChecked={false}
                            value={formik.values.changePassword}
                            onChange={() => formik.setFieldValue("changePassword", !formik.values.changePassword)}
                            />
                        }
                        />
                    </Box>      
                </CardContent>
                <CardActions sx={{ display: "flex", justifyContent: "center", mt: 2}}>
                    <Button type="submit" variant="contained" size="large" fullWidth
                    sx={{ px: 10, maxWidth: { xs: "90%", sm: "80%", md: "70%", lg: "55%" } }}>
                        UPDATE INFORMATION
                    </Button>
                </CardActions>
                <ToastContainer/>
            </Box>
        </Container>
    )
}