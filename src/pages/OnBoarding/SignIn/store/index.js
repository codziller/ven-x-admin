/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import apis from "services/auth";

class AuthStore {
  // ====================================================
  // State
  // ====================================================
  user = null;
  otp_value = "";
  error = null;
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Computed views
  // ====================================================
  // While MobX promotes OOP, we can still benefit from using FP where it's appropriate
  get userIsAdmin() {
    return this?.user?.role?.includes("ADMIN");
  }

  // ====================================================
  // Actions
  // ====================================================

  login = async (data, logUserIn) => {
    this.loading = true;

    try {
      let res = await apis.login(data);
      res = res?.adminLoginUser;
      console.log("res: ", res);
      this.setCurrentUser(res?.user);
      logUserIn(res);
      const message = "You have successfully logged into zusco admin dashboard";
      successToast(`Successfully logged in`, message);
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };
  setCurrentUser = (data) => {
    this.user = data;
  };

  logoutUser = () => {
    this.user = null;
    this.setCurrentUser(null);
  };
}

export default new AuthStore();
