/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import apis from "services/orders";
import { ORDER_STATUSES } from "utils/appConstant";

const { DISPATCHED, CANCELLED, COMPLETED, INPROGRESS, PENDING } =
  ORDER_STATUSES;
class OrdersStore {
  // ====================================================
  // State
  // ====================================================
  orders = [];
  order = null;
  ordersCount = null;

  in_progressOrders = [];
  in_progressOrdersCount = null;
  pendingOrders = [];
  pendingOrdersCount = null;
  dispatchedOrders = [];
  dispatchedOrdersCount = null;
  completedOrders = [];
  completedOrdersCount = null;
  cancelledOrders = [];
  cancelledOrdersCount = null;

  brandOrders = [];
  brandOrdersCount = null;
  brandOrdersLoading = null;

  error = null;
  loading = false;
  createOrderLoading = false;
  updateOrderStatusLoading = false;
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

  getBrandOrders = async ({ data }) => {
    this.brandOrdersLoading = true;
    try {
      let res = await apis.getBrandOrders(data);
      res = res?.orders_by_brand_id;
      this.brandOrders = res?.results || [];
      this.brandOrdersCount = res?.total;
    } catch (error) {
      console.log("bbsgt error: ", error);
      this.error = error;
    } finally {
      this.brandOrdersLoading = false;
    }
  };

  getOrders = async ({ data }) => {
    const status = data?.status;
    this.loading = true;
    try {
      let res = await apis.getOrders(data);
      res = res?.orders;
      const resResults =
        res?.results?.sort((a, b) =>
          moment(b.createdAt).diff(moment(a.createdAt))
        ) || [];

      switch (status) {
        case INPROGRESS:
          this.in_progressOrders = resResults;
          this.in_progressOrdersCount = res?.total;

          break;
        case PENDING:
          this.pendingOrders = resResults;
          this.pendingOrdersCount = res?.total;
          break;
        case DISPATCHED:
          this.dispatchedOrders = resResults;
          this.dispatchedOrdersCount = res?.total;
          break;
        case COMPLETED:
          this.completedOrders = resResults;
          this.completedOrdersCount = res?.total;
          break;
        case CANCELLED:
          this.cancelledOrders = resResults;
          this.cancelledOrdersCount = res?.total;
          break;
        default:
          this.orders = resResults;
          this.ordersCount = res?.total;
          break;
      }
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
  updateOrderStatus = async ({ data, onSuccess, page }) => {
    this.updateOrderStatusLoading = true;
    try {
      await apis.updateOrderStatus(data);
      successToast(
        "Operation Successful!",
        "Order status updated Successfully."
      );
      onSuccess?.();
      await this.getOrders({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.updateOrderStatusLoading = false;
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
