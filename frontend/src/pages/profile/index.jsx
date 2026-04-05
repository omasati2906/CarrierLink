import { getAboutUser,connectionsOfUser } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import UserLayout from '@/layout/UserLayout';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.css';
import { getImageUrl, DEFAULT_AVATAR } from '@/config';
import clientServer from '@/config';
import { useRouter } from 'next/router';

export default function Profile() {
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { connections_of_user } = authState;

  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [toast, setToast] = useState(null);

  // Modal state
  const [editModal, setEditModal] = useState(null); // 'about' | 'experience' | 'education' | 'headline' | null
  const [saving, setSaving] = useState(false);

  // Form states
  const [bioForm, setBioForm] = useState('');
  const [headlineForm, setHeadlineForm] = useState('');
  const [expForm, setExpForm] = useState({ company: '', position: '', years: '' });
  const [eduForm, setEduForm] = useState({ school: '', degree: '', fieldOfStudy: '' });

  // ── fetch profile & posts ──
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || authState.isError) {
      if (authState.isError) {
        dispatch({ type: 'auth/reset' });
      }
      router.push('/login');
      return;
    }
    dispatch(getAboutUser({ token }));
    dispatch(getAllPosts());
    dispatch(connectionsOfUser({ token }));
  }, [dispatch, authState.isError, router]);

  if (!authState.user && !authState.isError) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <span>Loading profile...</span>
      </div>
    );
  }

  useEffect(() => {
    if (authState.user) {
      setUserProfile(authState.user);
    }
  }, [authState.user]);

  useEffect(() => {
    if (userProfile?.userId?._id && postReducer.posts) {
      const filtered = postReducer.posts.filter(
        (p) => p.userId._id === userProfile.userId._id
      );
      setUserPosts(filtered);
    }
  }, [postReducer.posts, userProfile]);

  // ── toast helper ──
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ── Profile picture upload ──
  const handleProfilePicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('token', localStorage.getItem('token'));
      formData.append('profile_Picture', file);
      await clientServer.post('/update_profile_picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast('Profile picture updated!');
      dispatch(getAboutUser({ token: localStorage.getItem('token') }));
    } catch (err) {
      showToast('Failed to upload picture', 'error');
    }
  };

  // ── Save About (bio) ──
  const handleSaveBio = async () => {
    setSaving(true);
    try {
      await clientServer.post('/update_profile_data', {
        token: localStorage.getItem('token'),
        bio: bioForm,
      });
      showToast('About section updated!');
      dispatch(getAboutUser({ token: localStorage.getItem('token') }));
      setEditModal(null);
    } catch (err) {
      showToast('Failed to update bio', 'error');
    }
    setSaving(false);
  };

  // ── Save Headline (currentPost) ──
  const handleSaveHeadline = async () => {
    setSaving(true);
    try {
      await clientServer.post('/update_profile_data', {
        token: localStorage.getItem('token'),
        currentPost: headlineForm,
      });
      showToast('Headline updated!');
      dispatch(getAboutUser({ token: localStorage.getItem('token') }));
      setEditModal(null);
    } catch (err) {
      showToast('Failed to update headline', 'error');
    }
    setSaving(false);
  };

  // ── Add Experience ──
  const handleAddExperience = async () => {
    if (!expForm.company || !expForm.position || !expForm.years) return;
    setSaving(true);
    try {
      const current = userProfile?.pastWork || [];
      await clientServer.post('/update_profile_data', {
        token: localStorage.getItem('token'),
        pastWork: [...current, expForm],
      });
      showToast('Experience added!');
      dispatch(getAboutUser({ token: localStorage.getItem('token') }));
      setEditModal(null);
      setExpForm({ company: '', position: '', years: '' });
    } catch (err) {
      showToast('Failed to add experience', 'error');
    }
    setSaving(false);
  };

  // ── Delete Experience ──
  const handleDeleteExperience = async (index) => {
    try {
      const updated = [...(userProfile?.pastWork || [])];
      updated.splice(index, 1);
      await clientServer.post('/update_profile_data', {
        token: localStorage.getItem('token'),
        pastWork: updated,
      });
      showToast('Experience removed');
      dispatch(getAboutUser({ token: localStorage.getItem('token') }));
    } catch (err) {
      showToast('Failed to remove experience', 'error');
    }
  };

  // ── Add Education ──
  const handleAddEducation = async () => {
    if (!eduForm.school || !eduForm.degree || !eduForm.fieldOfStudy) return;
    setSaving(true);
    try {
      const current = userProfile?.education || [];
      await clientServer.post('/update_profile_data', {
        token: localStorage.getItem('token'),
        education: [...current, eduForm],
      });
      showToast('Education added!');
      dispatch(getAboutUser({ token: localStorage.getItem('token') }));
      setEditModal(null);
      setEduForm({ school: '', degree: '', fieldOfStudy: '' });
    } catch (err) {
      showToast('Failed to add education', 'error');
    }
    setSaving(false);
  };

  // ── Delete Education ──
  const handleDeleteEducation = async (index) => {
    try {
      const updated = [...(userProfile?.education || [])];
      updated.splice(index, 1);
      await clientServer.post('/update_profile_data', {
        token: localStorage.getItem('token'),
        education: updated,
      });
      showToast('Education removed');
      dispatch(getAboutUser({ token: localStorage.getItem('token') }));
    } catch (err) {
      showToast('Failed to remove education', 'error');
    }
  };

  // ── Download own resume ──
  const handleDownloadResume = async () => {
    try {
      const response = await clientServer.get(
        `/download_resume/${userProfile?.userId?._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${userProfile?.userId?.name}_resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast('Resume downloaded!');
    } catch (err) {
      showToast('Failed to download resume', 'error');
    }
  };

  // ── Profile completion ──
  const calcCompletion = () => {
    if (!userProfile) return 0;
    let score = 0;
    const total = 5;
    if (userProfile.userId?.profilePicture && userProfile.userId.profilePicture !== 'default.jpg') score++;
    if (userProfile.bio) score++;
    if (userProfile.currentPost) score++;
    if (userProfile.pastWork?.length > 0) score++;
    if (userProfile.education?.length > 0) score++;
    return Math.round((score / total) * 100);
  };

  // ── Render guard ──
  if (!userProfile) {
    return (
      <UserLayout>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <span style={{ color: '#64748b' }}>Loading your profile…</span>
        </div>
      </UserLayout>
    );
  }

  const profileUser = userProfile.userId;
  const completion = calcCompletion();

  return (
    <UserLayout>
      <div className={styles.profileContainer}>

        {/* ══════════ HEADER CARD ══════════ */}
        <div className={styles.headerCard}>
          <div className={styles.coverBanner}></div>

          {/* Avatar */}
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {profileUser?.profilePicture && profileUser.profilePicture !== 'default.jpg' ? (
                <img
                  src={getImageUrl(profileUser.profilePicture) || DEFAULT_AVATAR}
                  alt={profileUser?.name}
                  className={styles.avatar}
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className={styles.avatarFallback}
                style={{ display: profileUser?.profilePicture && profileUser.profilePicture !== 'default.jpg' ? 'none' : 'flex' }}
              >
                {(profileUser?.name || 'U').charAt(0).toUpperCase()}
              </div>
              {/* Camera overlay */}
              <div className={styles.avatarOverlay} onClick={() => fileInputRef.current?.click()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleProfilePicUpload}
              />
            </div>
          </div>

          {/* User Info */}
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>{profileUser?.name || 'Unknown User'}</h1>
            {userProfile.currentPost && <p className={styles.headline}>{userProfile.currentPost}</p>}
            <p className={styles.email}>{profileUser?.email}</p>
            <p className={styles.username}>@{profileUser?.username || 'username'}</p>

            <div className={styles.headerActions}>
              <button className={styles.primaryBtn} onClick={() => {
                setHeadlineForm(userProfile.currentPost || '');
                setEditModal('headline');
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Profile
              </button>
              <button className={styles.secondaryBtn} onClick={handleDownloadResume}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Resume
              </button>
            </div>
          </div>
        </div>

        {/* ══════════ MAIN GRID ══════════ */}
        <div className={styles.mainGrid}>

          {/* ──── LEFT COLUMN ──── */}
          <div className={styles.mainContent}>

            {/* About Section */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>About</h2>
                <button className={styles.editBtn} onClick={() => {
                  setBioForm(userProfile.bio || '');
                  setEditModal('about');
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </button>
              </div>
              {userProfile.bio ? (
                <div className={styles.bioText}>{userProfile.bio}</div>
              ) : (
                <p className={styles.emptyHint}>Add a summary to tell people about yourself.</p>
              )}
            </div>

            {/* Experience Section */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Experience</h2>
                <button className={styles.editBtn} onClick={() => {
                  setExpForm({ company: '', position: '', years: '' });
                  setEditModal('experience');
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add
                </button>
              </div>
              {userProfile.pastWork && userProfile.pastWork.length > 0 ? (
                userProfile.pastWork.map((work, i) => (
                  <div key={i} className={styles.listItem}>
                    <div className={styles.itemIcon}>🏢</div>
                    <div className={styles.itemContent}>
                      <h4 className={styles.itemTitle}>{work.position}</h4>
                      <p className={styles.itemSubtitle}>{work.company}</p>
                      <span className={styles.itemMeta}>{work.years}</span>
                    </div>
                    <button className={styles.deleteItemBtn} onClick={() => handleDeleteExperience(i)} title="Remove">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className={styles.emptyHint}>Add your work experience to showcase your career.</p>
              )}
            </div>

            {/* Education Section */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Education</h2>
                <button className={styles.editBtn} onClick={() => {
                  setEduForm({ school: '', degree: '', fieldOfStudy: '' });
                  setEditModal('education');
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add
                </button>
              </div>
              {userProfile.education && userProfile.education.length > 0 ? (
                userProfile.education.map((edu, i) => (
                  <div key={i} className={styles.listItem}>
                    <div className={styles.itemIcon}>🎓</div>
                    <div className={styles.itemContent}>
                      <h4 className={styles.itemTitle}>{edu.degree} in {edu.fieldOfStudy}</h4>
                      <p className={styles.itemSubtitle}>{edu.school}</p>
                    </div>
                    <button className={styles.deleteItemBtn} onClick={() => handleDeleteEducation(i)} title="Remove">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                        <path d="M10 11v6"></path>
                        <path d="M14 11v6"></path>
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className={styles.emptyHint}>Add your education background.</p>
              )}
            </div>

            {/* Activity & Posts */}
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Activity &amp; Posts</h2>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{userPosts.length} post{userPosts.length !== 1 ? 's' : ''}</span>
              </div>
              {userPosts.length > 0 ? (
                [...userPosts].reverse().map((post, i) => (
                  <div key={i} className={styles.postCard}>
                    <p className={styles.postDate}>
                      {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className={styles.postBody}>{post.body}</p>
                    {post.media && (
                      <img src={getImageUrl(post.media)} alt="Post media" className={styles.postMedia} onError={(e) => { e.target.style.display = 'none' }} />
                    )}
                  </div>
                ))
              ) : (
                <p className={styles.emptyHint}>You haven't posted anything yet. Share your thoughts!</p>
              )}
            </div>

          </div>

          {/* ──── RIGHT COLUMN (Sidebar) ──── */}
          <div className={styles.sidebar}>

            {/* Profile Completion */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Profile Strength</h2>
              <div className={styles.completionBarBg}>
                <div className={styles.completionBarFill} style={{ width: `${completion}%` }}></div>
              </div>
              <p className={styles.completionPercent}>
                {completion}% — {completion === 100 ? 'All Star!' : completion >= 60 ? 'Intermediate' : 'Getting started'}
              </p>
            </div>

            {/* Stats */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Dashboard</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>{userPosts.length}</span>
                  <span className={styles.statLabel}>Posts</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>{connections_of_user?.length || 0}</span>
                  <span className={styles.statLabel}>Connections</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>{userProfile.pastWork?.length || 0}</span>
                  <span className={styles.statLabel}>Roles</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>{userProfile.education?.length || 0}</span>
                  <span className={styles.statLabel}>Education</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>Quick Links</h2>
              <div className={styles.quickLink} onClick={() => router.push('/dashboard')}>
                <span className={styles.quickLinkIcon}>🏠</span>
                <span className={styles.quickLinkText}>Go to Dashboard</span>
              </div>
              <div className={styles.quickLink} onClick={() => router.push('/my_connections')}>
                <span className={styles.quickLinkIcon}>👥</span>
                <span className={styles.quickLinkText}>My Connections</span>
              </div>
              <div className={styles.quickLink} onClick={() => router.push('/Discover')}>
                <span className={styles.quickLinkIcon}>🔍</span>
                <span className={styles.quickLinkText}>Discover People</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ══════════ MODALS ══════════ */}

      {/* --- About Modal --- */}
      {editModal === 'about' && (
        <div className={styles.modalOverlay} onClick={() => setEditModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Edit About</h2>
              <button className={styles.modalCloseBtn} onClick={() => setEditModal(null)}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Bio</label>
                <textarea
                  rows={5}
                  value={bioForm}
                  onChange={(e) => setBioForm(e.target.value)}
                  placeholder="Write something about yourself…"
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setEditModal(null)}>Cancel</button>
              <button className={styles.saveBtn} disabled={saving} onClick={handleSaveBio}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Headline Modal --- */}
      {editModal === 'headline' && (
        <div className={styles.modalOverlay} onClick={() => setEditModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Edit Headline</h2>
              <button className={styles.modalCloseBtn} onClick={() => setEditModal(null)}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Headline / Current Position</label>
                <input
                  type="text"
                  value={headlineForm}
                  onChange={(e) => setHeadlineForm(e.target.value)}
                  placeholder="e.g. Senior Developer at Google"
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setEditModal(null)}>Cancel</button>
              <button className={styles.saveBtn} disabled={saving} onClick={handleSaveHeadline}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Experience Modal --- */}
      {editModal === 'experience' && (
        <div className={styles.modalOverlay} onClick={() => setEditModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Add Experience</h2>
              <button className={styles.modalCloseBtn} onClick={() => setEditModal(null)}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Position / Title</label>
                <input type="text" value={expForm.position} onChange={(e) => setExpForm({ ...expForm, position: e.target.value })} placeholder="e.g. Software Engineer" />
              </div>
              <div className={styles.formGroup}>
                <label>Company</label>
                <input type="text" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} placeholder="e.g. Google" />
              </div>
              <div className={styles.formGroup}>
                <label>Duration</label>
                <input type="text" value={expForm.years} onChange={(e) => setExpForm({ ...expForm, years: e.target.value })} placeholder="e.g. 2022 – Present" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setEditModal(null)}>Cancel</button>
              <button className={styles.saveBtn} disabled={saving || !expForm.company || !expForm.position || !expForm.years} onClick={handleAddExperience}>
                {saving ? 'Saving…' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Education Modal --- */}
      {editModal === 'education' && (
        <div className={styles.modalOverlay} onClick={() => setEditModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Add Education</h2>
              <button className={styles.modalCloseBtn} onClick={() => setEditModal(null)}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>School / University</label>
                <input type="text" value={eduForm.school} onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })} placeholder="e.g. MIT" />
              </div>
              <div className={styles.formGroup}>
                <label>Degree</label>
                <input type="text" value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })} placeholder="e.g. Bachelor of Science" />
              </div>
              <div className={styles.formGroup}>
                <label>Field of Study</label>
                <input type="text" value={eduForm.fieldOfStudy} onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })} placeholder="e.g. Computer Science" />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setEditModal(null)}>Cancel</button>
              <button className={styles.saveBtn} disabled={saving || !eduForm.school || !eduForm.degree || !eduForm.fieldOfStudy} onClick={handleAddEducation}>
                {saving ? 'Saving…' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ TOAST ══════════ */}
      {toast && (
        <div className={toast.type === 'error' ? styles.toastError : styles.toastSuccess}>
          {toast.msg}
        </div>
      )}

    </UserLayout>
  );
}
