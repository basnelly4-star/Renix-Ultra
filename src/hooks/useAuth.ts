import { useState, useEffect } from "react";
import { subscribeToAuthState, getCurrentUser, AppUser } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState<AppUser | null>(getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    const unsubscribe = subscribeToAuthState((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
};
