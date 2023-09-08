/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import apis from "services/warehouses";

class WareHousesStore {
  // ====================================================
  // State
  // ====================================================
  warehouses = null;
  warehouse = null;
  warehousesCount = null;
  error = null;
  loading = false;
  createWareHouseLoading = false;
  editWareHouseLoading = false;
  getWareHouseLoading = false;
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  getWarehouses = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getWarehouses(data);
      res = res?.warehouses;
      this.warehouses =
        res?.results?.sort((a, b) =>
          moment(b.createdAt).diff(moment(a.createdAt))
        ) || [];
      this.warehousesCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getWarehouse = async ({ data }) => {
    this.getWareHouseLoading = true;
    try {
      let res = await apis.getWarehouse(data);
      res = res?.warehouse;
      this.warehouse = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.getWareHouseLoading = false;
    }
  };

  createWarehouse = async ({ data, onSuccess }) => {
    this.createWareHouseLoading = true;
    try {
      await apis.createWarehouse(data);
      successToast("Operation Successful!", "Warehouse created Successfully.");
      onSuccess?.();
      // await this.getWarehouses({ data: { page: 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createWareHouseLoading = false;
    }
  };
  editWarehouse = async ({ data, onSuccess }) => {
    this.editWareHouseLoading = true;
    try {
      await apis.editWarehouse(data);
      successToast("Operation Successful!", "Warehouse updated Successfully.");
      onSuccess?.();
      await this.getWarehouse({ data: { id: data?.id } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editWareHouseLoading = false;
    }
  };
}

export default new WareHousesStore();
