import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import CategoriesStore from "../store";
import cleanPayload from "utils/cleanPayload";

const AddHeaderNav = ({ details, toggler }) => {
  const {
    getHeaderNavs,
    createHeaderNav,
    createHeaderNavLoading,
    editHeaderNav,
    editHeaderNavLoading,
  } = CategoriesStore;

  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    subcategories: details?.subCategories,
    subcategory: "",
    deletingSubcategories: [],
    editLoading: false,
  });

  useEffect(() => {
    getHeaderNavs();
  }, []);
  const schema = yup.object({
    name: yup.string().required("Please enter header nav name"),
  });

  const defaultValues = {
    name: details?.name,
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
  const handleChange = async (prop, val) => {
    setValue(prop, val);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    name: watch("name"),
  };

  const handleOnSubmit = async (e) => {
    const payload = { name: form.name, id: details?.id };
    cleanPayload(payload);
    if (details.isAdd) {
      createHeaderNav({ data: payload, onSuccess: () => toggler() });
    } else {
      editHeaderNav({ data: payload, onSuccess: () => toggler() });
    }
  };
  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="">
            <Link to={details?.link} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 ">
            <Close />
          </button>
        )}

        {details?.isAdd ? (
          <p className="font-600 mb-3 text-xl">Add Header Nav</p>
        ) : (
          <p className="font-600 mb-3 text-xl  ">Edit Header Nav</p>
        )}

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-5 w-full overflow-y-auto"
        >
          <Input
            label="Header Nav Name"
            value={form?.name}
            onChangeFunc={(val) => handleChange("name", val)}
            placeholder="Enter Header Nav Name"
            formError={errors.name}
            showFormError={formTwo?.showFormError}
            required
          />

          <Button
            onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
            isLoading={createHeaderNavLoading || editHeaderNavLoading}
            type="submit"
            text={details?.isAdd ? "Add Header Nav" : "Save Changes"}
            className="mb-5 "
            fullWidth
          />
        </form>
      </div>
    </>
  );
};
AddHeaderNav.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};

export default observer(AddHeaderNav);
