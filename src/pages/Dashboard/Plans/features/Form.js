import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
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
  subscriptionDurationOptions,
} from "utils/appConstant";
import DetailsModal from "./DetailsModal";
import CheckBox from "components/General/Input/CheckBox";
import CategoryDetailsModal from "pages/Dashboard/Categories/features/DetailsModal";
import { observer } from "mobx-react-lite";
import ProductsStore from "../store";
import cleanPayload from "utils/cleanPayload";
import { errorToast, warningToast } from "components/General/Toast/Toast";
import { flatMap, isEmpty } from "lodash";
import { convertToJs, flattenCategories } from "utils/functions";
import { uploadImagesToCloud } from "utils/uploadImagesToCloud";
import WareHousesStore from "pages/Dashboard/WareHouses/store";
import { FormErrorMessage } from "components/General/FormErrorMessage";
import moment from "moment";
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
  const { product_id, warehouse_id } = useParams();
  const location = useLocation();
  const isViewMode = location.pathname.includes("/dashboard/plans/view/");
  const {
    createProduct,
    product,
    editProduct,
    editProductOption,
    createProductOption,
    createProductOptionLoading,
  } = ProductsStore;
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
    // getCategories();
    // getBrands({ data: { page: 1 } });
    // getWarehouses({ data: { page: 1 } });
  }, []);

  const schema = yup.object({
    name: yup.string().required("Please enter name"),
    ...(product_id
      ? {}
      : {
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
        }),
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
    costPrice: product_id
      ? convertToJs(product)?.productCostPrice?.sort((a, b) =>
          moment(a?.updatedAt).isBefore(moment(b?.updatedAt)) ? 0 : -1
        )?.[0]?.costPrice
      : "",
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
    isPrivate: product_id ? product?.isPrivate : false,
    isDiscountAllowed: product_id ? product?.isDiscountAllowed : false,
    preOrderMessage: product_id ? product?.preOrderMessage : "",
    preOrderLimit: product_id ? product?.preOrderLimit : "",
    discountType: product_id ? product?.discountType : "",
    productVariants: product_id ? product?.productVariants : [],
    productOptions: product_id ? product?.productOptions : [],
    productSubscriptions: product_id ? product?.productSubscriptions : [],
    subscriptionDuration: "",
    subscriptionFrequency: "",
    tagline: "",
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
    isPrivate: watch("isPrivate"),
    isDiscountAllowed: watch("isDiscountAllowed"),
    preOrderMessage: watch("preOrderMessage"),
    preOrderLimit: watch("preOrderLimit"),
    discountType: watch("discountType"),
    weightType: watch("weightType"),
    productVariants: watch("productVariants"),
    productOptions: watch("productOptions"),
    productSubscriptions: watch("productSubscriptions"),
    warehouseInventory: watch("warehouseInventory"),

    subscriptionDuration: watch("subscriptionDuration"),
    subscriptionFrequency: watch("subscriptionFrequency"),
    tagline: watch("tagline"),
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
    try {
      handleChangeTwo("productOptionId", option?.id || option?.name);
      if (option?.id) {
        const payload = {
          ...option,
          choices: option?.choices?.map((item) => cleanPayload(item)),
          productOptionId: option?.id,
          id: "",
        };
        cleanPayload(payload);
        await editProductOption({
          product_id,
          data: payload,
          onSuccess: () => navigate(-1),
        });
      } else {
        const payload = {
          createProductOptionInput: option,
          productId: product_id,
        };
        cleanPayload(payload);
        await createProductOption({
          product_id,
          data: payload,
          onSuccess: () => navigate(-1),
        });
      }
    } catch (error) {
      console.log(error);
      errorToast("Error", "Error encountered. Please conatact admin");
    } finally {
      handleChangeTwo("productOptionId", "");
    }
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
          onSuccess: (response) => {
            if (!isEmpty(payload?.productOptions)) {
              navigate(
                `/dashboard/inventory/edit/${warehouse_id}/${response?.id}`
              );
            } else {
              navigate(-1);
            }
          },
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
  console.log("main errors: ", errors);

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
          <h2 className="section-heading my-8 text-xl">Add New Plan</h2>
        ) : (
          <h2 className="section-heading my-8 text-xl  ">
            {isViewMode ? "View Plan Details" : "Edit Plan"}
          </h2>
        )}

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col md:flex-row justify-start items-start gap-10 w-full overflow-y-auto"
        >
          {/* First section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto">
            <span className="text-grey-text text-lg uppercase">Plan info</span>
            <Input
              label="Plan Name"
              value={form?.name}
              onChangeFunc={(val) => handleChange({ prop: "name", val })}
              placeholder="Enter Plan Name"
              formError={errors.name}
              showFormError={formTwo?.showFormError}
              isRequired
              isDisabled={isViewMode}
            />
            {/* <Select
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
              isDisabled={isViewMode}
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
              isDisabled={isViewMode}
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
                isDisabled={!form?.weightType || isViewMode}
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
                  isDisabled={isViewMode}
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
                  isDisabled={isViewMode}
                />
              </div>
            </div> */}
            <Input
              label="Tagline (optional)"
              value={form?.tagline}
              onChangeFunc={(val) => handleChange("tagline", val)}
              placeholder="Subscribe and save 50%"
              formError={errors.tagline}
              showFormError={formTwo?.showFormError}
            />
            <Wysiwyg
              label="Plan Description"
              editorState={formTwo.productDescription}
              onEditorStateChange={(val) => {
                handleChange({
                  prop: "productDescription",
                  val,
                  isFormTwo: true,
                  isWysywyg: true,
                });
              }}
              placeholder="Enter Plan Description"
              formError={errors.productDescription}
              showFormError={formTwo?.showFormError}
              isDisabled={isViewMode}
            />
          </div>
          {/* Second section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto">
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">
                Plan Frequency
              </span>
              <span className="text-grey-text text-sm">
                Customise plan frequency
              </span>
            </div>

            <Input
              label="Repeats every"
              value={form?.subscriptionFrequency}
              onChangeFunc={(val) =>
                handleChange({ prop: "subscriptionFrequency", val })
              }
              placeholder="1"
              formError={errors.subscriptionFrequency}
              showFormError={formTwo?.showFormError}
              type="number"
              tooltip="Subscription frequency"
              isRequired
            />

            <Select
              placeholder="Select"
              options={subscriptionDurationOptions}
              onChange={(val) =>
                handleChange({ prop: "subscriptionDuration", val: val?.value })
              }
              value={subscriptionDurationOptions.find(
                (item) => item.value === form.subscriptionDuration
              )}
              formError={errors.subscriptionDuration}
              showFormError={formTwo?.showFormError}
              isRequired
              fullWidth
            />

            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">
                Plan Visibility
              </span>
              <span className="text-grey-text text-sm">
                Make this product private. If made private, the product will not
                be visible on the app and website.
              </span>
            </div>

            <CheckBox
              label="Make this plan private"
              square
              tooltip="Make this plan private"
              onChange={() =>
                handleChange({
                  prop: "isPrivate",
                  val: !form.isPrivate,
                })
              }
              checked={form.isPrivate}
              isDisabled={isViewMode}
            />
          </div>
          {/* Third section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto">
            <span className="text-grey-text text-lg uppercase">Pricing</span>
            <Input
              label="Price (₦‎)"
              value={form?.costPrice}
              onChangeFunc={(val) => handleChange({ prop: "costPrice", val })}
              placeholder="Enter Price"
              formError={errors.costPrice}
              showFormError={formTwo?.showFormError}
              prefix={"₦‎"}
              type="number"
              isRequired
              isDisabled={!!product_id || isViewMode}
            />
            {product_id && !isViewMode && (
              <Button
                onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
                type="submit"
                text={!product_id ? "Add New Product" : "Save Changes"}
                isLoading={formTwo.createLoading}
                className="mt-10 mb-5 "
                fullWidth
              />
            )}

            {!product_id && !isViewMode && (
              <Button
                onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
                type="submit"
                text={!product_id ? "Add New Plan" : "Save Changes"}
                isLoading={formTwo.createLoading}
                className="mt-10 mb-5 "
                fullWidth
                isDisabled={isViewMode}
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
