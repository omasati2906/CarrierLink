import NavbarComponent from "@/components/navbar";
import React, { useEffect } from "react";  
import { useRouter } from "next/router";

export default function UserLayout({ children }) {
    const router = useRouter();
    const isLoginPage = router.pathname === "/login";

    useEffect(() => {
        const checkTokenExpiration = () => {
            try {
                const token = localStorage.getItem("token");
                const lastVisit = localStorage.getItem("lastVisit");
                const now = Date.now();
                const threeHours = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

                if (token) {
                    if (!lastVisit) {
                        // Initialize if missing but token exists
                        localStorage.setItem("lastVisit", now.toString());
                    } else if (now - parseInt(lastVisit) > threeHours) {
                        // Session expired due to inactivity
                        localStorage.removeItem("token");
                        localStorage.removeItem("lastVisit");
                        if (!isLoginPage) {
                            router.push("/login");
                        }
                    } else {
                        // Still active, refresh the lastVisit timestamp
                        localStorage.setItem("lastVisit", now.toString());
                    }
                } else if (!isLoginPage && router.pathname !== "/register") {
                    // No token and not on login/register page, redirect to login
                    router.push("/login");
                }
            } catch (error) {
                console.warn("Storage access failed:", error);
            }
        };


        checkTokenExpiration();
    }, [router.pathname, isLoginPage]);

    return ( 
            <div className="flex flex-col min-h-screen">
              {!isLoginPage && <NavbarComponent/>}
              <main className="flex-grow">
                {children}
              </main>
          </div>
    );
}