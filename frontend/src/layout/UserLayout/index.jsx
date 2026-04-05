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
            <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
              {!isLoginPage && <NavbarComponent/>}
              <main className="flex-grow">
                {children}
              </main>
              {!isLoginPage && (
                <footer className="w-full py-10 mt-20 border-t border-indigo-100 bg-white/50 backdrop-blur-sm">
                  <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          C
                        </div>
                        <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          CareerLink
                        </span>
                      </div>
                      
                      <p className="text-slate-500 text-sm font-medium">
                        Developed with ❤️ by {" "}
                        <a 
                          href="https://www.linkedin.com/in/om-asati-b8ab28325/" 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 underline underline-offset-4 decoration-indigo-200 hover:decoration-indigo-600 transition-all"
                        >
                          Om Asati
                        </a>
                      </p>

                      <div className="flex space-x-5 pt-2">
                        <a 
                          href="https://www.linkedin.com/in/om-asati-b8ab28325/" 
                          target="_blank" 
                          rel="noreferrer"
                          className="group p-2 rounded-full bg-indigo-50 hover:bg-indigo-600 transition-all duration-300 transform hover:-translate-y-1 shadow-sm"
                        >
                          <svg
                             xmlns="http://www.w3.org/2000/svg"
                             width="20"
                             height="20"
                             viewBox="0 0 24 24"
                             fill="none"
                             stroke="currentColor"
                             strokeWidth="2"
                             strokeLinecap="round"
                             strokeLinejoin="round"
                             className="text-indigo-600 group-hover:text-white transition-colors"
                          >
                             <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                             <rect width="4" height="12" x="2" y="9" />
                             <circle cx="4" cy="4" r="2" />
                          </svg>
                        </a>
                      </div>

                      <div className="text-slate-400 text-[10px] uppercase tracking-widest pt-4">
                        © {new Date().getFullYear()} CareerLink Platform • All Rights Reserved
                      </div>
                    </div>
                  </div>
                </footer>
              )}
          </div>
    );
}