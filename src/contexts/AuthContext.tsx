import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 현재 세션 확인
    const checkSession = async () => {
      try {

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('세션 체크 에러:', error);
          throw error;
        }

        
        if (session) {

          setUser(session.user);
          setIsAuthenticated(true);
        } else {

          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('세션 체크 중 에러 발생:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // 인증 상태 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {

      
      if (event === 'SIGNED_IN' && session) {

        setUser(session.user);
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {

        setUser(null);
        setIsAuthenticated(false);
      } else if (event === 'TOKEN_REFRESHED' && session) {

        setUser(session.user);
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('로그인 에러:', error);
        throw error;
      }

      if (data?.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('로그인 에러:', error);
      toast.error('로그인에 실패했습니다.');
      return false;
    }
  };

  const signup = async (email: string, password: string, fullName: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('회원가입 에러:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('회원가입 에러:', error);
      toast.error('회원가입에 실패했습니다.');
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('로그아웃 시도');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('로그아웃 에러:', error);
        throw error;
      }
      console.log('로그아웃 성공');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('로그아웃 에러:', error);
      toast.error('로그아웃에 실패했습니다.');
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    signup,
    logout
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
