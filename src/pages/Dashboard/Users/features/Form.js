import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

import { TailSpin } from "react-loader-spinner";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import { Link, useParams } from "react-router-dom";
import { NAIRA, PRODUCT_MODAL_TYPES, WALLET_ACTIONS } from "utils/appConstant";
import DetailsModal from "./DetailsModal";
import CheckBox from "components/General/Input/CheckBox";
import CategoryDetailsModal from "pages/Dashboard/Categories/features/DetailsModal";
import { observer } from "mobx-react-lite";
import AffiliateMarketersStore from "../store";
import cleanPayload from "utils/cleanPayload";
import { isEmpty } from "lodash";
import DatePickerComponent from "components/General/DatePicker";
import moment from "moment";
import { FormErrorMessage } from "components/General/FormErrorMessage";
import UsersStore from "../store";
import { numberWithCommas } from "utils/formatter";
const { PRODUCT_CATEGORY, PRODUCT_CATEGORY_OPTIONS } = PRODUCT_MODAL_TYPES;
const { Credit, Debit } = WALLET_ACTIONS;
const Form = ({ details, toggler }) => {
  const { user_id, warehouse_id } = useParams();
  console.log("user_id: ", user_id);

  const { editUserWallet, user, editUserWalletLoading } = UsersStore;
  const navigate = useNavigate();

  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    formModified: false,
    modalType: "",
    createLoading: false,
  });

  const schema = yup.object({
    amount: yup.string().required("Please enter amount"),
    transactionType: yup.string().required("Please select transaction type"),
  });

  const defaultValues = {
    amount: "",
    transactionType: "",
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

  const form = {
    amount: watch("amount"),
    transactionType: watch("transactionType"),
  };

  const handleChange = async (prop, val, rest, isFormTwo) => {
    isFormTwo
      ? setFormTwo({ ...formTwo, [prop]: val, formModified: true })
      : setFormTwo({ ...formTwo, formModified: true });
    const updatedVal = rest ? [...rest, ...val] : val;
    setValue(prop, updatedVal);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const handleOnSubmit = () => {
    let payload = {
      ...form,
      amount: parseFloat(form.amount),
      userId: user_id,
    };

    if (user_id) {
      editUserWallet({
        data: payload,
        onSuccess: () => navigate(`/dashboard/users/${warehouse_id}`),
      });
      return;
    }
  };

  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 ">
        {details?.link ? (
          <div className="mb-5">
            <Link to={`/dashboard/users/${warehouse_id}`} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 mb-5">
            <Close />
          </button>
        )}

        {!user_id ? (
          <h2 className="section-heading my-8 text-xl">Add User</h2>
        ) : (
          <h2 className="section-heading my-8 text-xl  ">Edit User</h2>
        )}

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col md:flex-row justify-start items-start gap-10 w-full "
        >
          {/* First section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 h-full">
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-grey-text text-lg uppercase">
                Update Wallet
              </span>
              <span className="text-grey-text text-sm">
                Select the transaction type to be performed on this user&apos;s
                wallet <br />
                Wallet Balance -{" "}
                <span className="text-black">
                  {NAIRA}
                  {numberWithCommas(user?.balance)}
                </span>
              </span>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center w-full gap-3 md:gap-6">
              <div className="flex justify-start items-center w-full gap-6">
                <CheckBox
                  label={Credit}
                  onChange={() => handleChange("transactionType", Credit)}
                  checked={form.transactionType === Credit}
                />

                <CheckBox
                  label={Debit}
                  onChange={() => handleChange("transactionType", Debit)}
                  checked={form.transactionType === Debit}
                />
              </div>
            </div>

            {form?.transactionType && (
              <Input
                label="Amount"
                value={form?.amount}
                onChangeFunc={(val) => handleChange("amount", val)}
                placeholder="Enter Amount"
                formError={errors.amount}
                showFormError={formTwo?.showFormError}
                prefix={NAIRA}
                tooltip={`Amount to be ${
                  form.transactionType === Debit ? "debited" : "credited"
                }`}
                type="number"
                isRequired
              />
            )}
            <Button
              onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
              type="submit"
              text={!user_id ? "Add User" : "Save Changes"}
              isLoading={editUserWalletLoading}
              className="mt-10 mb-5 "
              fullWidth
            />
          </div>
          {/* Second section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 "></div>
          {/* Third section */}
          <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto"></div>
        </form>
      </div>

      <DetailsModal
        active={formTwo?.modalType === PRODUCT_CATEGORY_OPTIONS}
        details={{ modalType: PRODUCT_CATEGORY_OPTIONS }}
        toggler={() => handleChangeTwo("modalType", false)}
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
