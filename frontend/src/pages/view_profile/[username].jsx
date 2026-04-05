import React from 'react';
import UserLayout from '@/layout/UserLayout';
import { BASE_URL } from '@/config';
import clientServer from '@/config';
import styles from './styles.module.css'; 
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { useEffect, useState } from 'react';
import { sendConnectionsRequest, getmyconnectionRequest, getwhoSentmeconnectionRequest,getAboutUser} from '@/config/redux/action/authAction';

export default function ViewProfile({ userProfile }) {


  const router = useRouter();
  const postReducer=useSelector(state=>state.posts);
  const dispatch=useDispatch();

  const authState=useSelector(state=>state.auth);


  const [isOwnProfile, setIsOwnProfile] = useState(false);


  const [userposts,setuserposts]=useState([]);

  const [isCurrentUserInConnection,setIsCurrentUserInConnection]=useState(false);
  const [isconnectionNull,setisconnectionNull]=useState(true);

  const handlesendconnectionrequest= async ()=>{
    await dispatch(sendConnectionsRequest({ token: localStorage.getItem("token"),user_id:userProfile?.userId?._id }));
    await dispatch(getmyconnectionRequest({ token: localStorage.getItem("token") }));
    await dispatch(getwhoSentmeconnectionRequest({ token: localStorage.getItem("token") }));
    setIsCurrentUserInConnection(true);
  }

  const handleDownloadResume= async()=>{
    try {
          const response=await clientServer.get(`/download_resume/${userProfile?.userId?._id}`,{headers:{Authorization:`Bearer ${localStorage.getItem("token")}`},responseType:"blob"});
          const url=window.URL.createObjectURL(new Blob([response.data]));
          const link=document.createElement("a");
          link.href=url;
          link.setAttribute("download",`${userProfile?.userId?.name}_resume.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      await dispatch(getAllPosts());
      if (localStorage.getItem("token")) {
        await dispatch(getmyconnectionRequest({ token: localStorage.getItem("token") }));
        await dispatch(getwhoSentmeconnectionRequest({ token: localStorage.getItem("token") }));
      }
    };
    fetchInitialData();
  }, [dispatch]);

  useEffect(() => 
    {
            let post =postReducer.posts;
            if(userProfile?.userId?._id) {
               let userposts = post.filter((post) => post.userId._id === userProfile.userId._id);
               setuserposts(userposts);
            }
  },[postReducer.posts, userProfile]);
  
  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem('token') }));
  }, [dispatch]);

  useEffect(() => {
    if (authState.user?.userId?._id && userProfile?.userId?._id) {
       if (authState.user.userId._id === userProfile.userId._id) {
          setIsOwnProfile(true);
       }
    }
  }, [authState.user, userProfile]);

  useEffect(() => 
    {   
       
        if(userProfile?.userId?._id)
        {
            let connections = authState.connections || [];
            let connectionRequests = authState.ConnectionRequests || [];
           
            if(connections.some((conn)=>conn.connectionId?._id===userProfile.userId._id) ||
               connectionRequests.some((conn)=>conn.userId?._id===userProfile.userId._id))
            { 
                setIsCurrentUserInConnection(true); 
            }

            const foundConn = connections.find((conn)=>conn.connectionId?._id===userProfile.userId._id);
            const foundReq = connectionRequests.find((conn)=>conn.userId?._id===userProfile.userId._id);

            if((foundConn && foundConn.status_accepted === true) || (foundReq && foundReq.status_accepted === true))
            {
                setisconnectionNull(false);
            }
        }
    },[authState.connections, authState.connectionRequests, userProfile]);

  if (!userProfile) {
    return (
      <UserLayout>
        <div className={styles.loadingContainer}>
          <h2 style={{ color: '#64748b' }}> Profile not found</h2>
        </div>
      </UserLayout>
    );
  }

  const profileUser = userProfile.userId;

  return (
    <UserLayout>
      <div className={styles.profileContainer}>

        {/* 1. Header Card (Banner + Avatar + Basic Info) */}
        <div className={styles.headerCard}>
          {/* Cover Banner */}
          <div className={styles.coverBanner}></div>

          {/* Avatar (Absolute Positioned) */}
          <div className={styles.avatarSection}>
            {profileUser?.profilePicture ? (
              <img
                src={`${BASE_URL}/${profileUser.profilePicture}`}
                alt={profileUser?.name}
                className={styles.avatar}
                onError={(e) => { e.target.src = `${BASE_URL}/default.jpg` }}
              />
            ) : (
                <div className={styles.avatarFallback}>
                    {(profileUser?.name || 'U').charAt(0).toUpperCase()}
                </div>
            )}
          </div>

          {/* User Info (Name, Headline, Email, Connect Button) */}
          <div className={styles.headerInfo}>
            <div className={styles.basicInfo}>
              <h1 className={styles.name}>{profileUser?.name || 'Unknown User'}</h1>
              {userProfile.currentPost && <p className={styles.headline}>{userProfile.currentPost}</p>}
              <p className={styles.email}>{profileUser?.email}</p>
              
              <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
              {!isOwnProfile && (
                !isCurrentUserInConnection ? (
                  <button className={styles.connectBtn} onClick={handlesendconnectionrequest}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                    Connect
                  </button>
                ) : (
                  <button className={styles.connectBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                      {isconnectionNull ? "Pending" : "Connected"}
                  </button>
                )
              )}

              <div style={{cursor:"pointer", padding: "0.5rem", borderRadius: "10px", background: "var(--bg)", border: "1px solid var(--border-medium)"}} onClick={handleDownloadResume}>
                <svg style={{width:"1.4rem", color: "var(--primary)"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main Grid Layout (Two Columns on Desktop) */}
        <div className={styles.mainGrid}>
          
          {/* Left Column (Main Content) */}
          <div className={styles.mainContent}>

            {/* About / Bio Section */}
            {userProfile.bio && (
              <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>About</h2>
                <div className={styles.bioText}>{userProfile.bio}</div>
              </div>
            )}

            {/* Experience Section */}
            {userProfile.pastWork && userProfile.pastWork.length > 0 && (
              <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Experience</h2>
                {userProfile.pastWork.map((work, i) => (
                  <div key={i} className={styles.listItem}>
                    <div className={styles.itemIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    </div>
                    <div className={styles.itemContent}>
                      <h4 className={styles.itemTitle}>{work.position}</h4>
                      <p className={styles.itemSubtitle}>{work.company}</p>
                      <span className={styles.itemMeta}>{work.years}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Education Section */}
            {userProfile.education && userProfile.education.length > 0 && (
              <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Education</h2>
                {userProfile.education.map((edu, i) => (
                  <div key={i} className={styles.listItem}>
                    <div className={styles.itemIcon}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                    </div>
                    <div className={styles.itemContent}>
                      <h4 className={styles.itemTitle}>{edu.degree} in {edu.fieldOfStudy}</h4>
                      <p className={styles.itemSubtitle}>{edu.school}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* User Posts Section */}
            {userposts && userposts.length > 0 && (
              <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Activity & Posts</h2>
                {userposts.map((post, i) => (
                  <div key={i} style={{ borderBottom: '1px solid #e2e8f0', padding: '1rem 0' }}>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>
                      {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                    </p>
                    <p style={{ fontSize: '1rem', color: '#1e293b', whiteSpace: 'pre-wrap' }}>
                      {post.body}
                    </p>
                    {post.media && (
                      <img 
                        src={`${BASE_URL}/${post.media}`} 
                        alt="Post media" 
                        onError={(e) => { e.target.style.display = 'none' }}
                        style={{ width: '100%', borderRadius: '8px', marginTop: '1rem', maxHeight: '300px', objectFit: 'cover' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            
          </div>

          {/* Right Column (Sidebar) */}
          <div className={styles.sidebar}>
             <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>People also viewed</h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>More profiles to discover in your network.</p>
             </div>
             
             {/* You can add more sidebar blocks here modeled after the wireframe */}
             <div className={styles.sectionCard}>
                <h2 className={styles.sectionTitle}>Similar Roles</h2>
                <p>Explore positions similar to {userProfile.currentPost || 'this professional'}.</p>
             </div>
          </div>

        </div>

      </div>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.params;

  try {
    const response = await clientServer.get('/get_user_profile_and_user_based_on_username', {
      params: { username }
    });

    return {
      props: {
        userProfile: response.data.profile,
      },
    };
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return {
      props: {
        user: null,
      },
    };
  }
}