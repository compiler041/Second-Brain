import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useGetMe, 
  useLogin, 
  useRegister, 
  useLogout,
  getGetMeQueryKey
} from "@workspace/api-client-react";
import { setAuthTokenGetter } from "@workspace/api-client-react/custom-fetch";

const TOKEN_KEY = "sb_auth_token";

function initAuthToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    setAuthTokenGetter(() => token);
  }
}

initAuthToken();

export function useAuth() {
  const queryClient = useQueryClient();
  const { data: user, isLoading, error } = useGetMe({
    query: {
      retry: false,
      staleTime: Infinity,
    }
  });

  const login = useLogin({
    mutation: {
      onSuccess: (data) => {
        const token = data.token;
        localStorage.setItem(TOKEN_KEY, token);
        setAuthTokenGetter(() => token);
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      }
    }
  });

  const register = useRegister({
    mutation: {
      onSuccess: (data) => {
        const token = data.token;
        localStorage.setItem(TOKEN_KEY, token);
        setAuthTokenGetter(() => token);
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      }
    }
  });

  const logout = useLogout({
    mutation: {
      onSuccess: () => {
        localStorage.removeItem(TOKEN_KEY);
        setAuthTokenGetter(null);
        queryClient.setQueryData(getGetMeQueryKey(), null);
        queryClient.clear();
      }
    }
  });

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
}
