import React from "react";
import PropTypes from "prop-types";

const Dropdown = ({ categories }) => {
  return (
    <div className="pt-4 absolute animate-slide left-0 right-0 mx-auto top-[30px]">
      <div className="grid grid-cols-4 gap-8 justify-between items-start w-full text-base transition-all duration-150 ease-in-out bg-white px-6 py-5  z-30 font-medium">
        {categories?.map(({ name, subCategories }) => (
          <div
            key={name}
            className={`flex flex-col justify-start align-start gap-y-3 h-fit`}
          >
            <h3 className="font-bold mb-1">{name}</h3>
            {subCategories?.map(({ name }, i) => (
              <div
                key={name}
                className={`flex justify-start items-center hover:text-grey-text text-blue bani-base whitespace-nowrap gap-2 `}
              >
                <span className="text-current whitespace-nowrap">{name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

Dropdown.propTypes = {
  categories: PropTypes.array,
};

export default Dropdown;
