import React, { useState } from "react";

import PropTypes from "prop-types";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";

import { Link } from "react-router-dom";
import DetailsModal from "./DetailsModal";
import CategoriesStore from "pages/Dashboard/Categories/store";
import { observer } from "mobx-react-lite";
import CheckBox from "components/General/Input/CheckBox";
import { isEmpty } from "lodash";
import { useCallback } from "react";
import SearchBar from "components/General/Searchbar/SearchBar";
import ProductsStore from "../store";

const ProductCategories = ({ details, toggler, handleChange, form }) => {
  const { categories } = CategoriesStore;
  const { setProductForm } = ProductsStore;
  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    categoryId: form?.categoryId || "",
  });
  const [searchInput, setSearchInput] = useState("");

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
    handleChange(prop, val);
    handleSubmit(val);
  };

  const isSelected = useCallback(
    (id) => formTwo?.categoryId === id,
    [formTwo.categoryId]
  );

  const handleSubmit = (val) => {
    setProductForm({ categoryId: val || formTwo?.categoryId });
    toggler?.();
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

        <p className="font-600 text-[20px] ">
          Select A Category For This Product
        </p>

        <p className="mb-3 text-sm text-grey text-left">
          You'll be able to manage pricing and inventory for this variant later
          on
        </p>

        <SearchBar
          placeholder={"Search subcategories"}
          onChange={setSearchInput}
          value={searchInput}
          className="flex"
        />

        <div className="w-full flex flex-col justify-start items-start gap-4 mt-4">
          {categories?.map((item) => {
            return (
              <div
                key={item?.id}
                className="flex flex-col justify-start items-start gap-3 w-full"
              >
                <CheckBox
                  label={item?.name}
                  onChange={() => handleChangeTwo("categoryId", item?.id)}
                  checked={isSelected(item?.id)}
                  labelClass="text-[13px] font-500"
                />
                {!isEmpty(item?.subCategories) && (
                  <div
                    key={item?.id}
                    className="flex flex-col justify-start items-start gap-2"
                  >
                    <p className="text-[10px] text-grey">SubCategories</p>
                    {item?.subCategories?.map((subItem) => {
                      return (
                        <div
                          key={subItem?.id}
                          className="flex flex-col justify-start items-start gap-2.5"
                        >
                          <CheckBox
                            key={subItem?.id}
                            label={subItem?.name}
                            onChange={() =>
                              handleChangeTwo("categoryId", subItem?.id)
                            }
                            checked={isSelected(subItem?.id)}
                            labelClass="text-[13px] font-500"
                          />

                          {!isEmpty(subItem?.subCategories) && (
                            <>
                              <p className="text-[10px] text-grey">
                                {item?.name} {">"} {subItem?.name} {">"}{" "}
                                SubCategories
                              </p>

                              {subItem?.subCategories?.map((subSubItem) => {
                                return (
                                  <div
                                    key={subSubItem?.id}
                                    className="flex flex-col justify-start items-start gap-2"
                                  >
                                    <CheckBox
                                      key={subSubItem?.id}
                                      label={subSubItem?.name}
                                      onChange={() =>
                                        handleChangeTwo(
                                          "categoryId",
                                          subSubItem?.id
                                        )
                                      }
                                      checked={isSelected(subSubItem?.id)}
                                    />
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                <hr className="w-full" />
              </div>
            );
          })}
          <div className="flex flex-col md:flex-row justify-center items-start w-full gap-6 mt-5">
            <Button
              onClick={() => toggler?.()}
              text="Cancel"
              fullWidth
              whiteBg
            />

            <Button
              onClick={handleSubmit}
              isDisabled={!formTwo?.categoryId}
              text="Continue"
              className="mb-2"
              fullWidth
            />
          </div>
        </div>
      </div>
      <DetailsModal
        active={formTwo?.showProductOption}
        details={{ modalType: "product_option" }}
        toggler={() => handleChangeTwo("showProductOption", false)}
      />
    </>
  );
};
ProductCategories.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
  handleChange: PropTypes.func,
  form: PropTypes.object,
};
export default observer(ProductCategories);
