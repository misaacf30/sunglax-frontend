import { Box, TextField } from "@mui/material"
import { getIn } from "formik";
import secureLocalStorage from "react-secure-storage";

export default function ContactForm({ type, values, errors, touched, handleBlur, handleChange}) {
    const formattedName = (field) => `${type}.${field}`;
    const formattedError = (field) =>
        Boolean(
            getIn(touched, formattedName(field)) && getIn(errors, formattedName(field))
        )
    const formattedHelper = (field) => 
        getIn(touched, formattedName(field)) && getIn(errors, formattedName(field))

    return(
        <Box>
            <TextField
                size="small"
                fullWidth
                required
                type="text"
                label="Receipt Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name={formattedName("email")}
                error={formattedError("email")}
                helperText={formattedHelper("email")}
                sx={{ gridColumn: "span 4", marginBottom: "10px"}}
                disabled={secureLocalStorage.getItem("authenticated") && true}
            />
            <TextField
                size="small"
                fullWidth
                required
                type="text"
                label="Phone Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phoneNumber}
                name={formattedName("phoneNumber")}
                error={formattedError("phoneNumber")}
                helperText={formattedHelper("phoneNumber")}
                sx={{ gridColumn: "span 4"}}
            />
        </Box>
    )
}