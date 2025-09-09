import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
    userInfo : localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null
}

const authSlice = createSlice({
    name : auth,
    initialState,
    reducers : {

        setCredential : (state, action) => {
            state.userInfo = action.payload
            localStorage.getItem("userInfo", JSON.stringify(action.payload))

        const expirationDate = new Date().getTime() + 30 * 60 * 60 * 1000
        localStorage.getItem("expirationDate", expirationDate)
        },

       logout : (state) => {
         state.userInfo = null,
         localStorage.clear()
       }
    }
})


export const {setCredential, logout} = authSlice.actions;
export default authSlice.reducer;