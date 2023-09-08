import "react-phone-number-input/style.css";

import Input, {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import React, { useEffect, useRef, useState } from "react";

import { ReactComponent as ArrowIcon } from "../../../assets/icons/Arrow/arrow-icon.svg";
import PropTypes from "prop-types";
import en from "react-phone-number-input/locale/en.json";

// const PhoneNumber = ({ name, value, defaultCountry, onChange }) => {
//   const [country, setCountry] = useState();
//   const [selectedLabel, setSelectedLabel] = useState();
//   const inputRef = useRef();

//   useEffect(() => {
//     setSelectedLabel(
//       `${en[country ? country : "NG"]}(+${getCountryCallingCode(
//         country ? country : "NG"
//       )})`
//     );
//   }, [country]);

//   useEffect(() => {
//     setCountry(defaultCountry);
//   }, [defaultCountry]);

//   const CountrySelect = ({ value, onChange, labels, ...rest }) => (
//     <select
//       {...rest}
//       value={value}
//       onChange={(event) => onChange(event.target.value || undefined)}
//       className="bg-transparent focus:outline-none outline-none focus:ring-0  cursor-pointer absolute z-10 h-full w-full top-0 left-0 opacity-0"
//     >
//       <option value="">{labels.ZZ}</option>
//       {getCountries().map((country) => (
//         <option key={country} value={country}>
//           {labels[country]} +{getCountryCallingCode(country)}
//         </option>
//       ))}
//     </select>
//   );

//   return (
//     <>
//       <div className="flex flex-row w-full text-gray leading-normal shadow-none space-x-2 md:space-x-4 transition-all duration-300 ease-in-out rounded-lg md:rounded-none border border-grey-border hover:border-blue md:border-0 focus:border-blue">
//         <div className="flex justify-between space-x-2 md:space-x-0 md:justify-start items-center  md:w-full relative h-11 md:border md:border-grey-3 md:rounded-lg text-grey transition-all duration-300 ease-in-out hover:border-blue focus:border-blue md:px-3 cursor-pointer w-max">
//           <div className="relative flex flex-row justify-center items-center h-full w-16 space-x-2">
//             <div className="h-4 w-6 flex justify-center items-center pointer-events-none border border-grey-3 rounded-100 relative overflow-hidden">
//               <img
//                 className="h-6 w-6 pointer-events-none object-cover mx-auto"
//                 alt={country ? country : "NG"}
//                 src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${
//                   country ? country : "NG"
//                 }.svg`}
//               />
//             </div>
//             {/* <span className="hidden md:flex flex-row w-full pointer-events-none text-sm">
//               {selectedLabel}
//             </span> */}
//             <CountrySelect
//               className="cursor-pointer absolute z-10 h-full w-full top-0 left-0 opacity-0"
//               labels={en}
//               value={country ? country : "NG"}
//               onChange={(e) => setCountry(e)}
//               name="countrySelect"
//             />
//             <ArrowIcon className="stroke-current rotate-180" />
//           </div>

//           {/* <div
//             className={`transition-all duration-300 ease-in-out rotate-0 ${
//               isEdit ? "block" : "hidden"
//             }`}
//           >
//             <ArrowIcon className="stroke-current" />
//           </div> */}
//           <Input
//             ref={inputRef}
//             className="focus:outline-none outline-none text-sm placeholder:text-grey"
//             value={value}
//             onChange={onChange}
//             placeholder="Number"
//             name={name}
//             required
//           />
//         </div>

//         {/* <div
//           className="w-full flex justify-start items-center h-11 md:px-2 md:border md:border-grey-3  md:rounded-lg transition-all duration-300 ease-in-out md:hover:border-blue md:focus:border-blue cursor-text"
//           onClick={() => inputRef.current.focus()}
//         >
//           <Input
//             ref={inputRef}
//             className="focus:outline-none outline-none text-sm placeholder:text-grey-3"
//             value={value}
//             onChange={onChange}
//             placeholder="Number"
//             name={name}
//             required
//           />
//         </div> */}
//       </div>
//     </>
//   );
// };

const useClickOutside = (handler) => {
  const domNode = useRef();

  useEffect(() => {
    const maybeHandler = (event) => {
      if (!domNode.current.contains(event.target || event.target.childNodes)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domNode;
};

const CountrySelect = ({ value, onChange, labels, ...rest }) => (
  <select
    {...rest}
    value={value}
    onChange={(event) => onChange(event.target.value || undefined)}
  >
    <option value="">{labels.ZZ}</option>
    {getCountries().map((country) => (
      <option key={country} value={country}>
        {labels[country]} +{getCountryCallingCode(country)}
      </option>
    ))}
  </select>
);

const PhoneNumber = ({
  placeholder,
  name,
  flag_name,
  label,
  value,
  onPhoneChange,
  onCountryChange,
  countryClicked,
  isError,
  required,
  isDisabled,
}) => {
  const [country, setCountry] = useState();
  const [error, setError] = useState(false);
  const [active, setActive] = useState(false);

  const domNode = useClickOutside(() => {
    setActive(false);
  });

  useEffect(() => {
    setCountry(countryClicked);
  }, [countryClicked]);

  useEffect(() => {
    if (!isError) return setError(false);
    setError(true);
  }, [isError]);

  return (
    <div className="w-full">
      {label && (
        <label className="text-grey general-input-label mb-[12px]">
          {label}
        </label>
      )}
      <div
        className={`h-11 border border-gray-border rounded-lg text-grey focus:border flex flex-row w-full text-gray leading-normal shadow-none outline-none focus:outline-none focus:ring-0 focus:text-gray overflow-ellipsis overflow-hidden whitespace-nowrap
        ${
          error
            ? "!border-red"
            : active
            ? "border-blue"
            : "hover:bg-grey-whitesmoke border-grey-border"
        }
        `}
        ref={domNode}
      >
        <div className="flex justify-center items-center h-full  relative overflow-hidden space-x-2 c border-gray-xlight ">
          <div className="absolute h-full top-0 left-0 z-10 opacity-0 w-full cursor-pointer">
            <CountrySelect
              className="h-full cursor-pointer"
              labels={en}
              disabled={isDisabled}
              value={country || "NG"}
              onChange={(value) =>
                onCountryChange(value, { name: flag_name, value })
              }
              name="countrySelect"
            />
          </div>
          <div className="w-10 ml-4 flex justify-center items-center">
            <div className="flex h-6 w-6 relative overflow-hidden !mx-0">
              <img
                className="h-full w-6"
                alt={country || "NG"}
                src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${
                  country || "NG"
                }.svg`}
              />
            </div>
          </div>

          <ArrowIcon className="stroke-current rotate-180" />
        </div>

        <div
          className="ml-2 w-full flex justify-start items-center"
          onClick={() => setActive(true)}
        >
          <Input
            country={country || "NG"}
            value={value}
            className={`shadow-none outline-none focus:outline-none focus:ring-0 focus:text-black h-full w-full pl-2 
            ${value && value.length > 1 && "text-black"}
            `}
            disabled={isDisabled}
            onChange={(value) => onPhoneChange(value, { name, value })}
            placeholder={placeholder}
            name={name}
            required={required}
          />
        </div>
      </div>
    </div>
  );
};

PhoneNumber.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  flag_name: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  onPhoneChange: PropTypes.func,
  onCountryChange: PropTypes.func,
  countryClicked: PropTypes.func,
  isError: PropTypes.bool,
  required: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

CountrySelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  labels: PropTypes.array,
  rest: PropTypes.object,
};

export default PhoneNumber;
