import { createSlice } from '@reduxjs/toolkit';
import  secureLocalStorage  from  "react-secure-storage";

const initialState = {
    cart: [],
    items: [],
    authenticated: false,
    orders: null
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
        },

        setAuthenticated: (state, action) => {
            state.authenticated = action.payload
            secureLocalStorage.setItem('authenticated', state.authenticated)
        },

        setOrders: (state, action) => {
            state.orders = action.payload
        },

        setCart: (state, action) => {
            state.cart = action.payload
        },

        addToCart: (state, action) => {
            const existItem = state.cart.find((item) => item.id === action.payload.item.id);

            state.cart = existItem 
            ? 
                state.cart.map((item) => {
                    if(item.id === action.payload.item.id) {
                        item.count += action.payload.item.count;
                    }
                    return item;
                })
            :
                [...state.cart, action.payload.item]

                secureLocalStorage.setItem('cart', JSON.stringify(state.cart))
        },

        removeFromCart: (state, action) => {
            state.cart = state.cart.filter((item) => item.id !== action.payload.id);
            secureLocalStorage.setItem('cart', JSON.stringify(state.cart))
            if(state.cart.length === 0) {
                secureLocalStorage.removeItem('cart')
            }           
        },
        
        increaseCount: (state, action) => {
            state.cart = state.cart.map((item) => {
                if(item.id === action.payload.id) {
                    item.count++;
                }
                return item;
            })
            secureLocalStorage.setItem('cart', JSON.stringify(state.cart))
        },

        decreaseCount: (state, action) => {
            state.cart = state.cart.map((item) => {
                if(item.id === action.payload.id && item.count > 1) {
                    item.count--;
                }   
                return item;
            })
            secureLocalStorage.setItem('cart', JSON.stringify(state.cart))
        },

        clearCart: (state, action) => {
            state.cart = []
            secureLocalStorage.removeItem('cart')
        }
    }
});

export const {
    setItems,
    addToCart,
    removeFromCart,
    increaseCount,
    decreaseCount,
    setCart,
    clearCart,
    setAuthenticated,
    setOrders
} = cartSlice.actions;

export default cartSlice.reducer;