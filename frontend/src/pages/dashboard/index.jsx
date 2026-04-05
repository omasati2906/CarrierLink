import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import UserLayout from '@/layout/UserLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPosts, createPost, deletePost, likePost, getAllComments, commentPost } from '@/config/redux/action/postAction'
import { getAboutUser } from '@/config/redux/action/authAction'
import { getAllUsers, connectionsOfUser } from '@/config/redux/action/authAction'
import styles from './styles.module.css'
import { BASE_URL } from '@/config'
import { resetpostId } from '@/config/redux/reducer/postReducer'


const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;

    return date.toLocaleDateString();
};


export default function Dashboard() {

    const router = useRouter();

    const [istokenthere, setistokenthere] = useState(false);


    // If data is needed after page loads → Client (CSR)
    //all this are client side rendering

    const dispatch = useDispatch();
    const { user, allUsers, all_profiles_fetched, connections_of_user } = useSelector((state) => state.auth);
    const { posts, postId, comments } = useSelector((state) => state.posts);

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            router.push("/login");
        } else {
            setistokenthere(true);
            dispatch(getAllPosts());
            dispatch(getAboutUser({ token: localStorage.getItem("token") }));

            if (!all_profiles_fetched) {
                dispatch(getAllUsers());
            }

            dispatch(connectionsOfUser({ token: localStorage.getItem("token") }));


        }
    }, [dispatch, router])

    const [postContent, setpostcontent] = useState("");
    const [postMedia, setpostmedia] = useState(null);

    const [commentText, setCommentText] = useState("");


    const handleredirectuser = (username) => {
        if (!user || !user.userId) return;
        
        if (user.userId.username === username) {
            router.push(`/profile`);
        }
        else {
            router.push(`/view_profile/${username}`);
        }
    }


    const handlePostSubmit = async () => {
        await dispatch(createPost({ body: postContent, file: postMedia }));
        setpostcontent("");
        setpostmedia(null);
        dispatch(getAllPosts());
    }

    if (!user && !istokenthere) {
        return (
            <div className={styles.loadingContainer}>
                <h3>Loading your professional space...</h3>
            </div>
        )
    }

    const handleLikes = async (post) => {
        dispatch(likePost(post._id));
    }

    const handleComment = async (post) => {
        await dispatch(getAllComments(post._id));
        dispatch(getAllPosts());
    }

    const handleDeletePost = async (post) => {
        await dispatch(deletePost(post._id));
        dispatch(getAllPosts());
    }

    const handleShare = async (post) => {
        const text = encodeURIComponent(post.body);
        const url = encodeURIComponent("omasati.in");

        const twitterUrl = `http://twitter.com/intent/tweet?text=${text}&url=${url}`;
        window.open(twitterUrl, "_blank");
    }

    const handlePostComment = async () => {
        await dispatch(commentPost({ post_id: postId, commentBody: commentText }));
        setCommentText("");
        dispatch(getAllComments(postId));
    }

    return (
        <UserLayout>
            <div className={styles.dashboardContainer}>
                {/* Left Sidebar */}
                <aside className={styles.sidebar} onClick={() => router.push('/profile')}>
                    <div className={styles.profileCard}>
                        <div className={styles.coverImage}></div>
                        <img
                            src={`${BASE_URL}/${user?.userId?.profilePicture || "default.jpg"}`}
                            alt="Profile"
                            className={styles.sidebarAvatar}
                        />
                        <div className={styles.profileInfo}>
                            <h3 className={styles.profileName}>{user?.userId?.name || 'User'}</h3>
                            <p className={styles.profileUsername}>@{user?.userId?.username || 'username'}</p>

                            <div className={styles.profileStats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Connections</span>
                                    <span className={styles.statValue}>{connections_of_user?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Middle Content */}
                <main className={styles.mainContent}>

                    <div className={styles.createPostCard}>
                        <div className={styles.createPostTop}>
                            <img
                                src={`${BASE_URL}/${user?.userId?.profilePicture || "default.jpg"}`}
                                className={styles.userAvatarMini}
                                alt="User"
                            />
                            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <textarea
                                    className={styles.fakeInput}
                                    onChange={(e) => setpostcontent(e.target.value)}
                                    value={postContent}
                                    placeholder="Share an insight or update..."
                                    style={{ paddingRight: '50px' }}
                                ></textarea>
                                <label htmlFor="post-file-upload" className={styles.inlineActionBtn}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    <input
                                        id="post-file-upload"
                                        type="file"
                                        accept="image/*,video/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => setpostmedia(e.target.files[0])}
                                    />
                                </label>
                            </div>
                        </div>
                        {(postContent.trim().length > 0 || postMedia) && (
                            <div className={styles.createPostActions} style={{ justifyContent: "flex-end", paddingTop: '0' }}>
                                <button onClick={handlePostSubmit} className={styles.postBtn}>Post</button>
                            </div>
                        )}
                    </div>




                    <h2 className={styles.feedTitle}>Professional Feed</h2>

                    <div className={styles.feedArea}>
                        {posts && posts.length > 0 ? (
                            [...posts].reverse().map((post) => (
                                <React.Fragment key={post._id}>
                                    <div className={styles.postCard}>
                                        <div className={styles.postHeader} style={{ cursor: "pointer" }} onClick={() => handleredirectuser(post.userId?.username)}>
                                            <img
                                                src={`${BASE_URL}/${post.userId?.profilePicture || "default.jpg"}`}
                                                className={styles.postAvatar}
                                                alt="User"
                                            />
                                            <div className={styles.postAuthorInfo}>
                                                <h4>{post.userId?.name || "Unknown User"}</h4>
                                                <p>@{post.userId?.username || "username"}</p>
                                            </div>
                                            {
                                                post.userId?._id === user?.userId?._id && (
                                                    <button style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); handleDeletePost(post) }} className={styles.deleteBtn} aria-label="Delete post">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M3 6h18"></path>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        </svg>
                                                    </button>
                                                )
                                            }
                                        </div>
                                        <div className={styles.postContent}>
                                            {post.body}
                                        </div>
                                        {post.media && (
                                            <div className={styles.postMediaContainer}>
                                                {post.filetype === "image" ? (
                                                    <img src={`${BASE_URL}/${post.media}`} className={styles.postMedia} alt="Post content" />
                                                ) : (
                                                    <video src={`${BASE_URL}/${post.media}`} className={styles.postMedia} controls />
                                                )}
                                            </div>
                                        )}
                                        <div className={styles.postActions}>
                                            <div className={`${styles.postAction} ${post.likedBy?.includes(user?.userId?._id) ? styles.postActionLiked : ''}`} onClick={() => handleLikes(post)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={post.likedBy?.includes(user?.userId?._id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                                <span>{post.likes > 0 ? post.likes : 'Like'}</span>
                                            </div>
                                            <div className={styles.postAction} onClick={() => handleComment(post)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                                <span>{post.comments > 0 ? `${post.comments} Comments` : 'Comment'}</span>
                                            </div>
                                            <div className={styles.postAction} onClick={() => handleShare(post)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                                                <span>Share</span>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                </React.Fragment>
                            ))
                        ) : (
                            <div className={styles.emptyFeed}>
                                <h3>No posts to show</h3>
                                <p>Be the first to share an insight!</p>
                            </div>
                        )}
                    </div>

                </main>

                {/* Right Sidebar */}
                <aside className={styles.rightSidebar}>
                    <div className={styles.sectionCard}>
                        <h3 className={styles.sectionTitle}>Top Profiles</h3>
                        <div className={styles.profilesList}>
                            {allUsers && allUsers.length > 0 ? (
                                allUsers
                                    .filter(p => p.userId?._id !== user?.userId?._id)
                                    .slice(0, 5)
                                    .map((profile) => (
                                        <div key={profile._id} className={styles.profileItemSmall} onClick={() => router.push(`/view_profile/${profile.userId?.username}`)}>
                                            <img
                                                src={`${BASE_URL}/${profile.userId?.profilePicture || "default.jpg"}`}
                                                className={styles.profileImageSmall}
                                                alt={profile.userId?.name}
                                            />
                                            <div className={styles.profileDetailsSmall}>
                                                <div className={styles.profileNameSmall}>{profile.userId?.name}</div>
                                                <div className={styles.profileRoleSmall}>Professional</div>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p>No other profiles found</p>
                            )}
                        </div>

                    </div>

                    <div className={styles.sectionCard}>
                        <h3 className={styles.sectionTitle}>Career Tips 💡</h3>
                        <div className={styles.profilesList}>
                            <div className={styles.profileItemSmall}>
                                <div className={styles.profileDetailsSmall}>
                                    <div className={styles.profileNameSmall}>Optimizing your resume</div>
                                    <div className={styles.profileRoleSmall}>5 min read</div>
                                </div>
                            </div>
                            <div className={styles.profileItemSmall}>
                                <div className={styles.profileDetailsSmall}>
                                    <div className={styles.profileNameSmall}>Networking on CareerLink</div>
                                    <div className={styles.profileRoleSmall}>3 min read</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {postId !== "" && (
                <div className={styles.commentContainer} onClick={() => dispatch(resetpostId())}>
                    <div className={styles.allCommentsContainer} onClick={(e) => e.stopPropagation()}>

                        {/* Header */}
                        <div className={styles.commentHeader}>
                            <h3 className={styles.commentTitle}>Comments</h3>
                            <button className={styles.commentCloseBtn} onClick={() => dispatch(resetpostId())}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Comments List */}
                        <div className={styles.commentsList}>
                            {(!comments || comments.length === 0) ? (
                                <div className={styles.noComments}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    <p>No comments yet</p>
                                    <span>Be the first to share your thoughts!</span>
                                </div>
                            ) : (
                                comments.map(c => (
                                    <div key={c._id} className={styles.commentItem}>
                                        <div className={styles.commentAvatar}>
                                            {(c.userId?.name || "U").charAt(0).toUpperCase()}
                                        </div>
                                        <div className={styles.commentBody}>
                                            <div className={styles.commentAuthorContainer}>
                                                <span className={styles.commentAuthor}>{c.userId?.name || "User"}</span>
                                                <span className={styles.commentTime}>{formatRelativeTime(c.createdAt)}</span>
                                            </div>
                                            <p className={styles.commentText}>{c.body}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input Area */}
                        <div className={styles.postCommentContainer}>
                            <input
                                type="text"
                                className={styles.commentInput}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                onKeyDown={(e) => e.key === 'Enter' && commentText.trim() && handlePostComment()}
                            />
                            <button onClick={handlePostComment} className={styles.postCommentBtn} disabled={!commentText.trim()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </UserLayout>
    )
}


