import React from "react";
import PropTypes from "prop-types";
import { TailSpin } from "react-loader-spinner";
const Button = ({
  type,
  isOutline,
  text,
  isDisabled,
  onClick,
  icon,
  iconRight,
  isLoading,
  whiteBg,
  redBg,
  blackBg,
  fullWidth,
  borderColor,
  textColor,
  textClass = "text-base font-bold",
  height,
  className,
  buttonClass,
  innerClassName,
  href = undefined,
}) => {
  const btnClass = `
  flex justify-center items-center
  ${height || "h-[40px] md:h-[44px]"} outline-none
 px-5 py-1.5 medium-font
  transition-all duration-[700ms] ease-in-out cursor-pointer
  ${fullWidth ? "w-full" : ""}
  whitespace-nowrap ${
    isOutline
      ? `bg-transparent ${
          isDisabled
            ? "bg-white/[.2]"
            : " hover:bg-blue-clear hover:border-blue-border"
        } text-blue`
      : whiteBg
      ? `bg-white ${isDisabled ? "bg-white/[.2]" : ""} text-${
          textColor || "black"
        } border border-${
          borderColor || "grey-border"
        } hover:bg-grey-light hover:border-grey-20`
      : redBg
      ? `bg-red-deep hover:bg-red ${isDisabled ? "bg-red/[.2]" : ""} text-white`
      : blackBg
      ? `bg-black ${isDisabled ? "bg-black/[.2]" : ""} text-white hover:bg-blue`
      : ` ${
          isDisabled
            ? "bg-grey-disabled !text-grey-fade"
            : "bg-blue hover:bg-blue-bright"
        } text-white`
  } ${innerClassName}`;
  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      className={`z-10 ${fullWidth ? "w-full" : ""} ${className || ""}`}
      href={href}
    >
      {isLoading ? (
        <div className={`${btnClass} relative`}>
          <span className="absolute left-0 top-0 right-0 bottom-0 m-auto w-fit flex justify-center items-center ">
            <TailSpin
              height="25"
              width="25"
              color="#ffffff"
              ariaLabel="tail-spin-loading"
              radius="3"
              visible={true}
            />
          </span>

          <span className={`${textClass} !text-transparent relative`}>
            {text}
          </span>
        </div>
      ) : (
        <div className={`${btnClass} gap-x-2 ${buttonClass}`}>
          {icon && <div>{icon}</div>}
          {text && <span className={`${textClass}`}>{text}</span>}
          {iconRight && <div className={`${textClass}`}>{iconRight}</div>}
        </div>
      )}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.any,
  isOutline: PropTypes.bool,
  text: PropTypes.string,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  whiteBg: PropTypes.bool,
  redBg: PropTypes.bool,
  blackBg: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.element,
  iconRight: PropTypes.element,
  borderColor: PropTypes.string,
  textColor: PropTypes.string,
  textClass: PropTypes.string,
  height: PropTypes.string,
  href: PropTypes.string,
  className: PropTypes.string,
  buttonClass: PropTypes.string,
  innerClassName: PropTypes.string,
};

export default Button;
