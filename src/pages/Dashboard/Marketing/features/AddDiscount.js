import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import Button from "components/General/Button/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { MEDIA_MODAL_TYPES, PRODUCT_MODAL_TYPES } from "utils/appConstant";
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
import ImagePicker from "components/General/Input/ImagePicker";
import CategoriesStore from "pages/Dashboard/Categories/store";
import BrandsStore from "pages/Dashboard/Brands/store";
import ProductsStore from "pages/Dashboard/Products/store";
import { uploadImageToCloud } from "utils/uploadImagesToCloud";
import cleanPayload from "utils/cleanPayload";
import { FormErrorMessage } from "components/General/FormErrorMessage";
import { flattenCategories } from "utils/functions";
import CategoryDetailsModal from "pages/Dashboard/Categories/features/DetailsModal";
import { isArray, isEmpty } from "lodash";
import { errorToast } from "components/General/Toast/Toast";
import Select from "components/General/Input/Select";
import Wysiwyg from "components/General/Textarea/Wysiwyg";
import Input from "components/General/Input/Input";
import CheckBox from "components/General/Input/CheckBox";

const { PRODUCT_CATEGORY, PRODUCT_CATEGORY_OPTIONS } = PRODUCT_MODAL_TYPES;
const { BRAND, PRODUCT } = MEDIA_MODAL_TYPES;
const Form = observer(() => {
  const { warehouse_id, media_id, position } = useParams();
  const { getCategories } = CategoriesStore;
  const { createDiscount, editDiscount, discount, loadingDiscount } =
    MarketingStore;
  const navigate = useNavigate();
  const [formTwo, setFormTwo] = useState({
    modalType: "",
    showFormError: false,
    createLoading: false,
    descriptionText:
      media_id && discount?.descriptionText
        ? EditorState.createWithContent(
            ContentState.createFromBlockArray(
              convertFromHTML(JSON.parse(discount?.descriptionText))
            )
          )
        : "",
  });

  useEffect(() => {
    getCategories();
  }, []);

  const schema = yup.object({
    titleText: yup.string().required("Please enter discount title"),
    discountCode: yup.string().required("Please enter discount code"),
    discountValue: yup.string().required("Please enter discount value"),
    discountType: yup.string().required("Please select discount type"),
  });

  const defaultValues = {
    categoryIds: media_id ? discount?.categoryIds : [],
    imageUrl: media_id ? discount?.imageUrl : [],
    brandIds: media_id ? discount?.brandIds : [],
    productIds: media_id ? discount?.productIds : [],
    descriptionText: media_id ? discount?.descriptionText : "",
    discountCode: media_id ? discount?.discountCode : "",
    discountValue: media_id ? discount?.discountValue : "",
    discountType: media_id ? discount?.discountType : "",
    titleText: media_id ? discount?.titleText : "",
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
      form.discountType === "PERCENTAGE" &&
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
    titleText: watch("titleText"),
    categoryIds: watch("categoryIds"),
    imageUrl: watch("imageUrl"),
    brandIds: watch("brandIds"),
    productIds: watch("productIds"),
    descriptionText: watch("descriptionText"),
    discountCode: watch("discountCode"),
    discountValue: watch("discountValue"),
    discountType: watch("discountType"),
  };

  useEffect(() => {
    if (
      form.discountType === "PERCENTAGE" &&
      parseFloat(form.discountValue) > 100
    ) {
      handleChange({ prop: "discountValue", val: "" });
    }
  }, [form.discountType, form.discountValue]);

  const handleOnSubmit = async () => {
    handleChangeTwo("createLoading", true);

    try {
      const imagesUrls = await uploadImageToCloud(
        isArray(form?.imageUrl) ? form?.imageUrl?.[0] : form?.imageUrl
      );
      const payload = {
        ...form,
        showOnWeb: !!(position === "web"),
        showOnMobile: !!(position === "mobile"),
        imageUrl: imagesUrls,
      };

      if (!media_id) {
        await createDiscount({
          data: payload,
          onSuccess: () => navigate(`/dashboard/marketing/${warehouse_id}`),
        });
        return;
      } else {
        await editDiscount({
          data: { ...payload, id: media_id },
          onSuccess: () => navigate(`/dashboard/marketing/${warehouse_id}`),
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
                    label="Discount Title"
                    value={form?.titleText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "titleText", val })
                    }
                    placeholder="Enter Title"
                    formError={errors.titleText}
                    showFormError={formTwo?.showFormError}
                  />

                  <ImagePicker
                    label="Select Image "
                    handleDrop={(val) =>
                      handleChange({ prop: "imageUrl", val })
                    }
                    images={form.imageUrl}
                    multiple={false}
                    isMarketingImg
                  />

                  <Wysiwyg
                    label="Discount Description"
                    editorState={formTwo.descriptionText}
                    onEditorStateChange={(val) => {
                      handleChange({
                        prop: "descriptionText",
                        val,
                        isFormTwo: true,
                        isWysywyg: true,
                      });
                    }}
                    placeholder="Enter Discount Description"
                    formError={errors.descriptionText}
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
                      isRequired
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
