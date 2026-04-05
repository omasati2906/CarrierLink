import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers,getAboutUser } from '@/config/redux/action/authAction'
import { BASE_URL } from '@/config'
import styles from './styles.module.css'
import { useRouter } from 'next/navigation';

export default function Discover() {

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  const router=useRouter();

  useEffect(() => {
    dispatch(getAllUsers());
     dispatch(getAboutUser({ token: localStorage.getItem('token') }));
  }, []);

  const filteredUsers = authState.allUsers?.filter((user) => {
    // Exclude the current user from the list
    if (user.userId?._id === authState.user?.userId?._id) return false;
    
    const name = user.userId?.name?.toLowerCase() || '';
    const email = user.userId?.email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    
    return name.includes(query) || email.includes(query);
  });

  return (
    <UserLayout>
      <div className={styles.discoverContainer}>

        {/* Header */}
        <div className={styles.discoverHeader}>
          <h1 className={styles.discoverTitle}>
            Discover <span>People</span>
          </h1>
          <p className={styles.discoverSubtitle}>
            Find and connect with professionals across the world
          </p>

          {/* Search */}
          <div className={styles.searchBar}>
            <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading */}
        {!authState.all_profiles_fetched && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <span className={styles.loadingText}>Discovering people...</span>
          </div>
        )}

        {/* Profiles Grid */}
        {authState.all_profiles_fetched && (
          <div className={styles.profilesGrid}>
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <div
                  key={user._id}
                  className={styles.profileCard}
                  style={{ animationDelay: `${index * 0.08}s` }}
                  onClick={()=>{router.push(`/view_profile/${user.userId?.username}`)}}
                >
                  {/* Cover Banner */}
                  <div className={styles.cardCover}></div>

                  {/* Avatar */}
                  <div className={styles.avatarWrapper}>
                    {user.userId?.profilePicture ? (
                      <img
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt={user.userId?.name}
                        className={styles.avatar}
                        onError={(e) => { e.target.src = `${BASE_URL}/default.jpg` }}
                      />
                    ) : (
                        <div className={styles.avatarFallback}>
                            {(user.userId?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.userName}>{user.userId?.name || 'Unknown'}</h3>
                    <p className={styles.userEmail}>{user.userId?.email}</p>

                    {user.currentPost && (
                      <div className={styles.currentPost}>
                        💼 {user.currentPost}
                      </div>
                    )}

                    {user.bio && (
                      <p className={styles.userBio}>{user.bio}</p>
                    )}

                    <div className={styles.cardDivider}></div>

                    {/* <button className={styles.connectBtn}  onClick={(e)=>{e.stopPropagation();}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                      </svg>
                      Connect
                    </button> */}
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <h3>No profiles found</h3>
              </div>
            )}
          </div>
        )}

      </div>
    </UserLayout>
  )
}