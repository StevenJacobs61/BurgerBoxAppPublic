import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice ({
    name: 'cart',
    initialState: {
    products: [],
    quantity: 0,
    total:0,
    notifications: false,
    },
    reducers: {
        addProduct: (state, action) => {
            state.products.push(action.payload);
            state.quantity = state.products.length
            state.total += action.payload.totalPrice
           
        },
        addQuantity: (state, action) => {
            state.quantity = action.payload;
        },
        changeTotal: (state, action) => {
            state.total = Math.round(action.payload*100)/100;
        },
        del: (state, action) => {
            state.products = state.products.filter(product => product.id !== action.payload.id);
            state.quantity = state.products.length;
            state.total = state.total - action.payload.totalPrice
        },
        changeNotif: (state, action) => {
            state.notifications = action.payload;
        },
        reset: (state) => {
            state.products = [],
            state.quantity = 0,
            state.total = 0,
            state.id = 0
        }
    }
});
export const {addProduct, reset, del, addQuantity, changeTotal, changeNotif} = cartSlice.actions;
export default cartSlice.reducer;  