import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import Button from "components/General/Button/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { TailSpin } from "react-loader-spinner";
import {
  DISCOUNT_TYPES,
  DISCOUNT_TYPES_OPTION,
  MEDIA_MODAL_TYPES,
  PRODUCT_MODAL_TYPES,
} from "utils/appConstant";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import MarketingStore from "../store";
import DetailsModal from "./DetailsModal";
import { observer } from "mobx-react-lite";
import CategoriesStore from "pages/Dashboard/Categories/store";
import BrandsStore from "pages/Dashboard/Brands/store";
import ProductsStore from "pages/Dashboard/Products/store";
import cleanPayload from "utils/cleanPayload";
import { FormErrorMessage } from "components/General/FormErrorMessage";
import { flattenCategories } from "utils/functions";
import CategoryDetailsModal from "pages/Dashboard/Categories/features/DetailsModal";
import { isArray, isEmpty } from "lodash";
import { errorToast, warningToast } from "components/General/Toast/Toast";
import Select from "components/General/Input/Select";
import Wysiwyg from "components/General/Textarea/Wysiwyg";
import Input from "components/General/Input/Input";
import CheckBox from "components/General/Input/CheckBox";

const { PRODUCT_CATEGORY, PRODUCT_CATEGORY_OPTIONS } = PRODUCT_MODAL_TYPES;
const { BRAND, PRODUCT } = MEDIA_MODAL_TYPES;
const { BUY_X_GET_X_FREE, BUY_X_GET_Y_FREE, FIXED, FREE_SHIPPING, PERCENTAGE } =
  DISCOUNT_TYPES;
