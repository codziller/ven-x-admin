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
  product = null;
  productsCount = null;
  error = null;
  loading = false;
  createProductLoading = false;
  editProductLoading = false;
  getProductLoading = false;
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
  getProductsCount = async ({ data }) => {
    this.loading = true;
    try {
      let res = await apis.getProductsCount(data);
      res = res?.products;
      this.productsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
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

  getProduct = async ({ data }) => {
    this.getProductLoading = true;
    try {
      let res = await apis.getProduct(data);
      res = res?.product;
      this.product = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.getProductLoading = false;
    }
  };

  createProduct = async ({ data, onSuccess }) => {
    this.createProductLoading = true;
    try {
      await apis.createProduct(data);
      successToast("Operation Successful!", "Product created Successfully.");
      onSuccess?.();
      // await this.getProducts({ data: { page: 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createProductLoading = false;
    }
  };
  editProduct = async ({ data, onSuccess }) => {
    this.editProductLoading = true;
    try {
      await apis.editProduct(data);
      successToast("Operation Successful!", "Product updated Successfully.");
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.editProductLoading = false;
    }
  };
}

export default new ProductsStore();
