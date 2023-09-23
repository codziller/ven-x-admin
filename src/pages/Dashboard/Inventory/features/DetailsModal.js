import React from "react";
import PropTypes from "prop-types";

import Modal from "components/General/Modal/Modal/Modal";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";
import Form from "./Form";
import DeleteDialog from "./DeleteDialog";
import { INVENTORY_MODAL_TYPES } from "utils/appConstant";
import CostPriceHistory from "./CostPriceHistory";
import RequestProductForm from "./RequestProductForm";

const { COST_PRICE_HISTORY, REQUEST_PRODUCT } = INVENTORY_MODAL_TYPES;
const DetailsModal = ({ active, toggler, details }) => {
  const renderModalBody = () => {
    switch (details?.modalType) {
      case "delete":
        return <DeleteDialog details={details} toggler={toggler} />;
      case "edit":
        return <Form details={details} toggler={toggler} />;
      case COST_PRICE_HISTORY:
        return <CostPriceHistory details={details} toggler={toggler} />;
      case REQUEST_PRODUCT:
        return <RequestProductForm details={details} toggler={toggler} />;

      default:
        return null;
    }
  };
  return (
    <Modal
      size={details?.modalSize || "md"}
      active={active}
      toggler={toggler}
      modalClassName="overflow-y-auto overflow-x-hidden"
    >
      <div className="w-full h-full">
        <ModalBody>
          <div className="w-full">{active && renderModalBody()}</div>
        </ModalBody>
      </div>
    </Modal>
  );
};
DetailsModal.propTypes = {
  active: PropTypes.bool,
  toggler: PropTypes.func,
  details: PropTypes.object,
};
export default DetailsModal;
