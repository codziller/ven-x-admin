import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";

import { Link, useParams } from "react-router-dom";
import { numberWithCommas } from "utils/formatter";
import classNames from "classnames";
import Textarea from "components/General/Textarea/Textarea";
import ImagePicker from "components/General/Input/ImagePicker";
import cleanPayload from "utils/cleanPayload";
import { errorToast } from "components/General/Toast/Toast";
import { isEmpty, lowerCase } from "lodash";
import { uploadImagesToCloud } from "utils/uploadImagesToCloud";
import ProductsStore from "../store";
import { observer } from "mobx-react-lite";

const ProductVariant = ({ details, toggler, handleOnChange, formObj }) => {
  const { productVariants } = formObj;
  const { currentProductVariant } = details;
  const { product_id } = useParams();
  const isEdit = !isEmpty(currentProductVariant);

  const { editProductVariant } = ProductsStore;
  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    editLoading: false,
  });

  const schema = yup.object({
    variantName: yup.string().required("Please enter variant name"),
  });

  const defaultValues = {
    variantName: currentProductVariant?.variantName || "",
    variantCostPrice: currentProductVariant?.variantCostPrice || "",
    variantSalePrice: currentProductVariant?.variantSalePrice || "",
    variantQuantity: currentProductVariant?.variantQuantity || "",
    imageUrls: currentProductVariant?.imageUrls || [],
    videoUrls: currentProductVariant?.videoUrls || [],
    visibility: currentProductVariant?.variantName
      ? currentProductVariant?.visibility
      : true,
    description: currentProductVariant?.description || "",
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
  const handleChange = async (prop, val, rest, isFormTwo) => {
    isFormTwo && setFormTwo({ ...formTwo, [prop]: val });
    const updatedVal = rest ? [...val, ...rest] : val;
    setValue(prop, updatedVal);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    variantName: watch("variantName"),
    variantCostPrice: watch("variantCostPrice"),
    variantSalePrice: watch("variantSalePrice"),
    variantQuantity: watch("variantQuantity"),
    imageUrls: watch("imageUrls"),
    videoUrls: watch("videoUrls"),
    visibility: watch("visibility"),
    description: watch("description"),
  };
  const handleOnSubmit = async (e) => {
    if (isEdit) {
      try {
        handleChangeTwo("editLoading", true);
        const imagesUrls = await Promise.all([
          uploadImagesToCloud(form?.imageUrls),
          uploadImagesToCloud(form?.videoUrls),
        ]);

        const payload = {
          ...form,
          productVariantId: currentProductVariant?.id,
          imageUrls: imagesUrls?.[0],
          videoUrls: imagesUrls?.[1],
        };
        cleanPayload(payload);
        await editProductVariant({
          product_id,
          data: payload,
          onSuccess: () => toggler?.(),
        });
      } catch (error) {
      } finally {
        handleChangeTwo("editLoading", false);
      }
      return;
    }

    const prevOption = productVariants?.find(
      (item) => lowerCase(item?.variantName) === lowerCase(form.variantName)
    );
    if (prevOption?.variantName) {
      errorToast(
        "Error!",
        "You've already added a product variant with this name"
      );
      return;
    }
    const payload = form;
    handleOnChange({
      prop: "productVariants",
      val: [...productVariants, payload],
    });
    toggler?.();
  };

  const profitMargin =
    form?.variantCostPrice && form?.variantSalePrice
      ? form?.variantSalePrice - form?.variantCostPrice
      : "";

  const removeFile = (file, prop, files) => {
    let updatedFiles = [...files];
    updatedFiles = updatedFiles.filter(
      (_) => (_?.name || _) !== (file?.name || file)
    );
    handleChange(prop, updatedFiles);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-start gap-y-2 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="mb-5">
            <Link to={details?.link} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mr-auto">
            <Close />
          </button>
        )}

        <p className="font-600 text-xl">
          {isEdit ? "Edit Product Variant" : "Add Product Variant"}
        </p>

        <p className="mb-3 text-sm text-grey text-left">
          You'll be able to manage pricing and inventory for this variant later
          on
        </p>

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-3 w-full overflow-y-auto"
        >
          <Input
            label="Variant Name"
            value={form?.variantName}
            onChangeFunc={(val) => handleChange("variantName", val)}
            placeholder="Enter Variant Name"
            formError={errors.variantName}
            showFormError={formTwo?.showFormError}
            isRequired
          />

          <div className="flex flex-col md:flex-row justify-center items-start w-full gap-3 md:gap-6">
            <Input
              label="Variant Cost Price (₦‎)"
              value={form?.variantCostPrice}
              onChangeFunc={(val) => handleChange("variantCostPrice", val)}
              placeholder="Enter Variant Cost Price"
              formError={errors.variantCostPrice}
              showFormError={formTwo?.showFormError}
              prefix={"₦‎"}
              type="number"
            />

            <Input
              label="Variant Sale Price (₦‎)"
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
              value={form?.variantSalePrice}
              onChangeFunc={(val) => handleChange("variantSalePrice", val)}
              placeholder="Enter Variant Sale Price"
              formError={errors.variantSalePrice}
              showFormError={formTwo?.showFormError}
              prefix={"₦‎"}
              tooltip="Selling price of this variant"
              type="number"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center w-full gap-3 md:gap-6">
            <Input
              label="Variant Quantity"
              value={form?.variantQuantity}
              onChangeFunc={(val) => handleChange("variantQuantity", val)}
              placeholder="Enter Variant Quantity"
              formError={errors.variantQuantity}
              showFormError={formTwo?.showFormError}
              type="number"
            />

            <div className="w-full">
              <div
                className={classNames(
                  "flex justify-start items-center gap-2 cursor-pointer w-fit",
                  {
                    "text-green-light": form.visibility,
                    "text-grey-fade": !form.visibility,
                  }
                )}
                onClick={() => handleChange("visibility", !form.visibility)}
              >
                <label
                  className={
                    "general-input-label mb-1 relative text-[13px] font-bold !flex justify-start items-center gap-1.5 cursor-pointer"
                  }
                >
                  Visibility {form.visibility ? "On" : "Off"}
                </label>
                <span className="-mt-1">
                  {form.visibility ? (
                    <AiOutlineEye size={20} className="current-svg" />
                  ) : (
                    <AiOutlineEyeInvisible size={20} className="current-svg" />
                  )}
                </span>
              </div>
            </div>
          </div>

          <Textarea
            label="Variant Description"
            value={form?.description}
            onChangeFunc={(val) => handleChange("description", val)}
            placeholder="Enter a short description for this variant"
            formError={errors.description}
            showFormError={formTwo?.showFormError}
          />

          <ImagePicker
            label=" Add Variant Image"
            showFormError={formTwo?.showFormError && errors.imageUrls}
            handleDrop={(val) => handleChange("imageUrls", val, form.imageUrls)}
            images={form.imageUrls}
            removeImage={(file) =>
              removeFile(file, "imageUrls", form.imageUrls)
            }
            multiple
          />
          <ImagePicker
            label=" Add Variant Videos"
            showFormError={formTwo?.showFormError && errors.videoUrls}
            handleDrop={(val) => handleChange("videoUrls", val, form.videoUrls)}
            images={form.videoUrls}
            removeImage={(file) =>
              removeFile(file, "videoUrls", form.videoUrls)
            }
            placeholder="Drag 'n' drop some videos here, or click to select videos"
            type="video"
            multiple
          />
          <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 mt-5">
            <Button
              onClick={() => toggler?.()}
              text="Cancel"
              fullWidth
              whiteBg
            />

            <Button
              onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
              isLoading={formTwo.editLoading}
              type="submit"
              text={isEdit ? "Save Changes" : "Add"}
              className="mb-2"
              fullWidth
            />
          </div>
        </form>
      </div>
    </>
  );
};
ProductVariant.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
  handleChange: PropTypes.func,
  form: PropTypes.object,
};
export default observer(ProductVariant);
