
import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, getAboutUser,getAllUsers, getmyconnectionRequest ,getwhoSentmeconnectionRequest,connectionsOfUser} from "../../action/authAction";

const initialState = {

    user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    isLoggedIn: false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequests: [],
    allUsers: [],
    all_profiles_fetched: false,
    connections_of_user: [],
    

}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        reset: (state) => {
            localStorage.removeItem("token");
            return initialState;
        },

        handleLoginUser: (state) => {
            state.message = "hello"
        }

    },


    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Knocking the door..."
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.isLoggedIn = true;
                state.message = "Welcome to CareerLink"
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Registering You..."
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.isLoggedIn = false;
                state.message = "Registration is Successfull , Please Login"
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAboutUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Fetching your profile..."
            })
            .addCase(getAboutUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.isLoggedIn = true;
                state.message = "Profile fetched successfully"
                state.user = action.payload.profile;
                state.profileFetched = true;
                state.connections = action.payload.profile.connections || [];
                state.connectionRequests = action.payload.profile.connectionRequests || [];
            })
            .addCase(getAboutUser.rejected, (state, action) => {        
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAllUsers.pending, (state) => {
                state.isLoading = true;
                state.message = "Fetching all users..."
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.isLoggedIn = true;
                state.all_profiles_fetched = true;
                state.message = "All users fetched successfully"
                state.allUsers = [...action.payload].reverse();
            })
            .addCase(getAllUsers.rejected, (state, action) => {        
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getmyconnectionRequest.pending, (state) => {
                state.isLoading = true;
                state.message = "Fetching your connection requests..."
            })
            .addCase(getmyconnectionRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                 state.isSuccess = true;
                state.isLoggedIn = true;
                state.message = "Connection requests fetched successfully"
                state.connections = [...action.payload].reverse();
            })
            .addCase(getmyconnectionRequest.rejected, (state, action) => {        
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getwhoSentmeconnectionRequest.pending, (state) => {
                state.isLoading = true;
                state.message = "Fetching who sent you connection requests..."
            })
            .addCase(getwhoSentmeconnectionRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                 state.isSuccess = true;
                state.isLoggedIn = true;
                state.message = "Who sent you connection requests fetched successfully"
                state.ConnectionRequests = [...action.payload].reverse();
            })
            .addCase(getwhoSentmeconnectionRequest.rejected, (state, action) => {        
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(connectionsOfUser.pending, (state) => {
                state.isLoading = true;
                state.message = "Fetching your connections..."
            })
            .addCase(connectionsOfUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                 state.isSuccess = true;
                state.isLoggedIn = true;
                state.message = "Connections fetched successfully"
                state.connections_of_user = [...action.payload].reverse();
            })
            .addCase(connectionsOfUser.rejected, (state, action) => {        
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }


})


export const { reset, handleLoginUser } = authSlice.actions;
export default authSlice.reducer;
