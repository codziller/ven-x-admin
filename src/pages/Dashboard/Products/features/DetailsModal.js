import React from "react";
import PropTypes from "prop-types";

import Modal from "components/General/Modal/Modal/Modal";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";
import Form from "./Form";
import DeleteDialog from "./DeleteDialog";
import ProductOptions from "./ProductOptions";
import { PRODUCT_MODAL_TYPES } from "utils/appConstant";
import ProductVariant from "./ProductVariant";
import ProductSubscription from "./ProductSubscription";
import ProductCategories from "./ProductCategories";

const {
  PRODUCT_OPTION,
  PRODUCT_SUBSCRIPTION,
  PRODUCT_VARIANT,
  PRODUCT_CATEGORY_OPTIONS,
} = PRODUCT_MODAL_TYPES;
const DetailsModal = ({ active, toggler, details, handleChange, form }) => {
  const renderModalBody = () => {
    switch (details?.modalType) {
      case "delete":
        return <DeleteDialog details={details} toggler={toggler} />;
      case "edit":
        return <Form details={details} toggler={toggler} />;
      case PRODUCT_OPTION:
        return (
          <ProductOptions
            details={details}
            toggler={toggler}
            handleOnChange={handleChange}
            formObj={form}
          />
        );
      case PRODUCT_VARIANT:
        return (
          <ProductVariant
            details={details}
            toggler={toggler}
            handleOnChange={handleChange}
            formObj={form}
          />
        );
      case PRODUCT_SUBSCRIPTION:
        return (
          <ProductSubscription
            details={details}
            toggler={toggler}
            handleOnChange={handleChange}
            formObj={form}
          />
        );
      case PRODUCT_CATEGORY_OPTIONS:
        return (
          <ProductCategories
            details={details}
            toggler={toggler}
            handleChange={handleChange}
            form={form}
          />
        );

      default:
        return null;
    }
  };
  return (
    <Modal
      size={details?.modalSize || "lg"}
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
  handleChange: PropTypes.func,
  form: PropTypes.object,
};
export default DetailsModal;
