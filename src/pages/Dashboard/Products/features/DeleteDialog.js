import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import { Link, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Delete } from "assets/icons/delete-span.svg";

import Button from "components/General/Button/Button";
import ProductsStore from "../store";
import cleanPayload from "utils/cleanPayload";

const DeleteDialog = ({ details, toggler }) => {
  const { warehouse_id } = useParams();
  const {
    deleteProduct,
    deleteProductLoading,
    editProduct,
    editWareHouseLoading,
  } = ProductsStore;
  const navigate = useNavigate();
  const handleOnSubmit = () => {
    if (details?.archive) {
      const payload = {
        ...details,
        archive: false,
        productId: details?.id,
        currentPage: "",
        id: "",
      };

      cleanPayload(payload);
      editProduct({
        data: payload,
        page: details?.currentPage,
        onSuccess: () => navigate(`/dashboard/products/${warehouse_id}`),
      });
      return;
    }
    const payload = { id: details?.id };
    deleteProduct({
      data: payload,
      onSuccess: () => {
        toggler();
        navigate(`/dashboard/products/${warehouse_id}`);
      },
    });
  };

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
      <p className="font-600 text-xl ">{`${
        details?.archive ? "Unarchive" : "Archive"
      } Product`}</p>

      <p className="mb-3 text-sm text-grey text-center">
        Are you sure you want to {details?.archive ? "unarchive" : "archive"}{" "}
        <span className="text-black">"{details?.name}"?</span>
      </p>

      <Button
        onClick={handleOnSubmit}
        isLoading={deleteProductLoading || editWareHouseLoading}
        type="submit"
        text={`Yes, ${details?.archive ? "unarchive" : "archive"} this product`}
        className="mb-2"
        fullWidth
        redBg
      />

      <Button
        onClick={() => toggler?.()}
        isDisabled={deleteProductLoading || editWareHouseLoading}
        text="No, Cancel"
        className="mb-5"
        fullWidth
        whiteBg
      />
    </div>
  );
};
DeleteDialog.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};

export default observer(DeleteDialog);
