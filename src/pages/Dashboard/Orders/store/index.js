/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import apis from "services/orders";

class OrdersStore {
  // ====================================================
  // State
  // ====================================================
  orders = [];
  order = null;
  ordersCount = null;
  error = null;
  loading = false;
  createOrderLoading = false;
  editOrderLoading = false;
  getOrderLoading = false;
  deleteOrderLoading = false;
  searchResultCount = 0;
  searchLoading = false;
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  searchItems = async ({ data }) => {
    this.searchLoading = true;
    try {
      let res = await apis.searchUsers(data);
      res = res?.searchUsers;
      this.searchResult = res?.results || [];
      this.searchResultCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.searchLoading = false;
    }
  };

  getOrders = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getOrders(data);
      res = res?.orders;
      this.orders =
        res?.results?.sort((a, b) =>
          moment(b.createdAt).diff(moment(a.createdAt))
        ) || [];
      this.ordersCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getOrdersCount = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getOrdersCount(data);
      res = res?.orders;
      this.ordersCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getOrder = async ({ data }) => {
    this.getOrderLoading = true;
    try {
      let res = await apis.getOrder(data);
      res = res?.order;
      this.order = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.getOrderLoading = false;
    }
  };

  createOrder = async ({ data, onSuccess, page }) => {
    this.createOrderLoading = true;
    try {
      await apis.createOrder(data);
      successToast("Operation Successful!", "Order created Successfully.");
      onSuccess?.();
      await this.getOrders({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createOrderLoading = false;
    }
  };
  editOrder = async ({ data, onSuccess, page }) => {
    this.editOrderLoading = true;
    try {
      await apis.editOrder(data);
      successToast("Operation Successful!", "Order updated Successfully.");
      onSuccess?.();
      await this.getOrders({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editOrderLoading = false;
    }
  };

  deleteOrder = async ({ data, onSuccess, page }) => {
    this.deleteOrderLoading = true;
    try {
      await apis.deleteOrder(data);
      successToast("Operation Successful!", "Order deleted Successfully.");
      onSuccess?.();
      await this.getOrders({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteOrderLoading = false;
    }
  };
}

export default new OrdersStore();
