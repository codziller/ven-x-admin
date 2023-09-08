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

export default function ProductSubscription({ details, toggler }) {
  const [formTwo, setFormTwo] = useState({
    country: "NG",
    showFormError: false,
    visibility: "",
    collapsed: [],
    showProductOption: false,
  });

  const schema = yup.object({});

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
    discount_type: "₦",
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
    discount_type: watch("discount_type"),
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

        <p className="font-600 text-xl ">Add a Subscription To This Product</p>

        <p className="mb-3 text-sm text-grey text-left">
          Easily offer this product on a recurring basis with subscriptions
        </p>

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-3 w-full overflow-y-auto"
        >
          <span className="text-grey-text text-sm uppercase">
            Subscription info
          </span>
          <div className="flex flex-col md:flex-row justify-center items-start w-full gap-3 md:gap-6">
            <Input
              label="Name"
              value={form?.name}
              onChangeFunc={(val) => handleChange("name", val)}
              placeholder="Product of the month"
              formError={errors.name}
              showFormError={formTwo?.showFormError}
              required
            />
            <Input
              label="Tagline (optional)"
              value={form?.name}
              onChangeFunc={(val) => handleChange("name", val)}
              placeholder="Subscribe and save 50%"
              formError={errors.name}
              showFormError={formTwo?.showFormError}
              required
            />
          </div>
          <hr className="w-full" />
          <span className="text-grey-text text-sm uppercase">
            Subscription details
          </span>
          <div className="flex flex-col md:flex-row justify-center items-end w-full gap-3 md:gap-6">
            <Input
              label="Repeats every"
              value={form?.cost_price}
              onChangeFunc={(val) => handleChange("cost_price", val)}
              placeholder="1"
              formError={errors.cost_price}
              showFormError={formTwo?.showFormError}
              type="number"
              tooltip="Subscription frequency"
              required
            />

            <Select
              placeholder="Select"
              options={[
                { label: "Weeks", value: "week" },
                { label: "Months", value: "month" },
                { label: "Years", value: "year" },
              ]}
              onChange={(val) => handleChange("country", val)}
              value={form.country}
              formError={errors.country}
              showFormError={formTwo?.showFormError}
              fullWidth
            />
          </div>

          <Select
            label="Expires after"
            tooltip="Subscription duration"
            placeholder="Select"
            options={[
              { label: "One Week", value: "week" },
              { label: "One Month", value: "month" },
              { label: "One Year", value: "year" },
              { label: "Custom date", value: "custom" },
            ]}
            onChange={(val) => handleChange("regular_price", val)}
            value={form.regular_price}
            formError={errors.regular_price}
            showFormError={formTwo?.showFormError}
            fullWidth
          />
          <hr className="w-full mb-2" />
          <span className="text-grey-text text-sm uppercase">
            Subscription pricing
          </span>
          <div className="flex flex-col md:flex-row justify-center items-center w-full gap-3 md:gap-6">
            <Input
              label="Discount"
              value={form?.regular_price}
              onChangeFunc={(val) => handleChange("regular_price", val)}
              placeholder="Enter Discount"
              formError={errors.regular_price}
              showFormError={formTwo?.showFormError}
              prefix={form.discount_type === "₦" && form.discount_type}
              suffix={form.discount_type === "%" && form.discount_type}
              tooltip="Discount"
              type="number"
              required
            />
            <div className="flex justify-center items-center w-full gap-6">
              <CheckBox
                label="₦"
                onChange={() => handleChange("discount_type", "₦")}
                checked={form.discount_type === "₦"}
              />

              <CheckBox
                label="%"
                onChange={() => handleChange("discount_type", "%")}
                checked={form.discount_type === "%"}
              />
            </div>
          </div>

          <Input
            label="Cost Price (₦‎)"
            value={form?.cost_price}
            onChangeFunc={(val) => handleChange("cost_price", val)}
            placeholder="Enter Cost Price"
            formError={errors.cost_price}
            showFormError={formTwo?.showFormError}
            prefix={"₦‎"}
            labelControl={
              <span className="text-sm text-blue flex justify-start items-center gap-1 cursor-pointer">
                Regular Price:₦{numberWithCommas("1000000")}
              </span>
            }
            type="number"
            required
          />
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
ProductSubscription.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
