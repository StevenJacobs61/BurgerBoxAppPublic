import { createSlice } from "@reduxjs/toolkit";
import { locations } from "../data/locations";

const locationSlice = createSlice ({
    name: 'location',
    initialState: '',
    reducers: {
       changeLocation: (state, action) => {
           return action.payload
        }
    }
});
export const {changeLocation} = locationSlice.actions;
export default locationSlice.reducer;  