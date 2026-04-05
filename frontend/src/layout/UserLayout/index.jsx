import NavbarComponent from "@/components/navbar";
import React, { useEffect } from "react";  
import { useRouter } from "next/router";

export default function UserLayout({ children }) {
    const router = useRouter();
    const isLoginPage = router.pathname === "/login";

    useEffect(() => {
        const checkTokenExpiration = () => {
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
        };

        checkTokenExpiration();
    }, [router.pathname, isLoginPage]);

    return ( 
            <div className="flex flex-col min-h-screen">
              {!isLoginPage && <NavbarComponent/>}
              <main className="flex-grow">
                {children}
              </main>
              {!isLoginPage && (
                <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="container flex flex-col items-center justify-between gap-4 py-8 md:h-24 md:flex-row md:py-0">
                    <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                      <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Developed by{" "}
                        <a
                          href="https://www.linkedin.com/in/om-asati-b8ab28325/"
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
                        >
                          Om Asati
                        </a>
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <a 
                          href="https://www.linkedin.com/in/om-asati-b8ab28325/" 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <svg
                             xmlns="http://www.w3.org/2000/svg"
                             width="24"
                             height="24"
                             viewBox="0 0 24 24"
                             fill="none"
                             stroke="currentColor"
                             strokeWidth="2"
                             strokeLinecap="round"
                             strokeLinejoin="round"
                             className="h-5 w-5"
                          >
                             <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                             <rect width="4" height="12" x="2" y="9" />
                             <circle cx="4" cy="4" r="2" />
                          </svg>
                        </a>
                    </div>
                  </div>
                </footer>
              )}
          </div>
    );
}