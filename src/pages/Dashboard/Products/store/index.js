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
  productsArchivedCount = 0;
  productsPrivate = [];
  productsPrivateCount = 0;
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

  createProductOptionLoading = false;

  editProductVariantLoading = false;
  editProductOptionLoading = false;
  editProductSubscriptionLoading = false;
  editProductInventoryLoading = false;
  loadingArchived = false;
  loadingPrivateProducts = false;
  searchProductLoading = false;
  deleteProductLoading = false;
  requestProductsLoading = false;
  productTransferRequestLoading = false;
  productTransferRequestsLoading = false;
  productRequestsLoading = false;
  updateProductTransferRequestStatusLoading = false;

  productStats = null;
  loadingProductStats = false;

  brandProductStats = null;
  loadingBrandProductStats = false;

  createProductCategoryLoading = false;
  deleteProductCategoryLoading = false;

  productForm = {};
  sourceWarehouseId = "";

  reviews = [];
  reviewsCount = null;
  reviewsLoading = false;
  deleteReviewLoading = false;

  productReviews = [];
  productReviewsCount = null;
  productReviewsLoading = false;

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

  getProductQuantitySoldByDateFilter = async ({ data }) => {
    this.loadingProductStats = true;
    try {
      let res = await apis.getProductQuantitySoldByDateFilter(data);
      res = res?.getProductQuantitySoldByDateFilter;
      this.productStats = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingProductStats = false;
    }
  };

  getProductQuantitySoldByDateFilterByBrandId = async ({ data }) => {
    this.loadingBrandProductStats = true;
    try {
      let res = await apis.getProductQuantitySoldByDateFilterByBrandId(data);
      res = res?.getProductQuantitySoldByDateFilterByBrandId;
      this.brandProductStats = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingBrandProductStats = false;
    }
  };

  getProducts = async ({ data, warehouse_id }) => {
    this.loading = true;
    try {
      let res = await apis.getProducts(data);
      res = res?.products;
      this.products =
        res?.results
          ?.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)))
          ?.map((item) => {
            const inventoryDetails = item?.warehouseInventory?.find(
              (_) => _?.warehouseId === warehouse_id
            );

            return { ...item, inventoryDetails };
          }) || [];
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

  getPrivateProducts = async ({ data }) => {
    this.loadingPrivateProducts = true;
    try {
      let res = await apis.getPrivateProducts(data);
      res = res?.products_by_private_status;
      this.productsPrivate = res?.results || [];
      this.productsPrivateCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingPrivateProducts = false;
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
  deleteProduct = async ({ data, onSuccess, page, warehouse_id }) => {
    this.deleteProductLoading = true;
    try {
      await apis.deleteProduct(data);
      successToast("Operation Successful!", "Product archived Successfully.");
      onSuccess?.();
      await this.getProducts({ data: { page: page || 1 }, warehouse_id });
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
      const response = await apis.createProduct(data);
      successToast("Operation Successful!", "Product created Successfully.");
      console.log("resposne: ", response);
      onSuccess?.(response?.createProduct);
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

  createProductOption = async ({ data, onSuccess, product_id }) => {
    this.createProductOptionLoading = true;
    try {
      await apis.createProductOption(data);
      successToast(
        "Operation Successful!",
        "Product option created Successfully."
      );
      onSuccess?.();
      this.getProduct({ data: { id: product_id } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createProductOptionLoading = false;
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
  editProductInventory = async ({ data, onSuccess, page, warehouse_id }) => {
    this.editProductInventoryLoading = true;
    try {
      await apis.editProductInventory(data);
      successToast(
        "Operation Successful!",
        "Product inventory updated Successfully."
      );
      this.getProducts({ data: { page: page || 1 }, warehouse_id });
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

  createProductCategory = async ({ data }) => {
    this.createProductCategoryLoading = true;
    try {
      await apis.createProductCategory(data);
    } catch (error) {
      this.error = error;
    } finally {
      this.createProductCategoryLoading = false;
    }
  };

  deleteProductCategory = async ({ data }) => {
    this.deleteProductCategoryLoading = true;
    try {
      await apis.deleteProductCategory(data);
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteProductCategoryLoading = false;
    }
  };

  getProductReviews = async ({ data }) => {
    this.productReviewsLoading = true;
    try {
      const res = await apis.getProductReviews(data);
      this.productReviews = res?.products_reviews_by_product_id;
      this.productReviewsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.productReviewsLoading = false;
    }
  };

  getReviews = async ({ data }) => {
    this.reviewsLoading = true;
    try {
      let res = await apis.getReviews(data);
      res = res?.products_reviews_all;
      this.reviews = res?.results;
      this.reviewsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.reviewsLoading = false;
    }
  };

  deleteReview = async ({ data, onSuccess }) => {
    this.deleteReviewLoading = true;
    try {
      await apis.deleteProductReview(data);
      onSuccess?.();
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteReviewLoading = false;
    }
  };
  resetProductStore = () => {
    this.products = null;
    this.product = null;
    this.productTransferRequest = null;
    this.productsCount = 0;
    this.productsArchived = [];
    this.searchResult = [];
    this.productTransferRequests = [];
    this.productRequests = [];
    this.productTransferRequestsCount = 0;
    this.productRequestsCount = 0;
    this.error = null;
    this.loading = false;
    this.createProductLoading = false;
    this.editProductLoading = false;
    this.getProductLoading = false;

    this.editProductVariantLoading = false;
    this.editProductOptionLoading = false;
    this.editProductSubscriptionLoading = false;
    this.editProductInventoryLoading = false;
    this.loadingArchived = false;
    this.loadingPrivateProducts = false;
    this.searchProductLoading = false;
    this.deleteProductLoading = false;
    this.requestProductsLoading = false;
    this.productTransferRequestLoading = false;
    this.productTransferRequestsLoading = false;
    this.productRequestsLoading = false;
    this.updateProductTransferRequestStatusLoading = false;
    this.productForm = {};
    this.sourceWarehouseId = "";
  };
}

export default new ProductsStore();
