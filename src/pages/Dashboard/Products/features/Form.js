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
import { useParams } from "react-router-dom";
import CategoriesStore from "pages/Dashboard/Categories/store";
import BrandsStore from "pages/Dashboard/Brands/store";
import ImagePicker from "components/General/Input/ImagePicker";
import Wysiwyg from "components/General/Textarea/Wysiwyg";
import { numberWithCommas } from "utils/formatter";
import classNames from "classnames";
import {
  CENTRAL_WAREHOUSE_ID,
  PRODUCT_MODAL_TYPES,
  RIBBONS,
  WEIGHT_TYPES,
} from "utils/appConstant";
import DetailsModal from "./DetailsModal";
import CheckBox from "components/General/Input/CheckBox";
import CategoryDetailsModal from "pages/Dashboard/Categories/features/DetailsModal";
import { observer } from "mobx-react-lite";
import ProductsStore from "../store";
import cleanPayload from "utils/cleanPayload";
import { errorToast, warningToast } from "components/General/Toast/Toast";
import { flatMap, isEmpty } from "lodash";
import { flattenCategories } from "utils/functions";
import { uploadImagesToCloud } from "utils/uploadImagesToCloud";
import WareHousesStore from "pages/Dashboard/WareHouses/store";
import { FormErrorMessage } from "components/General/FormErrorMessage";
const {
  PRODUCT_OPTION,
  PRODUCT_SUBSCRIPTION,
  PRODUCT_VARIANT,
  PRODUCT_CATEGORY,
  PRODUCT_CATEGORY_OPTIONS,
  INVENTORY,
  DELETE,
} = PRODUCT_MODAL_TYPES;
const { grams, milliliters } = WEIGHT_TYPES;
const Form = ({ details, toggler }) => {
  const { product_id } = useParams();
  const { createProduct, product, editProduct, editProductOption } =
    ProductsStore;
  const { getCategories, categories } = CategoriesStore;
  const { brands, getBrands, loading } = BrandsStore;
  const { warehouses, getWarehouses } = WareHousesStore;
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
    currentProductInventory: {},
    modalDeleteType: null,
    modalDeleteData: null,
    productOptionId: "",
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
    getWarehouses({ data: { page: 1 } });
  }, []);

  const schema = yup.object({
    name: yup.string().required("Please enter name"),
    warehouseInventory: yup.array().of(
      yup.object().shape({
        quantity: yup
          .number()
          .required("Quantity is required")
          .integer("Quantity must be an integer")
          .min(1, "Quantity must be greater than 0"),
        lowInQuantityValue: yup
          .number()
          .required("Low in Stock Value is required")
          .integer("Low in Stock Value must be an integer")
          .min(1, "Low in Stock Value must be greater than 0"),
      })
    ),
    categoryIds: yup
      .array()
      .min(1, "Select at least one category for this product")
      .required("Select at least one category for this product"),
    imageUrls: yup
      .array()
      .min(1, "Please select images for this product")
      .required("Please select images for this product"),
  });

  const defaultValues = {
    name: product_id ? product?.name : "",
    brandId: product_id ? product?.brandId : "",
    categoryIds: product_id ? product?.categories?.map((item) => item?.id) : [],
    ribbon: product_id ? product?.ribbon : "",
    costPrice: product_id ? product?.costPrice : "",
    salePrice: product_id ? product?.salePrice : "",
    discountValue: product_id ? product?.discountValue : "",
    // quantity: product_id ? product?.quantity : "",
    weight: product_id ? product?.weight : "",
    weightType: product_id ? product?.weightType : milliliters,
    // lowInQuantityValue: product_id ? product?.lowInQuantityValue : "",
    imageUrls: product_id ? product?.imageUrls : [],
    videoUrls: product_id ? product?.videoUrls : [],
    productDescription: product_id ? product?.productDescription : "",
    howToUse: product_id ? product?.howToUse : "",
    productIngredients: product_id ? product?.productIngredients : "",
    enablePreOrder: product_id ? product?.enablePreOrder : false,
    isDiscountAllowed: product_id ? product?.isDiscountAllowed : false,
    preOrderMessage: product_id ? product?.preOrderMessage : "",
    preOrderLimit: product_id ? product?.preOrderLimit : "",
    discountType: product_id ? product?.discountType : "",
    productVariants: product_id ? product?.productVariants : [],
    productOptions: product_id ? product?.productOptions : [],
    productSubscriptions: product_id ? product?.productSubscriptions : [],
    warehouseInventory: product_id
      ? product?.warehouseInventory
      : [
          {
            lowInQuantityValue: 0,
            quantity: 0,
            warehouseId: CENTRAL_WAREHOUSE_ID,
          },
        ],
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
    categoryIds: watch("categoryIds"),
    ribbon: watch("ribbon"),
    // quantity: watch("quantity"),
    weight: watch("weight"),
    // lowInQuantityValue: watch("lowInQuantityValue"),
    productDescription: watch("productDescription"),
    howToUse: watch("howToUse"),
    productIngredients: watch("productIngredients"),
    costPrice: watch("costPrice"),
    salePrice: watch("salePrice"),
    discountValue: watch("discountValue"),
    imageUrls: watch("imageUrls"),
    videoUrls: watch("videoUrls"),
    enablePreOrder: watch("enablePreOrder"),
    isDiscountAllowed: watch("isDiscountAllowed"),
    preOrderMessage: watch("preOrderMessage"),
    preOrderLimit: watch("preOrderLimit"),
    discountType: watch("discountType"),
    weightType: watch("weightType"),
    productVariants: watch("productVariants"),
    productOptions: watch("productOptions"),
    productSubscriptions: watch("productSubscriptions"),
    warehouseInventory: watch("warehouseInventory"),
  };

  const selectedCategories = useMemo(
    () =>
      !isEmpty(flattenedCategories)
        ? flattenedCategories?.filter((item) =>
            form?.categoryIds?.includes(item?.id)
          )
        : "",
    [flattenedCategories, form?.categoryIds]
  );

  const selectedInventories = useMemo(
    () =>
      !isEmpty(warehouses)
        ? form?.warehouseInventory
            ?.map((item) => {
              const warehouseName = warehouses?.find(
                (_) => _.id === item?.warehouseId
              );
              if (item?.warehouseId !== CENTRAL_WAREHOUSE_ID)
                return { ...item, name: warehouseName?.name };
            })
            ?.filter((item) => item)
        : [],
    [warehouses, form?.warehouseInventory]
  );
  const handleChange = async ({
    prop,
    val,
    rest,
    isFormTwo,
    isWysywyg,
    isInventory,
    objectProp,
  }) => {
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
    let updatedVal;
    if (isInventory) {
      updatedVal = form?.warehouseInventory?.map((item) => {
        const updatedItem =
          item?.warehouseId === CENTRAL_WAREHOUSE_ID
            ? { ...item, [objectProp]: val }
            : item;
        return updatedItem;
      });
    } else if (isWysywyg) {
      updatedVal = JSON.stringify(
        draftToHtml(convertToRaw(val?.getCurrentContent()))
      );
    } else if (rest) {
      updatedVal = [...rest, ...val];
    } else {
      updatedVal = val;
    }

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
      handleChange({ prop: "discountValue", val: "" });
    }
  }, [form.discountType, form.discountValue]);

  const removeFile = (file, prop, files) => {
    let updatedFiles = [...files];
    updatedFiles = updatedFiles.filter(
      (_) => (_?.name || _) !== (file?.name || file)
    );
    handleChange({ prop, val: updatedFiles });
  };
  const handleRemoveOption = (val, prop) => {
    if (val?.id && prop !== "categoryIds") {
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

      if (prop === "warehouseInventory") {
        setFormTwo({
          ...formTwo,
          modalDeleteType: INVENTORY,
          modalDeleteData: val,
          modalType: DELETE,
        });
        return;
      }
    }
    console.log("val, prop: ", val, prop);
    const newOptions = form?.[prop]?.filter(
      (item) =>
        (item?.id ||
          item?.name ||
          item?.variantName ||
          item?.warehouseId ||
          item) !==
        (val?.warehouseId || val?.id || val?.name || val?.variantName)
    );
    handleChange({ prop, val: newOptions });
  };

  const handleEditOption = (val, prop, rest) => {
    if (prop === "productVariants") {
      setFormTwo({
        ...formTwo,
        currentProductVariant: val,
        currentProductOption: rest,
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
    if (prop === "warehouseInventory") {
      setFormTwo({
        ...formTwo,
        currentProductInventory: val,
        modalType: INVENTORY,
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
      currentProductOption: {},
      modalType: false,
    });
  };

  const handleSubmitProductOption = async (option) => {
    console.log("option: ", option);
    handleChangeTwo("productOptionId", option?.id);
    const payload = { ...option, id: "" };
    cleanPayload(payload);
    await editProductOption({
      product_id,
      data: payload,
      onSuccess: () => navigate(-1),
    });

    handleChangeTwo("productOptionId", "");
  };
  const handleOnSubmit = async () => {
    const flattenedProductChoices = flatMap(
      form.productOptions,
      (item) => item.choices
    );

    const mainChoice = flattenedProductChoices?.find((item) => item?.main);
    if (!isEmpty(form.productOptions) && !mainChoice) {
      errorToast(
        "Erorr",
        "One of the product options choices must be checked as main"
      );

      return;
    }
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
        // lowInQuantityValue: form?.lowInQuantityValue || "0",
        preOrderLimit: form?.preOrderLimit || "0",
        ...(product_id && {
          productId: product_id,
          productVariants: null,
          productOptions: null,
          productSubscriptions: null,
        }),
      };
      console.log("payload: ", payload);
      cleanPayload(payload);

      if (product_id) {
        await editProduct({
          data: payload,
          onSuccess: () => navigate(-1),
        });
      } else {
        await createProduct({
          data: payload,
          onSuccess: () => navigate(-1),
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
  console.log("main form errors: ", errors);
  console.log("selectedInventories: ", selectedInventories);
  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="mb-5 w-full flex justify-start">
            <div
              onClick={() => navigate(-1)}
              className="scale-90 cursor-pointer"
            >
              <ArrowBack />
            </div>
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
              onChangeFunc={(val) => handleChange({ prop: "name", val })}
              placeholder="Enter Product Name"
              formError={errors.name}
              showFormError={formTwo?.showFormError}
              isRequired
            />
            <Select
              label="Product Brand"
              placeholder="Select Product Brand"
              options={brands}
              onChange={(val) =>
                handleChange({ prop: "brandId", val: val?.value })
              }
              value={brands?.find((item) => item?.value === form?.brandId)}
              formError={errors.brandId}
              showFormError={formTwo?.showFormError}
              isLoading={loading}
              fullWidth
              isRequired
            />

            <Select
              label="Ribbon"
              placeholder="Select Ribbon"
              options={RIBBONS}
              onChange={(val) =>
                handleChange({ prop: "ribbon", val: val?.value })
              }
              value={RIBBONS?.find((item) => item.value === form.ribbon)}
              formError={errors.ribbon}
              showFormError={formTwo?.showFormError}
              tooltip="Ribbon to be attached with this product"
              fullWidth
            />

            <div className="flex flex-col md:flex-row justify-center items-center w-full gap-3 md:gap-6">
              <Input
                label="Weight"
                value={form?.weight}
                onChangeFunc={(val) => handleChange({ prop: "weight", val })}
                placeholder="Enter Weight"
                formError={errors.weight}
                showFormError={formTwo?.showFormError}
                suffix={form.weightType === grams ? "g" : "ml"}
                isRequired
                tooltip="Weight in millimeters or grams"
                type="number"
                isDisabled={!form?.weightType}
              />
              <div className="flex justify-center items-center w-full gap-6">
                <CheckBox
                  label="ml"
                  onChange={() =>
                    handleChange({
                      prop: "weightType",
                      val: form.weightType !== milliliters ? milliliters : "",
                    })
                  }
                  checked={form.weightType === milliliters}
                />

                <CheckBox
                  label="g"
                  onChange={() =>
                    handleChange({
                      prop: "weightType",
                      val: form.weightType !== grams ? grams : "",
                    })
                  }
                  checked={form.weightType === grams}
                />
              </div>
            </div>
            <Wysiwyg
              label="Product Description"
              editorState={formTwo.productDescription}
              onEditorStateChange={(val) => {
                handleChange({
                  prop: "productDescription",
                  val,
                  isFormTwo: true,
                  isWysywyg: true,
                });
              }}
              placeholder="Enter Product Description"
              formError={errors.productDescription}
              showFormError={formTwo?.showFormError}
            />
            <Wysiwyg
              label="How To Use"
              editorState={formTwo.howToUse}
              onEditorStateChange={(val) => {
                handleChange({
                  prop: "howToUse",
                  val,
                  isFormTwo: true,
                  isWysywyg: true,
                });
              }}
              placeholder="Enter How To Use"
              formError={errors.howToUse}
              showFormError={formTwo?.showFormError}
            />
            <Wysiwyg
              label="Product Ingredients"
              editorState={formTwo.productIngredients}
              onEditorStateChange={(val) => {
                handleChange({
                  prop: "productIngredients",
                  val,
                  isFormTwo: true,
                  isWysywyg: true,
                });
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
              onChangeFunc={(val) => handleChange({ prop: "costPrice", val })}
              placeholder="Enter Cost Price"
              formError={errors.costPrice}
              showFormError={formTwo?.showFormError}
              prefix={"₦‎"}
              type="number"
              isRequired
              isDisabled={!!product_id}
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
              onChangeFunc={(val) => handleChange({ prop: "salePrice", val })}
              placeholder="Enter Sale Price"
              formError={errors.salePrice}
              showFormError={formTwo?.showFormError}
              prefix={"₦‎"}
              tooltip="Selling price of this product"
              type="number"
              isRequired
            />

            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">Discount</span>
              <span className="text-grey-text text-sm">
                Enable discount to apply discount to this product now or later
                in the future.
              </span>
            </div>

            <CheckBox
              label="Enable Discount"
              square
              tooltip="Enable discount to apply discount to this product now or later in the future."
              onChange={() =>
                handleChange({
                  prop: "isDiscountAllowed",
                  val: !form.isDiscountAllowed,
                })
              }
              checked={form.isDiscountAllowed}
            />
            {/* {form.isDiscountAllowed && (
              <div className="flex flex-col md:flex-row justify-center items-center w-full gap-3 md:gap-6">
                <Input
                  label="Discount"
                  value={form?.discountValue}
                  onChangeFunc={(val) =>
                    handleChange({ prop: "discountValue", val })
                  }
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
                      handleChange({
                        prop: "discountType",
                        val: form.discountType !== "FIXED" ? "FIXED" : "",
                      })
                    }
                    checked={form.discountType === "FIXED"}
                  />

                  <CheckBox
                    label="%"
                    onChange={() =>
                      handleChange({
                        prop: "discountType",
                        val:
                          form.discountType !== "PERCENTAGE"
                            ? "PERCENTAGE"
                            : "",
                      })
                    }
                    checked={form.discountType === "PERCENTAGE"}
                  />
                </div>
              </div>
            )} */}
            <hr className="w-full" />
            <span className="text-grey-text text-lg uppercase">
              Images & Videos
            </span>
            <ImagePicker
              isRequired
              label=" Add Product Image "
              formError={errors.imageUrls}
              showFormError={formTwo?.showFormError && errors.imageUrls}
              handleDrop={(val) =>
                handleChange({ prop: "imageUrls", val, rest: form.imageUrls })
              }
              images={form.imageUrls}
              setImages={(imgs) => {
                handleChange({ prop: "imageUrls", val: imgs });
              }}
              removeImage={(file) =>
                removeFile(file, "imageUrls", form.imageUrls)
              }
              multiple
            />
            <ImagePicker
              label=" Add Product Videos "
              showFormError={formTwo?.showFormError && errors.videoUrls}
              handleDrop={(val) =>
                handleChange({ prop: "videoUrls", val, rest: form.videoUrls })
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
                handleChange({
                  prop: "enablePreOrder",
                  val: !form.enablePreOrder,
                })
              }
              checked={form.enablePreOrder}
            />

            {form.enablePreOrder && (
              <>
                <Input
                  label="Pre-order Message"
                  value={form?.preOrderMessage}
                  onChangeFunc={(val) =>
                    handleChange({ prop: "preOrderMessage", val })
                  }
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
                            handleChange({ prop: "preOrderLimit", val })
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

            <div className="flex flex-col justify-start items-end gap-1 w-full">
              {!isEmpty(selectedCategories) && (
                <div className="flex flex-wrap justify-start items-start gap-2 ">
                  {selectedCategories?.map((item, i) => {
                    return (
                      <div
                        key={i}
                        className="flex gap-3 w-fit justify-between items-center border-1/2 border-grey-border p-2 text-sm bg-white"
                      >
                        <div className="flex justify-start items-center gap-3 ">
                          <span className="">{item?.name}</span>
                        </div>

                        <span
                          onClick={() =>
                            handleRemoveOption(item, "categoryIds")
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
                onClick={() =>
                  handleChangeTwo("modalType", PRODUCT_CATEGORY_OPTIONS)
                }
                text="Select Categories"
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
                {errors?.categoryIds && (
                  <FormErrorMessage type={errors?.categoryIds} />
                )}
              </div>
            </div>

            <hr className="w-full" />
            {!product_id && (
              <>
                <div className="flex flex-col justify-start items-start gap-1">
                  <span className="text-grey-text text-lg uppercase">
                    Inventory
                  </span>
                  <span className="text-grey-text text-sm">
                    Add inventory details for this product here. The default
                    quantity field is required for the central warehouse. Hit
                    'Add Inventory' to add inventory for other warehouses.
                  </span>
                </div>

                <Input
                  label="Central warehouse Product Quantity"
                  value={form?.warehouseInventory?.[0]?.quantity}
                  onChangeFunc={(val) =>
                    handleChange({
                      prop: "warehouseInventory",
                      objectProp: "quantity",
                      val: val,
                      isInventory: true,
                    })
                  }
                  placeholder="Enter Quantity"
                  formError={errors?.warehouseInventory?.[0]?.quantity}
                  showFormError={formTwo?.showFormError}
                  type="number"
                  isRequired
                />

                <Input
                  label="Central Warehouse Product Low in Stock Value"
                  value={form?.warehouseInventory?.[0]?.lowInQuantityValue}
                  onChangeFunc={(val) =>
                    handleChange({
                      prop: "warehouseInventory",
                      objectProp: "lowInQuantityValue",
                      val: val,
                      isInventory: true,
                    })
                  }
                  placeholder="10"
                  showFormError={formTwo?.showFormError}
                  formError={
                    errors?.warehouseInventory?.[0]?.lowInQuantityValue
                  }
                  type="number"
                  tooltip="When quantity is at this value, the product will be low in stock."
                />

                {!isEmpty(selectedInventories) && (
                  <div className="flex flex-wrap justify-start items-start gap-2 ">
                    {selectedInventories?.map((item, i) => {
                      return (
                        <div
                          key={i}
                          className="flex gap-3 w-fit justify-between items-center border-1/2 border-grey-border p-2 text-sm bg-white"
                        >
                          <div className="flex justify-start items-center gap-3 ">
                            <span className="">{item?.name}</span>{" "}
                            <span className="text-red-deep">
                              x{item?.quantity}
                            </span>
                          </div>
                          {product_id && (
                            <span
                              onClick={() =>
                                handleEditOption(item, "warehouseInventory")
                              }
                              className="hover:bg-red-300 text-black hover:text-white transition-colors duration-300 ease-in-out cursor-pointer p-1"
                            >
                              <Edit className="current-svg scale-[0.9]" />
                            </span>
                          )}
                          <span
                            onClick={() =>
                              handleRemoveOption(item, "warehouseInventory")
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
                  onClick={() => handleChangeTwo("modalType", INVENTORY)}
                  text="Add Inventory"
                  icon={<Plus className="text-black current-svg" />}
                  className=""
                  whiteBg
                  fullWidth
                />
                <hr className="w-full" />
              </>
            )}

            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">
                Product Options
              </span>
              <span className="text-grey-text text-sm">
                Manage the options this product comes in.
              </span>
            </div>
            {!isEmpty(form.productOptions) && (
              <div className="flex flex-wrap justify-start items-start gap-2 w-full">
                {form.productOptions?.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="flex flex-col gap-3 w-full justify-start items-start"
                    >
                      <div className="w-full flex justify-between items-center bg-white border-1/2 border-grey-border p-2 gap-2">
                        <span className="font-bold text-red w-full">
                          {item?.name}
                        </span>

                        <span
                          onClick={() =>
                            handleEditOption(item, "productOptions")
                          }
                          className="hover:bg-red-300 text-black hover:text-white transition-colors duration-300 ease-in-out cursor-pointer p-1 text-sm underline"
                        >
                          Edit
                        </span>
                        <span
                          onClick={() =>
                            handleRemoveOption(item, "productOptions")
                          }
                          className="hover:bg-red-300 hover:text-white transition-colors duration-300 ease-in-out cursor-pointer"
                        >
                          <Close className="current-svg scale-[0.7]" />
                        </span>
                      </div>
                      <span className="text-sm font-bold">
                        Choices ({item?.choices?.length})
                      </span>

                      <div className="flex justify-start items-center gap-3">
                        {item?.choices?.map((choice) => {
                          return (
                            <div
                              key={choice?.variantName}
                              className="flex gap-3 w-fit justify-between items-center border-1/2 border-grey-border p-2 text-sm bg-white"
                            >
                              <div className="flex justify-start items-center gap-3 ">
                                <span className="">{choice?.variantName}</span>
                              </div>

                              <span
                                onClick={() =>
                                  handleEditOption(
                                    choice,
                                    "productVariants",
                                    item
                                  )
                                }
                                className="hover:bg-red-300 text-black hover:text-white transition-colors duration-300 ease-in-out cursor-pointer p-1"
                              >
                                <Edit className="current-svg scale-[0.9]" />
                              </span>

                              {choice?.main ? (
                                <span className="bg-grey-20 text-black px-2 py-0.5 text-xs rounded">
                                  main
                                </span>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>

                      {item?.id && (
                        <Button
                          text={`Save Changes for ${item?.name}`}
                          onClick={() => handleSubmitProductOption(item)}
                          isLoading={formTwo.productOptionId === item?.id}
                          className="mt-2 mb-5 "
                          fullWidth
                        />
                      )}
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
          currentProductOption: formTwo.currentProductOption,
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
        active={formTwo?.modalType === INVENTORY}
        details={{
          modalType: INVENTORY,
          currentProductInventory: formTwo.currentProductInventory,
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
