import { useNavigate } from "react-router-dom";
import {
  saveToken,
  saveUserInfoToStorage,
  clearAccountCreation,
} from "utils/storage";
import { useAuth } from "./useAuth";

function useLogin() {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  const logUserIn = (user, route) => {
    if (user?.accessToken) {
      const { accessToken, ...rest } = user;
      saveToken(accessToken);
      saveUserInfoToStorage(rest);
      setAuthenticatedUser(user);
      // dispatch(fetchBusinesses());
      clearAccountCreation();
      navigate(route || "/warehouses", { replace: true });
    }
  };

  return {
    logUserIn,
  };
}

export default useLogin;
