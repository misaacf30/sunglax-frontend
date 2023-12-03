import { Box, Button, Container, Typography, FormControlLabel, Checkbox} from "@mui/material"
import { useFormik } from "formik"
import * as yup from "yup"
import { useSelector } from "react-redux"
import AddressForm from "../components/AddressForm"
import ContactForm from "../components/ContactForm"
import { loadStripe } from "@stripe/stripe-js"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios, * as others from 'axios';
import secureLocalStorage from "react-secure-storage"
import { useEffect } from "react"
import { useState } from "react"

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const initialValues = {
    shippingAddress: {
        firstName: "",
        lastName: "",
        country: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        zipCode: "",
    },
    billingAddress: {
        isSameAddress: true,
        firstName: "",
        lastName: "",
        country: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        zipCode: "",
    },
    contactInfo: {
        email: "",
        phoneNumber: "",
    }   
};

const checkoutSchema = yup.object({
    shippingAddress: yup.object({
        firstName: yup.string().required("First name required"),
        lastName: yup.string().required("Last name required"),
        country: yup.string().required("Country required"),
        street1: yup.string().required("Street required"),
        street2: yup.string(),
        city: yup.string().required("City required"),
        state: yup.string().required("State required"),
        zipCode: yup.string().required("Zip code required"),
    }),
    billingAddress: yup.object({
        isSameAddress: yup.boolean(),
        firstName:  yup.string().when('isSameAddress', {
            is: false,
            then: () => yup.string().required("First name required")    // () => is necessary when using .when()
        }),
        
        lastName: yup.string().when('isSameAddress', {
            is: false,
            then: () => yup.string().required("Last name required")
        }),
        
        country: yup.string().when('isSameAddress', {
            is: false,
            then: () => yup.string().required("Country required")
        }),
        
        street1: yup.string().when('isSameAddress', {
            is: false,
            then: () => yup.string().required("Street required")
        }),
        
        street2: yup.string(),

        city: yup.string().when('isSameAddress', {
            is: false,
            then: () => yup.string().required("City required")
        }),
        
        state:  yup.string().when('isSameAddress', {
            is: false,
            then: () => yup.string().required("State required")
        }),
        
        zipCode:  yup.string().when('isSameAddress', {
            is: false,
            then: () => yup.string().required("Zip code required")
        }),     
    }),   
    contactInfo: yup.object({
        email: secureLocalStorage.getItem("authenticated") ? "" :  yup.string().email("Enter valid email").required("Email is required"),
        phoneNumber: yup.string().required("Phone number is required"),
    }),      
});

export default function Checkout() {
    const cart = useSelector((state) => state.cart.cart);
    const[customerId, setCustomerId] = useState(null);

    if(secureLocalStorage.getItem("authenticated")) {
        (async () => {
            await axios.get("/api/Auth/userInfo")
            .then(response => {
                setCustomerId(response.data.stripeCustomerId)
                formik.initialValues.shippingAddress.firstName = response.data.firstName;
                formik.initialValues.shippingAddress.lastName = response.data.lastName;
                formik.initialValues.contactInfo.email = response.data.username;
            })
            .catch(error => {
                //console.log(error)
            });
        }
    )();
    }     
 
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: checkoutSchema,
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (values, actions) => {
            if(values.billingAddress.isSameAddress) {
                actions.setFieldValue("billingAddress", {
                    ...values.shippingAddress,
                    isSameAddress: true
                })              
            }
            makePayment(values);
        }
    });

    async function makePayment(values) {
        const stripe = await stripePromise;
        //console.log("*****CUSTOMER ID: " + customerId)

        const requestBody = {
            customerEmail: secureLocalStorage.getItem("authenticated") ? null : values.contactInfo.email,
            customer: customerId,
            successUrl: "http://localhost:3000/success?session_id=" + "{CHECKOUT_SESSION_ID}",
            cancelUrl: "http://localhost:3000",
            products: cart.map((product) => {
                return { item1: product.stripePriceId, item2: product.count }
            })
        };
        //console.log(requestBody)
        const session = await fetch("/api/Stripe/session/create", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(requestBody)
        }).then((response) => {
            return response.json().then((data) => {
                //console.log(data);
                return data;
            })
        }).catch((err) => {
            //console.log(err.message);
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

        secureLocalStorage.removeItem("cart");
        await stripe.redirectToCheckout({
            sessionId: session.id,
        });
        
    }
    return (
        <Container>
                <Box component="form" onSubmit={formik.handleSubmit} noValidate>    
                    <Typography my="10px" align="center">
                        CHECKOUT
                    </Typography>
             
                    {/* Address Form */}
                    <Box>
                        <Typography mb="3px">
                            Shipping Address
                        </Typography>
                        <AddressForm
                            type="shippingAddress"
                            values={formik.values.shippingAddress}
                            errors={formik.errors}
                            touched={formik.touched}
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}                    
                        />
                    </Box>

                    {/* Same Address Checkbox */}
                    <Box mb="10px">
                        <FormControlLabel
                        label="Same for Billing Address"
                            control={
                                <Checkbox
                                    defaultChecked
                                    value={formik.values.billingAddress.isSameAddress}
                                    onChange={() =>
                                        formik.setFieldValue(
                                            "billingAddress.isSameAddress",
                                            !formik.values.billingAddress.isSameAddress
                                        )                            
                                    }
                                />
                            }
                        />
                    </Box>

                    {/* Billing Form */}
                    {!formik.values.billingAddress.isSameAddress && (
                    <Box my="10px" >
                        <Typography mb="3px">
                        Billing Address
                        </Typography>
                        <AddressForm
                        type="billingAddress"
                        values={formik.values.billingAddress}
                        errors={formik.errors}
                        touched={formik.touched}
                        handleBlur={formik.handleBlur}
                        handleChange={formik.handleChange}                    
                        />
                    </Box>
                    )}

                    {/* Contact Form */}
                    <Box my="20px">
                        <Typography mb="3px">
                            Contact Information
                        </Typography>
                        <ContactForm
                            type="contactInfo"
                            values={formik.values.contactInfo}
                            errors={formik.errors}
                            touched={formik.touched}
                            handleBlur={formik.handleBlur}
                            handleChange={formik.handleChange}
                            setFieldValue={formik.setFieldValue}
                        />
                    </Box>
              
                    {/* Payment button */}        
                    <Button
                    fullWidth
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{                                            
                        boxShadow: "none",
                        color: "white",
                        borderRadius: 0,
                        padding: "15px 40px",
                        marginBottom: "10px"
                    }}
                    //onClick={() => console.log(cart)}   // ????
                    disabled={cart.length===0}
                    >
                    Proceed to payment
                    </Button>
                    
                    <ToastContainer/>                                                           
                </Box>
        </Container>
    )
}