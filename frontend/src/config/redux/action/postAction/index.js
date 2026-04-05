
import { createAsyncThunk } from "@reduxjs/toolkit";
import clientServer from "../../../index";


export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkAPI) => {
        try {
            const response = await clientServer.get(`/get_all_posts`);
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const  createPost=createAsyncThunk(
    "post/createPost",
    async (userdata,thunkAPI)=>{

        const {file,body}=userdata;
        try {

            const formdata=new FormData();
            formdata.append('token',localStorage.getItem('token'));
            formdata.append("body",body);
            formdata.append("file",file);

            const response=await clientServer.post(`/create_post`,formdata,{
                headers:{
                    "Content-Type":"multipart/form-data",
                }
            });

            if(response.status===200)
            {
               return thunkAPI.fulfillWithValue("Post Uploaded Successfully");
            }
            else
            {
                return thunkAPI.rejectWithValue("Post not Uploaded");
            }
        
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (postId, thunkAPI) => {
        try {
            const response = await clientServer.delete(`/delete_post`, {
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    token: localStorage.getItem("token"),
                    post_id:postId,
                },
            });

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue("Post deleted successfully");
            } else {
                return thunkAPI.rejectWithValue("Failed to delete post");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const likePost = createAsyncThunk(
    "post/likePost",
    async (postId, thunkAPI) => {
        try {
            const response = await clientServer.post(`/increment_post_likes`, {
               token:localStorage.getItem("token"),
               post_id:postId,
            });

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue(response.data);
            } else {
                return thunkAPI.rejectWithValue("Failed to like post");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);  

export const getAllComments = createAsyncThunk(
    "post/getAllComments",
    async (postId, thunkAPI) => {
        try {
            const response = await clientServer.post(`/get_comments_by_post`, {
               post_id:postId,
            });

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue({
                    post_id:postId,
                    comments:response.data.comments
                });
            } else {
                return thunkAPI.rejectWithValue("Failed to get comments");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const commentPost = createAsyncThunk(
    "post/commentPost",
    async (commentData, thunkAPI) => {
        try {
            const response = await clientServer.post(`/comment_post`, {
               token:localStorage.getItem("token"),
               post_id:commentData.post_id,
               commentBody:commentData.commentBody,
            });

            if (response.status === 200) {
                return thunkAPI.fulfillWithValue(response.data.message);
            } else {
                return thunkAPI.rejectWithValue("Failed to comment on post");
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);
