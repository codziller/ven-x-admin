import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Edit } from "assets/icons/Edit/edit.svg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import Textarea from "components/General/Textarea/Textarea";
import { Link } from "react-router-dom";
import { FormErrorMessage } from "components/General/FormErrorMessage";
import ImagePicker from "components/General/Input/ImagePicker";
import Wysiwyg from "components/General/Textarea/Wysiwyg";
import { numberWithCommas } from "utils/formatter";
import classNames from "classnames";
import { RIBBONS } from "utils/appConstant";
import DetailsModal from "./DetailsModal";
import CheckBox from "components/General/Input/CheckBox";

export default function ProductVariant({ details, toggler }) {
  const [formTwo, setFormTwo] = useState({
    country: "NG",
    showFormError: false,
    visibility: "",
    collapsed: [],
    showProductOption: false,
  });

  const schema = yup.object({
    name: yup.string().required("Please enter your name"),
    cost_price: yup.string().required("Please enter cost_price"),
    quantity: yup.string().required("Please enter quantity"),
  });

  //

  //   const { actions } = signInSlice;

  const defaultValues = {
    name: "",
    country: "",
    cost_price: "",
    sale_price: "",
    regular_price: "",
    quantity: "",
    images: [],
    videos: [],
    visibility: true,
  };

  const {
    handleSubmit,
    formState: { errors, isValid },
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
    const updatedVal = rest ? [...rest, ...val] : val;
    setValue(prop, updatedVal);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    name: watch("name"),
    country: watch("country"),
    cost_price: watch("cost_price"),
    sale_price: watch("sale_price"),
    regular_price: watch("regular_price"),
    quantity: watch("quantity"),
    images: watch("images"),
    videos: watch("videos"),
    visibility: watch("visibility"),
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      toggler?.();
    }
    // onSubmit(e);
    // dispatch(actions.signInUser({ username: name, country }));
  };

  const profitMargin =
    form?.cost_price && form?.sale_price
      ? form?.sale_price - form?.cost_price
      : "";

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

        <p className="font-600 text-xl ">Add Product Variant</p>

        <p className="mb-3 text-sm text-grey text-left">
          You'll be able to manage pricing and inventory for this variant later
          on
        </p>

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-3 w-full overflow-y-auto"
        >
          <Input
            label="Variant"
            value={form?.name}
            onChangeFunc={(val) => handleChange("name", val)}
            placeholder="Enter Product Name"
            formError={errors.name}
            showFormError={formTwo?.showFormError}
            required
          />

          <div className="flex flex-col md:flex-row justify-center items-start w-full gap-3 md:gap-6">
            <Input
              label="Variant Cost Price (₦‎)"
              value={form?.cost_price}
              onChangeFunc={(val) => handleChange("cost_price", val)}
              placeholder="Enter Variant Cost Price"
              formError={errors.cost_price}
              showFormError={formTwo?.showFormError}
              prefix={"₦‎"}
              type="number"
              required
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
              value={form?.sale_price}
              onChangeFunc={(val) => handleChange("sale_price", val)}
              placeholder="Enter Variant Sale Price"
              formError={errors.sale_price}
              showFormError={formTwo?.showFormError}
              prefix={"₦‎"}
              tooltip="Selling price of this variant"
              type="number"
              required
            />
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center w-full gap-3 md:gap-6">
            <Input
              label="Variant Inventory"
              value={form?.quantity}
              onChangeFunc={(val) => handleChange("quantity", val)}
              placeholder="Enter Variant Inventory"
              formError={errors.quantity}
              showFormError={formTwo?.showFormError}
              type="number"
              required
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
          <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 mt-5">
            <Button
              onClick={() => toggler?.()}
              text="Cancel"
              fullWidth
              whiteBg
            />

            <Button
              onClick={() => toggler?.()}
              text="Save"
              className="mb-2"
              fullWidth
            />
          </div>
        </form>
      </div>
      <DetailsModal
        active={formTwo?.showProductOption}
        details={{ modalType: "product_option" }}
        toggler={() => handleChangeTwo("showProductOption", false)}
      />
    </>
  );
}
ProductVariant.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
