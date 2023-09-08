import { useNavigate } from "react-router";
import {
  clearUserDetails,
  getToken,
  getUserInfoFromStorage,
} from "../utils/storage";
import AuthStore from "pages/OnBoarding/SignIn/store";
function useAuth() {
  const { logoutUser } = AuthStore;
  const currentUser = {};
  const userData = getUserInfoFromStorage();
  const token = getToken();
  const navigate = useNavigate();
  function checkSessionValidity() {
    try {
      return !!token;
    } catch (err) {
      return false;
    }
  }

  async function logout() {
    try {
      clearUserDetails();
      logoutUser();
      navigate("/");
    } catch (error) {
      return error;
    }
  }

  function setAuthenticatedUser(result) {
    // dispatch(authActions.setCurrentUser(result));
  }

  function initUserSession() {
    if (checkSessionValidity()) {
      setAuthenticatedUser({ ...userData, token });
      // dispatch(authActions.fetchBusinesses());
      return;
    }
    setAuthenticatedUser({});
  }

  return {
    currentUser,
    checkSessionValidity,
    initUserSession,
    setAuthenticatedUser,
    isAuthenticated: checkSessionValidity(),
    logout,
  };
}

export { useAuth };
