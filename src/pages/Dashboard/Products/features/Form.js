import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Edit } from "assets/icons/Edit/edit.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import { Link, useParams } from "react-router-dom";
import CategoriesStore from "pages/Dashboard/Categories/store";
import BrandsStore from "pages/Dashboard/Brands/store";
import ImagePicker from "components/General/Input/ImagePicker";
import Wysiwyg from "components/General/Textarea/Wysiwyg";
import { numberWithCommas } from "utils/formatter";
import classNames from "classnames";
import { PRODUCT_MODAL_TYPES, RIBBONS } from "utils/appConstant";
import DetailsModal from "./DetailsModal";
import CheckBox from "components/General/Input/CheckBox";
import CategoryDetailsModal from "pages/Dashboard/Categories/features/DetailsModal";
import { observer } from "mobx-react-lite";
import ProductsStore from "../store";
import cleanPayload from "utils/cleanPayload";
import { errorToast } from "components/General/Toast/Toast";
import { isEmpty } from "lodash";
import { flattenCategories } from "utils/functions";
import { uploadImagesToCloud } from "utils/uploadImagesToCloud";

const {
  PRODUCT_OPTION,
  PRODUCT_SUBSCRIPTION,
  PRODUCT_VARIANT,
  PRODUCT_CATEGORY,
  PRODUCT_CATEGORY_OPTIONS,
  DELETE,
} = PRODUCT_MODAL_TYPES;
const Form = ({ details, toggler }) => {
  const { product_id, warehouse_id } = useParams();
  const { createProduct, product, editProduct } = ProductsStore;
  const { getCategories, categories } = CategoriesStore;
  const { brands, getBrands, loading } = BrandsStore;
  const navigate = useNavigate();
  const flattenedCategories = useMemo(
    () => !isEmpty(categories) && flattenCategories(categories),
    [categories]
  );

  const [formTwo, setFormTwo] = useState({
    country: "NG",
    no_limit: product_id && Number(product?.preOrderLimit) ? false : true,
    showFormError: false,
    formModified: false,
    currentProductVariant: {},
    currentProductOption: {},
    currentProductSubscription: {},
    modalDeleteType: null,
    modalDeleteData: null,
    productDescription:
      product_id && product?.productDescription
        ? EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(JSON.parse(product?.productDescription))
            )
          )
        : "",
    howToUse:
      product_id && product?.howToUse
        ? EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(JSON.parse(product?.howToUse))
            )
          )
        : "",
    productIngredients:
      product_id && product?.productIngredients
        ? EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(JSON.parse(product?.productIngredients))
            )
          )
        : "",

    collapsed: [],
    modalType: "",
    createLoading: false,
  });

  useEffect(() => {
    getCategories();
    getBrands({ data: { page: 1 } });
  }, []);

  const schema = yup.object({
    name: yup.string().required("Please enter name"),
  });

  const defaultValues = {
    name: product_id ? product?.name : "",
    brandId: product_id ? product?.brandId : "",
    categoryId: product_id ? product?.categoryId : "",
    ribbon: product_id ? product?.ribbon : "",
    costPrice: product_id ? product?.costPrice : "",
    salePrice: product_id ? product?.salePrice : "",
    discountValue: product_id ? product?.discountValue : "",
    quantity: product_id ? product?.quantity : "",
    weight: product_id ? product?.weight : "",
    lowInQuantityValue: product_id ? product?.lowInQuantityValue : "",
    imageUrls: product_id ? product?.imageUrls : [],
    videoUrls: product_id ? product?.videoUrls : [],
    productDescription: product_id ? product?.productDescription : "",
    howToUse: product_id ? product?.howToUse : "",
    productIngredients: product_id ? product?.productIngredients : "",
    enablePreOrder: product_id ? product?.enablePreOrder : false,
    preOrderMessage: product_id ? product?.preOrderMessage : "",
    preOrderLimit: product_id ? product?.preOrderLimit : "",
    discountType: product_id ? product?.discountType : "",
    productVariants: product_id ? product?.productVariants : [],
    productOptions: product_id ? product?.productOptions : [],
    productSubscriptions: product_id ? product?.productSubscriptions : [],
  };

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const form = {
    name: watch("name"),
    brandId: watch("brandId"),
    categoryId: watch("categoryId"),
    ribbon: watch("ribbon"),
    quantity: watch("quantity"),
    weight: watch("weight"),
    lowInQuantityValue: watch("lowInQuantityValue"),
    productDescription: watch("productDescription"),
    howToUse: watch("howToUse"),
    productIngredients: watch("productIngredients"),
    costPrice: watch("costPrice"),
    salePrice: watch("salePrice"),
    discountValue: watch("discountValue"),
    imageUrls: watch("imageUrls"),
    videoUrls: watch("videoUrls"),
    enablePreOrder: watch("enablePreOrder"),
    preOrderMessage: watch("preOrderMessage"),
    preOrderLimit: watch("preOrderLimit"),
    discountType: watch("discountType"),
    productVariants: watch("productVariants"),
    productOptions: watch("productOptions"),
    productSubscriptions: watch("productSubscriptions"),
  };

  const selectedCategory = useMemo(
    () =>
      !isEmpty(flattenedCategories)
        ? flattenedCategories?.find((item) => item?.id === form?.categoryId)
            ?.name
        : "",
    [flattenedCategories, form?.categoryId]
  );
  const handleChange = async (prop, val, rest, isFormTwo, isWysywyg) => {
    if (
      prop === "discountValue" &&
      form.discountType === "PERCENTAGE" &&
      parseFloat(val) > 100
    ) {
      return;
    }

    isFormTwo
      ? setFormTwo({ ...formTwo, [prop]: val, formModified: true })
      : setFormTwo({ ...formTwo, formModified: true });
    const updatedVal = isWysywyg
      ? JSON.stringify(draftToHtml(convertToRaw(val?.getCurrentContent())))
      : rest
      ? [...val, ...rest]
      : val;
    setValue(prop, updatedVal);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  useEffect(() => {
    if (
      form.discountType === "PERCENTAGE" &&
      parseFloat(form.discountValue) > 100
    ) {
      handleChange("discountValue", "");
    }
  }, [form.discountType, form.discountValue]);

  const removeFile = (file, prop, files) => {
    let updatedFiles = [...files];
    updatedFiles = updatedFiles.filter(
      (_) => (_?.name || _) !== (file?.name || file)
    );
    handleChange(prop, updatedFiles);
  };
  const handleRemoveOption = (val, prop) => {
    if (val?.id) {
      if (prop === "productVariants") {
        setFormTwo({
          ...formTwo,
          modalDeleteType: PRODUCT_VARIANT,
          modalDeleteData: val,
          modalType: DELETE,
        });
        return;
      }
      if (prop === "productOptions") {
        setFormTwo({
          ...formTwo,
          modalDeleteType: PRODUCT_OPTION,
          modalDeleteData: val,
          modalType: DELETE,
        });
        return;
      }
      if (prop === "productSubscriptions") {
        setFormTwo({
          ...formTwo,
          modalDeleteType: PRODUCT_SUBSCRIPTION,
          modalDeleteData: val,
          modalType: DELETE,
        });
        return;
      }
    }
    const newOptions = form?.[prop]?.filter(
      (item) =>
        (item?.name || item?.variantName) !== (val?.name || val?.variantName)
    );
    handleChange(prop, newOptions);
  };

  const handleEditOption = (val, prop) => {
    if (prop === "productVariants") {
      setFormTwo({
        ...formTwo,
        currentProductVariant: val,
        modalType: PRODUCT_VARIANT,
      });
      return;
    }
    if (prop === "productOptions") {
      setFormTwo({
        ...formTwo,
        currentProductOption: val,
        modalType: PRODUCT_OPTION,
      });
      return;
    }
    if (prop === "productSubscriptions") {
      setFormTwo({
        ...formTwo,
        currentProductSubscription: val,
        modalType: PRODUCT_SUBSCRIPTION,
      });
      return;
    }
  };
  const profitMargin =
    form?.costPrice && form?.salePrice ? form?.salePrice - form?.costPrice : "";

  const handleCloseModal = () => {
    setFormTwo({
      ...formTwo,
      currentProductVariant: {},
      modalType: false,
    });
  };
  const handleOnSubmit = async () => {
    handleChangeTwo("createLoading", true);
    const productVariantsImages = product_id
      ? []
      : form?.productVariants?.map((item) => item.imageUrls);
    const productVariantsVideos = product_id
      ? []
      : form?.productVariants?.map((item) => item.videoUrls);
    try {
      const imagesUrls = await Promise.all([
        uploadImagesToCloud(form?.imageUrls),
        uploadImagesToCloud(form?.videoUrls),
        ...productVariantsImages?.map((items) => uploadImagesToCloud(items)),
        ...productVariantsVideos?.map((items) => uploadImagesToCloud(items)),
      ]);

      let productVariants = [];
      if (!product_id) {
        productVariants = form.productVariants?.map((item, i) => {
          return cleanPayload({
            ...item,
            imageUrls: imagesUrls?.[i + 2],
            videoUrls: imagesUrls?.[i + (2 + productVariantsImages?.length)],
          });
        });
      }

      const payload = {
        ...form,
        productVariants,
        imageUrls: imagesUrls?.[0],
        videoUrls: imagesUrls?.[1],
        lowInQuantityValue: form?.lowInQuantityValue || "0",
        preOrderLimit: form?.preOrderLimit || "0",
        ...(product_id && {
          productId: product_id,
          productVariants: null,
          productOptions: null,
          productSubscriptions: null,
        }),
      };
      cleanPayload(payload);

      if (product_id) {
        await editProduct({
          data: payload,
          onSuccess: () => navigate(`/dashboard/products/${warehouse_id}`),
        });
      } else {
        await createProduct({
          data: payload,
          onSuccess: () => navigate(`/dashboard/products/${warehouse_id}`),
        });
      }
    } catch (error) {
      console.log("error: ", error);
      errorToast(
        "Error!",
        "Error encountered uploading images. Kindly Check the image format."
      );
    } finally {
      handleChangeTwo("createLoading", false);
    }
  };

  console.log("main form: ", form);
  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="mb-5">
            <Link
              to={`/dashboard/products/${warehouse_id}`}
              className="scale-90"
            >
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mb-5">
            <Close />
          </button>
        )}

        {!product_id ? (
          <h2 className="section-heading my-8 text-xl">Add New Product</h2>
        ) : (
          <h2 className="section-heading my-8 text-xl  ">Edit Product</h2>
        )}

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col md:flex-row justify-start items-start gap-10 w-full overflow-y-auto"
        >
          {/* First section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto">
            <span className="text-grey-text text-lg uppercase">
              Product info
            </span>

            <Input
              label="Product Name"
              value={form?.name}
              onChangeFunc={(val) => handleChange("name", val)}
              placeholder="Enter Product Name"
              formError={errors.name}
              showFormError={formTwo?.showFormError}
              isRequired
            />
            <Select
              label="Product Brand"
              placeholder="Select Product Brand"
              options={brands}
              onChange={(val) => handleChange("brandId", val?.value)}
              value={brands?.find((item) => item?.value === form?.brandId)}
              formError={errors.brandId}
              showFormError={formTwo?.showFormError}
              isLoading={loading}
              fullWidth
              isRequired
            />

            <div className="flex flex-col justify-start items-end gap-1 w-full">
              {form?.categoryId && <p>{selectedCategory}</p>}
              <Button
                onClick={() =>
                  handleChangeTwo("modalType", PRODUCT_CATEGORY_OPTIONS)
                }
                text="Select Category"
                icon={<Plus className="text-black current-svg" />}
                className=""
                whiteBg
                fullWidth
              />
              <span
                onClick={() => handleChangeTwo("modalType", PRODUCT_CATEGORY)}
                className="text-sm text-blue flex justify-start items-center gap-1 cursor-pointer"
              >
                <Plus className="text-blue current-svg w-[16px]" /> Create
                Category
              </span>
              <div className="h-[13px]">
                {errors?.categoryId && (
                  <FormErrorMessage type={errors?.categoryId} />
                )}
              </div>
            </div>

            <Select
              label="Ribbon"
              placeholder="Select Ribbon"
              options={RIBBONS}
              onChange={(val) => handleChange("ribbon", val?.value)}
              value={RIBBONS?.find((item) => item.value === form.ribbon)}
              formError={errors.ribbon}
              showFormError={formTwo?.showFormError}
              tooltip="Ribbon to be attached with this product"
              fullWidth
            />
            <Input
              label="Quantity"
              value={form?.quantity}
              onChangeFunc={(val) => handleChange("quantity", val)}
              placeholder="Enter Quantity"
              formError={errors.quantity}
              showFormError={formTwo?.showFormError}
              type="number"
              isRequired
            />
            <Input
              label="Weight (grams)"
              value={form?.weight}
              onChangeFunc={(val) => handleChange("weight", val)}
              placeholder="30g"
              formError={errors.weight}
              showFormError={formTwo?.showFormError}
              suffix={"g"}
              type="number"
              isRequired
            />
            <Input
              label="Low in stock value (optional)"
              value={form?.lowInQuantityValue}
              onChangeFunc={(val) => handleChange("lowInQuantityValue", val)}
              placeholder="10"
              formError={errors.lowInQuantityValue}
              showFormError={formTwo?.showFormError}
              type="number"
              tooltip="When quantity is at this value, the product will be low in stock."
            />

            <Wysiwyg
              label="Product Description"
              editorState={formTwo.productDescription}
              onEditorStateChange={(val) => {
                handleChange("productDescription", val, false, true, true);
              }}
              placeholder="Enter Product Description"
              formError={errors.productDescription}
              showFormError={formTwo?.showFormError}
            />
            <Wysiwyg
              label="How To Use"
              editorState={formTwo.howToUse}
              onEditorStateChange={(val) => {
                handleChange("howToUse", val, false, true, true);
              }}
              placeholder="Enter How To Use"
              formError={errors.howToUse}
              showFormError={formTwo?.showFormError}
            />
            <Wysiwyg
              label="Product Ingredients"
              editorState={formTwo.productIngredients}
              onEditorStateChange={(val) => {
                handleChange("productIngredients", val, false, true, true);
              }}
              placeholder="List Product Ingredients"
              formError={errors.productIngredients}
              showFormError={formTwo?.showFormError}
            />
          </div>
          {/* Second section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto">
            <span className="text-grey-text text-lg uppercase">Pricing</span>
            <Input
              label="Cost Price (₦‎)"
              value={form?.costPrice}
              onChangeFunc={(val) => handleChange("costPrice", val)}
              placeholder="Enter Cost Price"
              formError={errors.costPrice}
              showFormError={formTwo?.showFormError}
              prefix={"₦‎"}
              type="number"
              isRequired
            />

            <Input
              label="Sale Price (₦‎)"
              labelControl={
                profitMargin && (
                  <span
                    className={classNames("text-sm", {
                      "text-red": profitMargin < 0,
                      "text-green": profitMargin > 0,
                      "text-grey-text": profitMargin === 0,
                    })}
                  >{`${
                    profitMargin < 0 ? "Loss" : "Profit"
                  }: ₦${numberWithCommas(profitMargin)}`}</span>
                )
              }
              value={form?.salePrice}
              onChangeFunc={(val) => handleChange("salePrice", val)}
              placeholder="Enter Sale Price"
              formError={errors.salePrice}
              showFormError={formTwo?.showFormError}
              prefix={"₦‎"}
              tooltip="Selling price of this product"
              type="number"
              isRequired
            />
            <div className="flex flex-col md:flex-row justify-center items-center w-full gap-3 md:gap-6">
              <Input
                label="Discount"
                value={form?.discountValue}
                onChangeFunc={(val) => handleChange("discountValue", val)}
                placeholder="Enter Discount"
                formError={errors.discountValue}
                showFormError={formTwo?.showFormError}
                prefix={form.discountType === "FIXED" ? "₦" : ""}
                suffix={form.discountType === "PERCENTAGE" ? "%" : ""}
                tooltip="Discount"
                type="number"
                isDisabled={!form?.discountType}
              />
              <div className="flex justify-center items-center w-full gap-6">
                <CheckBox
                  label="₦"
                  onChange={() =>
                    handleChange(
                      "discountType",
                      form.discountType !== "FIXED" ? "FIXED" : ""
                    )
                  }
                  checked={form.discountType === "FIXED"}
                />

                <CheckBox
                  label="%"
                  onChange={() =>
                    handleChange(
                      "discountType",
                      form.discountType !== "PERCENTAGE" ? "PERCENTAGE" : ""
                    )
                  }
                  checked={form.discountType === "PERCENTAGE"}
                />
              </div>
            </div>
            <hr className="w-full" />
            <span className="text-grey-text text-lg uppercase">
              Images & Videos
            </span>
            <ImagePicker
              isRequired
              label=" Add Product Image "
              showFormError={formTwo?.showFormError && errors.imageUrls}
              handleDrop={(val) =>
                handleChange("imageUrls", val, form.imageUrls)
              }
              images={form.imageUrls}
              removeImage={(file) =>
                removeFile(file, "imageUrls", form.imageUrls)
              }
              multiple
            />
            <ImagePicker
              label=" Add Product Videos "
              showFormError={formTwo?.showFormError && errors.videoUrls}
              handleDrop={(val) =>
                handleChange("videoUrls", val, form.videoUrls)
              }
              images={form.videoUrls}
              removeImage={(file) =>
                removeFile(file, "videoUrls", form.videoUrls)
              }
              placeholder="Drag 'n' drop some videos here, or click to select videos"
              type="video"
              multiple
            />
          </div>
          {/* Third section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto">
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">
                Pre-order
              </span>
              <span className="text-grey-text text-sm">
                Let customers buy this product before it's released or when it's
                out of stock
              </span>
            </div>

            <CheckBox
              label="Enable Pre-order"
              square
              tooltip="Let customers buy this product before it's released or when it's out of stock"
              onChange={() =>
                handleChange("enablePreOrder", !form.enablePreOrder)
              }
              checked={form.enablePreOrder}
            />

            {form.enablePreOrder && (
              <>
                <Input
                  label="Pre-order Message"
                  value={form?.preOrderMessage}
                  onChangeFunc={(val) => handleChange("preOrderMessage", val)}
                  placeholder="Eg: Expected to ship by the end of june"
                  formError={errors.preOrderMessage}
                  showFormError={formTwo?.showFormError}
                  tooltip="Tell customers when this product will be shipped or delivered"
                />

                <div className="flex flex-col justify-start items-start">
                  <label
                    className={
                      "general-input-label mb-1 relative text-[13px] font-bold text-grey-dark !flex justify-start items-center gap-1 cursor-pointer"
                    }
                  >
                    Pre-order Limit
                  </label>

                  <span className="text-grey-text text-sm mb-3">
                    Limit the total number of items available for pre-order. If
                    this product has variants, the limit will apply to each one
                    individually
                  </span>
                  <CheckBox
                    label="No Limit"
                    onChange={() =>
                      handleChangeTwo("no_limit", !formTwo.no_limit)
                    }
                    checked={formTwo.no_limit}
                  />
                  <div className="flex justify-start items-center gap-8 mt-3">
                    <CheckBox
                      label="Limit to"
                      onChange={() =>
                        handleChangeTwo("no_limit", !formTwo.no_limit)
                      }
                      checked={!formTwo.no_limit}
                    />

                    {!formTwo.no_limit && (
                      <div className="">
                        <Input
                          value={form?.preOrderLimit}
                          onChangeFunc={(val) =>
                            handleChange("preOrderLimit", val)
                          }
                          placeholder="10"
                          formError={errors.preOrderLimit}
                          showFormError={formTwo?.showFormError}
                          type="number"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            {product_id && (
              <Button
                onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
                type="submit"
                text={!product_id ? "Add New Product" : "Save Changes"}
                isLoading={formTwo.createLoading}
                className="mt-10 mb-5 "
                fullWidth
              />
            )}
            <hr className="w-full" />
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">Variants</span>
              <span className="text-grey-text text-sm">
                Add variants of this product and configure their prices and
                quantity
              </span>
            </div>

            {!isEmpty(form.productVariants) && (
              <div className="flex flex-wrap justify-start items-start gap-2 ">
                {form.productVariants?.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="flex gap-3 w-fit justify-between items-center border-1/2 border-grey-border p-2 text-sm bg-white"
                    >
                      <div className="flex justify-start items-center gap-3 ">
                        <span className="">{item?.variantName}</span>
                      </div>
                      {product_id && (
                        <span
                          onClick={() =>
                            handleEditOption(item, "productVariants")
                          }
                          className="hover:bg-red-300 text-black hover:text-white transition-colors duration-300 ease-in-out cursor-pointer p-1"
                        >
                          <Edit className="current-svg scale-[0.9]" />
                        </span>
                      )}
                      <span
                        onClick={() =>
                          handleRemoveOption(item, "productVariants")
                        }
                        className="hover:bg-red-300 hover:text-white transition-colors duration-300 ease-in-out cursor-pointer"
                      >
                        <Close className="current-svg scale-[0.7]" />
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <Button
              onClick={() => handleChangeTwo("modalType", PRODUCT_VARIANT)}
              text="Add Variant"
              icon={<Plus className="text-black current-svg" />}
              className=""
              whiteBg
              fullWidth
            />
            <hr className="w-full" />
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">
                Product Options
              </span>
              <span className="text-grey-text text-sm">
                Manage the options this product comes in.
              </span>
            </div>
            {!isEmpty(form.productOptions) && (
              <div className="flex flex-wrap justify-start items-start gap-2 ">
                {form.productOptions?.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="flex gap-3 w-fit justify-between items-center border-1/2 border-grey-border p-2 text-sm bg-white"
                    >
                      <div className="flex justify-start items-center gap-3 ">
                        <span className="">{item?.name}</span>
                        <span className=" text-red">
                          {item?.choices?.length}{" "}
                          {item?.choices?.length > 1 ? "choices" : "choice"}
                        </span>
                      </div>
                      {product_id && (
                        <span
                          onClick={() =>
                            handleEditOption(item, "productOptions")
                          }
                          className="hover:bg-red-300 text-black hover:text-white transition-colors duration-300 ease-in-out cursor-pointer p-1"
                        >
                          <Edit className="current-svg scale-[0.9]" />
                        </span>
                      )}
                      <span
                        onClick={() =>
                          handleRemoveOption(item, "productOptions")
                        }
                        className="hover:bg-red-300 hover:text-white transition-colors duration-300 ease-in-out cursor-pointer"
                      >
                        <Close className="current-svg scale-[0.7]" />
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <Button
              onClick={() => handleChangeTwo("modalType", PRODUCT_OPTION)}
              text="Add Product Option"
              icon={<Plus className="text-black current-svg" />}
              className=""
              whiteBg
              fullWidth
            />
            <hr className="w-full" />
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">
                Subscriptions
              </span>
              <span className="text-grey-text text-sm">
                Easily offer this product on a recurring basis with
                subscriptions
              </span>
            </div>

            {!isEmpty(form.productSubscriptions) && (
              <div className="flex flex-wrap justify-start items-start gap-2 ">
                {form.productSubscriptions?.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="flex gap-3 w-fit justify-between items-center border-1/2 border-grey-border p-2 text-sm bg-white"
                    >
                      <div className="flex justify-start items-center gap-3 ">
                        <span className="">{item?.name}</span>
                        <span className=" text-red">
                          {item?.subscriptionFrequency}{" "}
                          {item?.subscriptionDuration}
                        </span>
                      </div>

                      {product_id && (
                        <span
                          onClick={() =>
                            handleEditOption(item, "productSubscriptions")
                          }
                          className="hover:bg-red-300 text-black hover:text-white transition-colors duration-300 ease-in-out cursor-pointer p-1"
                        >
                          <Edit className="current-svg scale-[0.9]" />
                        </span>
                      )}

                      <span
                        onClick={() =>
                          handleRemoveOption(item, "productSubscriptions")
                        }
                        className="hover:bg-red-300 hover:text-white transition-colors duration-300 ease-in-out cursor-pointer"
                      >
                        <Close className="current-svg scale-[0.7]" />
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            <Button
              onClick={() => handleChangeTwo("modalType", PRODUCT_SUBSCRIPTION)}
              text="Add Subscription"
              icon={<Plus className="text-black current-svg" />}
              className=""
              whiteBg
              fullWidth
            />
            {!product_id && (
              <Button
                onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
                type="submit"
                text={!product_id ? "Add New Product" : "Save Changes"}
                isLoading={formTwo.createLoading}
                className="mt-10 mb-5 "
                fullWidth
              />
            )}
          </div>
        </form>
      </div>
      <DetailsModal
        active={formTwo?.modalType === PRODUCT_OPTION}
        details={{
          modalType: PRODUCT_OPTION,
          currentProductOption: formTwo.currentProductOption,
        }}
        toggler={handleCloseModal}
        handleChange={handleChange}
        form={form}
      />
      <DetailsModal
        active={formTwo?.modalType === PRODUCT_VARIANT}
        details={{
          modalType: PRODUCT_VARIANT,
          currentProductVariant: formTwo.currentProductVariant,
        }}
        toggler={handleCloseModal}
        handleChange={handleChange}
        form={form}
      />

      <DetailsModal
        active={formTwo?.modalType === PRODUCT_SUBSCRIPTION}
        details={{
          modalType: PRODUCT_SUBSCRIPTION,
          currentProductSubscription: formTwo.currentProductSubscription,
        }}
        toggler={handleCloseModal}
        handleChange={handleChange}
        form={form}
      />
      <DetailsModal
        active={formTwo?.modalType === PRODUCT_CATEGORY_OPTIONS}
        details={{ modalType: PRODUCT_CATEGORY_OPTIONS }}
        toggler={handleCloseModal}
        handleChange={handleChange}
        form={form}
      />

      <DetailsModal
        active={formTwo?.modalType === DELETE}
        details={{
          modalType: DELETE,
          modalDeleteType: formTwo.modalDeleteType,
          modalDeleteData: formTwo.modalDeleteData,
        }}
        toggler={handleCloseModal}
      />
      <CategoryDetailsModal
        active={formTwo?.modalType === PRODUCT_CATEGORY}
        details={{ modalType: "add", isAdd: true }}
        toggler={handleCloseModal}
      />
    </>
  );
};

Form.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};

export default observer(Form);
