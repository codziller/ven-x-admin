import React from "react";
import PropTypes from "prop-types";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import { ReactComponent as Delete } from "assets/icons/delete-span.svg";
import Button from "components/General/Button/Button";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import OrdersStore from "../store";

const DeleteDialog = ({ details, toggler }) => {
  const { updateOrderStatus, updateOrderStatusLoading } = OrdersStore;

  const handleOnSubmit = () => {
    const payload = { id: details?.id, status: details?.value };
    updateOrderStatus({ data: payload, onSuccess: () => toggler() });
  };

  console.log("details: ", details);
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

      <p className="font-600 text-xl ">
        {" "}
        Set order '{details?.orderCode}' as '{details?.label}'
      </p>

      <p className="mb-3 text-sm text-grey text-center">
        Are you sure you want to carry out this action?{" "}
      </p>

      <Button
        onClick={handleOnSubmit}
        isLoading={updateOrderStatusLoading}
        type="submit"
        text={`Yes, set as ${details?.label}`}
        className="mb-2"
        fullWidth
      />

      <Button
        onClick={() => toggler?.()}
        isDisabled={updateOrderStatusLoading}
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