const Form = observer(() => {
  const { warehouse_id, media_id, position } = useParams();
  const { getCategories } = CategoriesStore;
  const { createDiscount, editDiscount, discount, loadingDiscount } =
    MarketingStore;
  const { getProductName, getProductLoading, product } = ProductsStore;
  const navigate = useNavigate();
  const [formTwo, setFormTwo] = useState({
    modalType: "",
    showFormError: false,
    createLoading: false,
  });

  useEffect(() => {
    getCategories();
  }, []);

  const schema = yup.object({
    name: yup.string().required("Please enter discount name"),
    discountCode: yup.string().required("Please enter discount code"),
    discountType: yup.string().required("Please select discount type"),
  });

  const defaultValues = {
    categoryIds: media_id ? discount?.categoryIds : [],
    brandIds: media_id ? discount?.brandIds : [],
    productIds: media_id ? discount?.productIds : [],
    discountCode: media_id ? discount?.discountCode : "",
    discountValue: media_id ? discount?.discountValue : "",
    discountType: media_id ? discount?.discountType : "",
    name: media_id ? discount?.name : "",
    discountBuyXValue: media_id ? discount?.discountBuyXValue : "",
    discountGetXValue: media_id ? discount?.discountGetXValue : "",
    discountGetYProductId: media_id ? discount?.discountGetYProductId : "",
    discountGetYValue: media_id ? discount?.discountGetYValue : "",
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

  const handleChange = async ({ prop, val, rest, isFormTwo, isWysywyg }) => {
    if (
      prop === "discountValue" &&
      form.discountType === PERCENTAGE &&
      parseFloat(val) > 100
    ) {
      return;
    }

    isFormTwo
      ? setFormTwo({ ...formTwo, [prop]: val, formModified: true })
      : setFormTwo({ ...formTwo, formModified: true });
    let updatedVal;
    if (isWysywyg) {
      updatedVal = JSON.stringify(
        draftToHtml(convertToRaw(val?.getCurrentContent()))
      );
    } else if (rest) {
      updatedVal = [...val, ...rest];
    } else {
      updatedVal = val;
    }

    setValue(prop, updatedVal);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    name: watch("name"),
    categoryIds: watch("categoryIds"),
    brandIds: watch("brandIds"),
    productIds: watch("productIds"),
    discountCode: watch("discountCode"),
    discountValue: watch("discountValue"),
    discountType: watch("discountType"),
    discountBuyXValue: watch("discountBuyXValue"),
    discountGetXValue: watch("discountGetXValue"),
    discountGetYProductId: watch("discountGetYProductId"),
    discountGetYValue: watch("discountGetYValue"),
  };

  useEffect(() => {
    if (
      form?.discountGetYProductId &&
      form?.discountType === BUY_X_GET_Y_FREE
    ) {
      getProductName({ data: { id: form.discountGetYProductId } });
    }
  }, [form?.discountGetYProductId, form?.discountType]);

  useEffect(() => {
    if (
      form.discountType === PERCENTAGE &&
      parseFloat(form.discountValue) > 100
    ) {
      handleChange({ prop: "discountValue", val: "" });
    }
  }, [form.discountType, form.discountValue]);

  const handleOnSubmit = async () => {
    const {
      discountType,
      discountValue,
      discountGetXValue,
      discountGetYValue,
      discountBuyXValue,
      discountGetYProductId,
      productIds,
      categoryIds,
      brandIds,
    } = form;
    if (
      (discountType === PERCENTAGE || discountType === FIXED) &&
      !discountValue
    ) {
      warningToast("Error!", "Please enter discount value");
      return;
    }
    if (discountType?.includes("BUY") && !discountBuyXValue) {
      warningToast("Error!", "Please enter number of product (X) to be bought");
      return;
    }
    if (discountType === BUY_X_GET_X_FREE && !discountGetXValue) {
      warningToast("Error!", "Please enter number of product (X) to be given");
      return;
    }

    if (discountType === BUY_X_GET_Y_FREE && !discountGetYProductId) {
      warningToast("Error!", "Please  Select product (Y) to be given");
      return;
    }

    if (discountType === BUY_X_GET_Y_FREE && !discountGetYValue) {
      warningToast("Error!", "Please enter number of product (Y) to be given");
      return;
    }

    if (discountType?.includes("BUY") && isEmpty(productIds)) {
      warningToast("Error!", "Please select product to apply this discount to");
      return;
    }

    if (isEmpty(productIds || categoryIds || brandIds)) {
      warningToast(
        "Error!",
        "Please select products, brands, or categories to apply this discount to"
      );
      return;
    }
    handleChangeTwo("createLoading", true);

    try {
      const payload = {
        ...form,
        discountValue: form.discountValue || "0",
        discountGetYValue: discountGetYValue ? Number(discountGetYValue) : "",
        discountGetXValue: discountGetXValue ? Number(discountGetXValue) : "",
        discountBuyXValue: discountBuyXValue ? Number(discountBuyXValue) : "",
      };

      cleanPayload(payload);
      if (!media_id) {
        await createDiscount({
          data: payload,
          onSuccess: () => navigate(-1),
        });
        return;
      } else {
        await editDiscount({
          data: { ...payload, id: media_id },
          onSuccess: () => navigate(-1),
        });
        return;
      }
    } catch (error) {
      errorToast(
        "Error!",
        "Error encountered uploading images. Kindly Check the image format."
      );
    } finally {
      handleChangeTwo("createLoading", false);
    }
  };

  return loadingDiscount ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <>
      <div className="h-full md:pr-4 pt-1">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex flex-col md:flex-row md:gap-6 justify-between items-start w-full mb-2">
            <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
              <div className="mb-5">
                <button onClick={() => navigate(-1)} className="scale-90">
                  <ArrowBack />
                </button>
              </div>
              {media_id ? (
                <h2 className="section-heading my-8 text-xl">Edit Discount</h2>
              ) : (
                <h2 className="section-heading mb-3 text-xl">Add Discount</h2>
              )}

              <form
                onSubmit={handleSubmit(handleOnSubmit)}
                className="flex flex-col md:flex-row justify-start items-start gap-10 w-full overflow-y-auto"
              >
                {/* First section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 h-full">
                  <Input
                    label="Discount Name"
                    value={form?.name}
                    onChangeFunc={(val) => handleChange({ prop: "name", val })}
                    placeholder="Enter Discount Name"
                    formError={errors.name}
                    showFormError={formTwo?.showFormError}
                  />
                </div>

                {/* Second section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <span className="text-grey-text text-lg uppercase">
                      Discount
                    </span>
                    <span className="text-grey-text text-sm">
                      Add discount details here
                    </span>
                  </div>
                  <Input
                    label="Discount Code"
                    value={form?.discountCode}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "discountCode", val })
                    }
                    placeholder="Enter Discount Code"
                    formError={errors.discountCode}
                    showFormError={formTwo?.showFormError}
                    isRequired
                  />

                  <Select
                    label="Discount Type"
                    placeholder="Select discount type"
                    options={DISCOUNT_TYPES_OPTION}
                    onChange={(val) =>
                      handleChange({ prop: "discountType", val: val?.value })
                    }
                    value={form.discountType}
                    formError={errors.discountType}
                    showFormError={formTwo?.showFormError}
                    fullWidth
                  />

                  {form?.discountType?.includes("BUY") ? (
                    <Input
                      label="Number of product (X) to be bought"
                      value={form?.discountBuyXValue}
                      onChangeFunc={(val) =>
                        handleChange({ prop: "discountBuyXValue", val })
                      }
                      placeholder="2"
                      showFormError={formTwo?.showFormError}
                      isRequired
                      tooltip="Number of product (X) to be bought to qualify for this discount"
                      type="number"
                    />
                  ) : null}
                  {form.discountType === BUY_X_GET_X_FREE ? (
                    <Input
                      label="Number of product (X) to be given"
                      value={form?.discountGetXValue}
                      onChangeFunc={(val) =>
                        handleChange({ prop: "discountGetXValue", val })
                      }
                      placeholder="2"
                      showFormError={formTwo?.showFormError}
                      isRequired
                      tooltip="Number of product (X) to be given"
                      type="number"
                    />
                  ) : null}
                  {form.discountType === BUY_X_GET_Y_FREE ? (
                    <>
                      <div className="flex flex-col justify-start items-start gap-1">
                        <span className="text-grey-text text-sm">
                          Select product (Y) to be given
                        </span>
                      </div>
                      <div className="flex flex-col justify-start items-end gap-1 w-full">
                        {!isEmpty(form.discountGetYProductId) && (
                          <div className="flex flex-wrap justify-start items-start gap-2 ">
                            {getProductLoading ? (
                              <TailSpin
                                height="20"
                                width="20"
                                color="#000000"
                                ariaLabel="tail-spin-loading"
                                radius="1"
                                visible={true}
                              />
                            ) : (
                              product?.name
                            )}
                          </div>
                        )}
                        <Button
                          onClick={() =>
                            handleChangeTwo("modalType", BUY_X_GET_Y_FREE)
                          }
                          text="Select Product Y"
                          icon={<Plus className="text-black current-svg" />}
                          className=""
                          whiteBg
                          fullWidth
                        />
                      </div>

                      <Input
                        label="Number of product (Y) to be given"
                        value={form?.discountGetYValue}
                        onChangeFunc={(val) =>
                          handleChange({ prop: "discountGetYValue", val })
                        }
                        placeholder="2"
                        showFormError={formTwo?.showFormError}
                        isRequired
                        tooltip="Number of product (Y) to be given"
                        type="number"
                      />
                    </>
                  ) : null}
                  {form.discountType === FIXED ||
                  form.discountType === PERCENTAGE ? (
                    <Input
                      label="Discount"
                      value={form?.discountValue}
                      onChangeFunc={(val) =>
                        handleChange({ prop: "discountValue", val })
                      }
                      placeholder="Enter Discount"
                      formError={errors.discountValue}
                      showFormError={formTwo?.showFormError}
                      prefix={form.discountType === FIXED ? "₦" : ""}
                      suffix={form.discountType === PERCENTAGE ? "%" : ""}
                      tooltip="Discount"
                      type="number"
                      isDisabled={!form?.discountType}
                      isRequired
                    />
                  ) : null}
                </div>
                {/* Third section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <span className="text-grey-text text-lg uppercase">
                      Apply Discount To:
                    </span>
                    <span className="text-grey-text text-sm">
                      Select products, brands, or categories to apply this
                      discount to
                    </span>
                  </div>

                  <div className="flex flex-col justify-start items-end gap-1 w-full">
                    {!isEmpty(form.productIds) && (
                      <div className="flex flex-wrap justify-start items-start gap-2 ">
                        {form.productIds?.length}{" "}
                        {form.productIds?.length === 1 ? "product" : "products"}{" "}
                        selected
                      </div>
                    )}
                    <Button
                      onClick={() => handleChangeTwo("modalType", PRODUCT)}
                      text="Select Products"
                      icon={<Plus className="text-black current-svg" />}
                      className=""
                      whiteBg
                      fullWidth
                    />

                    <div className="h-[13px]">
                      {errors?.productIds && (
                        <FormErrorMessage type={errors?.productIds} />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-start items-end gap-1 w-full">
                    {!isEmpty(form.brandIds) && (
                      <div className="flex flex-wrap justify-start items-start gap-2 ">
                        {form.brandIds?.length}{" "}
                        {form.brandIds?.length === 1 ? "brand" : "brands"}{" "}
                        selected
                      </div>
                    )}
                    <Button
                      onClick={() => handleChangeTwo("modalType", BRAND)}
                      text="Select Brands"
                      icon={<Plus className="text-black current-svg" />}
                      className=""
                      whiteBg
                      fullWidth
                    />

                    <div className="h-[13px]">
                      {errors?.brandIds && (
                        <FormErrorMessage type={errors?.brandIds} />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-start items-end gap-1 w-full">
                    {!isEmpty(form.categoryIds) && (
                      <div className="flex flex-wrap justify-start items-start gap-2 ">
                        {form.categoryIds?.length}{" "}
                        {form.categoryIds?.length === 1
                          ? "category"
                          : "categories"}{" "}
                        selected
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
                      onClick={() =>
                        handleChangeTwo("modalType", PRODUCT_CATEGORY)
                      }
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

                  <Button
                    onClick={() =>
                      setFormTwo({ ...formTwo, showFormError: true })
                    }
                    isLoading={formTwo.createLoading}
                    type="submit"
                    text={media_id ? "Save Changes" : "Add Discount"}
                    className="mt-8 mb-5"
                    fullWidth
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <DetailsModal
        active={formTwo?.modalType === PRODUCT_CATEGORY_OPTIONS}
        details={{
          modalTitle: "Discount",
          modalType: PRODUCT_CATEGORY_OPTIONS,
        }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
        type="Post"
      />

      <DetailsModal
        active={formTwo?.modalType === BRAND}
        details={{ isMultipleBrands: true, prop: "brandIds", modalType: BRAND }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />
      <DetailsModal
        active={formTwo?.modalType === PRODUCT}
        details={{
          isMultipleProducts: true,
          prop: "productIds",
          modalType: PRODUCT,
        }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />

      <DetailsModal
        active={formTwo?.modalType === BUY_X_GET_Y_FREE}
        details={{
          isMultipleProducts: false,
          prop: "discountGetYProductId",
          modalType: BUY_X_GET_Y_FREE,
        }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />

      <CategoryDetailsModal
        active={formTwo?.modalType === PRODUCT_CATEGORY}
        details={{ modalType: "add", isAdd: true }}
        toggler={() => handleChangeTwo("modalType", false)}
      />
    </>
  );
});

const AddHomePagePost = () => {
  const { media_id } = useParams();
  const { loadingDiscount, getDiscount } = MarketingStore;

  useEffect(() => {
    media_id && getDiscount({ data: { id: media_id } });
  }, []);
  return loadingDiscount ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <Form />
  );
};

export default observer(AddHomePagePost);
