/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import apis from "services/products";

class ProductsStore {
  // ====================================================
  // State
  // ====================================================
  products = null;
  warehouse = null;
  productsCount = null;
  error = null;
  loading = false;
  createProductLoading = false;
  editWareHouseLoading = false;
  getWareHouseLoading = false;
  productForm = {};
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  setProductForm = (payload) => {
    this.productForm = { ...this.productForm, ...payload };
  };
  getProducts = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getProducts(data);
      res = res?.products;
      this.products =
        res?.results?.sort((a, b) =>
          moment(b.createdAt).diff(moment(a.createdAt))
        ) || [];
      this.productsCount = res?.total;
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

  createProduct = async ({ data, onSuccess }) => {
    this.createProductLoading = true;
    try {
      await apis.createProduct(data);
      successToast("Operation Successful!", "Product created Successfully.");
      onSuccess?.();
      // await this.getWarehouses({ data: { page: 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createProductLoading = false;
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

export default new ProductsStore();
