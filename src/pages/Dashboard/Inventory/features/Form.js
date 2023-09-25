import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import { Link, useParams } from "react-router-dom";
import ProductsStore from "pages/Dashboard/Products/store";
import { observer } from "mobx-react-lite";
import cleanPayload from "utils/cleanPayload";

const Form = ({ details, toggler }) => {
  const { warehouse_id } = useParams();
  const [formTwo, setFormTwo] = useState({
    showFormError: false,
  });

  const { editProductInventory, editProductInventoryLoading } = ProductsStore;

  const schema = yup.object({
    quantity: yup.string().required("Please enter product quantity"),
  });

  const defaultValues = {
    quantity: details?.quantity || "",
    lowInQuantityValue: details?.lowInQuantityValue || "",
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

  const form = {
    lowInQuantityValue: watch("lowInQuantityValue"),
    quantity: watch("quantity"),
  };
  const handleOnSubmit = (e) => {
    const payload = {
      ...form,
      productId: details?.id,
      warehouseId: warehouse_id,
    };
    cleanPayload(payload);
    editProductInventory({
      data: payload,
      onSuccess: () => toggler(),
      page: details?.currentPage,
    });
  };

  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="mb-5">
            <Link to={details?.link} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mb-5">
            <Close />
          </button>
        )}

        {details?.isAdd ? (
          <h2 className="section-heading my-8 text-xl">Add New Product</h2>
        ) : (
          <h2 className="section-heading mb-3 text-xl  ">
            Edit Product Inventory
          </h2>
        )}

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-5 w-full overflow-y-auto"
        >
          <Input
            label="Quantity"
            value={form?.quantity}
            onChangeFunc={(val) => handleChange("quantity", val)}
            placeholder="Enter Quantity"
            formError={errors.quantity}
            showFormError={formTwo?.showFormError}
            type="number"
            required
          />

          <Input
            label="Low in stock value"
            value={form?.lowInQuantityValue}
            onChangeFunc={(val) => handleChange("lowInQuantityValue", val)}
            placeholder="Enter lowInQuantityValue"
            formError={errors.lowInQuantityValue}
            showFormError={formTwo?.showFormError}
            type="number"
            required
          />

          <Button
            onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
            isLoading={editProductInventoryLoading}
            type="submit"
            text={"Save Changes"}
            className="mb-5 "
            fullWidth
          />
        </form>
      </div>
    </>
  );
};
Form.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
export default observer(Form);
