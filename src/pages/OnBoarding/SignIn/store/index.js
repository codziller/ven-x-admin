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
    return !!(
      this?.user?.user?.role?.includes("ADMIN") ||
      this?.user?.role?.includes("ADMIN")
    );
  }
  get userIsBrandStaff() {
    return !!((this?.user?.user?.role || this?.user?.role) === "BRAND_STAFF");
  }

  // ====================================================
  // Actions
  // ====================================================

  login = async (data, logUserIn) => {
    this.loading = true;

    try {
      // let res = await apis.login(data);
      // res = res?.adminLoginUser;

      let res = {
        user: {
          firstName: "Admin",
          lastName: "Ven-x",
          email: data.email,
          role: "GENERAL_ADMIN",
          gender: "MALE",
          brandId: null,
          warehouseStaff: {
            warehouseId: "61cbeb71-74a5-4ceb-8d9c-41433c4b3d5a",
          },
        },
        accessToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwiaWQiOiI1Njk0MzQ4ZC0xY2U2LTQ5MDYtOTkwNS0wYWRjNDEwNzY4MDYiLCJwaG9uZU51bWJlciI6IjA4MDkxMTExNDAyIiwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcwNDQzMjMwMCwiZXhwIjo5MTcwNDQzMjMwMH0.OIp4d5CNrr-3Br_O_bn6a-McUscq1K5F6qIqPkxGdm4",
      };
      this.setCurrentUser(res?.user);
      console.log("RESSS: ", res);
      logUserIn(res);
      const message = "You have successfully logged into ven-x admin dashboard";
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
