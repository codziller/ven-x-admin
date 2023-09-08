/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import moment from "moment";
import apis from "services/categories";

class CategoriesStore {
  // ====================================================
  // State
  // ====================================================
  categories = null;
  category = null;
  categoriesCount = null;
  error = null;
  loading = false;
  createCategoryLoading = false;
  editCategoryLoading = false;
  getCategoryLoading = false;
  deleteCategoryLoading = false;
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  getCategories = async () => {
    this.loading = true;
    try {
      let res = await apis.getCategories();
      res = res?.categories;

      this.categories =
        res
          ?.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt)))
          ?.map((item) => {
            return { ...item, label: item?.name, value: item?.id };
          }) || [];
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  };

  getCategory = async ({ data }) => {
    this.getCategoryLoading = true;
    try {
      let res = await apis.getCategory(data);
      res = res?.category;
      this.category = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.getCategoryLoading = false;
    }
  };

  createCategory = async ({ data, onSuccess, noAlert }) => {
    this.createCategoryLoading = true;
    try {
      await apis.createCategory(data);
      !noAlert &&
        successToast("Operation Successful!", "Category created Successfully.");
      onSuccess?.();
      await this.getCategories();
    } catch (error) {
      this.error = error;
    } finally {
      this.createCategoryLoading = false;
    }
  };

  editCategory = async ({ data, onSuccess, noAlert }) => {
    this.editCategoryLoading = true;
    try {
      await apis.editCategory(data);
      !noAlert &&
        successToast("Operation Successful!", "Category updated Successfully.");
      onSuccess?.();
      await this.getCategories();
    } catch (error) {
      this.error = error;
    } finally {
      this.editCategoryLoading = false;
    }
  };

  deleteCategory = async ({ data, onSuccess }) => {
    this.deleteCategoryLoading = true;
    try {
      await apis.deleteCategory(data);
      successToast("Operation Successful!", "Category deleted Successfully.");
      onSuccess?.();
      await this.getCategories();
    } catch (error) {
      this.error = error;
    } finally {
      this.deleteCategoryLoading = false;
    }
  };
}

export default new CategoriesStore();
