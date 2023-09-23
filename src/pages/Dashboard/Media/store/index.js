/**
 * Advanced example demonstrating all core MobX constructs.
 */

import { successToast } from "components/General/Toast/Toast";
import { makeAutoObservable } from "mobx";
import apis from "services/media";

class MediaStore {
  // ====================================================
  // State
  // ====================================================
  images = [];
  image = null;
  imagesCount = null;
  loadingImages = false;
  loadingImage = false;
  createImageLoading = false;
  editImageLoading = false;

  homeSliderImages = [];
  homeSliderImage = null;
  homeSliderImagesCount = null;
  loadingHomeSliderImages = false;
  loadingHomeSliderImage = false;
  createHomeSliderImageLoading = false;
  editHomeSliderImageLoading = false;

  mobilePagePosts = [];
  mobilePagePost = null;
  mobilePagePostsCount = null;
  loadingMobilePagePosts = false;
  loadingMobilePagePost = false;
  createMobilePagePostLoading = false;
  editMobilePagePostLoading = false;

  error = null;
  constructor() {
    makeAutoObservable(this);
  }

  // ====================================================
  // Actions
  // ====================================================

  getImages = async ({ data }) => {
    this.loadingImages = true;
    try {
      let res = await apis.getImages(data);
      res = res?.images;
      this.images =
        res?.results?.sort((a, b) => a?.name.localeCompare(b?.name)) || [];
      this.imagesCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingImages = false;
    }
  };

  getImage = async ({ data }) => {
    this.loadingImage = true;
    try {
      let res = await apis.getImage(data);
      res = res?.image;
      this.image = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingImage = false;
    }
  };

  getHomeSliderImages = async ({ data }) => {
    this.loadingHomeSliderImages = true;
    try {
      let res = await apis.getHomeSliderImages(data);
      res = res?.homeSliderHomeSliderImages;
      this.homeSliderImages =
        res?.results?.sort(
          (a, b) => Number(a?.position) - Number(b?.position)
        ) || [];
      this.homeSliderImagesCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingHomeSliderImages = false;
    }
  };

  getHomeSliderImage = async ({ data }) => {
    this.loadingHomeSliderImage = true;
    try {
      let res = await apis.getHomeSliderImage(data);
      res = res?.homeSliderHomeSliderImage;
      this.homeSliderImage = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingHomeSliderImage = false;
    }
  };

  getMobilePagePosts = async ({ data }) => {
    this.loadingMobilePagePosts = true;
    try {
      let res = await apis.getMobilePagePosts(data);
      res = res?.homeSliderMobilePagePosts;
      this.mobilePagePosts =
        res?.results?.sort(
          (a, b) => Number(a?.position) - Number(b?.position)
        ) || [];
      this.mobilePagePostsCount = res?.total;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingMobilePagePosts = false;
    }
  };

  getMobilePagePost = async ({ data }) => {
    this.loadingMobilePagePost = true;
    try {
      let res = await apis.getMobilePagePost(data);
      res = res?.homeSliderMobilePagePost;
      this.mobilePagePost = res;
    } catch (error) {
      this.error = error;
    } finally {
      this.loadingMobilePagePost = false;
    }
  };

  createImage = async ({ data, onSuccess, page }) => {
    this.createImageLoading = true;
    try {
      await apis.createImage(data);
      successToast(
        "Operation Successful!",
        "Homepage Post created Successfully."
      );
      onSuccess?.();
      await this.getImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createImageLoading = false;
    }
  };
  editImage = async ({ data, onSuccess, page }) => {
    this.editImageLoading = true;
    try {
      await apis.editImage(data);
      successToast(
        "Operation Successful!",
        "Homepage Post updated Successfully."
      );
      onSuccess?.();
      await this.getImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editImageLoading = false;
    }
  };

  createHomeSliderImage = async ({ data, onSuccess, page }) => {
    this.createHomeSliderImageLoading = true;
    try {
      await apis.createHomeSliderImage(data);
      successToast(
        "Operation Successful!",
        "Homepage Slider Image created Successfully."
      );
      onSuccess?.();
      await this.getHomeSliderImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createHomeSliderImageLoading = false;
    }
  };
  editHomeSliderImage = async ({ data, onSuccess, page }) => {
    this.editHomeSliderImageLoading = true;
    try {
      await apis.editHomeSliderImage(data);
      successToast(
        "Operation Successful!",
        "Homepage Slider Image updated Successfully."
      );
      onSuccess?.();
      await this.getHomeSliderImages({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editHomeSliderImageLoading = false;
    }
  };

  createMobilePagePost = async ({ data, onSuccess, page }) => {
    this.createMobilePagePostLoading = true;
    try {
      await apis.createMobilePagePost(data);
      successToast(
        "Operation Successful!",
        "Mobile Page Post created Successfully."
      );
      onSuccess?.();
      await this.getHomeSliderMobilePagePosts({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.createMobilePagePostLoading = false;
    }
  };
  editMobilePagePost = async ({ data, onSuccess, page }) => {
    this.editMobilePagePostLoading = true;
    try {
      await apis.editMobilePagePost(data);
      successToast(
        "Operation Successful!",
        "Mobile Page Post updated Successfully."
      );
      onSuccess?.();
      await this.getHomeSliderMobilePagePosts({ data: { page: page || 1 } });
    } catch (error) {
      this.error = error;
    } finally {
      this.editMobilePagePostLoading = false;
    }
  };
}

export default new MediaStore();
