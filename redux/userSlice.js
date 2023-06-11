import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState:{
        admin: false,
        offline:false,
        open:true,
    },
    reducers:({
        setAdmin: (state, action) => {
            state.admin = action.payload;
        },
        setOffline: (state, action) =>{
            state.offline = action.payload
        },
        nowOpen: (state, action) =>{
            state.open = action.payload
        },
}
)});
export const {setAdmin, setOffline, nowOpen} = userSlice.actions;
export default userSlice.reducer;