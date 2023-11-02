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
import WareHousesStore from "pages/Dashboard/WareHouses/store";
import { observer } from "mobx-react-lite";
import cleanPayload from "utils/cleanPayload";
import { INVENTORY_MODAL_TYPES, PRODUCT_MODAL_TYPES } from "utils/appConstant";
import DetailsModal from "pages/Dashboard/Products/features/DetailsModal";
import TransactionDetailsModal from "./DetailsModal";
import { isEmpty } from "lodash";
import Select from "components/General/Input/Select";
import { numberWithCommas } from "utils/formatter";

const { PRODUCT_VARIANT } = PRODUCT_MODAL_TYPES;
const { COST_PRICE_HISTORY } = INVENTORY_MODAL_TYPES;
const Form = ({ details, toggler }) => {
  const { warehouse_id, product_id } = useParams();
  const navigate = useNavigate();
  const [formTwo, setFormTwo] = useState({
    currentProductVariant: {},
    currentProductOption: {},
    modalType: "",
    showFormError: false,
    productOptionModified: false,
  });

  const { editProductInventory, editProductInventoryLoading, product } =
    ProductsStore;
  const { warehouses, loading } = WareHousesStore;
  const schema = yup.object({
    quantity: yup.string().required("Please enter product quantity"),
    lowInQuantityValue: yup
      .string()
      .required("Please enter low in stock value"),
    warehouseId: yup.string().required("Please select warehouse"),
  });

  const defaultValues = {
    quantity: "",
    lowInQuantityValue: "",
    costPrice: "",
    productOptions: product_id ? product?.productOptions : [],
    warehouseId: warehouse_id || "",
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
    if (prop === "productOptions") {
      setFormTwo({ ...formTwo, productOptionModified: true });
    }
    isFormTwo && setFormTwo({ ...formTwo, [prop]: val });
    const updatedVal = rest ? [...rest, ...val] : val;
    setValue(prop, updatedVal);
    await trigger(prop);
  };
  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };
  const form = {
    lowInQuantityValue: watch("lowInQuantityValue"),
    quantity: watch("quantity"),
    costPrice: watch("costPrice"),
    productOptions: watch("productOptions"),
    warehouseId: watch("warehouseId"),
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
    setFormTwo((prev) => {
      return {
        ...prev,
        currentProductOption: {},
        currentProductVariant: {},
        modalType: false,
      };
    });
  };
  const handleOnSubmit = (e) => {
    const choiceInventory = form?.productOptions
      ?.map((item) => {
        return item?.choices
          ?.map((choice, index) => {
            if (choice?.main) {
              return {
                costPrice: form?.costPrice,
                lowInQuantityValue: form?.lowInQuantityValue,
                productOptionChoiceIndex: index,
                productOptionId: item?.id,
                quantity: Number(form.quantity),
              };
            } else
              return {
                costPrice: choice?.costPrice,
                lowInQuantityValue: choice?.lowInQuantityValue,
                productOptionChoiceIndex: index,
                productOptionId: item?.id,
                quantity: Number(choice.quantity),
              };
          })
          ?.filter((item) => item?.lowInQuantityValue);
      })
      .flatMap((item) => item);
    console.log("choiceInventory: ", choiceInventory);
    const payload = {
      ...form,
      productId: product_id,
      productOptions: null,
      choiceInventory: formTwo.productOptionModified ? choiceInventory : null,
    };
    cleanPayload(payload);
    editProductInventory({
      data: { costPrice: form.costPrice, products: [payload] },
      onSuccess: () => toggler(),
      page: details?.currentPage,
      warehouse_id,
    });
  };
  console.log("Form in inventory: ", form);
  console.log("formTwo in inventory: ", formTwo);
  const currentWareHouseInventory = product?.warehouseInventory?.find(
    (item) => item?.warehouseId === form.warehouseId
  );
  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="mb-5 w-full flex justify-between">
            <div
              onClick={() => navigate(-1)}
              className="scale-90 cursor-pointer"
            >
              <ArrowBack />
            </div>

            <Button
              onClick={() => handleChangeTwo("modalType", COST_PRICE_HISTORY)}
              text="View Cost Prices"
              className=""
              whiteBg
            />
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

            <span className="text-grey-text text-sm">
              Current quantity in warehouse:{" "}
              {numberWithCommas(currentWareHouseInventory?.quantity)}
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
            />

            <Input
              label="Low in stock value"
              isRequired
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

            {!isEmpty(form?.productOptions) && (
              <div className="flex flex-wrap justify-start items-start gap-2 w-full">
                {form?.productOptions?.map((item, i) => {
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

          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto h-full">
            <span className="text-grey-text text-lg uppercase">
              Inventory Warehouse
            </span>
            <span className="text-grey-text text-sm">
              Select the warehouse to apply the inventory update to. Current
              warehouse is already selected by default.
            </span>
            <Select
              label="Select Warehouse"
              placeholder="Select Warehouse"
              options={warehouses}
              onChange={(val) =>
                handleChange({ prop: "warehouseId", val: val?.value })
              }
              value={warehouses?.find(
                (item) => item?.value === form?.warehouseId
              )}
              formError={errors.warehouseId}
              showFormError={formTwo?.showFormError}
              isLoading={loading}
              fullWidth
            />
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

      <TransactionDetailsModal
        active={formTwo?.modalType === COST_PRICE_HISTORY}
        details={{ ...product, modalSize: "lg", modalType: COST_PRICE_HISTORY }}
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
