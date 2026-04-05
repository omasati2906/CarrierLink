import {createSlice} from "@reduxjs/toolkit";
import { getAllPosts,createPost ,deletePost,getAllComments,likePost} from "../../action/postAction";

const initialState = {
    posts: [],
    isError:false,
    postFetched:false,
    isLoading:false,
    isLoggedIn:false,
    message:"",
    comments:[],
    likes:[],
    postId:"",
    
};

  const postSlice = createSlice({
    name:"posts",
    initialState,
    reducers:{
        reset:() => initialState,
        resetpostId:(state)=>{
            state.postId="";
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllPosts.pending,(state)=>{
            state.isLoading = true;
            state.message="Fetching all the posts..."
        })
        .addCase(getAllPosts.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError=false;
            state.isSuccess = true;
            state.isLoggedIn=true;
            state.posts=action.payload.posts;
            state.message="All the posts are fetched successfully"
        })
        .addCase(getAllPosts.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(createPost.pending,(state)=>{
            state.isLoading = true;
            state.message="Creating post..."
        })
        .addCase(createPost.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError=false;
            state.isSuccess = true;
            state.isLoggedIn=true;
            state.posts=action.payload.posts;
            state.message="Post created successfully"
        })
        .addCase(createPost.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(deletePost.pending,(state)=>{
            state.isLoading = true;
            state.message="Deleting post..."
        })
        .addCase(deletePost.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError=false;
            state.isSuccess = true;
            state.isLoggedIn=true;
            state.message="Post deleted successfully"
        })
        .addCase(deletePost.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
    
    .addCase(getAllComments.pending,(state)=>{
        state.isLoading = true;
        state.message="Fetching all the comments..."
    })
    .addCase(getAllComments.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isError=false;
        state.isSuccess = true;
        state.isLoggedIn=true;
        state.postId=action.payload.post_id;
        state.comments=action.payload.comments;
        state.message="All the comments are fetched successfully"
    })
    .addCase(getAllComments.rejected,(state,action)=>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
    })
    .addCase(likePost.pending,(state)=>{
        state.isLoading = true;
        state.message="Liking post..."
    })
    .addCase(likePost.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isError=false;
        state.isSuccess = true;
        state.isLoggedIn=true;
        
        const index = state.posts.findIndex(p => p._id === action.payload.post._id);
        if (index !== -1) {
            state.posts[index] = action.payload.post;
        }
        
        state.message="Post like/unlike updated successfully"
    })
    .addCase(likePost.rejected,(state,action)=>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
    })
}
  })



  export const {reset,resetpostId} = postSlice.actions;
  export default postSlice.reducer;
