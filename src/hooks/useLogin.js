import { useNavigate } from "react-router-dom";
import {
  saveToken,
  saveUserInfoToStorage,
  clearAccountCreation,
} from "utils/storage";
import useAuth from "./useAuth";

function useLogin() {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();

  const logUserIn = (user, route) => {
    if (user?.accessToken) {
      const { accessToken, ...rest } = user;
      const warehouseId = rest?.user?.warehouseStaff?.warehouseId;
      const brandId = rest?.user?.brandId;
      const role = rest?.user?.role;
      const defaultRoute =
        role === "BRAND_STAFF"
          ? `/dashboard/home/${brandId}`
          : !role?.includes("ADMIN") && warehouseId
          ? `/dashboard/home/${warehouseId}`
          : "/dashboard/home/1";
      saveToken(accessToken);
      saveUserInfoToStorage(rest);
      setAuthenticatedUser(user);
      clearAccountCreation();
      navigate(route || defaultRoute, { replace: true });
    }
  };

  return {
    logUserIn,
  };
}

export default useLogin;
