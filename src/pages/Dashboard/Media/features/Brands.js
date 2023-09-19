import React, { useState } from "react";

import PropTypes from "prop-types";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { Link } from "react-router-dom";

import { observer } from "mobx-react-lite";
import { useCallback } from "react";
import BrandsPage from "pages/Dashboard/Brands/features";

const Brands = ({ details, toggler, handleChange, form }) => {
  const [formTwo, setFormTwo] = useState({
    showFormError: false,
    categoryId: form?.categoryId || "",
  });

  const isSelected = useCallback(
    (id) => formTwo?.categoryId === id,
    [formTwo.categoryId]
  );

  const handleSubmit = (val) => {
    setFormTwo({ ...formTwo, dataId: val });
    handleChange("dataId", val);
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

        <p className="font-600 text-[20px] ">Select A Brand</p>

        <p className="mb-3 text-sm text-grey text-left">
          Search for a brand to be linked to this slide
        </p>

        <BrandsPage
          isModal
          handleBrandSelect={(e) => handleSubmit(e?.id)}
          isSelected={isSelected}
        />
      </div>
    </>
  );
};
Brands.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
  handleChange: PropTypes.func,
  form: PropTypes.object,
};
export default observer(Brands);
