import React, { useState } from "react";
import clsx from "classnames";
import PropTypes from "prop-types";
import Popover from "@material-ui/core/Popover";
import { ReactComponent as Check } from "assets/icons/CheckIcon/small-check.svg";
import { ReactComponent as ArrowDownIcon } from "assets/icons/caret-down.svg";

export default function TableDropdown({ content, handleClick, options }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState("");
  const open = Boolean(anchorEl);
  return (
    <>
      <div
        className={clsx(
          "relative w-full flex items-center justify-between font-normal outline-none capitalize tracking-wider focus:outline-none transition-all duration-300 whitespace-nowrap leading-relaxed shadow-none cursor-pointer text-left  rounded-lg",
          { "rounded-bl-none rounded-br-none": open }
        )}
        onClick={(e) => {
          // // handleClick(e);
          setAnchorEl(open ? null : e.currentTarget);
        }}
      >
        <div className="w-full flex flex-row justify-between items-center">
          <div
            className={`overflow-ellipsis overflow-hidden whitespace-nowrap max-w-12 flex flex-row justify-start items-center
            
            `}
          >
            <div className="text-black text-sm font-normal mr-4 capitalize">
              {selected?.label || content}
            </div>
          </div>
        </div>

        <span
          className={`flex justify-center items-center transition-transform ease-in-out duration-300 transform
                ${open ? "-rotate-180" : "rotate-0 text-blue"}
                `}
        >
          <ArrowDownIcon className="stroke-black h-2 w-2 " />
        </span>
      </div>
      <Popover
        id={open ? "simple-popover" : undefined}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div
          className={clsx(
            "transition-all w-[270px] rounded-lg py-3 bg-white border-1/2 border-grey-bordercolor no-scroll"
          )}
        >
          {options?.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                setSelected(item);
                handleClick?.(item);
                setAnchorEl(null);
              }}
              className="w-full flex items-center justify-between p-3 transition-colors duration-500 ease-in-out hover:bg-grey-whitesmoke3 "
            >
              <span className="text-base text-grey-text capitalize">
                {item?.label}
              </span>
              {item.value === (selected?.value || content) && <Check />}
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}

TableDropdown.propTypes = {
  content: PropTypes.any,
  handleClick: PropTypes.func,
  options: PropTypes.array,
};
