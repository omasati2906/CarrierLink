import UserLayout from '@/layout/UserLayout'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getwhoSentmeconnectionRequest, getmyconnectionRequest, acceptConnectionsRequest } from '@/config/redux/action/authAction';
import { useEffect } from 'react';
import styles from "./styles.module.css";
import { BASE_URL } from '@/config';
import { useRouter } from 'next/router';

export default function index() {

    const dispatch=useDispatch();
    const authState=useSelector(state=>state.auth);
    const router=useRouter();

    useEffect(() => {
        dispatch(getwhoSentmeconnectionRequest({ token: localStorage.getItem("token") }));
        dispatch(getmyconnectionRequest({ token: localStorage.getItem("token") }));
    }, [dispatch]);

    const handleAccept = async (userId) => {
        await dispatch(acceptConnectionsRequest({ token: localStorage.getItem("token"), userId ,action:"accept"}));
        dispatch(getwhoSentmeconnectionRequest({ token: localStorage.getItem("token") }));
        dispatch(getmyconnectionRequest({ token: localStorage.getItem("token") }));
    }

    const handleIgnore = async (userId) => {
        await dispatch(acceptConnectionsRequest({ token: localStorage.getItem("token"), userId ,action:"reject"}));
        dispatch(getwhoSentmeconnectionRequest({ token: localStorage.getItem("token") }));
    }

  return (
    <UserLayout>
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Connection Requests</h1>
                <p className={styles.subtitle}>Manage your pending invitations</p>
            </div>
            
            <div className={styles.grid}>
                {authState.ConnectionRequests && authState.ConnectionRequests.length > 0 ? (
                    authState.ConnectionRequests.filter((connectionRequest)=>connectionRequest.status_accepted!==true).map((connectionRequest)=>{
                        const user = connectionRequest.userId;
                        return(
                            <div key={connectionRequest._id} className={styles.card} onClick={()=>router.push(`/view_profile/${user.username}`)}>
                                <div className={styles.cardHeader}>
                                    {user?.profilePicture ? (
                                        <img src={`${BASE_URL}/${user.profilePicture}`} alt={user?.name} className={styles.avatar} />
                                    ) : (
                                        <div className={styles.avatarFallback}>
                                            {(user?.name || "U").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                
                                <div className={styles.cardContent}>
                                    <h3 className={styles.name}>{user?.name}</h3>
                                    <p className={styles.headline}>@{user?.username}</p>
                                </div>

                                <div className={styles.cardActions} onClick={(e)=>e.stopPropagation()}>
                                    <button className={styles.rejectBtn} onClick={()=>handleIgnore(user._id)}>Reject</button>
                                    <button className={styles.acceptBtn} onClick={()=>handleAccept(user._id)}>Accept</button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className={styles.emptyState}>
                        <p>No pending connection requests.</p>
                    </div>
                )}
            </div>

            <div className={styles.header} style={{marginTop: '3rem'}}>
                <h2 className={styles.title}>My Connections</h2>
                <p className={styles.subtitle}>People you are connected with</p>
            </div>
            
            <div className={styles.grid}>
                {authState.connections && authState.connections.length > 0 ? (
                    authState.connections.filter((conn) => conn.status_accepted === true).map((connection)=>{
                        const user = connection.connectionId;
                        if (!user) return null;
                        return(
                            <div key={connection._id} className={styles.card} style={{cursor:"pointer"}} onClick={()=>router.push(`/view_profile/${user.username}`)}>
                                <div className={styles.cardHeader}>
                                    {user?.profilePicture ? (
                                        <img src={`${BASE_URL}/${user.profilePicture}`} alt={user?.name} className={styles.avatar} />
                                    ) : (
                                        <div className={styles.avatarFallback}>
                                            {(user?.name || "U").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                
                                <div className={styles.cardContent}>
                                    <h3 className={styles.name}>{user?.name}</h3>
                                    <p className={styles.headline}>@{user?.username}</p>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className={styles.emptyState}>
                        <p>You don't have any connections yet.</p>
                    </div>
                )}
            </div>
        </div>
    </UserLayout>
  )
}
