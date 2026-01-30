"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface UseUserReturn {
    userId: string | null;
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signOut: () => Promise<void>;
}

export function useUser(): UseUserReturn {
    const [user, setUser] = useState<User | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for authenticated user
        const checkUser = async () => {
            try {
                const { data: { user: authUser } } = await supabase.auth.getUser();
                
                if (authUser) {
                    setUser(authUser);
                    setUserId(authUser.id);
                } else {
                    // Fallback to localStorage for demo mode
                    if (typeof window !== 'undefined') {
                        let stored = localStorage.getItem("resume_builder_userid");
                        if (!stored) {
                            stored = crypto.randomUUID();
                            localStorage.setItem("resume_builder_userid", stored);
                        }
                        setUserId(stored);
                    }
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                // Fallback to localStorage
                if (typeof window !== 'undefined') {
                    let stored = localStorage.getItem("resume_builder_userid");
                    if (!stored) {
                        stored = crypto.randomUUID();
                        localStorage.setItem("resume_builder_userid", stored);
                    }
                    setUserId(stored);
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                setUserId(session.user.id);
            } else {
                setUser(null);
                // Keep localStorage userId for demo mode
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        // Generate new localStorage userId for demo mode
        if (typeof window !== 'undefined') {
            const newId = crypto.randomUUID();
            localStorage.setItem("resume_builder_userid", newId);
            setUserId(newId);
        }
    };

    return { 
        userId, 
        user, 
        isLoading,
        isAuthenticated: !!user,
        signOut
    };
}
