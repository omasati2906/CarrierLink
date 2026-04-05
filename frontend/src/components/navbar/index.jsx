import React, { useState } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";
import { BASE_URL } from "@/config";

export default function NavbarComponent() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(reset());
        router.push("/login");
    };

    return (
        <div className={styles.container}>
            <nav className={styles.navBar}>
                <div className={styles.leftSection} onClick={() => router.push("/dashboard")}>
                    <div className={styles.logoIcon}>C</div>
                    <h1 className={styles.logoText}>CareerLink</h1>
                </div>

                {/* {user && (
                    <div className={styles.searchBar}>
                        <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" placeholder="Search people..." className={styles.searchInput} onClick={() => router.push("/Discover")} />
                    </div>
                )} */}

                <div className={styles.navLinks}>
                    {user ? (
                        <>
                            <div onClick={() => router.push("/dashboard")} className={router.pathname === "/dashboard" ? styles.activeLink : styles.navLink}>
                                <svg className={styles.navIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                <span>Home</span>
                            </div>
                            <div onClick={() => router.push("/my_connections")} className={router.pathname === "/my_connections" ? styles.activeLink : styles.navLink}>
                                <svg className={styles.navIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                <span>Network</span>
                            </div>
                            <div onClick={() => router.push("/Discover")} className={router.pathname === "/Discover" ? styles.activeLink : styles.navLink}>
                                <svg className={styles.navIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                                <span>Discover</span>
                            </div>

                            <div className={styles.profileSection}>
                                <div className={styles.profileWrapper} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                    <img 
                                        src={`${BASE_URL}/${user?.userId?.profilePicture || "default.jpg"}`} 
                                        alt="Me" 
                                        className={styles.profileImage}
                                        onError={(e) => { e.target.src = `${BASE_URL}/default.jpg` }}
                                    />
                                    <div className={styles.userInfo}>
                                        <span className={styles.userName}>Me</span>
                                    </div>
                                </div>
                                
                                {isMenuOpen && (
                                    <div className={styles.dropdownMenu}>
                                        <div className={styles.dropdownItem} onClick={() => { setIsMenuOpen(false); router.push("/profile"); }}>My Profile</div>
                                        <div className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>Logout</div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <button onClick={() => router.push("/login")} className={styles.buttonJoin}>
                            Be a Part
                        </button>
                    )}
                </div>
            </nav>
        </div>
    );
}
