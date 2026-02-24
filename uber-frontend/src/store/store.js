// Redux store = global state container.

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSilce";

export const store = configureStore({
    reducer:{
         // slices will come here
           auth: authReducer,  //state.auth will be managed by authReducer. We can access auth state using useSelector(state => state.auth) in our components.
    }
})

