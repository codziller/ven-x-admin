import React from "react";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";

import { numberWithCommas } from "utils/formatter";
import useWindowDimensions from "hooks/useWindowDimensions";
import ToolTip from "../ToolTip";

const Amount = ({ prefix = "NGN", className, value, noDefaultPrefix }) => {
  const { width } = useWindowDimensions();
  return (
    <ToolTip content={`${prefix || ""} ${numberWithCommas(value)}`}>
      <div className={className}>
        <NumberFormat
          decimalScale={2}
          fixedDecimalScale
          thousandSeparator=","
          displayType="text"
          value={value}
          className={className}
          prefix={
            noDefaultPrefix
              ? null
              : (prefix === "NGN" && width < 768 ? "₦" : prefix) + " "
          }
        />
      </div>
    </ToolTip>
  );
};

Amount.propTypes = {
  prefix: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.number,
  noDefaultPrefix: PropTypes.bool,
};

export default Amount;
