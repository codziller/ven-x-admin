import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Edit } from "assets/icons/Edit/edit.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductsStore from "pages/Dashboard/Products/store";
import { observer } from "mobx-react-lite";
import cleanPayload from "utils/cleanPayload";
import { PRODUCT_MODAL_TYPES } from "utils/appConstant";
import DetailsModal from "pages/Dashboard/Products/features/DetailsModal";
import { isEmpty } from "lodash";

const { PRODUCT_VARIANT } = PRODUCT_MODAL_TYPES;
const Form = ({ details, toggler }) => {
  const { warehouse_id, product_id } = useParams();
  const navigate = useNavigate();
  const [formTwo, setFormTwo] = useState({
    currentProductVariant: {},
    currentProductOption: {},
    modalType: "",
    showFormError: false,
  });

  const { editProductInventory, editProductInventoryLoading, product } =
    ProductsStore;

  const schema = yup.object({
    quantity: yup.string().required("Please enter product quantity"),
  });

  const defaultValues = {
    quantity: details?.quantity || "",
    lowInQuantityValue: details?.lowInQuantityValue || "",
    costPrice: details?.costPrice || "",
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
  const handleChange = async ({ prop, val, rest, isFormTwo }) => {
    isFormTwo && setFormTwo({ ...formTwo, [prop]: val });
    const updatedVal = rest ? [...rest, ...val] : val;
    setValue(prop, updatedVal);
    await trigger(prop);
  };

  const form = {
    lowInQuantityValue: watch("lowInQuantityValue"),
    quantity: watch("quantity"),
    costPrice: watch("costPrice"),
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
  };

  const handleCloseModal = () => {
    setFormTwo({
      ...formTwo,
      currentProductOption: {},
      modalType: false,
    });
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
      warehouse_id,
    });
  };

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
        <h2 className="section-heading mb-3 text-xl">
          Edit {product?.name} Inventory
        </h2>
        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col md:flex-row justify-start items-start gap-10 w-full overflow-y-auto"
        >
          {/* First section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto">
            <span className="text-grey-text text-lg uppercase">
              Main Product Inventory
            </span>
            <span className="text-grey-text text-sm">
              Update this product&apos;s inventory
            </span>
            <Input
              label="Quantity"
              value={form?.quantity}
              onChangeFunc={(val) => handleChange({ prop: "quantity", val })}
              placeholder="Enter Quantity"
              formError={errors.quantity}
              showFormError={formTwo?.showFormError}
              type="number"
              isRequired
              required
            />

            <Input
              label="Low in stock value"
              value={form?.lowInQuantityValue}
              onChangeFunc={(val) =>
                handleChange({ prop: "lowInQuantityValue", val })
              }
              placeholder="Enter lowInQuantityValue"
              formError={errors.lowInQuantityValue}
              showFormError={formTwo?.showFormError}
              type="number"
            />
            <Input
              label="Cost Price (₦‎)"
              value={form?.costPrice}
              onChangeFunc={(val) => handleChange({ prop: "costPrice", val })}
              placeholder="Enter Cost Price"
              formError={errors.costPrice}
              showFormError={formTwo?.showFormError}
              prefix={"₦‎"}
              type="number"
            />
          </div>
          {/* Second section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto">
            <span className="text-grey-text text-lg uppercase">
              Product Options
            </span>
            <span className="text-grey-text text-sm">
              Update Inventory for this product&apos;s variants
            </span>

            {!isEmpty(product?.productOptions) && (
              <div className="flex flex-wrap justify-start items-start gap-2 w-full">
                {product?.productOptions?.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="flex flex-col gap-3 w-full justify-start items-start"
                    >
                      <div className="w-full flex justify-between items-center bg-white border-1/2 border-grey-border p-2 gap-2">
                        <span className="font-bold text-red w-full">
                          {item?.name}
                        </span>
                      </div>
                      <span className="text-sm font-bold">
                        Choices ({item?.choices?.length})
                      </span>

                      <div className="flex justify-start items-center gap-3 flex-wrap">
                        {item?.choices?.map((choice, i) => {
                          return (
                            <div
                              key={choice?.variantName}
                              className="flex gap-3 w-fit justify-between items-center border-1/2 border-grey-border p-2 text-sm bg-white"
                            >
                              <div className="flex justify-start items-center gap-3 ">
                                <span className="">{choice?.variantName}</span>
                              </div>

                              {choice?.main ? null : (
                                <span
                                  onClick={() =>
                                    handleEditOption(
                                      {
                                        ...choice,
                                        productOptionChoiceIndex: i,
                                        productOptionId: item?.id,
                                      },
                                      "productVariants",
                                      item
                                    )
                                  }
                                  className="hover:bg-red-300 text-black hover:text-white transition-colors duration-300 ease-in-out cursor-pointer p-1"
                                >
                                  <Edit className="current-svg scale-[0.9]" />
                                </span>
                              )}

                              {choice?.main ? (
                                <span className="bg-grey-20 text-black px-2 py-0.5 text-xs rounded">
                                  main
                                </span>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto">
            <Button
              onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
              isLoading={editProductInventoryLoading}
              type="submit"
              text={"Save Changes"}
              className="mb-5 "
              fullWidth
            />
          </div>
        </form>
      </div>

      <DetailsModal
        active={formTwo?.modalType === PRODUCT_VARIANT}
        details={{
          modalType: PRODUCT_VARIANT,
          currentProductVariant: formTwo.currentProductVariant,
          currentProductOption: formTwo.currentProductOption,
          isInventory: true,
        }}
        toggler={handleCloseModal}
        handleChange={handleChange}
        form={form}
      />
    </>
  );
};
Form.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};
export default observer(Form);
