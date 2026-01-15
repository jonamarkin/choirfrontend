"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/types/auth";
import { authService } from "@/services/auth.service";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: any) => Promise<void>; // Using 'any' briefly to match service, or import types
    logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/signup", "/forgot-password", "/"];

    React.useEffect(() => {
        const initAuth = async () => {
            // 1. Check for token
            if (typeof window === "undefined") return;

            const token = localStorage.getItem("access_token");
            const cachedUser = authService.getCachedUser();

            if (!token) {
                // No token found
                if (!publicRoutes.includes(pathname)) {
                    // If on a protected route, redirect to login
                    router.push("/login");
                }
                setIsLoading(false);
                return;
            }

            // 2. Token found. Set user from cache first for speed
            if (cachedUser) {
                setUser(cachedUser);
            }

            // 3. Optional: Verify token / fetch fresh profile
            try {
                // We can optimistically assume token is valid if we have it, 
                // but verifying ensures we don't keep invalid sessions.
                // For now, let's trust the cache to avoid blocking UI, 
                // and fetch fresh data in background.
                const freshUser = await authService.getProfile();
                setUser(freshUser);

                // If we are on a public route (like login) and valid, redirect to home
                if (publicRoutes.includes(pathname)) {
                    router.push("/home");
                }
            } catch (error) {
                console.error("Session verification failed", error);
                // Token might be expired
                authService.logout();
                setUser(null);
                if (!publicRoutes.includes(pathname)) {
                    router.push("/login");
                }
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [pathname]); // Re-run checks on path change? 
    // Actually, checking on mount is usually enough, accessing protected routes 
    // without token will trigger this if we add it to the dependency or separate logic.
    // Better: separate the route protection logic.

    // Logic 2: Route Protection on path change
    React.useEffect(() => {
        if (isLoading) return;

        const token = localStorage.getItem("access_token");
        const isPublic = publicRoutes.includes(pathname);

        if (!token && !isPublic) {
            router.push("/login");
        }

        if (token && isPublic) {
            router.push("/home");
        }
    }, [pathname, isLoading]);


    const login = async (data: any) => {
        const response = await authService.login(data);
        if (response.user) {
            setUser(response.user);
            router.push("/home");
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
