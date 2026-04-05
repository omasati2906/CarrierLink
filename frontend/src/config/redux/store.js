/**
 * 
 *  STEPS FOR STATE MANAGEMENT
 * 
 *  1. SUBMIT ACTION
 *  2. HABDLE ACTION IN ITS REDUCER
 *  3. REGISTER HERE-> REDUCER
 * 
 * 
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";


export  const store = configureStore({
    reducer: {
        auth:authReducer,
        posts:postReducer
    }
})