import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as InfoIcon } from "assets/icons/info-icon.svg";
import { BsCardList } from "react-icons/bs";
import { MdOutlineInvertColors } from "react-icons/md";

import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import Select from "components/General/Input/Select";
import Textarea from "components/General/Textarea/Textarea";
import { Link } from "react-router-dom";
import { FormErrorMessage } from "components/General/FormErrorMessage";
import RadioInput from "components/General/Input/RadioInput";
import classNames from "classnames";
import { errorToast } from "components/General/Toast/Toast";
import { isEmpty } from "lodash";

export default function ProductOptions({ details, toggler }) {
  const [formTwo, setFormTwo] = useState({
    country: "NG",
    showFormError: false,
    choices: [],
  });

  const schema = yup.object({});

  //

  //   const { actions } = signInSlice;

  const defaultValues = {
    name: "",
    type: "list",
    choice: "",
    quantity: "",
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

  const handleChange = async (prop, val) => {
    setValue(prop, val);
    await trigger(prop);
  };

  const form = {
    name: watch("name"),
    type: watch("type"),
    choice: watch("choice"),
    quantity: watch("quantity"),
  };
  const handleOnSubmit = (e) => {
    //  e?.preventDefault();
    let choice = form.choice?.split(",").map((item) => item?.trim());

    if (!choice) return;
    if (formTwo.choices?.includes(form.choice)) {
      errorToast("Cannot add the same choice twice");
    } else {
      setFormTwo({
        ...formTwo,
        choices: [...formTwo.choices, ...choice],
      });
      handleChange("choice", "");
    }

    // onSubmit(e);
    // dispatch(actions.signInUser({ username: name, country }));
  };
  const handleRemoveChoice = (val) => {
    setFormTwo({
      ...formTwo,
      choices: formTwo.choices.filter((item) => item !== val),
    });
  };
  return (
    <div className="flex flex-col justify-center items-start gap-y-2 w-full h-full pb-4 overflow-y-auto">
      {details?.link ? (
        <Link to={details?.link} className="scale-90 mb-2 mr-auto">
          <ArrowBack />
        </Link>
      ) : (
        <button onClick={() => toggler?.()} className="scale-90 mr-auto">
          <Close />
        </button>
      )}

      <p className="font-600 text-xl ">Add Product Option</p>

      <p className="mb-3 text-sm text-grey text-left">
        You'll be able to manage pricing and inventory for this product option
        later on
      </p>

      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col justify-start items-start w-full overflow-y-auto"
      >
        <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 mb-2">
          <Input
            label="Option Name"
            value={form?.name}
            onChangeFunc={(val) => handleChange("name", val)}
            placeholder="Enter Product Name"
            formError={errors.name}
            showFormError={formTwo?.showFormError}
            tooltip="Type in an option name"
            required
          />
          <div className="flex flex-col w-full mb-[13px]">
            <label
              className={
                "general-input-label mb-1 relative text-[13px] font-bold text-grey-dark !flex justify-start items-center gap-1.5"
              }
            >
              Show in product page as:
            </label>
            <div className="flex justify-start items-center gap-3">
              <button
                type="button"
                className={classNames(
                  "flex justify-start items-center gap-2 transition-colors duration-300 ease-in-out",
                  {
                    "text-blue": form.type === "list",
                    "text-grey-text5": form.type !== "list",
                  }
                )}
                onClick={() => handleChange("type", "list")}
              >
                <BsCardList size={20} />
                <span>List</span>
              </button>

              <button
                type="button"
                className={classNames(
                  "flex justify-start items-center gap-2 transition-colors duration-300 ease-in-out",
                  {
                    "text-blue": form.type === "color",
                    "text-grey-text5": form.type !== "color",
                  }
                )}
                onClick={() => handleChange("type", "color")}
              >
                <MdOutlineInvertColors size={20} />
                <span>Color</span>
              </button>
            </div>
          </div>
        </div>
        <Input
          label="Type in choices for this option"
          value={form?.choice}
          onChangeFunc={(val) => handleChange("choice", val)}
          placeholder="Enter Choice"
          formError={errors.choice}
          showFormError={formTwo?.showFormError}
          tooltip="Use comma to separate multiple choices"
          extraElement={
            <Button
              onClick={() => handleOnSubmit()}
              icon={
                <ArrowBack className="rotate-180 scale-75 current-svg text-white" />
              }
              innerClassName="!h-[90%] cursor-pointer !px-1"
              textClass="text-sm"
              isDisabled={!form.choice}
            />
          }
          required
        />
        <p className="text-sm text-grey text-left flex justify-start items-center gap-1">
          <InfoIcon /> Use comma to separate multiple choices
        </p>
        {!isEmpty(formTwo?.choices) && (
          <div className="flex flex-wrap gap-3 w-full my-3 justify-start items-center border-1/2 border-grey-border p-2">
            {formTwo?.choices?.map((item) => (
              <div
                onClick={() => handleRemoveChoice(item)}
                key={item}
                className="flex justify-center items-center w-fit transition-colors duration-300 ease-in-out gap-1 bg-grey-fadeLight text-sm px-1"
              >
                <span>{item}</span>

                <span className="hover:bg-red-300 hover:text-white transition-colors duration-300 ease-in-out cursor-pointer">
                  <Close className="current-svg scale-[0.7]" />
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 mt-5">
          <Button onClick={() => toggler?.()} text="Cancel" fullWidth whiteBg />

          <Button
            onClick={() => toggler?.()}
            text="Apply"
            className="mb-2"
            fullWidth
          />
        </div>
      </form>
    </div>
  );
}
ProductOptions.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
