import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice ({
    name: 'cart',
    initialState: {
    quantity: 0,
    notifications: false,
    },
    reducers: {
        addQuantity: (state, action) => {
            state.quantity = action.payload;
        },
        changeNotif: (state, action) => {
            state.notifications = action.payload;
        },
    }
});
export const {addQuantity, changeNotif} = cartSlice.actions;
export default cartSlice.reducer;  