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
  productTransferRequest = null;
  productsCount = 0;
  productsArchived = [];
  searchResult = [];
  productTransferRequests = [];
  productRequests = [];
  productTransferRequestsCount = 0;
  productRequestsCount = 0;
  error = null;
  loading = false;
  createProductLoading = false;
  editProductLoading = false;
  getProductLoading = false;

  editProductVariantLoading = false;
  editProductOptionLoading = false;
  editProductSubscriptionLoading = false;
  editProductInventoryLoading = false;
  loadingArchived = false;
  searchProductLoading = false;
  deleteProductLoading = false;
  requestProductsLoading = false;
  productTransferRequestLoading = false;
  productTransferRequestsLoading = false;
  productRequestsLoading = false;
  updateProductTransferRequestStatusLoading = false;
  productForm = {};
  sourceWarehouseId = "";
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  setProductForm = (payload) => {
    this.productForm = { ...this.productForm, ...payload };
  };
  setSourceWarehouseId = (payload) => {
    this.sourceWarehouseId = payload;
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

  getArchivedProducts = async ({ data }) => {
    this.loadingArchived = true;
    try {
      let res = await apis.getArchivedProducts(data);
      res = res?.archived_products;
      this.productsArchived = res?.results || [];
      this.productsArchivedCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingArchived = false;
    }
  };

  searchProducts = async ({ data }) => {
    this.searchProductLoading = true;
    try {
      let res = await apis.searchProducts(data);
      res = res?.searchProducts;
      this.searchResult = res?.results || [];
      this.searchResultCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.searchProductLoading = false;
    }
  };
  deleteProduct = async ({ data, onSuccess, page }) => {
    this.deleteProductLoading = true;
    try {
      await apis.deleteProduct(data);
      successToast("Operation Successful!", "Product archived Successfully.");
      onSuccess?.();
      await this.getProducts({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteProductLoading = false;
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

  getProductCostPriceHistory = async ({ data }) => {
    this.getProductLoading = true;
    try {
      let res = await apis.getProductCostPriceHistory(data);
      res = res?.product;
      this.product = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.getProductLoading = false;
    }
  };

  getProductName = async ({ data }) => {
    this.getProductLoading = true;
    try {
      let res = await apis.getProductName(data);
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

  editProductVariant = async ({ data, onSuccess, product_id }) => {
    this.editProductVariantLoading = true;
    try {
      await apis.editProductVariant(data);
      successToast(
        "Operation Successful!",
        "Product variant updated Successfully."
      );
      onSuccess?.();
      this.getProduct({ data: { id: product_id } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editProductVariantLoading = false;
    }
  };
  editProductOption = async ({ data, onSuccess, product_id }) => {
    this.editProductOptionLoading = true;
    try {
      await apis.editProductOption(data);
      successToast(
        "Operation Successful!",
        "Product option updated Successfully."
      );
      onSuccess?.();
      this.getProduct({ data: { id: product_id } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editProductOptionLoading = false;
    }
  };

  editProductSubscription = async ({ data, onSuccess, product_id }) => {
    this.editProductSubscriptionLoading = true;
    try {
      await apis.editProductSubscription(data);
      successToast(
        "Operation Successful!",
        "Product subscription updated Successfully."
      );
      onSuccess?.();
      this.getProduct({ data: { id: product_id } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editProductSubscriptionLoading = false;
    }
  };

  requestProducts = async ({ data, onSuccess }) => {
    this.requestProductsLoading = true;
    try {
      await apis.requestProducts(data);
      successToast("Operation Successful!", "Product requested Successfully.");
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.requestProductsLoading = false;
    }
  };
  updateProductTransferRequestStatus = async ({
    data,
    onSuccess,
    message,
    pageStatus,
    currentPage,
  }) => {
    this.updateProductTransferRequestStatusLoading = true;
    try {
      await apis.updateProductTransferRequestStatus(data);
      successToast("Operation Successful!", message);
      this.getProductTransferRequests({
        data: {
          page: currentPage || 1,
          warehouseId: data?.warehouseId,
          status: pageStatus,
        },
      });
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.updateProductTransferRequestStatusLoading = false;
    }
  };
  editProductInventory = async ({ data, onSuccess, page }) => {
    this.editProductInventoryLoading = true;
    try {
      await apis.editProductInventory(data);
      successToast(
        "Operation Successful!",
        "Product inventory updated Successfully."
      );
      this.getProducts({ data: { page: page || 1 } });
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.editProductInventoryLoading = false;
    }
  };

  getProductTransferRequests = async ({ data }) => {
    this.productTransferRequestsLoading = true;
    try {
      let res = await apis.productTransferRequests({
        ...data,
        isSource: true,
      });
      res = res?.productTransferRequests;
      this.productTransferRequests =
        res?.results?.sort((a, b) =>
          moment(b.createdAt).diff(moment(a.createdAt))
        ) || [];
      this.productTransferRequestsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.productTransferRequestsLoading = false;
    }
  };

  getProductRequests = async ({ data }) => {
    this.productRequestsLoading = true;
    try {
      let res = await apis.productTransferRequests({
        ...data,
        isSource: false,
      });
      res = res?.productTransferRequests;
      this.productRequests =
        res?.results?.sort((a, b) =>
          moment(b.createdAt).diff(moment(a.createdAt))
        ) || [];
      this.productRequestsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.productRequestsLoading = false;
    }
  };

  getProductTransferRequest = async ({ data }) => {
    this.productTransferRequestLoading = true;
    try {
      let res = await apis.productTransferRequest(data);
      res = res?.productTransferRequest;
      this.productTransferRequest = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.productTransferRequestLoading = false;
    }
  };
}

export default new ProductsStore();
