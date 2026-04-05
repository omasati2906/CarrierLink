import React from "react";
import styles from "./style.module.css";
import UserLayout from "@/layout/UserLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { registerUser,loginUser } from "@/config/redux/action/authAction";


export default function Login() {

    const authState = useSelector((state) => state.auth);
    
    const router=useRouter();

    const dispatch=useDispatch();

    const [userloginMethod,setuserloginMethod]=useState(false);

    useEffect(() => {
        if (authState.isLoggedIn) 
        {
            router.push("/dashboard");
        }
    },[authState.isLoggedIn])

    useEffect(() => {
        if (localStorage.getItem("token")) {
            router.push("/dashboard");
        }
    }, [router])

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [name,setName]=useState("");
    const [username,setUsername]=useState("");

    const handleRegister=()=>{
          if(!username || !password || !email || !name){
              alert("All fields are required");
              return;
          }
          dispatch(registerUser({username,password,email,name}));
    }

    const handleLogin=()=>{
        if(!email || !password){
            alert("All fields are required");
            return;
        }
        dispatch(loginUser({email,password}));
    }

    return (
        <UserLayout>
            
        <div className={styles.container}>
            <div className={styles.cardContainer}>
                
                <div className={styles.cardContainer_left}>
                    <h1 className={styles.cardleft_heading}>{userloginMethod ? "Sign in" : "Sign up"}</h1>

                    <div className={styles.error_success_msg} style={{
                        color: authState.isError ? "#ef4444" : "#10b981",
                        background: authState.isError ? "#fef2f2" : "#ecfdf5",
                        display: authState.message ? "inline-block" : "none"
                    }}>
                        {typeof authState.message === 'string' ? authState.message : (authState.message?.message || "An unexpected error occurred")}
                    </div>
                    
                    <div className={styles.inputContainer}>
                        {!userloginMethod && (
                            <div className={styles.inputRow}>
                                <input onChange={(e)=>setUsername(e.target.value)} className={styles.inputField} type="text" placeholder="Username" />
                                <input onChange={(e)=>setName(e.target.value)} className={styles.inputField} type="text" placeholder="Full Name" />
                            </div>
                        )}
                    
                        <input onChange={(e)=>setEmail(e.target.value)} className={styles.inputField} type="text" placeholder="Email Address" />
                        <input onChange={(e)=>setPassword(e.target.value)} className={styles.inputField} type="password" placeholder="Password" />

                        <div onClick={()=>{
                            if(userloginMethod){
                                handleLogin()
                            }
                            else {
                                handleRegister()
                            }
                        }} className={styles.buttonWithOutline}>
                            {userloginMethod ? "Sign in" : "Create Account"}
                        </div>

                        <span className={styles.toggleText} onClick={() => setuserloginMethod(!userloginMethod)}>
                            {userloginMethod ? "New to CareerLink? Join now" : "Already on CareerLink? Sign in"}
                        </span>
                    </div>
                </div>
            
                <div className={styles.cardContainer_right}>
                    <h2 style={{fontSize: '3rem', marginBottom: '1.5rem'}}>
                        {userloginMethod ? "Welcome Back!" : "Hello, Friend!"}
                    </h2>
                    <p style={{fontSize: '1.15rem', opacity: '0.9'}}>
                        {userloginMethod 
                            ? "Stay connected with your professional community and explore new opportunities." 
                            : "Enter your personal details and start your journey with CareerLink today."}
                    </p>
                </div>
            </div>
        </div>

        </UserLayout>
    );
}