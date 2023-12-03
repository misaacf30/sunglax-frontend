import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../state";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

//axios.defaults.baseURL = "/api/Auth/"

var isRefreshing = false    // to handle multiple requests

axios.interceptors.response.use(response => response, async error => {

    if(error.response.status === 401) { //!error.config.sent error.config  ??
        if(!isRefreshing) {
            isRefreshing = true;
            //error.config.sent = true;
            const response = await axios.post("/api/Auth/refresh-token", {}, {}); // , {withCredentials: true}
            //isRefreshing = false;    

            if(response.status === 200) {           
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}`; // update default config w/ new token
                
                // ***When axios initiate a request, it takes all the configuration at that moment. So, when you update 
                // the default config with the new token, it does not modify the configuration of the request that has 
                // been sent before. Hence, error.config contains the old token. You need to modify it directly.***
                error.config.headers['Authorization'] = `Bearer ${response.data}`;   // update old config with new token
    
                isRefreshing = false;
                return axios(error.config);     // do the same request that got an error again
            }
        }
        else {
            error.config.headers['Authorization'] = axios.defaults.headers.common['Authorization']; // ?
            return axios(error.config);
        }     
    }
    return Promise.reject(error);
});