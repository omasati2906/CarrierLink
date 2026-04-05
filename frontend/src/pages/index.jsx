import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
    const router = useRouter();

    return (

        <UserLayout>

    
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={`${styles.section} ${styles.heroSection}`}>
                <div className={styles.mainContainer}>
                    <div className={styles.mainContainer_left}>
                        <h1 className={styles.title}>Connect without Exaggeration</h1>
                        <p className={styles.subtitle}>
                            Welcome to a true social media platform, built with honesty and transparency. 
                            No bluff, just real stories from real people.
                        </p>

                        <div onClick={() => router.push("/login")} className={styles.buttonJoin}>
                            Join CareerLink Today
                        </div>
                    </div>

                    <div className={styles.mainContainer_right}>
                        <img src="/images/image.png" alt="CareerLink" className={styles.logo} />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={`${styles.section} ${styles.featuresSection}`}>
                <h2 className={styles.sectionTitle}>Why CareerLink?</h2>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🛡️</div>
                        <h3>Real Identity</h3>
                        <p>Verified professionals only. No anonymous noise, just authentic connections.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📈</div>
                        <h3>True Growth</h3>
                        <p>Share your real journey—including the failures that lead to your success.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🤝</div>
                        <h3>Trusted Networking</h3>
                        <p>Build relationships based on transparency and proven professional history.</p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className={`${styles.section} ${styles.missionSection}`}>

                <div className={styles.missionContent}>
                    <h2>Skip the Bluff</h2>
                    <p>
                        Most platforms are filled with exaggerated successes. CareerLink is different. 
                        We value the raw process of building a career. Join a community that celebrates 
                        the real work behind the profile.
                    </p>
                    <button onClick={() => router.push("/login")} className={styles.outlineButton}>
                        Get Started for Free
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <p>&copy; 2026 CareerLink. All rights reserved.</p>
                <div className={styles.footerLinks}>
                    <span>Privacy Policy</span>
                    <span>Terms of Service</span>
                    <span>Contact Us</span>
                </div>
            </footer>
        </div>
            </UserLayout>
    );
}






