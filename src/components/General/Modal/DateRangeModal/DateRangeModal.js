import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import PropTypes from "prop-types";
import Modal from "components/General/Modal/Modal/Modal";
import ModalHeader from "components/General/Modal/ModalHeader/ModalHeader";
import ModalBody from "components/General/Modal/ModalBody/ModalBody";
import ModalFooter from "components/General/Modal/ModalFooter/ModalFooter";
import { Button } from "components/General/Button";

const DateRangeModal = ({ active, toggler }) => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  useEffect(() => {
    // setSelectionRange(inflowSelectionRange);
  }, []);
  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    toggler();
  };
  return (
    <Modal size="md" active={active} toggler={toggler}>
      <form onSubmit={handleSubmit} className="w-full h-full">
        <ModalHeader>
          <h3 className="text-[22px]">Select date Range</h3>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4 py-4 w-full h-full pb-4">
            <DateRangePicker
              ranges={[selectionRange]}
              onChange={handleSelect}
              showMonthAndYearPickers={false}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-between items-center w-full ">
            <div className="">
              <Button type="submit" text="Ok" onClick={handleSubmit} />
            </div>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};
DateRangeModal.propTypes = {
  active: PropTypes.bool,
  toggler: PropTypes.func,
};
export default DateRangeModal;
