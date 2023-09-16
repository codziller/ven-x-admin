import React from "react";
import PropTypes from "prop-types";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Delete } from "assets/icons/delete-span.svg";
import Button from "components/General/Button/Button";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import BrandsStore from "../store";
import { lowerCase } from "lodash";

const DeleteProductOptionDialog = ({ details, toggler }) => {
  const { deleteBrand, deleteBrandLoading } = BrandsStore;

  const { modalDeleteType, modalDeleteData } = details;
  console.log("details: ", details);
  const handleOnSubmit = () => {
    const payload = { id: details?.id };
    // deleteBrand({
    //   data: payload,
    //   page: details?.currentPage,
    //   onSuccess: () => toggler(),
    // });
  };

  const title = lowerCase(modalDeleteType?.replaceAll("_", " "));

  const name = modalDeleteData?.variantName || modalDeleteData?.name;
  return (
    <div className="flex flex-col justify-center items-center gap-y-2 w-full h-full pb-4 overflow-y-auto">
      {details?.link ? (
        <Link to={details?.link} className="scale-90 mb-2 mr-auto">
          <ArrowBack />
        </Link>
      ) : (
        <button onClick={() => toggler?.()} className="scale-90 mb-5 mr-auto">
          <Close />
        </button>
      )}

      <Delete className="scale-90" />
      <p className="font-600 text-xl capitalize">Delete {title}</p>

      <p className="mb-3 text-sm text-grey text-center">
        Are you sure you want to delete{" "}
        <span className="text-black">"{name}"?</span>
      </p>

      <Button
        onClick={handleOnSubmit}
        isLoading={deleteBrandLoading}
        type="submit"
        text={`Yes, Delete this ${title}`}
        className="mb-2"
        fullWidth
        redBg
      />

      <Button
        onClick={() => toggler?.()}
        isDisabled={deleteBrandLoading}
        text="No, Cancel"
        className="mb-5"
        fullWidth
        whiteBg
      />
    </div>
  );
};
DeleteProductOptionDialog.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};

export default observer(DeleteProductOptionDialog);
