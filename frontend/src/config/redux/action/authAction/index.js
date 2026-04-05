import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "../../../index";

export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post(`/login`, {
                email: user.email,
                password: user.password
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("lastVisit", Date.now());
            } else {
                return thunkAPI.rejectWithValue({
                    message: "Token not found"
                });
            }
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try {
            console.log("Registering user:", user);
            const response = await clientServer.post(`/register`, {
                name: user.name,
                username: user.username,
                email: user.email,
                password: user.password
            });
            return response.data; 
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get(`/get_user_and_profile`, {
                params:{
                    token:user.token
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get(`/get_all_user_profile`);
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getUserProfileByUsername = createAsyncThunk(
    "user/getUserProfileByUsername",
    async (username, thunkAPI) => {
        try {
            const response = await clientServer.get(`/get_user_profile_and_user_based_on_username`, {
                params: { username }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const sendConnectionsRequest = createAsyncThunk(
    "user/sendConnectionsRequest",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post(`/send_connection_request`, {
                token:user.token,
                connectionId:user.user_id
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getmyconnectionRequest = createAsyncThunk(
    "user/getmyconnectionRequest",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get(`/get_my_connection_requests`, {
                params: {
                    token: user.token
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getwhoSentmeconnectionRequest = createAsyncThunk(
    "user/getwhoSentmeconnectionRequest",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get(`/get_who_sent_me_connection_requests`, {
                params: {
                    token: user.token
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const acceptConnectionsRequest = createAsyncThunk(
    "user/acceptConnectionsRequest",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post(`/accept_connection_request`, {
                token: user.token,
                connection_id:user.userId,
                action_type:user.action
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const connectionsOfUser = createAsyncThunk(
    "user/connectionsOfUser",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.get(`/find_connections`, {
                params: {
                    token: user.token
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);